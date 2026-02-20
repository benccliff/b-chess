from chess.notation.fen import parse_fen
from chess.models.board import sq_to_coords
from chess.moves.knight_validator import knight_moves


def moves_to_sqs(state, from_sq_str):
    from_sq = sq_to_coords(from_sq_str)
    return {m.to_sq for m in knight_moves(state, from_sq)}


def test_knight_center_has_8_moves():
    # Knight on e4, no other pieces nearby
    fen = "8/8/8/8/4N3/8/8/8 w - - 0 1"
    state = parse_fen(fen)
    targets = moves_to_sqs(state, "e4")
    assert len(targets) == 8


def test_knight_corner_has_2_moves():
    fen = "N7/8/8/8/8/8/8/8 w - - 0 1"
    state = parse_fen(fen)
    targets = moves_to_sqs(state, "a8")
    assert len(targets) == 2


def test_knight_cannot_land_on_own_piece():
    # Knight on e4, white piece on d2
    fen = "8/8/8/8/4N3/8/3P4/8 w - - 0 1"
    state = parse_fen(fen)
    targets = moves_to_sqs(state, "e4")
    assert sq_to_coords("d2") not in targets


def test_knight_can_capture_enemy():
    # Knight on e4, black piece on d6
    fen = "8/8/3p4/8/4N3/8/8/8 w - - 0 1"
    state = parse_fen(fen)
    targets = moves_to_sqs(state, "e4")
    assert sq_to_coords("d6") in targets


def test_knight_can_jump_over_pieces():
    # Starting position - knights can always jump
    from chess.notation.fen import STARTING_FEN
    state = parse_fen(STARTING_FEN)
    targets = moves_to_sqs(state, "g1")
    assert sq_to_coords("f3") in targets
    assert sq_to_coords("h3") in targets
