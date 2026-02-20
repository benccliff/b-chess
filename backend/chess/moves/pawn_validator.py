from typing import Iterator
from ..models.board import Square, on_board
from ..models.game_state import GameState
from ..models.types import Color, PieceType
from .move import Move


_PROMOTION_TYPES = [PieceType.QUEEN, PieceType.ROOK, PieceType.BISHOP, PieceType.KNIGHT]


def pawn_moves(state: GameState, from_sq: Square) -> Iterator[Move]:
    row, col = from_sq
    piece = state.board.get(row, col)
    if piece is None or piece.piece_type != PieceType.PAWN:
        return

    color = piece.color
    direction = -1 if color == Color.WHITE else 1  # White pawns move up (decreasing row)
    start_row = 6 if color == Color.WHITE else 1
    promotion_row = 0 if color == Color.WHITE else 7

    # Single push
    to_row = row + direction
    if on_board(to_row, col) and state.board.get(to_row, col) is None:
        if to_row == promotion_row:
            for promo in _PROMOTION_TYPES:
                yield Move(from_sq, (to_row, col), promotion=promo)
        else:
            yield Move(from_sq, (to_row, col))

            # Double push from starting rank
            if row == start_row:
                dbl_row = row + 2 * direction
                if state.board.get(dbl_row, col) is None:
                    yield Move(from_sq, (dbl_row, col))

    # Captures (diagonal)
    for dc in (-1, 1):
        to_col = col + dc
        if not on_board(to_row, to_col):
            continue
        target = state.board.get(to_row, to_col)
        is_capture = target is not None and target.color != color
        is_en_passant = (to_row, to_col) == state.en_passant_target

        if is_capture or is_en_passant:
            if to_row == promotion_row:
                for promo in _PROMOTION_TYPES:
                    yield Move(from_sq, (to_row, to_col), promotion=promo)
            else:
                yield Move(from_sq, (to_row, to_col))
