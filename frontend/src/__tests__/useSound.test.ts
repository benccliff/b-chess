import { vi, describe, it, expect, beforeAll } from 'vitest'
import { useSound, playMove, playCapture, playCheck, playNewGame, playGameEnd } from '../hooks/useSound'

const mockOscillator = {
  type: 'sine' as OscillatorType,
  frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
  connect: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
}

const mockGain = {
  gain: { setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
  connect: vi.fn(),
}

const mockCtx = {
  state: 'running',
  currentTime: 0,
  createOscillator: vi.fn(() => mockOscillator),
  createGain: vi.fn(() => mockGain),
  destination: {},
  resume: vi.fn(),
}

beforeAll(() => {
  vi.stubGlobal('AudioContext', vi.fn(() => mockCtx))
})

describe('useSound', () => {
  it('returns all five play functions', () => {
    const sound = useSound()
    expect(typeof sound.playNewGame).toBe('function')
    expect(typeof sound.playMove).toBe('function')
    expect(typeof sound.playCapture).toBe('function')
    expect(typeof sound.playCheck).toBe('function')
    expect(typeof sound.playGameEnd).toBe('function')
  })

  it('exported functions are callable without throwing', () => {
    expect(() => playMove()).not.toThrow()
    expect(() => playCapture()).not.toThrow()
    expect(() => playCheck()).not.toThrow()
    expect(() => playNewGame()).not.toThrow()
    expect(() => playGameEnd()).not.toThrow()
  })
})
