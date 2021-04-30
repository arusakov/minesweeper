import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  calSides, CELL_FLAG, CELL_WIDTH,
  createMatrix,
  createTile,
  encodePosition, GameData, GameStatic,
  openEmptyCells, TileObj, TILE_SIZE, updateTile
} from './utils'
import { Tile } from './Tile'

import css from './GameArea.module.sass'

type Props = {
  gameStatic: GameStatic
}


export const GameArea: React.FC<Props> = ({ gameStatic }) => {
  const rowTiles = Math.ceil(gameStatic.rows / TILE_SIZE)
  const columnTiles = Math.ceil(gameStatic.columns / TILE_SIZE)

  const gameData = useRef<GameData>({
    mines: 0,
    inited: 0,
    opened: 0,
  })

  const [tiles, setTiles] = useState(createMatrix<TileObj>(rowTiles, columnTiles))



  const onCellFlag = (tileTop: number, tileLeft: number, top: number, left: number) => {
    const newTiles = tiles.slice()
    newTiles[tileTop] = newTiles[tileTop].slice()

    let tile = newTiles[tileTop][tileLeft]
    if (!tile) {
      tile = createTile(TILE_SIZE, TILE_SIZE)
    }

    const cell = tile[top][left]    
    newTiles[tileTop][tileLeft] = updateTile(tile, cell ^ CELL_FLAG, top, left)

    setTiles(newTiles)
  }

  const onCellClick = (tileTop: number, tileLeft: number, top: number, left: number) => {
    const realTop = tileTop * TILE_SIZE + top
    const realLeft = tileLeft * TILE_SIZE + left
    openEmptyCells(setTiles, tiles, gameStatic, gameData.current, [encodePosition(realTop, realLeft)])
  }

  const [top, setTop] = useState(0)
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(-1)
  const [bottom, setBottom] = useState(-1)
  const areaRef = useRef<HTMLDivElement>(null)
  const areaScrolls = useRef({ top: 0, left: 0 })

  const updateTilesSides = useCallback(() => {
    if (!areaRef.current) {
      return
    }
    const sides = calSides(areaRef.current, areaScrolls.current)

    areaScrolls.current.top = sides.scrollTop
    areaScrolls.current.left = sides.scrollLeft

    setTop(sides.top)
    setLeft(sides.left)
    setRight(Math.min(sides.right, columnTiles - 1))
    setBottom(Math.min(sides.bottom, rowTiles - 1))
  }, [columnTiles, rowTiles])

  useEffect(updateTilesSides, [updateTilesSides])

  useEffect(() => {
    window.addEventListener('resize', updateTilesSides)
    return () => window.removeEventListener('resize', updateTilesSides)
  }, [updateTilesSides])

  const currentTiles = []
  for (let i = top; i <= bottom; ++i) {
    for (let j = left; j <= right; ++j) {
      currentTiles.push(<Tile
        tile={tiles[i][j]}
        key={encodePosition(i, j)}
        tileLeft={j}
        tileTop={i}
        onClick={onCellClick}
        onContextMenu={onCellFlag}
      />)
    }
  }

  return (
    <div className={css.area} ref={areaRef} onScroll={updateTilesSides}>
      <div
        className={css.container}
        style={{
          width: gameStatic.columns * CELL_WIDTH + 1,
          height: gameStatic.rows * CELL_WIDTH + 1,
        }}>
        {currentTiles}
      </div>
    </div>
  )
}

