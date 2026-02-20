from dataclasses import dataclass
from typing import Optional
from .board import Board, Square
from .types import Color, CastlingRights


@dataclass(frozen=True)
class GameState:
    board: Board
    turn: Color
    castling_rights: CastlingRights
    en_passant_target: Optional[Square]
    halfmove_clock: int
    fullmove_number: int

    @classmethod
    def initial(cls) -> "GameState":
        return cls(
            board=Board.initial(),
            turn=Color.WHITE,
            castling_rights=CastlingRights(),
            en_passant_target=None,
            halfmove_clock=0,
            fullmove_number=1,
        )
