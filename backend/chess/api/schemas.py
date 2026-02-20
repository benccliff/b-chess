from typing import Optional
from pydantic import BaseModel


class PieceSchema(BaseModel):
    piece_type: str
    color: str


class MoveSchema(BaseModel):
    from_sq: str
    to_sq: str
    promotion: Optional[str] = None


class MoveRequest(BaseModel):
    from_sq: str
    to_sq: str
    promotion: Optional[str] = None


class GameStateResponse(BaseModel):
    game_id: str
    fen: str
    board: list[list[Optional[PieceSchema]]]
    turn: str
    status: str
    legal_moves: list[MoveSchema]
