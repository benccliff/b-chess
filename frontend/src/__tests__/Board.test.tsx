import { vi, describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Board from '../components/Board/Board'
import type { GameState } from '../types/chess'

function makeGameState(): GameState {
  const board = Array(8).fill(null).map(() => Array(8).fill(null))
  return {
    game_id: 'g1',
    fen: '',
    board,
    turn: 'white',
    status: 'active',
    legal_moves: [],
  }
}

describe('Board', () => {
  it('renders 64 squares', () => {
    const { container } = render(
      <Board
        gameState={makeGameState()}
        selectedSquare={null}
        legalTargets={[]}
        onSquareClick={vi.fn()}
      />,
    )
    const squares = container.firstChild?.childNodes
    expect(squares?.length).toBe(64)
  })

  it('flipped=false renders a8 as first square', () => {
    const { container } = render(
      <Board
        gameState={makeGameState()}
        selectedSquare={null}
        legalTargets={[]}
        onSquareClick={vi.fn()}
        flipped={false}
      />,
    )
    const first = container.firstChild?.firstChild as HTMLElement
    expect(first.getAttribute('data-sq')).toBe('a8')
  })

  it('flipped=true renders h1 as first square', () => {
    const { container } = render(
      <Board
        gameState={makeGameState()}
        selectedSquare={null}
        legalTargets={[]}
        onSquareClick={vi.fn()}
        flipped={true}
      />,
    )
    const first = container.firstChild?.firstChild as HTMLElement
    expect(first.getAttribute('data-sq')).toBe('h1')
  })
})
