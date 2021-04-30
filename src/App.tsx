import React, { useState } from 'react';
import { GameArea } from './GameArea';

import { Controls } from './Controls';

import { GameStatic } from './utils';

function App() {

  const [gameStatic, setGame] = useState<GameStatic>({
    columns: 32,
    rows: 32,
    mines: 300,
  })
  const [gameCounter, setGameCounter] = useState(1)

  const restartGame = (g: GameStatic) => {
    setGame(g)
    setGameCounter((c) => c + 1)
  }

  return <>
    <Controls game={gameStatic} onChange={restartGame} />
    <GameArea
      key={gameCounter}
      gameStatic={gameStatic}
    />
  </>;
}

export default App;
