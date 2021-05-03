import Denque from "denque"

export const MAX_CELLS = 10000

export const CELL_WIDTH = 18

export const TILE_SIZE = 16

export const TILE_WIDTH = CELL_WIDTH * TILE_SIZE

export type GameStatic = {
  rows: number
  columns: number
  mines: number
}

export type GameData = {
  inited: number
  mines: number
  opened: number
  rowTiles: number
  queue: Denque<number>
  set: Set<number>
  columnTiles: number
  failedTileRow: number
  failedTileColumn: number
}

export type TileObj = Array<Uint8Array>
export type Tiles = Array<Array<TileObj | undefined>>

export const encodePosition = (top: number, left: number) =>
  (top << 16) | left

export const decodePosition = (pos: number) => ({
  top: pos >> 16,
  left: 0xFFFF & pos,
})


export type Sides = {
  top: number
  left: number
  right: number
  bottom: number
}


export const calSides = (el: HTMLDivElement): Sides => {
  const { scrollTop, scrollLeft, clientWidth, clientHeight } = el

  return {
    top: Math.floor(scrollTop / TILE_WIDTH),
    left: Math.floor(scrollLeft / TILE_WIDTH),
    right: Math.floor((scrollLeft + clientWidth) / TILE_WIDTH),
    bottom: Math.floor((scrollTop + clientHeight) / TILE_WIDTH),
  }
}

export const createMatrix = <T>(rows: number, columns: number) => {
  const matrix = new Array<Array<T | undefined>>(rows)
  for (let i = 0; i < rows; ++i) {
    matrix[i] = new Array<T | undefined>(columns)
  }
  return matrix
}

export const createTile = (rows: number, columns: number) => {
  const tile = new Array<Uint8Array>(rows)
  for (let i = 0; i < rows; ++i) {
    tile[i] = new Uint8Array(columns)
  }
  return tile
}

export const updateTile = (origin: TileObj, item: number, top: number, left: number) => {
  const newTile = origin.slice()
  newTile[top] = newTile[top].slice()
  newTile[top][left] = item
  return newTile
}

export const updateMatrix = <T>(origin: T[][], item: T, top: number, left: number) => {
  const newMatrix = origin.slice()
  newMatrix[top] = newMatrix[top].slice()
  newMatrix[top][left] = item
  return newMatrix
}

export const CELL_OPENED = 0b10000000
export const CELL_INIT = 0b01000000
export const CELL_MINE = 0b00100000
export const CELL_FLAG = 0b00010000

export const initCells = (tiles: Array<Array<TileObj | undefined>>, realTop: number, realLeft: number, gameStatic: GameStatic, gameData: GameData) => {
  const newTiles: Array<Array<TileObj | undefined>> = tiles.slice()

  for (let i = Math.max(0, realTop - 1); i <= Math.min(gameStatic.rows - 1, realTop + 1); ++i) {
    const ti = Math.floor(i / TILE_SIZE)
    const iInTile = i % TILE_SIZE

    newTiles[ti] = newTiles[ti].slice()

    for (let j = Math.max(0, realLeft - 1); j <= Math.min(gameStatic.columns - 1, realLeft + 1); ++j) {
      const tj = Math.floor(j / TILE_SIZE)
      const jInTile = j % TILE_SIZE

      let tile = newTiles[ti][tj]
      if (!tile) {
        tile = createTile(TILE_SIZE, TILE_SIZE)
      }

      const cell = tile[iInTile][jInTile]

      if (!(cell & CELL_INIT)) {
        const probability = (realTop === i && realLeft === j ? gameData.opened : true) && (
          (gameStatic.mines - gameData.mines) / (gameStatic.columns * gameStatic.rows - gameData.inited)
        )

        const isMine = Boolean(probability) && Math.random() < probability
        newTiles[ti][tj] = updateTile(tile, cell | CELL_INIT | (isMine ? CELL_MINE : 0), iInTile, jInTile)

        if (isMine) {
          gameData.mines += 1

          for (let ii = Math.max(0, i - 1); ii <= Math.min(gameStatic.rows - 1, i + 1); ++ii) {
            const tii = Math.floor(ii / TILE_SIZE)
            const iiInTile = ii % TILE_SIZE
            for (let jj = Math.max(0, j - 1); jj <= Math.min(gameStatic.columns - 1, j + 1); ++jj) {
              const tjj = Math.floor(jj / TILE_SIZE)
              const jjInTile = jj % TILE_SIZE
              let tileIfMine = newTiles[tii][tjj]
              if (!tileIfMine) {
                tileIfMine = createTile(TILE_SIZE, TILE_SIZE)
              }

              const cellValue = tileIfMine[iiInTile][jjInTile]
              newTiles[tii][tjj] = updateTile(tileIfMine, cellValue + 1, iiInTile, jjInTile)
            }
          }
        }

        gameData.inited += 1
      }
    }
  }
  return newTiles
}

