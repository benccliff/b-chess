from chess.notation.fen import parse_fen, STARTING_FEN
from chess.models.types import Color
from chess.rules.check_detector import is_in_check


def test_not_in_check_at_start():
    state = parse_fen(STARTING_FEN)
    assert not is_in_check(state, Color.WHITE)
    assert not is_in_check(state, Color.BLACK)


def test_in_check_by_rook():
    # White king on e1, black rook on e8, nothing in between
    fen = "4r3/8/8/8/8/8/8/4K3 w - - 0 1"
    state = parse_fen(fen)
    assert is_in_check(state, Color.WHITE)


def test_in_check_by_bishop():
    # White king on e1, black bishop on h4
    fen = "8/8/8/8/7b/8/8/4K3 w - - 0 1"
    state = parse_fen(fen)
    assert is_in_check(state, Color.WHITE)


def test_blocker_shields_king():
    # White king on e1, black rook on e8, white pawn on e4 in between
    fen = "4r3/8/8/8/4P3/8/8/4K3 w - - 0 1"
    state = parse_fen(fen)
    assert not is_in_check(state, Color.WHITE)


def test_in_check_by_knight():
    # White king on e1, black knight on f3
    fen = "8/8/8/8/8/5n2/8/4K3 w - - 0 1"
    state = parse_fen(fen)
    assert is_in_check(state, Color.WHITE)


def test_in_check_by_pawn():
    # White king on e4, black pawn on d5
    fen = "8/8/8/3p4/4K3/8/8/8 w - - 0 1"
    state = parse_fen(fen)
    assert is_in_check(state, Color.WHITE)
