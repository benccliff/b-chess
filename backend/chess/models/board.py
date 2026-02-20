from dataclasses import dataclass
from typing import Optional
from .piece import Piece
from .types import Color, PieceType

Square = tuple[int, int]


def sq_to_coords(sq: str) -> Square:
    col = ord(sq[0]) - ord('a')
    rank = int(sq[1])
    row = 8 - rank
    return (row, col)


def coords_to_sq(row: int, col: int) -> str:
    file = chr(ord('a') + col)
    rank = 8 - row
    return f"{file}{rank}"


def on_board(row: int, col: int) -> bool:
    return 0 <= row <= 7 and 0 <= col <= 7


@dataclass(frozen=True)
class Board:
    grid: tuple[tuple[Optional[Piece], ...], ...]

    def get(self, row: int, col: int) -> Optional[Piece]:
        if on_board(row, col):
            return self.grid[row][col]
        return None

    def set(self, row: int, col: int, piece: Optional[Piece]) -> "Board":
        rows = [list(r) for r in self.grid]
        rows[row][col] = piece
        return Board(tuple(tuple(r) for r in rows))

    def find_king(self, color: Color) -> Optional[Square]:
        for row in range(8):
            for col in range(8):
                piece = self.grid[row][col]
                if piece and piece.color == color and piece.piece_type == PieceType.KING:
                    return (row, col)
        return None

    @classmethod
    def empty(cls) -> "Board":
        return cls(tuple(tuple(None for _ in range(8)) for _ in range(8)))

    @classmethod
    def initial(cls) -> "Board":
        def back_rank(color: Color) -> tuple[Optional[Piece], ...]:
            types = [
                PieceType.ROOK, PieceType.KNIGHT, PieceType.BISHOP, PieceType.QUEEN,
                PieceType.KING, PieceType.BISHOP, PieceType.KNIGHT, PieceType.ROOK,
            ]
            return tuple(Piece(color, t) for t in types)

        def pawn_rank(color: Color) -> tuple[Optional[Piece], ...]:
            return tuple(Piece(color, PieceType.PAWN) for _ in range(8))

        empty_rank: tuple[Optional[Piece], ...] = tuple(None for _ in range(8))

        grid: tuple[tuple[Optional[Piece], ...], ...] = (
            back_rank(Color.BLACK),
            pawn_rank(Color.BLACK),
            empty_rank,
            empty_rank,
            empty_rank,
            empty_rank,
            pawn_rank(Color.WHITE),
            back_rank(Color.WHITE),
        )
        return cls(grid)
