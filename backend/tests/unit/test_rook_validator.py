from chess.notation.fen import parse_fen
from chess.models.board import sq_to_coords
from chess.moves.rook_validator import rook_moves


def moves_to_sqs(state, from_sq_str):
    from_sq = sq_to_coords(from_sq_str)
    return {m.to_sq for m in rook_moves(state, from_sq)}


def test_rook_open_board():
    fen = "8/8/8/8/4R3/8/8/8 w - - 0 1"
    state = parse_fen(fen)
    targets = moves_to_sqs(state, "e4")
    assert len(targets) == 14  # 7 on rank + 7 on file


def test_rook_blocked_by_own_piece():
    # Rook on e4, white pawn on e6
    fen = "8/8/4P3/8/4R3/8/8/8 w - - 0 1"
    state = parse_fen(fen)
    targets = moves_to_sqs(state, "e4")
    assert sq_to_coords("e6") not in targets
    assert sq_to_coords("e5") in targets


def test_rook_can_capture_enemy():
    # Rook on e4, black pawn on e6
    fen = "8/8/4p3/8/4R3/8/8/8 w - - 0 1"
    state = parse_fen(fen)
    targets = moves_to_sqs(state, "e4")
    assert sq_to_coords("e6") in targets
    assert sq_to_coords("e7") not in targets


def test_rook_corner():
    fen = "R7/8/8/8/8/8/8/8 w - - 0 1"
    state = parse_fen(fen)
    targets = moves_to_sqs(state, "a8")
    assert len(targets) == 14
