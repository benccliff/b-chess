import pytest
from chess.models.types import Color, PieceType, GameStatus, CastlingRights


def test_color_opposite():
    assert Color.WHITE.opposite == Color.BLACK
    assert Color.BLACK.opposite == Color.WHITE


def test_color_values():
    assert Color.WHITE.value == "white"
    assert Color.BLACK.value == "black"


def test_piece_type_values():
    assert PieceType.PAWN.value == "pawn"
    assert PieceType.KING.value == "king"


def test_game_status_values():
    assert GameStatus.ACTIVE.value == "active"
    assert GameStatus.CHECKMATE.value == "checkmate"


def test_castling_rights_defaults():
    cr = CastlingRights()
    assert cr.white_kingside
    assert cr.white_queenside
    assert cr.black_kingside
    assert cr.black_queenside


def test_castling_rights_frozen():
    cr = CastlingRights()
    with pytest.raises(Exception):
        cr.white_kingside = False  # type: ignore
