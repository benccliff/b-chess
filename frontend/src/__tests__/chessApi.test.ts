import { vi, describe, it, expect, beforeEach } from 'vitest'
import { createGame, makeMove, ApiError } from '../services/chessApi'
import type { GameState } from '../types/chess'

const mockGameState: GameState = {
  game_id: 'test-id',
  fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  board: Array(8).fill(Array(8).fill(null)),
  turn: 'white',
  status: 'active',
  legal_moves: [],
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('createGame', () => {
  it('POSTs to /games and returns state', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockGameState,
    }))

    const result = await createGame()
    expect(result).toEqual(mockGameState)
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8000/games',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('throws ApiError on non-200', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'Server error',
    }))

    await expect(createGame()).rejects.toBeInstanceOf(ApiError)
  })
})

describe('makeMove', () => {
  it('POSTs the correct body', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockGameState,
    }))

    await makeMove('test-id', 'e2', 'e4')
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8000/games/test-id/moves',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ from_sq: 'e2', to_sq: 'e4', promotion: null }),
      }),
    )
  })

  it('includes promotion in body', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockGameState,
    }))

    await makeMove('test-id', 'e7', 'e8', 'queen')
    const call = vi.mocked(fetch).mock.calls[0]
    const body = JSON.parse(call[1]?.body as string)
    expect(body.promotion).toBe('queen')
  })
})
