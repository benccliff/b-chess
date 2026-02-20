from ..models.board import Square
from ..models.game_state import GameState
from ..models.types import Color, PieceType
from ..moves.move import Move


def pseudo_legal_moves_for_color(state: GameState, color: Color) -> list[Move]:
    from ..moves.pawn_validator import pawn_moves
    from ..moves.knight_validator import knight_moves
    from ..moves.bishop_validator import bishop_moves
    from ..moves.rook_validator import rook_moves
    from ..moves.queen_validator import queen_moves
    from ..moves.king_validator import king_moves

    _validators = {
        PieceType.PAWN: pawn_moves,
        PieceType.KNIGHT: knight_moves,
        PieceType.BISHOP: bishop_moves,
        PieceType.ROOK: rook_moves,
        PieceType.QUEEN: queen_moves,
        PieceType.KING: king_moves,
    }

    moves: list[Move] = []
    for row in range(8):
        for col in range(8):
            piece = state.board.get(row, col)
            if piece and piece.color == color:
                validator = _validators.get(piece.piece_type)
                if validator:
                    moves.extend(validator(state, (row, col)))
    return moves


def is_in_check(state: GameState, color: Color) -> bool:
    king_sq = state.board.find_king(color)
    if king_sq is None:
        return False

    opponent = color.opposite
    opponent_state = GameState(
        board=state.board,
        turn=opponent,
        castling_rights=state.castling_rights,
        en_passant_target=state.en_passant_target,
        halfmove_clock=state.halfmove_clock,
        fullmove_number=state.fullmove_number,
    )
    opponent_moves = pseudo_legal_moves_for_color(opponent_state, opponent)
    return any(m.to_sq == king_sq for m in opponent_moves)
