from typing import Iterator
from ..models.board import Square, on_board
from ..models.game_state import GameState
from ..models.types import PieceType
from .move import Move

_BISHOP_RAYS = [(-1, -1), (-1, 1), (1, -1), (1, 1)]


def bishop_moves(state: GameState, from_sq: Square) -> Iterator[Move]:
    row, col = from_sq
    piece = state.board.get(row, col)
    if piece is None or piece.piece_type != PieceType.BISHOP:
        return

    yield from _ray_moves(state, from_sq, _BISHOP_RAYS)


def _ray_moves(state: GameState, from_sq: Square, rays: list[tuple[int, int]]) -> Iterator[Move]:
    row, col = from_sq
    piece = state.board.get(row, col)
    assert piece is not None
    color = piece.color

    for dr, dc in rays:
        r, c = row + dr, col + dc
        while on_board(r, c):
            target = state.board.get(r, c)
            if target is None:
                yield Move(from_sq, (r, c))
            elif target.color != color:
                yield Move(from_sq, (r, c))  # capture and stop
                break
            else:
                break  # blocked by own piece
            r += dr
            c += dc
