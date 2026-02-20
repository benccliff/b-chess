from typing import Iterator
from ..models.board import Square
from ..models.game_state import GameState
from ..models.types import PieceType
from .move import Move
from .bishop_validator import _ray_moves

_ROOK_RAYS = [(-1, 0), (1, 0), (0, -1), (0, 1)]


def rook_moves(state: GameState, from_sq: Square) -> Iterator[Move]:
    row, col = from_sq
    piece = state.board.get(row, col)
    if piece is None or piece.piece_type != PieceType.ROOK:
        return

    yield from _ray_moves(state, from_sq, _ROOK_RAYS)
