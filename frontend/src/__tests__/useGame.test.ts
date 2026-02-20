import { vi, describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGame } from '../hooks/useGame'
import * as api from '../services/chessApi'
import type { GameState } from '../types/chess'

const mockState: GameState = {
  game_id: 'g1',
  fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  board: Array(8).fill(Array(8).fill(null)),
  turn: 'white',
  status: 'active',
  legal_moves: [],
}

const mockState2: GameState = { ...mockState, turn: 'black' }

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('useGame', () => {
  it('creates a game on mount', async () => {
    vi.spyOn(api, 'createGame').mockResolvedValue(mockState)

    const { result } = renderHook(() => useGame())

    await act(async () => {})
    expect(result.current.gameState).toEqual(mockState)
  })

  it('submitMove updates gameState', async () => {
    vi.spyOn(api, 'createGame').mockResolvedValue(mockState)
    vi.spyOn(api, 'makeMove').mockResolvedValue(mockState2)

    const { result } = renderHook(() => useGame())
    await act(async () => {})

    await act(async () => {
      await result.current.submitMove('e2', 'e4')
    })

    expect(result.current.gameState?.turn).toBe('black')
  })

  it('sets error on failure', async () => {
    vi.spyOn(api, 'createGame').mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useGame())
    await act(async () => {})

    expect(result.current.error).toBe('Network error')
  })

  it('manages isLoading correctly', async () => {
    let resolve: (v: GameState) => void
    const promise = new Promise<GameState>((r) => { resolve = r })
    vi.spyOn(api, 'createGame').mockReturnValue(promise)

    const { result } = renderHook(() => useGame())
    expect(result.current.isLoading).toBe(true)

    await act(async () => { resolve!(mockState) })
    expect(result.current.isLoading).toBe(false)
  })
})