export const initCellsForMines = (tiles: Array<Array<TileObj | undefined>>, gameStatic: GameStatic, gameData: GameData) => {
  tiles = tiles.slice()

  const { queue, set } = gameData

  for (let step = 0; step < 32; ++step) {
    const tilePostion = queue.shift()
    if (tilePostion == null) {
      break
    }

    set.delete(tilePostion)

    const { top, left } = decodePosition(tilePostion)
    console.log('tile', top, left)
    console.log('queue', queue.length)

    tiles[top] = tiles[top].slice()

    let tile = tiles[top][left]
    if (!tile) {
      tile = createTile(TILE_SIZE, TILE_SIZE)
    }

    for (let i = 0; i < TILE_SIZE * TILE_SIZE; ++i) {
      const r = Math.floor(i / TILE_SIZE)
      const c = i % TILE_SIZE

      if (top * TILE_SIZE + r >= gameStatic.rows || left * TILE_SIZE + c >= gameStatic.columns) {
        continue
      }

      const cell = tile[r][c]

      if (!(cell & CELL_INIT)) {
        const probability = (gameStatic.mines - gameData.mines) / (gameStatic.columns * gameStatic.rows - gameData.inited)
        gameData.inited += 1

        if (Math.random() < probability) {
          gameData.mines += 1

          tile = updateTile(tile, cell | CELL_INIT | CELL_MINE | CELL_OPENED, r, c)
        }
      } else if (cell & CELL_MINE) {
        tile = updateTile(tile, cell | CELL_OPENED, r, c)
      }
    }

    tiles[top][left] = tile

    const distance = Math.abs(top - gameData.failedTileRow) + Math.abs(left - gameData.failedTileColumn)


    for (let i = Math.max(0, top - 1); i <= Math.min(gameData.rowTiles - 1, top + 1); ++i) {
      for (let j = Math.max(0, left - 1); j <= Math.min(gameData.columnTiles - 1, left + 1); ++j) {
        if (Math.abs(i - gameData.failedTileRow) + Math.abs(j - gameData.failedTileColumn) <= distance) {
          continue
        }

        const pos = encodePosition(i, j)
        if (set.has(pos)) {
          continue
        }
        queue.push(pos)
        set.add(pos)
      }
    }

  }
  return tiles
}


export const openEmptyCells = (tiles: Tiles, gameStatic: GameStatic, gameData: GameData) => {
  const { queue, set } = gameData

  for (let counter = 0; counter < 512; ++counter) {
    const position = queue.shift()
    if (position == null) {
      break
    }
    set.delete(position)

    const { top, left } = decodePosition(position)

    tiles = initCells(tiles, top, left, gameStatic, gameData)

    const ti = Math.floor(top / TILE_SIZE)
    const tj = Math.floor(left / TILE_SIZE)
    const tii = top % TILE_SIZE
    const tjj = left % TILE_SIZE

    const tile = tiles[ti][tj] as Uint8Array[]
    const cell = tile[tii][tjj]


    tiles[ti][tj] = updateTile(tile, cell | CELL_OPENED, tii, tjj)
    gameData.opened += 1

    if (cell & 0b00001111) {
      continue
    }

    for (let i = Math.max(0, top - 1); i <= Math.min(gameStatic.rows - 1, top + 1); ++i) {
      for (let j = Math.max(0, left - 1); j <= Math.min(gameStatic.columns - 1, left + 1); ++j) {
        if (i === top && j === left) {
          continue
        }
        if (tiles[Math.floor(i / TILE_SIZE)][Math.floor(j / TILE_SIZE)]![i % TILE_SIZE][j % TILE_SIZE] & CELL_OPENED) {
          continue
        }
        const pos = encodePosition(i, j)
        if (set.has(pos)) {
          continue
        }
        queue.push(pos)
        set.add(pos)
      }
    }
  }

  return tiles
}
