import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Piece from '../components/Piece/Piece'

describe('Piece', () => {
  const cases: [string, string, string][] = [
    ['white', 'king', '♔'],
    ['white', 'queen', '♕'],
    ['white', 'rook', '♖'],
    ['white', 'bishop', '♗'],
    ['white', 'knight', '♘'],
    ['white', 'pawn', '♙'],
    ['black', 'king', '♚'],
    ['black', 'queen', '♛'],
    ['black', 'rook', '♜'],
    ['black', 'bishop', '♝'],
    ['black', 'knight', '♞'],
    ['black', 'pawn', '♟'],
  ]

  it.each(cases)('%s %s renders %s', (color, pieceType, glyph) => {
    render(<Piece piece={{ color: color as 'white' | 'black', piece_type: pieceType as 'king' }} />)
    expect(screen.getByText(glyph)).toBeTruthy()
  })
})
