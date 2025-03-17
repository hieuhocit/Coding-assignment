// React
import { useCallback, useState } from 'react';

// Components
import Game from './components/game/Game.tsx';
import Header from './components/header/Header.tsx';

// Styles
import './App.css';

// eslint-disable-next-line react-refresh/only-export-components
export enum Status {
  PLAYING = 'PLAYING',
  WON = 'WON',
  LOST = 'LOST',
}

function App() {
  const [points, setPoints] = useState(5);
  const [currentPoints, setCurrentPoints] = useState(0);

  const [status, setStatus] = useState<Status | null>(null);

  const [hasPlayed, setHasPlayed] = useState(false);

  const [autoPlay, setAutoPlay] = useState(false);

  // Use id to rerender the game component when the game is restarted
  const [idGame, setIdGame] = useState(0);

  // Use id to rerender the timer component inside header component when the game is restarted
  const [idTimer, setIdTimer] = useState(0);

  // Play and restart play
  const handlePlay = () => {
    if (points <= 0) return;

    setAutoPlay(false);
    setCurrentPoints(points);
    setStatus(Status.PLAYING);
    setIdGame(Math.random() * 9999);
    setIdTimer(Math.random() * 9999);

    if (!hasPlayed) {
      setHasPlayed(true);
    }
  };

  const handleChangePoints = (newPoints: string) => {
    if (Number.isNaN(Number(newPoints))) return;
    setPoints(+newPoints);
  };

  const handleChangeStatus = useCallback((newStatus: Status) => {
    setStatus(newStatus);
  }, []);

  const handleAutoPlay = () => {
    setAutoPlay((prev) => !prev);
  };

  return (
    <div className='app-container'>
      <div className='app'>
        <Header
          status={status}
          points={points}
          idTimer={idTimer}
          autoPlay={autoPlay}
          hasPlayed={hasPlayed}
          handlePlay={handlePlay}
          handleAutoPlay={handleAutoPlay}
          handleChangePoints={handleChangePoints}
        />
        <Game
          key={idGame}
          status={status}
          autoPlay={autoPlay}
          points={currentPoints}
          setStatus={handleChangeStatus}
        />
      </div>
    </div>
  );
}

export default App;
