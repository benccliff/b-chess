from chess.notation.fen import parse_fen
from chess.models.board import sq_to_coords
from chess.moves.bishop_validator import bishop_moves


def moves_to_sqs(state, from_sq_str):
    from_sq = sq_to_coords(from_sq_str)
    return {m.to_sq for m in bishop_moves(state, from_sq)}


def test_bishop_open_board_from_e4():
    fen = "8/8/8/8/4B3/8/8/8 w - - 0 1"
    state = parse_fen(fen)
    targets = moves_to_sqs(state, "e4")
    # 4 diagonals: 13 squares total
    assert len(targets) == 13


def test_bishop_blocked_by_own_piece():
    # Bishop on e4, white pawn on f5
    fen = "8/8/8/5P2/4B3/8/8/8 w - - 0 1"
    state = parse_fen(fen)
    targets = moves_to_sqs(state, "e4")
    assert sq_to_coords("f5") not in targets
    assert sq_to_coords("g6") not in targets


def test_bishop_can_capture_enemy_but_not_continue():
    # Bishop on e4, black pawn on f5
    fen = "8/8/8/5p2/4B3/8/8/8 w - - 0 1"
    state = parse_fen(fen)
    targets = moves_to_sqs(state, "e4")
    assert sq_to_coords("f5") in targets  # capture
    assert sq_to_coords("g6") not in targets  # blocked after capture


def test_bishop_corner_a1():
    fen = "8/8/8/8/8/8/8/B7 w - - 0 1"
    state = parse_fen(fen)
    targets = moves_to_sqs(state, "a1")
    assert len(targets) == 7  # one diagonal only
