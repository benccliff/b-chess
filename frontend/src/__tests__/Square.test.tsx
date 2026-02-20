import { vi, describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import Square from '../components/Square/Square'

describe('Square', () => {
  it('renders a piece', () => {
    const { container } = render(
      <Square
        sq="e4"
        piece={{ color: 'white', piece_type: 'pawn' }}
        isLight={true}
        isSelected={false}
        isLegalTarget={false}
        onClick={vi.fn()}
      />,
    )
    expect(container.querySelector('img')).toBeTruthy()
  })

  it('renders empty without piece', () => {
    const { container } = render(
      <Square sq="e4" piece={null} isLight={true} isSelected={false} isLegalTarget={false} onClick={vi.fn()} />,
    )
    expect(container.querySelector('span')).toBeNull()
  })

  it('calls onClick with square name', () => {
    const onClick = vi.fn()
    const { container } = render(
      <Square sq="e4" piece={null} isLight={true} isSelected={false} isLegalTarget={false} onClick={onClick} />,
    )
    fireEvent.click(container.firstChild!)
    expect(onClick).toHaveBeenCalledWith('e4')
  })

  it('shows dot indicator for legal target without piece', () => {
    const { container } = render(
      <Square sq="e4" piece={null} isLight={true} isSelected={false} isLegalTarget={true} onClick={vi.fn()} />,
    )
    expect(container.querySelector('div > div')).toBeTruthy()
  })

  it('applies selected background color', () => {
    const { container } = render(
      <Square sq="e4" piece={null} isLight={true} isSelected={true} isLegalTarget={false} onClick={vi.fn()} />,
    )
    const el = container.firstChild as HTMLElement
    expect(el.style.backgroundColor).toBe('rgb(246, 246, 105)')
  })
})
