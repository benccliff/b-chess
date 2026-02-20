import { describe, it, expect } from 'vitest'
import { computeSAN } from '../utils/san'
import type { GameState, PieceData } from '../types/chess'

function makeBoard(pieces: { sq: string; piece: PieceData }[]): (PieceData | null)[][] {
  const board: (PieceData | null)[][] = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null))
  for (const { sq, piece } of pieces) {
    const col = sq.charCodeAt(0) - 97
    const row = 8 - parseInt(sq[1])
    board[row][col] = piece
  }
  return board
}

function makeState(pieces: { sq: string; piece: PieceData }[], legalMoves: GameState['legal_moves'] = []): GameState {
  return {
    game_id: 'g1',
    fen: '',
    board: makeBoard(pieces),
    turn: 'white',
    status: 'active',
    legal_moves: legalMoves,
  }
}

const WP: PieceData = { piece_type: 'pawn', color: 'white' }
const BP: PieceData = { piece_type: 'pawn', color: 'black' }
const WN: PieceData = { piece_type: 'knight', color: 'white' }
const WB: PieceData = { piece_type: 'bishop', color: 'white' }
const WR: PieceData = { piece_type: 'rook', color: 'white' }
const WQ: PieceData = { piece_type: 'queen', color: 'white' }
const WK: PieceData = { piece_type: 'king', color: 'white' }

describe('computeSAN', () => {
  it('pawn push', () => {
    const state = makeState([{ sq: 'e2', piece: WP }])
    expect(computeSAN(state, 'e2', 'e4', null, 'active')).toBe('e4')
  })

  it('pawn push with check', () => {
    const state = makeState([{ sq: 'e2', piece: WP }])
    expect(computeSAN(state, 'e2', 'e4', null, 'check')).toBe('e4+')
  })

  it('pawn push with checkmate', () => {
    const state = makeState([{ sq: 'e2', piece: WP }])
    expect(computeSAN(state, 'e2', 'e4', null, 'checkmate')).toBe('e4#')
  })

  it('pawn capture', () => {
    const state = makeState([{ sq: 'e4', piece: WP }, { sq: 'd5', piece: BP }])
    expect(computeSAN(state, 'e4', 'd5', null, 'active')).toBe('exd5')
  })

  it('en passant capture (pawn diagonal to empty square)', () => {
    const state = makeState([{ sq: 'e5', piece: WP }])
    expect(computeSAN(state, 'e5', 'd6', null, 'active')).toBe('exd6')
  })

  it('knight move', () => {
    const state = makeState([{ sq: 'g1', piece: WN }])
    expect(computeSAN(state, 'g1', 'f3', null, 'active')).toBe('Nf3')
  })

  it('knight capture', () => {
    const state = makeState([{ sq: 'f3', piece: WN }, { sq: 'e5', piece: BP }])
    expect(computeSAN(state, 'f3', 'e5', null, 'active')).toBe('Nxe5')
  })

  it('bishop move', () => {
    const state = makeState([{ sq: 'c1', piece: WB }])
    expect(computeSAN(state, 'c1', 'f4', null, 'active')).toBe('Bf4')
  })

  it('rook move', () => {
    const state = makeState([{ sq: 'a1', piece: WR }])
    expect(computeSAN(state, 'a1', 'a8', null, 'active')).toBe('Ra8')
  })

  it('queen move', () => {
    const state = makeState([{ sq: 'd1', piece: WQ }])
    expect(computeSAN(state, 'd1', 'h5', null, 'active')).toBe('Qh5')
  })

  it('king move', () => {
    const state = makeState([{ sq: 'e1', piece: WK }])
    expect(computeSAN(state, 'e1', 'f1', null, 'active')).toBe('Kf1')
  })

  it('kingside castling', () => {
    const state = makeState([{ sq: 'e1', piece: WK }])
    expect(computeSAN(state, 'e1', 'g1', null, 'active')).toBe('O-O')
  })

  it('queenside castling', () => {
    const state = makeState([{ sq: 'e1', piece: WK }])
    expect(computeSAN(state, 'e1', 'c1', null, 'active')).toBe('O-O-O')
  })

  it('pawn promotion', () => {
    const state = makeState([{ sq: 'e7', piece: WP }])
    expect(computeSAN(state, 'e7', 'e8', 'queen', 'active')).toBe('e8=Q')
  })

  it('pawn promotion with capture', () => {
    const state = makeState([{ sq: 'e7', piece: WP }, { sq: 'd8', piece: BP }])
    expect(computeSAN(state, 'e7', 'd8', 'queen', 'active')).toBe('exd8=Q')
  })

  it('disambiguation by file when two knights can reach same square', () => {
    const state = makeState(
      [{ sq: 'b1', piece: WN }, { sq: 'd1', piece: WN }],
      [
        { from_sq: 'b1', to_sq: 'c3', promotion: null },
        { from_sq: 'd1', to_sq: 'c3', promotion: null },
      ],
    )
    expect(computeSAN(state, 'b1', 'c3', null, 'active')).toBe('Nbc3')
  })

  it('disambiguation by rank when two rooks on same file', () => {
    const state = makeState(
      [{ sq: 'a1', piece: WR }, { sq: 'a8', piece: WR }],
      [
        { from_sq: 'a1', to_sq: 'a4', promotion: null },
        { from_sq: 'a8', to_sq: 'a4', promotion: null },
      ],
    )
    expect(computeSAN(state, 'a1', 'a4', null, 'active')).toBe('R1a4')
  })

  it('disambiguation by full square when same file and rank needed', () => {
    const state = makeState(
      [{ sq: 'a1', piece: WQ }, { sq: 'a5', piece: WQ }, { sq: 'e1', piece: WQ }],
      [
        { from_sq: 'a1', to_sq: 'e5', promotion: null },
        { from_sq: 'a5', to_sq: 'e5', promotion: null },
        { from_sq: 'e1', to_sq: 'e5', promotion: null },
      ],
    )
    expect(computeSAN(state, 'a1', 'e5', null, 'active')).toBe('Qa1e5')
  })
})
