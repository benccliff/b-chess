import { vi, describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import StatusBar from '../components/StatusBar/StatusBar'
import type { GameState } from '../types/chess'

function makeState(overrides: Partial<GameState>): GameState {
  return {
    game_id: 'g1',
    fen: '',
    board: Array(8).fill(Array(8).fill(null)),
    turn: 'white',
    status: 'active',
    legal_moves: [],
    ...overrides,
  }
}

describe('StatusBar', () => {
  it('shows white to move', () => {
    render(<StatusBar gameState={makeState({ turn: 'white' })} onNewGame={vi.fn()} />)
    expect(screen.getByText(/White to move/)).toBeTruthy()
  })

  it('shows check indicator', () => {
    render(<StatusBar gameState={makeState({ status: 'check' })} onNewGame={vi.fn()} />)
    expect(screen.getByText(/Check!/)).toBeTruthy()
  })

  it('shows checkmate', () => {
    render(<StatusBar gameState={makeState({ status: 'checkmate', turn: 'white' })} onNewGame={vi.fn()} />)
    expect(screen.getByText(/Black wins!/)).toBeTruthy()
  })

  it('shows stalemate', () => {
    render(<StatusBar gameState={makeState({ status: 'stalemate' })} onNewGame={vi.fn()} />)
    expect(screen.getByText(/Stalemate/)).toBeTruthy()
  })

  it('calls onNewGame on button click', () => {
    const onNewGame = vi.fn()
    render(<StatusBar gameState={makeState({})} onNewGame={onNewGame} />)
    fireEvent.click(screen.getByText('New Game'))
    expect(onNewGame).toHaveBeenCalled()
  })
})
