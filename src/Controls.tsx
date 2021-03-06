import React, { useState } from 'react'
import { GameStatic, MAX_CELLS } from './utils'

import css from  './controls.module.sass'

type Props = {
  game: GameStatic
  result: boolean | null
  onChange: (game: GameStatic) => void
}

const getResultText = (result: boolean | null) => {
  if (result == null) {
    return ''
  }

  return result ? 'VICTORY!' : 'FAIL!'
}

export const Controls: React.FC<Props> = ({ result, game, onChange }) => {
  const [rows, setRows] = useState(game.rows)
  const [columns, setColumns] = useState(game.columns)
  const [mines, setMines] = useState(game.mines)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onChange({ rows, columns, mines })
  }

  return (
    <div className={css.controls}>
      <form onSubmit={onSubmit}>
        <input
          max={MAX_CELLS}
          min={1}
          name='rows'
          onChange={(e) => setRows(Number(e.currentTarget.value))}
          type='number'
          value={rows}
        />
        x
        <input
          name='columns'
          type='number'
          min={1}
          max={MAX_CELLS}
          value={columns}
          onChange={(e) => setColumns(Number(e.currentTarget.value))}
        />
        <label>
          Bombs:
          <input
            name='mines'
            type='number'
            min={1}
            max={rows * columns - 1}
            value={mines}
            onChange={(e) => setMines(Number(e.currentTarget.value))}
          />
        </label>
        <button>{getResultText(result)} Restart!</button>
      </form>
    </div>
  )
}