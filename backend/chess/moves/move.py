from dataclasses import dataclass
from typing import Optional
from ..models.board import Square
from ..models.types import PieceType


@dataclass(frozen=True)
class Move:
    from_sq: Square
    to_sq: Square
    promotion: Optional[PieceType] = None
