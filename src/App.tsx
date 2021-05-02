import React, { useState } from 'react';
import { GameArea } from './GameArea';

import { Controls } from './Controls';

import { GameStatic } from './utils';

function App() {

  const [gameStatic, setGame] = useState<GameStatic>({
    columns: 32,
    rows: 32,
    mines: 240,
  })
  const [gameCounter, setGameCounter] = useState(1)
  const [result, setResult] = useState<boolean | null>(null)

  const restartGame = (g: GameStatic) => {
    setGame(g)
    setResult(null)
    setGameCounter((c) => c + 1)
  }

  return <>
    <Controls
      result={result}
      game={gameStatic}
      onChange={restartGame}
    />
    <GameArea
      key={gameCounter}
      finished={result != null}
      gameStatic={gameStatic}
      onFinish={setResult}
    />
  </>;
}

export default App;
