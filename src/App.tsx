import React, { useState } from 'react';
import { Area } from './Area';

import { Controls } from './Controls';

import { GameStatic } from './utils';

function App() {

  const [gameStatic, setGame] = useState<GameStatic>({
    columns: 10**4,
    rows: 10**4,
    mines: 10**8 / 2 - 1,
  })

  return <>
    <Controls game={gameStatic} onChange={setGame} />
    <Area gameStatic={gameStatic}  onOpen={(top, left) => console.log(top, left)} />
  </>;
}

export default App;
