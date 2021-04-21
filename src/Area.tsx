import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { addToOrderedArray, binarySearch, calSides, CELL_WIDTH, createPositionsArray, encodePosition, GameStatic, numberComparator, Sides, TileObj, TILE_SIZE } from './utils'
import { Tile } from './Tile'

import css from './Area.module.sass'

type Props = {
  gameStatic: GameStatic
  onOpen: (top: number, left: number) => void
}


export const Area: React.FC<Props> = ({ gameStatic, onOpen }) => {

  const probability = gameStatic.mines / (gameStatic.columns * gameStatic.rows)

  const initialPositions = useMemo(() => createPositionsArray(gameStatic.mines, probability, gameStatic.rows, gameStatic.columns), [gameStatic])
  const isMines = gameStatic.columns * gameStatic.rows > gameStatic.mines * 2
  const [openedTiles, setOpenedTiles] = useState<TileObj[]>([]) 

  console.log(openedTiles)


  const callback = useCallback((top: number, left: number) => {
    const position = encodePosition(top, left)
    const finded = binarySearch(initialPositions, position, numberComparator) > -1

    const tilePosition = encodePosition(Math.floor(top / TILE_SIZE), Math.floor(left / TILE_SIZE))
    const tileIndex = binarySearch(openedTiles, tilePosition, (t, p) => t.position - p)

    if ((isMines && finded) || (!isMines && !finded)) {

    } else {
      if (tileIndex < 0) {
        const tile: TileObj = {
          cells: [],
          position: tilePosition,
        }
        // setOpenedTiles(addToOrderedArray())
      }
      // setOpenedTiles(addToOrderedArray(openedTiles, position))
    }

  }, [initialPositions, openedTiles, isMines])


  const [top, setTop] = useState(0)
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(-1)
  const [bottom, setBottom] = useState(-1)
  const areaRef = useRef<HTMLDivElement>(null)



  const updateTilesSides = useCallback(() => {
    if (!areaRef.current) {
      return
    }
    const sides = calSides(areaRef.current)
    setTop(sides.top)
    setLeft(sides.left)
    setRight(sides.right)
    setBottom(sides.bottom)
  }, [])

  useEffect(updateTilesSides, [updateTilesSides])

  const tiles = []
  for (let i = top; i <= bottom; ++i) {
    for (let j = left; j <= right; ++j) {
      tiles.push(<Tile
        initialPositions={initialPositions}
        isMines={isMines}
        key={encodePosition(i, j)}
        left={j}
        top={i}
        onOpen={callback}
      />)
    }
  }

  return (
    <div className={css.area} ref={areaRef} onScroll={updateTilesSides}>
      <div className={css.container} style={{ width: gameStatic.columns * CELL_WIDTH, height: gameStatic.rows * CELL_WIDTH }} >
        {tiles}
      </div>
    </div>
  )
}

