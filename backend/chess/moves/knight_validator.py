from typing import Iterator
from ..models.board import Square, on_board
from ..models.game_state import GameState
from ..models.types import PieceType
from .move import Move

_KNIGHT_DELTAS = [(-2, -1), (-2, 1), (-1, -2), (-1, 2), (1, -2), (1, 2), (2, -1), (2, 1)]


def knight_moves(state: GameState, from_sq: Square) -> Iterator[Move]:
    row, col = from_sq
    piece = state.board.get(row, col)
    if piece is None or piece.piece_type != PieceType.KNIGHT:
        return

    color = piece.color
    for dr, dc in _KNIGHT_DELTAS:
        to_row, to_col = row + dr, col + dc
        if not on_board(to_row, to_col):
            continue
        target = state.board.get(to_row, to_col)
        if target is None or target.color != color:
            yield Move(from_sq, (to_row, to_col))
