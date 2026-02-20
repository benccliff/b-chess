import { vi, describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import PromotionModal from '../components/PromotionModal/PromotionModal'

describe('PromotionModal', () => {
  it('renders 4 promotion options', () => {
    const { container } = render(<PromotionModal color="white" onChoice={vi.fn()} />)
    expect(container.querySelectorAll('img').length).toBe(4)
  })

  it('calls onChoice with queen when queen clicked', () => {
    const onChoice = vi.fn()
    const { container } = render(<PromotionModal color="white" onChoice={onChoice} />)
    const queenImg = container.querySelector('img[src="/white-queen.png"]')
    expect(queenImg).toBeTruthy()
    fireEvent.click(queenImg!.closest('button')!)
    expect(onChoice).toHaveBeenCalledWith('queen')
  })

  it('calls onChoice with knight when knight clicked', () => {
    const onChoice = vi.fn()
    const { container } = render(<PromotionModal color="white" onChoice={onChoice} />)
    const knightImg = container.querySelector('img[src="/white-knight.png"]')
    expect(knightImg).toBeTruthy()
    fireEvent.click(knightImg!.closest('button')!)
    expect(onChoice).toHaveBeenCalledWith('knight')
  })

  it('renders black pieces for black color', () => {
    const { container } = render(<PromotionModal color="black" onChoice={vi.fn()} />)
    expect(container.querySelector('img[src="/black-queen.png"]')).toBeTruthy()
    expect(container.querySelector('img[src="/black-rook.png"]')).toBeTruthy()
  })
})
