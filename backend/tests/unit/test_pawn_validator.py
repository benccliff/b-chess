import pytest
from chess.notation.fen import parse_fen, STARTING_FEN
from chess.models.board import sq_to_coords, Board
from chess.models.game_state import GameState
from chess.models.types import Color, PieceType, CastlingRights
from chess.models.piece import Piece
from chess.moves.pawn_validator import pawn_moves


def moves_to_sqs(state, from_sq_str):
    from_sq = sq_to_coords(from_sq_str)
    return {m.to_sq for m in pawn_moves(state, from_sq)}


def test_white_pawn_single_push():
    state = parse_fen(STARTING_FEN)
    targets = moves_to_sqs(state, "e2")
    assert sq_to_coords("e3") in targets


def test_white_pawn_double_push_from_start():
    state = parse_fen(STARTING_FEN)
    targets = moves_to_sqs(state, "e2")
    assert sq_to_coords("e4") in targets


def test_white_pawn_no_double_push_after_moving():
    # Pawn already on e3
    fen = "rnbqkbnr/pppppppp/8/8/8/4P3/PPPP1PPP/RNBQKBNR w KQkq - 0 2"
    state = parse_fen(fen)
    targets = moves_to_sqs(state, "e3")
    assert sq_to_coords("e5") not in targets


def test_white_pawn_blocked_by_piece():
    fen = "rnbqkbnr/pppp1ppp/8/8/8/4p3/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    state = parse_fen(fen)
    targets = moves_to_sqs(state, "e2")
    assert sq_to_coords("e3") not in targets
    assert sq_to_coords("e4") not in targets


def test_white_pawn_diagonal_capture():
    fen = "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2"
    state = parse_fen(fen)
    targets = moves_to_sqs(state, "e4")
    assert sq_to_coords("d5") in targets


def test_white_pawn_en_passant():
    # White pawn on e5, black just played d5 (en passant target = d6)
    fen = "rnbqkbnr/ppp1pppp/8/3pP3/8/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 3"
    state = parse_fen(fen)
    targets = moves_to_sqs(state, "e5")
    assert sq_to_coords("d6") in targets


def test_white_pawn_promotion():
    # White pawn on e7 with clear e8 and no adjacent enemies (only push promotion)
    fen = "k7/4P3/8/8/8/8/8/4K3 w - - 0 1"
    state = parse_fen(fen)
    from_sq = sq_to_coords("e7")
    moves = list(pawn_moves(state, from_sq))
    promotions = {m.promotion for m in moves}
    assert PieceType.QUEEN in promotions
    assert PieceType.ROOK in promotions
    assert PieceType.BISHOP in promotions
    assert PieceType.KNIGHT in promotions
    # 4 promotion types, push only (e8 is empty, no captures)
    assert len([m for m in moves if m.promotion is not None]) == 4


def test_black_pawn_single_push():
    fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1"
    state = parse_fen(fen)
    targets = moves_to_sqs(state, "e7")
    assert sq_to_coords("e6") in targets


def test_black_pawn_double_push():
    fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1"
    state = parse_fen(fen)
    targets = moves_to_sqs(state, "e7")
    assert sq_to_coords("e5") in targets


def test_black_pawn_promotion():
    # Black pawn on e2 with clear e1
    fen = "4K3/8/8/8/8/8/4p3/3k4 b - - 0 1"
    state = parse_fen(fen)
    from_sq = sq_to_coords("e2")
    moves = list(pawn_moves(state, from_sq))
    promotions = {m.promotion for m in moves}
    assert PieceType.QUEEN in promotions
    assert len([m for m in moves if m.promotion is not None]) == 4


def test_pawn_cannot_capture_own_piece():
    # White pawn e4, white knight d5
    fen = "rnbqkbnr/pppppppp/8/3N4/4P3/8/PPPP1PPP/R1BQKBNR w KQkq - 0 1"
    state = parse_fen(fen)
    targets = moves_to_sqs(state, "e4")
    assert sq_to_coords("d5") not in targets
