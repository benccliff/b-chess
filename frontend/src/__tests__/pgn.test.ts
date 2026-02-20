import { describe, it, expect } from 'vitest'
import { buildPGN } from '../utils/pgn'
import type { HistoryEntry } from '../types/chess'

describe('buildPGN', () => {
  it('empty history produces headers with result *', () => {
    const pgn = buildPGN([], 'active')
    expect(pgn).toContain('[Result "*"]')
    expect(pgn).toContain('[Event "b-chess"]')
    expect(pgn).toContain('[White "?"]')
    expect(pgn).toContain('[Black "?"]')
  })

  it('two moves produce "1. e4 e5"', () => {
    const history: HistoryEntry[] = [
      { san: 'e4', fenAfter: '' },
      { san: 'e5', fenAfter: '' },
    ]
    const pgn = buildPGN(history, 'active')
    expect(pgn).toContain('1. e4 e5')
  })

  it('four moves produce "1. e4 e5 2. Nf3 Nc6"', () => {
    const history: HistoryEntry[] = [
      { san: 'e4', fenAfter: '' },
      { san: 'e5', fenAfter: '' },
      { san: 'Nf3', fenAfter: '' },
      { san: 'Nc6', fenAfter: '' },
    ]
    const pgn = buildPGN(history, 'active')
    expect(pgn).toContain('1. e4 e5 2. Nf3 Nc6')
  })

  it('odd number of moves (white last) ends after white move', () => {
    const history: HistoryEntry[] = [
      { san: 'e4', fenAfter: '' },
      { san: 'e5', fenAfter: '' },
      { san: 'Nf3', fenAfter: '' },
    ]
    const pgn = buildPGN(history, 'active')
    expect(pgn).toContain('1. e4 e5 2. Nf3')
    // No black move paired with white's second move
    expect(pgn).not.toContain('2. Nf3 N')
    expect(pgn).not.toContain('2. Nf3 e')
  })

  it('checkmate result is 1-0 when black just moved (white wins)', () => {
    const history: HistoryEntry[] = [
      { san: 'e4', fenAfter: '' },
      { san: 'e5', fenAfter: '' },
      { san: 'Qh5#', fenAfter: '' },
    ]
    const pgn = buildPGN(history, 'checkmate')
    expect(pgn).toContain('[Result "1-0"]')
    expect(pgn).toContain('1-0')
  })

  it('stalemate result is 1/2-1/2', () => {
    const pgn = buildPGN([], 'stalemate')
    expect(pgn).toContain('[Result "1/2-1/2"]')
  })

  it('draw result is 1/2-1/2', () => {
    const pgn = buildPGN([], 'draw')
    expect(pgn).toContain('[Result "1/2-1/2"]')
  })
})
