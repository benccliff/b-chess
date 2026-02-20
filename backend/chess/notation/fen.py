from typing import Optional
from ..models.board import Board, Square, sq_to_coords, coords_to_sq
from ..models.game_state import GameState
from ..models.piece import Piece
from ..models.types import Color, PieceType, CastlingRights

_PIECE_FROM_CHAR: dict[str, tuple[Color, PieceType]] = {
    'P': (Color.WHITE, PieceType.PAWN),
    'N': (Color.WHITE, PieceType.KNIGHT),
    'B': (Color.WHITE, PieceType.BISHOP),
    'R': (Color.WHITE, PieceType.ROOK),
    'Q': (Color.WHITE, PieceType.QUEEN),
    'K': (Color.WHITE, PieceType.KING),
    'p': (Color.BLACK, PieceType.PAWN),
    'n': (Color.BLACK, PieceType.KNIGHT),
    'b': (Color.BLACK, PieceType.BISHOP),
    'r': (Color.BLACK, PieceType.ROOK),
    'q': (Color.BLACK, PieceType.QUEEN),
    'k': (Color.BLACK, PieceType.KING),
}

_CHAR_FROM_PIECE: dict[tuple[Color, PieceType], str] = {v: k for k, v in _PIECE_FROM_CHAR.items()}

STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"


def parse_fen(fen: str) -> GameState:
    parts = fen.strip().split()
    if len(parts) != 6:
        raise ValueError(f"Invalid FEN: expected 6 parts, got {len(parts)}")

    position_str, turn_str, castling_str, ep_str, halfmove_str, fullmove_str = parts

    ranks = position_str.split('/')
    if len(ranks) != 8:
        raise ValueError(f"Invalid FEN position: expected 8 ranks, got {len(ranks)}")

    rows: list[tuple[Optional[Piece], ...]] = []
    for rank_str in ranks:
        row: list[Optional[Piece]] = []
        for ch in rank_str:
            if ch.isdigit():
                row.extend([None] * int(ch))
            elif ch in _PIECE_FROM_CHAR:
                color, piece_type = _PIECE_FROM_CHAR[ch]
                row.append(Piece(color, piece_type))
            else:
                raise ValueError(f"Invalid FEN character: {ch!r}")
        if len(row) != 8:
            raise ValueError(f"Invalid FEN rank length: {rank_str!r}")
        rows.append(tuple(row))

    board = Board(tuple(rows))

    if turn_str == 'w':
        turn = Color.WHITE
    elif turn_str == 'b':
        turn = Color.BLACK
    else:
        raise ValueError(f"Invalid FEN turn: {turn_str!r}")

    wk = 'K' in castling_str
    wq = 'Q' in castling_str
    bk = 'k' in castling_str
    bq = 'q' in castling_str
    castling_rights = CastlingRights(
        white_kingside=wk,
        white_queenside=wq,
        black_kingside=bk,
        black_queenside=bq,
    )

    en_passant_target: Optional[Square] = None
    if ep_str != '-':
        if len(ep_str) != 2:
            raise ValueError(f"Invalid en passant square: {ep_str!r}")
        en_passant_target = sq_to_coords(ep_str)

    try:
        halfmove_clock = int(halfmove_str)
        fullmove_number = int(fullmove_str)
    except ValueError:
        raise ValueError(f"Invalid FEN clock values: {halfmove_str!r}, {fullmove_str!r}")

    return GameState(
        board=board,
        turn=turn,
        castling_rights=castling_rights,
        en_passant_target=en_passant_target,
        halfmove_clock=halfmove_clock,
        fullmove_number=fullmove_number,
    )


def serialize_fen(state: GameState) -> str:
    rank_strs: list[str] = []
    for row in range(8):
        rank_str = ""
        empty_count = 0
        for col in range(8):
            piece = state.board.grid[row][col]
            if piece is None:
                empty_count += 1
            else:
                if empty_count:
                    rank_str += str(empty_count)
                    empty_count = 0
                rank_str += _CHAR_FROM_PIECE[(piece.color, piece.piece_type)]
        if empty_count:
            rank_str += str(empty_count)
        rank_strs.append(rank_str)
    position_str = '/'.join(rank_strs)

    turn_str = 'w' if state.turn == Color.WHITE else 'b'

    cr = state.castling_rights
    castling_str = (
        ('K' if cr.white_kingside else '') +
        ('Q' if cr.white_queenside else '') +
        ('k' if cr.black_kingside else '') +
        ('q' if cr.black_queenside else '')
    ) or '-'

    ep_str = coords_to_sq(*state.en_passant_target) if state.en_passant_target else '-'

    return f"{position_str} {turn_str} {castling_str} {ep_str} {state.halfmove_clock} {state.fullmove_number}"
