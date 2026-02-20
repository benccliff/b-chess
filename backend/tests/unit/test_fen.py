import pytest
from chess.notation.fen import parse_fen, serialize_fen, STARTING_FEN
from chess.models.types import Color, PieceType, CastlingRights
from chess.models.piece import Piece
from chess.models.board import sq_to_coords


def test_parse_starting_position():
    state = parse_fen(STARTING_FEN)
    assert state.turn == Color.WHITE
    assert state.castling_rights == CastlingRights()
    assert state.en_passant_target is None
    assert state.halfmove_clock == 0
    assert state.fullmove_number == 1


def test_initial_board_pieces():
    state = parse_fen(STARTING_FEN)
    board = state.board
    # Black back rank
    assert board.get(0, 0) == Piece(Color.BLACK, PieceType.ROOK)
    assert board.get(0, 4) == Piece(Color.BLACK, PieceType.KING)
    # White back rank
    assert board.get(7, 4) == Piece(Color.WHITE, PieceType.KING)
    assert board.get(7, 3) == Piece(Color.WHITE, PieceType.QUEEN)
    # Pawns
    assert board.get(1, 0) == Piece(Color.BLACK, PieceType.PAWN)
    assert board.get(6, 0) == Piece(Color.WHITE, PieceType.PAWN)
    # Empty squares
    assert board.get(3, 3) is None


def test_round_trip_starting_fen():
    state = parse_fen(STARTING_FEN)
    result = serialize_fen(state)
    assert result == STARTING_FEN


def test_parse_mid_game_fen():
    # After 1. e4 e5 (with en passant and modified clocks)
    fen = "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2"
    state = parse_fen(fen)
    assert state.turn == Color.WHITE
    assert state.en_passant_target == sq_to_coords("e6")
    assert state.fullmove_number == 2


def test_parse_partial_castling_rights():
    fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w Kq - 5 10"
    state = parse_fen(fen)
    cr = state.castling_rights
    assert cr.white_kingside is True
    assert cr.white_queenside is False
    assert cr.black_kingside is False
    assert cr.black_queenside is True


def test_parse_no_castling_rights():
    fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1"
    state = parse_fen(fen)
    cr = state.castling_rights
    assert cr.white_kingside is False
    assert cr.white_queenside is False
    assert cr.black_kingside is False
    assert cr.black_queenside is False


def test_round_trip_mid_game():
    fen = "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 6"
    state = parse_fen(fen)
    assert serialize_fen(state) == fen


def test_invalid_fen_wrong_parts():
    with pytest.raises(ValueError):
        parse_fen("rnbqkbnr w KQkq - 0")  # only 5 parts


def test_invalid_fen_bad_rank():
    with pytest.raises(ValueError):
        parse_fen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP w KQkq - 0 1")  # 7 ranks


def test_invalid_fen_bad_turn():
    with pytest.raises(ValueError):
        parse_fen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR x KQkq - 0 1")


def test_serialize_black_turn():
    fen = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
    state = parse_fen(fen)
    assert state.turn == Color.BLACK
    assert serialize_fen(state) == fen
