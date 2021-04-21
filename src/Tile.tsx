import React from 'react'

import css from './Tile.module.sass'
import { binarySearch, CELL_WIDTH, encodePosition, TILE_SIZE, TILE_WIDTH } from './utils'

type Props = {
  top: number
  left: number
  onOpen: (top: number, left: number) => void
  isMines: boolean
  initialPositions: number[]
}

export const Tile: React.FC<Props> = ({ top, left, onOpen }) => {

  const cells = []
  for (let i = 0; i < TILE_SIZE * TILE_SIZE; ++i) {
    const cellTop = Math.floor(i / TILE_SIZE)
    const cellLeft = Math.floor(i % TILE_SIZE)
    const realTop = top * TILE_SIZE + cellTop
    const realLeft = left * TILE_SIZE + cellLeft

    cells.push(
      <div
        onClick={() => onOpen(realTop, realLeft)}
        key={i}
        style={{
          top: cellTop * CELL_WIDTH,
          left: cellLeft * CELL_WIDTH
        }}>

      </div>
    )
  }

  return (
    <div className={css.tile} style={{ top: top * TILE_WIDTH, left: left * TILE_WIDTH }}>
      {cells}
    </div>
  )
}