import React, { memo } from 'react'

import { CELL_FLAG, CELL_MINE, CELL_OPENED, CELL_WIDTH, TileObj, TILE_SIZE, TILE_WIDTH } from './utils'

import css from './Tile.module.sass'

type Props = {
  tileTop: number
  tileLeft: number
  tile?: TileObj
  onClick: (tileTop: number, tileLeft: number, top: number, left: number) => void
  onContextMenu: (tileTop: number, tileLeft: number, top: number, left: number) => void
}

const getCellData = (cell: number) => {
  if (cell & CELL_OPENED) {
    if (cell & CELL_MINE) {
      return {
        className: css.mine,
        content: null,
      }
    }
    return {
      content: cell & 0b00001111 || null,
      className: css.opened,
    }
  }
  return {
    content: null,
    className: cell & CELL_FLAG ? css.flag : '',
  }
}

export const Tile: React.FC<Props> = memo(({ tileTop, tileLeft, onClick, onContextMenu, tile }) => {

  const cells = []
  for (let i = 0; i < TILE_SIZE; ++i) {
    for (let j = 0; j < TILE_SIZE; ++j) {
      const cell = (tile && tile[i][j]) || 0
      const opened = Boolean(cell & CELL_OPENED)
      const { className, content } = getCellData(cell)
      cells.push(
        <div
          key={i * TILE_SIZE + j}
          onClick={opened || (cell & CELL_FLAG) ? undefined : (() => onClick(tileTop, tileLeft, i, j))}
          onContextMenu={opened ? undefined : ((e) => { e.preventDefault(); onContextMenu(tileTop, tileLeft, i, j) })}
          className={className}
          style={{
            top: i * CELL_WIDTH,
            left: j * CELL_WIDTH
          }}>
          {content}
        </div>
      )
    }
  }

  return (
    <div className={css.tile} style={{ top: tileTop * TILE_WIDTH, left: tileLeft * TILE_WIDTH }}>
      {cells}
    </div>
  )
})