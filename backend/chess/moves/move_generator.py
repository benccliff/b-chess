from ..models.game_state import GameState
from ..models.types import Color
from ..rules.check_detector import pseudo_legal_moves_for_color, is_in_check
from ..rules.position_applier import apply_move
from .move import Move


def legal_moves(state: GameState) -> list[Move]:
    color = state.turn
    pseudo = pseudo_legal_moves_for_color(state, color)

    result: list[Move] = []
    for move in pseudo:
        if _is_castling(state, move):
            if not _castling_is_legal(state, move):
                continue
        new_state = apply_move(state, move)
        if not is_in_check(new_state, color):
            result.append(move)
    return result


def _is_castling(state: GameState, move: Move) -> bool:
    from_row, from_col = move.from_sq
    piece = state.board.get(from_row, from_col)
    from ..models.types import PieceType
    return (
        piece is not None and
        piece.piece_type == PieceType.KING and
        abs(move.to_sq[1] - from_col) == 2
    )


def _castling_is_legal(state: GameState, move: Move) -> bool:
    color = state.turn
    from_sq = move.from_sq
    to_sq = move.to_sq

    if is_in_check(state, color):
        return False

    from_col = from_sq[1]
    to_col = to_sq[1]
    row = from_sq[0]
    step = 1 if to_col > from_col else -1

    col = from_col + step
    while col != to_col:
        intermediate_state = GameState(
            board=state.board.set(row, from_col, None).set(row, col, state.board.get(row, from_col)),
            turn=state.turn,
            castling_rights=state.castling_rights,
            en_passant_target=state.en_passant_target,
            halfmove_clock=state.halfmove_clock,
            fullmove_number=state.fullmove_number,
        )
        if is_in_check(intermediate_state, color):
            return False
        col += step

    return True
