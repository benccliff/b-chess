from chess.notation.fen import parse_fen
from chess.models.board import sq_to_coords
from chess.moves.queen_validator import queen_moves


def moves_to_sqs(state, from_sq_str):
    from_sq = sq_to_coords(from_sq_str)
    return {m.to_sq for m in queen_moves(state, from_sq)}


def test_queen_open_board_center():
    fen = "8/8/8/8/4Q3/8/8/8 w - - 0 1"
    state = parse_fen(fen)
    targets = moves_to_sqs(state, "e4")
    assert len(targets) == 27  # 14 rook + 13 bishop


def test_queen_blocked_by_own_piece():
    fen = "8/8/8/5P2/4Q3/8/8/8 w - - 0 1"
    state = parse_fen(fen)
    targets = moves_to_sqs(state, "e4")
    assert sq_to_coords("f5") not in targets


def test_queen_can_capture_enemy():
    fen = "8/8/8/5p2/4Q3/8/8/8 w - - 0 1"
    state = parse_fen(fen)
    targets = moves_to_sqs(state, "e4")
    assert sq_to_coords("f5") in targets
    assert sq_to_coords("g6") not in targets
