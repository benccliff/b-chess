import { describe, it, expect, beforeAll } from 'vitest'
import { render } from '@testing-library/react'
import MoveTracker from '../components/MoveTracker/MoveTracker'
import type { HistoryEntry } from '../types/chess'

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = () => {}
})

describe('MoveTracker', () => {
  it('renders without crashing on empty history', () => {
    const { container } = render(<MoveTracker moveHistory={[]} />)
    expect(container).toBeTruthy()
  })

  it('renders move number for first pair', () => {
    const history: HistoryEntry[] = [
      { san: 'e4', fenAfter: '' },
      { san: 'e5', fenAfter: '' },
    ]
    const { getByText } = render(<MoveTracker moveHistory={history} />)
    expect(getByText('1.')).toBeTruthy()
    expect(getByText('e4')).toBeTruthy()
    expect(getByText('e5')).toBeTruthy()
  })

  it('renders two move pairs', () => {
    const history: HistoryEntry[] = [
      { san: 'e4', fenAfter: '' },
      { san: 'e5', fenAfter: '' },
      { san: 'Nf3', fenAfter: '' },
      { san: 'Nc6', fenAfter: '' },
    ]
    const { getByText } = render(<MoveTracker moveHistory={history} />)
    expect(getByText('1.')).toBeTruthy()
    expect(getByText('2.')).toBeTruthy()
    expect(getByText('Nf3')).toBeTruthy()
    expect(getByText('Nc6')).toBeTruthy()
  })

  it('renders a white-only last move with no black move', () => {
    const history: HistoryEntry[] = [
      { san: 'e4', fenAfter: '' },
      { san: 'e5', fenAfter: '' },
      { san: 'Nf3', fenAfter: '' },
    ]
    const { getByText, queryByText } = render(<MoveTracker moveHistory={history} />)
    expect(getByText('2.')).toBeTruthy()
    expect(getByText('Nf3')).toBeTruthy()
    expect(queryByText('Nc6')).toBeNull()
  })
})
