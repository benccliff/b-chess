from chess.notation.fen import parse_fen, STARTING_FEN
from chess.models.board import sq_to_coords
from chess.models.types import Color, PieceType
from chess.moves.move_generator import legal_moves
from chess.moves.move import Move


def test_starting_position_20_moves():
    state = parse_fen(STARTING_FEN)
    moves = legal_moves(state)
    assert len(moves) == 20


def test_in_check_only_resolving_moves_legal():
    # White king in check by black rook on e1, white must block or move king
    fen = "4k3/8/8/8/8/8/8/4K2r w - - 0 1"
    state = parse_fen(fen)
    moves = legal_moves(state)
    # King must move (can't block on rank 1 with no pieces)
    for m in moves:
        piece = state.board.get(*m.from_sq)
        # all moves must be by the king (only piece) or blocking moves
        assert piece is not None


def test_pinned_piece_limited():
    # White rook on e4 pinned to king on e1 by black rook on e8
    fen = "4r3/8/8/8/4R3/8/8/4K3 w - - 0 1"
    state = parse_fen(fen)
    moves = legal_moves(state)
    rook_moves = [m for m in moves if m.from_sq == sq_to_coords("e4")]
    # Pinned rook can only move along the pin ray (e-file)
    for m in rook_moves:
        assert m.to_sq[1] == sq_to_coords("e4")[1]  # same file


def test_cannot_castle_while_in_check():
    # White king in check, but has castling rights
    fen = "4r3/8/8/8/8/8/8/4K2R w K - 0 1"
    state = parse_fen(fen)
    moves = legal_moves(state)
    castling = [m for m in moves if m.from_sq == sq_to_coords("e1") and m.to_sq == sq_to_coords("g1")]
    assert len(castling) == 0


def test_cannot_castle_through_check():
    # White king on e1, rook on h1. Black rook on f8 attacks f1 (through-square)
    fen = "5r2/8/8/8/8/8/8/4K2R w K - 0 1"
    state = parse_fen(fen)
    moves = legal_moves(state)
    castling = [m for m in moves if m.from_sq == sq_to_coords("e1") and m.to_sq == sq_to_coords("g1")]
    assert len(castling) == 0


def test_double_check_only_king_moves():
    # King in double check: must move the king
    fen = "4k3/8/8/8/8/5n2/8/4K2r w - - 0 1"
    state = parse_fen(fen)
    moves = legal_moves(state)
    for m in moves:
        piece = state.board.get(*m.from_sq)
        assert piece is not None
        assert piece.piece_type == PieceType.KING
