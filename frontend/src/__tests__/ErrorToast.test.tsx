import { vi, describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import ErrorToast from '../components/ErrorToast/ErrorToast'

describe('ErrorToast', () => {
  it('renders nothing when message is null', () => {
    const { container } = render(<ErrorToast message={null} onDismiss={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders the error message', () => {
    const { getByText } = render(<ErrorToast message="Move failed" onDismiss={vi.fn()} />)
    expect(getByText('Move failed')).toBeTruthy()
  })

  it('calls onDismiss when the dismiss button is clicked', () => {
    const onDismiss = vi.fn()
    const { getByRole } = render(<ErrorToast message="Network error" onDismiss={onDismiss} />)
    fireEvent.click(getByRole('button', { name: /dismiss/i }))
    expect(onDismiss).toHaveBeenCalledOnce()
  })
})
