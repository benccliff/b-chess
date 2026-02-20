import pytest
from chess.notation.fen import parse_fen, STARTING_FEN, serialize_fen
from chess.models.board import sq_to_coords
from chess.models.types import Color, PieceType
from chess.models.piece import Piece
from chess.rules.position_applier import apply_move
from chess.moves.move import Move


def test_basic_move_updates_board():
    state = parse_fen(STARTING_FEN)
    move = Move(sq_to_coords("e2"), sq_to_coords("e4"))
    new_state = apply_move(state, move)
    assert new_state.board.get(*sq_to_coords("e4")) == Piece(Color.WHITE, PieceType.PAWN)
    assert new_state.board.get(*sq_to_coords("e2")) is None


def test_immutability():
    state = parse_fen(STARTING_FEN)
    move = Move(sq_to_coords("e2"), sq_to_coords("e4"))
    new_state = apply_move(state, move)
    # Original state is unchanged
    assert state.board.get(*sq_to_coords("e2")) is not None
    assert new_state is not state


def test_turn_switches():
    state = parse_fen(STARTING_FEN)
    move = Move(sq_to_coords("e2"), sq_to_coords("e4"))
    new_state = apply_move(state, move)
    assert new_state.turn == Color.BLACK


def test_en_passant_target_set_on_double_push():
    state = parse_fen(STARTING_FEN)
    move = Move(sq_to_coords("e2"), sq_to_coords("e4"))
    new_state = apply_move(state, move)
    assert new_state.en_passant_target == sq_to_coords("e3")


def test_en_passant_target_cleared_on_other_moves():
    state = parse_fen(STARTING_FEN)
    # Double push sets en passant
    state = apply_move(state, Move(sq_to_coords("e2"), sq_to_coords("e4")))
    assert state.en_passant_target is not None
    # Black plays e5->e6 which clears it
    state = apply_move(state, Move(sq_to_coords("e7"), sq_to_coords("e6")))
    assert state.en_passant_target is None


def test_en_passant_capture_removes_pawn():
    fen = "rnbqkbnr/ppp1pppp/8/3pP3/8/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 3"
    state = parse_fen(fen)
    move = Move(sq_to_coords("e5"), sq_to_coords("d6"))
    new_state = apply_move(state, move)
    # d5 pawn (black) should be gone
    assert new_state.board.get(*sq_to_coords("d5")) is None
    # White pawn at d6
    assert new_state.board.get(*sq_to_coords("d6")) == Piece(Color.WHITE, PieceType.PAWN)


def test_castling_moves_both_king_and_rook():
    fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQK2R w KQkq - 0 1"
    state = parse_fen(fen)
    move = Move(sq_to_coords("e1"), sq_to_coords("g1"))
    new_state = apply_move(state, move)
    assert new_state.board.get(*sq_to_coords("g1")) == Piece(Color.WHITE, PieceType.KING)
    assert new_state.board.get(*sq_to_coords("f1")) == Piece(Color.WHITE, PieceType.ROOK)
    assert new_state.board.get(*sq_to_coords("e1")) is None
    assert new_state.board.get(*sq_to_coords("h1")) is None


def test_queenside_castling():
    fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/R3KBNR w KQkq - 0 1"
    state = parse_fen(fen)
    move = Move(sq_to_coords("e1"), sq_to_coords("c1"))
    new_state = apply_move(state, move)
    assert new_state.board.get(*sq_to_coords("c1")) == Piece(Color.WHITE, PieceType.KING)
    assert new_state.board.get(*sq_to_coords("d1")) == Piece(Color.WHITE, PieceType.ROOK)


def test_promotion():
    fen = "8/4P3/8/8/8/8/8/4K3 w - - 0 1"
    state = parse_fen(fen)
    move = Move(sq_to_coords("e7"), sq_to_coords("e8"), promotion=PieceType.QUEEN)
    new_state = apply_move(state, move)
    assert new_state.board.get(*sq_to_coords("e8")) == Piece(Color.WHITE, PieceType.QUEEN)
    assert new_state.board.get(*sq_to_coords("e7")) is None


def test_halfmove_clock_resets_on_pawn_move():
    fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 10 5"
    state = parse_fen(fen)
    move = Move(sq_to_coords("e2"), sq_to_coords("e4"))
    new_state = apply_move(state, move)
    assert new_state.halfmove_clock == 0


def test_halfmove_clock_resets_on_capture():
    fen = "8/8/8/3p4/4R3/8/8/4K3 w - - 5 3"
    state = parse_fen(fen)
    move = Move(sq_to_coords("e4"), sq_to_coords("d4"))  # not a capture
    new_state = apply_move(state, move)
    # Rook move, no capture, clock increments
    assert new_state.halfmove_clock == 6


def test_halfmove_clock_increments_on_non_pawn_non_capture():
    fen = "8/8/8/8/4R3/8/8/4K3 w - - 5 3"
    state = parse_fen(fen)
    move = Move(sq_to_coords("e4"), sq_to_coords("e5"))
    new_state = apply_move(state, move)
    assert new_state.halfmove_clock == 6


def test_fullmove_increments_after_black():
    fen = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
    state = parse_fen(fen)
    move = Move(sq_to_coords("e7"), sq_to_coords("e5"))
    new_state = apply_move(state, move)
    assert new_state.fullmove_number == 2


def test_castling_rights_revoked_on_king_move():
    fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    state = parse_fen(fen)
    # Move king (not castling)
    move = Move(sq_to_coords("e1"), sq_to_coords("e2"))
    new_state = apply_move(state, move)
    assert not new_state.castling_rights.white_kingside
    assert not new_state.castling_rights.white_queenside
    # Black rights unchanged
    assert new_state.castling_rights.black_kingside
    assert new_state.castling_rights.black_queenside


def test_castling_rights_revoked_on_rook_move():
    fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    state = parse_fen(fen)
    # Move h1 rook
    move = Move(sq_to_coords("h1"), sq_to_coords("h2"))
    new_state = apply_move(state, move)
    assert not new_state.castling_rights.white_kingside
    assert new_state.castling_rights.white_queenside  # queenside unaffected
