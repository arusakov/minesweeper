import React, { useState } from 'react';
import { Area } from './Area';

import { Controls } from './Controls';

import { GameStatic } from './utils';

function App() {

  const [gameStatic, setGame] = useState<GameStatic>({
    columns: 1000,
    rows: 1000,
    mines: 300,
  })
  const [gameCounter, setGameCounter] = useState(1)

  const restartGame = (g: GameStatic) => {
    setGame(g)
    setGameCounter((c) => c + 1)
  }

  return <>
    <Controls game={gameStatic} onChange={restartGame} />
    <Area
      key={gameCounter}
      gameStatic={gameStatic}
      onOpen={(top, left) => console.log(top, left)}
    />
  </>;
}

export default App;
