import React, { createRef } from 'react'
import {
  calSides, CELL_FLAG, CELL_MINE, CELL_WIDTH,
  createMatrix,
  createTile,
  encodePosition, GameData, GameStatic,
  initCellsForMines,
  openEmptyCells, Tiles, TILE_SIZE, updateTile
} from './utils'
import { Tile } from './Tile'

import css from './GameArea.module.sass'

type Props = {
  gameStatic: GameStatic
  finished: boolean
  onFinish: (result: boolean) => void
}

type State = {
  tiles: Tiles
  tileTop: number
  tileLeft: number
  tileRight: number
  tileBottom: number
}

export class GameArea extends React.Component<Props, State> implements GameData {

  areaRef = createRef<HTMLDivElement>()

  rowTiles: number
  columnTiles: number

  failedTileColumn = 0
  failedTileRow = 0
  queue: number[] = []
  tilesSet = new Set<number>()
  intervalId = 0
  

  mines = 0
  inited = 0
  opened = 0
  flags = 0

  constructor(props: Props) {
    super(props)

    const { gameStatic } = props

    this.rowTiles = Math.ceil(gameStatic.rows / TILE_SIZE)
    this.columnTiles = Math.ceil(gameStatic.columns / TILE_SIZE)

    this.state = {
      tiles: createMatrix(this.rowTiles, this.columnTiles),
      tileTop: 0,
      tileLeft: 0,
      tileRight: -1,
      tileBottom: -1,
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateTilesSides)
    this.updateTilesSides()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateTilesSides)
    clearInterval(this.intervalId)
  }

  updateTilesSides = () => {
    if (!this.areaRef.current) {
      return
    }
    const sides = calSides(this.areaRef.current)
    this.setState({
      tileBottom: Math.min(sides.bottom, this.rowTiles - 1),
      tileLeft: sides.left,
      tileRight: Math.min(sides.right, this.columnTiles - 1),
      tileTop: sides.top,
    })
  }

  onCellClick = (tileTop: number, tileLeft: number, top: number, left: number) => {
    if (this.props.finished) {
      return
    }
    const realTop = tileTop * TILE_SIZE + top
    const realLeft = tileLeft * TILE_SIZE + left

    this.queue.unshift(encodePosition(realTop, realLeft))

    const newTiles = this.openEmptyCells()

    if (newTiles[tileTop][tileLeft]![top][left] & CELL_MINE) {
      clearInterval(this.intervalId)
      this.failedTileColumn = tileLeft
      this.failedTileRow = tileTop
      this.queue = [encodePosition(tileTop, tileLeft)]
      this.intervalId = window.setInterval(this.openMinesCells, 200)

      this.props.onFinish(false)
    }
  }

  openMinesCells = () => {
    const { tiles } = this.state
    const { gameStatic } = this.props

    const newTiles = initCellsForMines(tiles, gameStatic, this, this.queue)
    this.setState({ tiles: newTiles })

    if (this.queue.length) {
      if (!this.intervalId) {
        this.intervalId = window.setInterval(this.openMinesCells, 200)
      }
    } else {
      clearInterval(this.intervalId)
    }
  }

  openEmptyCells = () => {
    const { tiles } = this.state
    const { gameStatic } = this.props

    const newTiles = openEmptyCells(tiles, gameStatic, this, this.queue)

    if (this.queue.length) {
      if (!this.intervalId) {
        this.intervalId = window.setInterval(this.openEmptyCells, 200)
      }
    } else {
      clearInterval(this.intervalId)
    }

    if (this.opened + gameStatic.mines === gameStatic.columns * gameStatic.rows) {
      this.props.onFinish(true)
    }

    this.setState({ tiles: newTiles })
    return newTiles
  }

  onCellFlag = (tileTop: number, tileLeft: number, top: number, left: number) => {
    if (this.props.finished) {
      return
    }
    const newTiles = this.state.tiles.slice()
    newTiles[tileTop] = newTiles[tileTop].slice()

    let tile = newTiles[tileTop][tileLeft]
    if (!tile) {
      tile = createTile(TILE_SIZE, TILE_SIZE)
    }

    const cell = tile[top][left]
    if (!(cell & CELL_FLAG) && this.flags >= this.props.gameStatic.mines) {
      return
    }

    this.flags += cell & CELL_FLAG ? -1 : 1
    newTiles[tileTop][tileLeft] = updateTile(tile, cell ^ CELL_FLAG, top, left)

    this.setState({ tiles: newTiles })  
  }

  renderTiles() {
    const { tileBottom, tileLeft, tileRight, tileTop, tiles } = this.state

    const currentTiles = []
    for (let i = tileTop; i <= tileBottom; ++i) {
      for (let j = tileLeft; j <= tileRight; ++j) {
        currentTiles.push(<Tile
          tile={tiles[i][j]}
          key={encodePosition(i, j)}
          tileLeft={j}
          tileTop={i}
          onClick={this.onCellClick}
          onContextMenu={this.onCellFlag}
        />)
      }
    }
    return currentTiles
  }

  render() {
    const { gameStatic } = this.props
    return (
      <div className={css.area} ref={this.areaRef} onScroll={this.updateTilesSides}>
        <div
          className={css.container}
          style={{
            width: gameStatic.columns * CELL_WIDTH + 1,
            height: gameStatic.rows * CELL_WIDTH + 1,
          }}>
          {this.renderTiles()}
        </div>
      </div>
    )
  }
}