import { vi, describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSelectedSquare } from '../hooks/useSelectedSquare'
import type { GameState } from '../types/chess'

function makeState(overrides: Partial<GameState> = {}): GameState {
  const board: (null | { piece_type: string; color: string })[][] = Array(8).fill(null).map(() => Array(8).fill(null))
  // White pawn at e2 (row 6, col 4)
  board[6][4] = { piece_type: 'pawn', color: 'white' }
  return {
    game_id: 'g1',
    fen: '',
    board: board as GameState['board'],
    turn: 'white',
    status: 'active',
    legal_moves: [{ from_sq: 'e2', to_sq: 'e4', promotion: null }],
    ...overrides,
  }
}

describe('useSelectedSquare', () => {
  it('clicking own piece selects it and shows legal targets', () => {
    const state = makeState()
    const { result } = renderHook(() => useSelectedSquare(state, vi.fn()))

    act(() => result.current.handleSquareClick('e2'))
    expect(result.current.selectedSquare).toBe('e2')
    expect(result.current.legalTargets).toContain('e4')
  })

  it('clicking legal target calls onMove', () => {
    const state = makeState()
    const onMove = vi.fn()
    const { result } = renderHook(() => useSelectedSquare(state, onMove))

    act(() => result.current.handleSquareClick('e2'))
    act(() => result.current.handleSquareClick('e4'))
    expect(onMove).toHaveBeenCalledWith('e2', 'e4')
    expect(result.current.selectedSquare).toBeNull()
  })

  it('clicking non-target deselects', () => {
    const state = makeState()
    const { result } = renderHook(() => useSelectedSquare(state, vi.fn()))

    act(() => result.current.handleSquareClick('e2'))
    act(() => result.current.handleSquareClick('e5'))
    expect(result.current.selectedSquare).toBeNull()
  })

  it('promotion target sets pendingPromotion', () => {
    const state = makeState({
      legal_moves: [
        { from_sq: 'e7', to_sq: 'e8', promotion: 'queen' },
        { from_sq: 'e7', to_sq: 'e8', promotion: 'rook' },
        { from_sq: 'e7', to_sq: 'e8', promotion: 'bishop' },
        { from_sq: 'e7', to_sq: 'e8', promotion: 'knight' },
      ],
    })
    const board = state.board.map((row) => [...row])
    board[1][4] = { piece_type: 'pawn', color: 'white' }
    const stateWithPawn: GameState = { ...state, board }

    const { result } = renderHook(() => useSelectedSquare(stateWithPawn, vi.fn()))

    act(() => result.current.handleSquareClick('e7'))
    act(() => result.current.handleSquareClick('e8'))
    expect(result.current.pendingPromotion).toEqual({ fromSq: 'e7', toSq: 'e8' })
  })

  it('handlePromotionChoice calls onMove with promotion', () => {
    const state = makeState({
      legal_moves: [
        { from_sq: 'e7', to_sq: 'e8', promotion: 'queen' },
        { from_sq: 'e7', to_sq: 'e8', promotion: 'rook' },
        { from_sq: 'e7', to_sq: 'e8', promotion: 'bishop' },
        { from_sq: 'e7', to_sq: 'e8', promotion: 'knight' },
      ],
    })
    const board = state.board.map((row) => [...row])
    board[1][4] = { piece_type: 'pawn', color: 'white' }
    const stateWithPawn: GameState = { ...state, board }

    const onMove = vi.fn()
    const { result } = renderHook(() => useSelectedSquare(stateWithPawn, onMove))

    act(() => result.current.handleSquareClick('e7'))
    act(() => result.current.handleSquareClick('e8'))
    act(() => result.current.handlePromotionChoice('queen'))

    expect(onMove).toHaveBeenCalledWith('e7', 'e8', 'queen')
    expect(result.current.pendingPromotion).toBeNull()
  })
})
