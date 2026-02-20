from dataclasses import dataclass
from .types import Color, PieceType


@dataclass(frozen=True)
class Piece:
    color: Color
    piece_type: PieceType
