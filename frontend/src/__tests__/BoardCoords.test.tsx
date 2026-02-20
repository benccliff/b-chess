import { vi, describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import BoardCoords from '../components/BoardCoords/BoardCoords'
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

const baseProps = {
  gameState: makeGameState(),
  selectedSquare: null as string | null,
  legalTargets: [] as string[],
  onSquareClick: vi.fn(),
}

describe('BoardCoords', () => {
  it('renders all rank labels 1-8', () => {
    const { getByText } = render(<BoardCoords {...baseProps} flipped={false} />)
    for (let r = 1; r <= 8; r++) {
      expect(getByText(String(r))).toBeTruthy()
    }
  })

  it('renders all file labels a-h', () => {
    const { getByText } = render(<BoardCoords {...baseProps} flipped={false} />)
    for (const f of 'abcdefgh') {
      expect(getByText(f)).toBeTruthy()
    }
  })

  it('unflipped: rank 8 appears before rank 1 in DOM', () => {
    const { container } = render(<BoardCoords {...baseProps} flipped={false} />)
    const labels = Array.from(container.querySelectorAll('[data-rank]')).map(
      (el) => el.textContent,
    )
    expect(labels[0]).toBe('8')
    expect(labels[7]).toBe('1')
  })

  it('flipped: rank 1 appears before rank 8 in DOM', () => {
    const { container } = render(<BoardCoords {...baseProps} flipped={true} />)
    const labels = Array.from(container.querySelectorAll('[data-rank]')).map(
      (el) => el.textContent,
    )
    expect(labels[0]).toBe('1')
    expect(labels[7]).toBe('8')
  })

  it('unflipped: file a appears before file h in DOM', () => {
    const { container } = render(<BoardCoords {...baseProps} flipped={false} />)
    const labels = Array.from(container.querySelectorAll('[data-file]')).map(
      (el) => el.textContent,
    )
    expect(labels[0]).toBe('a')
    expect(labels[7]).toBe('h')
  })

  it('flipped: file h appears before file a in DOM', () => {
    const { container } = render(<BoardCoords {...baseProps} flipped={true} />)
    const labels = Array.from(container.querySelectorAll('[data-file]')).map(
      (el) => el.textContent,
    )
    expect(labels[0]).toBe('h')
    expect(labels[7]).toBe('a')
  })
})
