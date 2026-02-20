import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Piece from '../components/Piece/Piece'

describe('Piece', () => {
  const cases: [string, string, string][] = [
    ['white', 'king', '/white-king.png'],
    ['white', 'queen', '/white-queen.png'],
    ['white', 'rook', '/white-rook.png'],
    ['white', 'bishop', '/white-bishop.png'],
    ['white', 'knight', '/white-knight.png'],
    ['white', 'pawn', '/white-pawn.png'],
    ['black', 'king', '/black-king.png'],
    ['black', 'queen', '/black-queen.png'],
    ['black', 'rook', '/black-rook.png'],
    ['black', 'bishop', '/black-bishop.png'],
    ['black', 'knight', '/black-knight.png'],
    ['black', 'pawn', '/black-pawn.png'],
  ]

  it.each(cases)('%s %s renders img with src %s', (color, pieceType, expectedSrc) => {
    const { container } = render(<Piece piece={{ color: color as 'white' | 'black', piece_type: pieceType as 'king' }} />)
    const img = container.querySelector('img')
    expect(img).toBeTruthy()
    expect(img!.getAttribute('src')).toBe(expectedSrc)
  })
})
