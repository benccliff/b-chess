from chess.notation.fen import parse_fen, STARTING_FEN
from chess.models.types import GameStatus
from chess.moves.move_generator import legal_moves
from chess.rules.game_status import determine_status


def test_active_at_start():
    state = parse_fen(STARTING_FEN)
    moves = legal_moves(state)
    assert determine_status(state, moves) == GameStatus.ACTIVE


def test_check_status():
    # White king in check
    fen = "4k3/8/8/8/8/8/8/4K2r w - - 0 1"
    state = parse_fen(fen)
    moves = legal_moves(state)
    assert determine_status(state, moves) == GameStatus.CHECK


def test_checkmate_fools_mate():
    # Fool's mate: 1. f3 e5 2. g4 Qh4#
    fen = "rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3"
    state = parse_fen(fen)
    moves = legal_moves(state)
    assert determine_status(state, moves) == GameStatus.CHECKMATE


def test_stalemate():
    # Classic stalemate: Black king on a8, White queen on b6, White king on c6
    fen = "k7/8/1QK5/8/8/8/8/8 b - - 0 1"
    state = parse_fen(fen)
    moves = legal_moves(state)
    assert determine_status(state, moves) == GameStatus.STALEMATE


def test_draw_by_50_move_rule():
    fen = "8/8/8/8/8/8/8/4K3 w - - 100 51"
    state = parse_fen(fen)
    moves = legal_moves(state)
    assert determine_status(state, moves) == GameStatus.DRAW
