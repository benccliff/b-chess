from enum import Enum
from dataclasses import dataclass


class Color(Enum):
    WHITE = "white"
    BLACK = "black"

    @property
    def opposite(self) -> "Color":
        return Color.BLACK if self == Color.WHITE else Color.WHITE


class PieceType(Enum):
    PAWN = "pawn"
    KNIGHT = "knight"
    BISHOP = "bishop"
    ROOK = "rook"
    QUEEN = "queen"
    KING = "king"


class GameStatus(Enum):
    ACTIVE = "active"
    CHECK = "check"
    CHECKMATE = "checkmate"
    STALEMATE = "stalemate"
    DRAW = "draw"


@dataclass(frozen=True)
class CastlingRights:
    white_kingside: bool = True
    white_queenside: bool = True
    black_kingside: bool = True
    black_queenside: bool = True
