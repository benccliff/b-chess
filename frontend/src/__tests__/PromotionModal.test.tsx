import { vi, describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PromotionModal from '../components/PromotionModal/PromotionModal'

describe('PromotionModal', () => {
  it('renders 4 promotion options', () => {
    render(<PromotionModal color="white" onChoice={vi.fn()} />)
    expect(screen.getByText('♕')).toBeTruthy()
    expect(screen.getByText('♖')).toBeTruthy()
    expect(screen.getByText('♗')).toBeTruthy()
    expect(screen.getByText('♘')).toBeTruthy()
  })

  it('calls onChoice with queen when queen clicked', () => {
    const onChoice = vi.fn()
    render(<PromotionModal color="white" onChoice={onChoice} />)
    fireEvent.click(screen.getByText('♕'))
    expect(onChoice).toHaveBeenCalledWith('queen')
  })

  it('calls onChoice with knight when knight clicked', () => {
    const onChoice = vi.fn()
    render(<PromotionModal color="white" onChoice={onChoice} />)
    fireEvent.click(screen.getByText('♘'))
    expect(onChoice).toHaveBeenCalledWith('knight')
  })

  it('renders black pieces for black color', () => {
    render(<PromotionModal color="black" onChoice={vi.fn()} />)
    expect(screen.getByText('♛')).toBeTruthy()
    expect(screen.getByText('♜')).toBeTruthy()
  })
})
