import React from 'react'
import { CELL_WIDTH, Game } from './utils'

import css from './area.module.sass'

type Props = {
  game: Game
}

export const Area: React.FC<Props> = ({ game }) => {

  const cells = Array.from({ length: game.columns * game.rows })

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    console.log(e.currentTarget.scrollTop, e.currentTarget.scrollLeft)
  }

  return (
    <div className={css.area} onScroll={onScroll}>
      <div className={css.container} style={{ width: game.columns * CELL_WIDTH, height: game.rows * CELL_WIDTH }} >
        {cells.map((c, i) => <div key={i} data-ind={i} style={{ top: Math.floor(i / game.columns) * CELL_WIDTH, left: Math.floor(i % game.columns) * CELL_WIDTH}}></div>)}
      </div>
    </div>
  )
}