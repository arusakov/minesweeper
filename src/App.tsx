import React, { useState } from 'react';
import { GameArea } from './GameArea';

import { Controls } from './Controls';

import { GameStatic } from './utils';

function App() {

  const [gameStatic, setGame] = useState<GameStatic>({
    columns: 10,
    rows: 10,
    mines: 2,
  })
  const [gameCounter, setGameCounter] = useState(1)
  const [failed, setFailed] = useState(false)

  const restartGame = (g: GameStatic) => {
    setGame(g)
    setFailed(false)
    setGameCounter((c) => c + 1)
  }

  return <>
    <Controls
      failed={failed}
      game={gameStatic}
      onChange={restartGame}
    />
    <GameArea
      key={gameCounter}
      failed={failed}
      gameStatic={gameStatic}
      onFail={() => setFailed(true)}
    />
  </>;
}

export default App;
