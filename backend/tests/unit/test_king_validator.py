from chess.notation.fen import parse_fen
from chess.models.board import sq_to_coords
from chess.moves.king_validator import king_moves


def moves_to_sqs(state, from_sq_str):
    from_sq = sq_to_coords(from_sq_str)
    return {m.to_sq for m in king_moves(state, from_sq)}


def test_king_center_8_moves():
    fen = "8/8/8/8/4K3/8/8/8 w - - 0 1"
    state = parse_fen(fen)
    targets = moves_to_sqs(state, "e4")
    assert len(targets) == 8


def test_king_corner_3_moves():
    fen = "K7/8/8/8/8/8/8/8 w - - 0 1"
    state = parse_fen(fen)
    targets = moves_to_sqs(state, "a8")
    assert len(targets) == 3


def test_king_cannot_land_on_own_piece():
    fen = "8/8/8/8/4K3/4P3/8/8 w - - 0 1"
    state = parse_fen(fen)
    targets = moves_to_sqs(state, "e4")
    assert sq_to_coords("e3") not in targets


def test_kingside_castling():
    # White king and rook in place, path clear, rights intact
    fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQK2R w KQkq - 0 1"
    state = parse_fen(fen)
    targets = moves_to_sqs(state, "e1")
    assert sq_to_coords("g1") in targets


def test_queenside_castling():
    fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/R3KBNR w KQkq - 0 1"
    state = parse_fen(fen)
    targets = moves_to_sqs(state, "e1")
    assert sq_to_coords("c1") in targets


def test_castling_blocked_by_piece_in_path():
    # Kingside path has a bishop in the way
    fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKB1R w KQkq - 0 1"
    state = parse_fen(fen)
    targets = moves_to_sqs(state, "e1")
    assert sq_to_coords("g1") not in targets


def test_castling_without_rights():
    # No castling rights
    fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQK2R w - - 0 1"
    state = parse_fen(fen)
    targets = moves_to_sqs(state, "e1")
    assert sq_to_coords("g1") not in targets


def test_black_kingside_castling():
    fen = "rnbqk2r/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1"
    state = parse_fen(fen)
    targets = moves_to_sqs(state, "e8")
    assert sq_to_coords("g8") in targets
