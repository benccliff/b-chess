from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from ..models.board import sq_to_coords, coords_to_sq
from ..models.types import PieceType
from ..moves.move import Move
from ..moves.move_generator import legal_moves
from ..notation.fen import serialize_fen
from ..rules.game_status import determine_status
from ..rules.position_applier import apply_move
from ..store.game_store import GameStore
from .schemas import GameStateResponse, MoveRequest, MoveSchema, PieceSchema

router = APIRouter(prefix="/games")

# Singleton store; replaced in tests via dependency override
_store = GameStore()


def get_store() -> GameStore:
    return _store


StoreDep = Annotated[GameStore, Depends(get_store)]


def _build_response(game_id: str, store: GameStore) -> GameStateResponse:
    state = store.get(game_id)
    assert state is not None

    moves = legal_moves(state)
    status = determine_status(state, moves)

    board_schema: list[list[PieceSchema | None]] = []
    for row in range(8):
        row_list: list[PieceSchema | None] = []
        for col in range(8):
            piece = state.board.get(row, col)
            if piece:
                row_list.append(PieceSchema(piece_type=piece.piece_type.value, color=piece.color.value))
            else:
                row_list.append(None)
        board_schema.append(row_list)

    legal_move_schemas = [
        MoveSchema(
            from_sq=coords_to_sq(*m.from_sq),
            to_sq=coords_to_sq(*m.to_sq),
            promotion=m.promotion.value if m.promotion else None,
        )
        for m in moves
    ]

    return GameStateResponse(
        game_id=game_id,
        fen=serialize_fen(state),
        board=board_schema,
        turn=state.turn.value,
        status=status.value,
        legal_moves=legal_move_schemas,
    )


@router.post("", status_code=201)
def create_game(store: StoreDep) -> GameStateResponse:
    game_id, _ = store.create()
    return _build_response(game_id, store)


@router.get("/{game_id}")
def get_game(game_id: str, store: StoreDep) -> GameStateResponse:
    if store.get(game_id) is None:
        raise HTTPException(status_code=404, detail="Game not found")
    return _build_response(game_id, store)


@router.post("/{game_id}/moves")
def make_move(game_id: str, body: MoveRequest, store: StoreDep) -> GameStateResponse:
    state = store.get(game_id)
    if state is None:
        raise HTTPException(status_code=404, detail="Game not found")

    try:
        from_sq = sq_to_coords(body.from_sq)
        to_sq = sq_to_coords(body.to_sq)
    except (ValueError, IndexError):
        raise HTTPException(status_code=422, detail="Invalid square notation")

    promotion: PieceType | None = None
    if body.promotion:
        try:
            promotion = PieceType(body.promotion)
        except ValueError:
            raise HTTPException(status_code=422, detail=f"Invalid promotion piece: {body.promotion}")

    requested_move = Move(from_sq, to_sq, promotion=promotion)
    moves = legal_moves(state)

    if requested_move not in moves:
        raise HTTPException(status_code=422, detail="Illegal move")

    new_state = apply_move(state, requested_move)
    store.update(game_id, new_state)
    return _build_response(game_id, store)


@router.delete("/{game_id}", status_code=200)
def delete_game(game_id: str, store: StoreDep) -> dict:
    if not store.delete(game_id):
        raise HTTPException(status_code=404, detail="Game not found")
    return {"deleted": game_id}
