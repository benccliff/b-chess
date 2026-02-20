from typing import Iterator
from ..models.board import Square, on_board
from ..models.game_state import GameState
from ..models.types import Color, PieceType
from .move import Move

_KING_DELTAS = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]


def king_moves(state: GameState, from_sq: Square) -> Iterator[Move]:
    row, col = from_sq
    piece = state.board.get(row, col)
    if piece is None or piece.piece_type != PieceType.KING:
        return

    color = piece.color

    # Normal king moves
    for dr, dc in _KING_DELTAS:
        to_row, to_col = row + dr, col + dc
        if not on_board(to_row, to_col):
            continue
        target = state.board.get(to_row, to_col)
        if target is None or target.color != color:
            yield Move(from_sq, (to_row, to_col))

    # Castling
    yield from _castling_moves(state, from_sq, color)


def _castling_moves(state: GameState, from_sq: Square, color: Color) -> Iterator[Move]:
    cr = state.castling_rights
    back_row = 7 if color == Color.WHITE else 0
    king_col = 4

    if from_sq != (back_row, king_col):
        return

    board = state.board

    # Kingside castling
    ks_right = cr.white_kingside if color == Color.WHITE else cr.black_kingside
    if ks_right:
        # Squares between king and rook must be empty: f1(col5), g1(col6)
        if (board.get(back_row, 5) is None and
                board.get(back_row, 6) is None and
                board.get(back_row, 7) is not None and
                board.get(back_row, 7).piece_type == PieceType.ROOK):  # type: ignore[union-attr]
            yield Move(from_sq, (back_row, 6))

    # Queenside castling
    qs_right = cr.white_queenside if color == Color.WHITE else cr.black_queenside
    if qs_right:
        # Squares between king and rook must be empty: d1(col3), c1(col2), b1(col1)
        if (board.get(back_row, 3) is None and
                board.get(back_row, 2) is None and
                board.get(back_row, 1) is None and
                board.get(back_row, 0) is not None and
                board.get(back_row, 0).piece_type == PieceType.ROOK):  # type: ignore[union-attr]
            yield Move(from_sq, (back_row, 2))
