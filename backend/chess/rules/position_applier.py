from ..models.board import Board, Square
from ..models.game_state import GameState
from ..models.piece import Piece
from ..models.types import Color, PieceType, CastlingRights
from ..moves.move import Move


def apply_move(state: GameState, move: Move) -> GameState:
    from_row, from_col = move.from_sq
    to_row, to_col = move.to_sq

    board = state.board
    piece = board.get(from_row, from_col)
    assert piece is not None

    captured = board.get(to_row, to_col)
    is_pawn_move = piece.piece_type == PieceType.PAWN
    is_capture = captured is not None

    board = board.set(from_row, from_col, None)

    landing_piece: Piece
    if move.promotion is not None:
        landing_piece = Piece(piece.color, move.promotion)
    else:
        landing_piece = piece

    board = board.set(to_row, to_col, landing_piece)

    new_ep_target: Square | None = None
    if is_pawn_move and (to_row, to_col) == state.en_passant_target:
        board = board.set(from_row, to_col, None)
        is_capture = True

    if is_pawn_move and abs(to_row - from_row) == 2:
        ep_row = (from_row + to_row) // 2
        new_ep_target = (ep_row, from_col)

    if piece.piece_type == PieceType.KING and abs(to_col - from_col) == 2:
        back_row = from_row
        if to_col == 6:
            rook = board.get(back_row, 7)
            board = board.set(back_row, 7, None)
            board = board.set(back_row, 5, rook)
        elif to_col == 2:
            rook = board.get(back_row, 0)
            board = board.set(back_row, 0, None)
            board = board.set(back_row, 3, rook)

    new_cr = _update_castling_rights(state.castling_rights, piece, move.from_sq, move.to_sq)
    new_halfmove = 0 if (is_pawn_move or is_capture) else state.halfmove_clock + 1
    new_fullmove = state.fullmove_number + (1 if state.turn == Color.BLACK else 0)

    return GameState(
        board=board,
        turn=state.turn.opposite,
        castling_rights=new_cr,
        en_passant_target=new_ep_target,
        halfmove_clock=new_halfmove,
        fullmove_number=new_fullmove,
    )


def _update_castling_rights(cr: CastlingRights, piece: Piece, from_sq: Square, to_sq: Square) -> CastlingRights:
    wk = cr.white_kingside
    wq = cr.white_queenside
    bk = cr.black_kingside
    bq = cr.black_queenside

    if piece.piece_type == PieceType.KING:
        if piece.color == Color.WHITE:
            wk = wq = False
        else:
            bk = bq = False

    if piece.piece_type == PieceType.ROOK:
        if from_sq == (7, 7):
            wk = False
        elif from_sq == (7, 0):
            wq = False
        elif from_sq == (0, 7):
            bk = False
        elif from_sq == (0, 0):
            bq = False

    if to_sq == (7, 7):
        wk = False
    elif to_sq == (7, 0):
        wq = False
    elif to_sq == (0, 7):
        bk = False
    elif to_sq == (0, 0):
        bq = False

    return CastlingRights(
        white_kingside=wk,
        white_queenside=wq,
        black_kingside=bk,
        black_queenside=bq,
    )
