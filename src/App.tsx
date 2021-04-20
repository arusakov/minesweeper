import React, { useState } from 'react';
import { Area } from './Area';

import { Controls } from './Controls';

import { Game } from './utils';

function App() {

  const [game, setGame] = useState<Game>({
    columns: 100,
    rows: 100,
    mines: 33,
  })

  return <>
    <Controls game={game} onChange={setGame} />
    <Area game={game} />
  </>;
}

export default App;
