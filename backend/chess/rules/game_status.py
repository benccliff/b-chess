from ..models.game_state import GameState
from ..models.types import GameStatus
from ..rules.check_detector import is_in_check
from ..moves.move import Move


def determine_status(state: GameState, legal_moves_list: list[Move]) -> GameStatus:
    if state.halfmove_clock >= 100:
        return GameStatus.DRAW

    if legal_moves_list:
        if is_in_check(state, state.turn):
            return GameStatus.CHECK
        return GameStatus.ACTIVE
    else:
        if is_in_check(state, state.turn):
            return GameStatus.CHECKMATE
        return GameStatus.STALEMATE
