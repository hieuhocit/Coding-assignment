// React
import { useEffect, useRef } from 'react';

// Styles
import './Header.css';

// Types
import { Status } from '../../App';

type HeaderProps = {
  points: number;
  idTimer: number;
  autoPlay: boolean;
  hasPlayed: boolean;
  status: Status | null;
  handlePlay: () => void;
  handleAutoPlay: () => void;
  handleChangePoints: (points: string) => void;
};

const Header = (props: HeaderProps) => {
  const messages = {
    WON: 'ALL CLEARED',
    LOST: 'GAME OVER',
    PLAYING: "LET'S PLAY",
  };

  return (
    <header className='header'>
      <h1
        className={`title ${
          props.status === Status.WON
            ? 'won'
            : props.status === Status.LOST
            ? 'lost'
            : ''
        }`}
      >
        {messages[props.status || 'PLAYING']}
      </h1>

      <div className='point-container'>
        <label className='label' htmlFor='points'>
          Points:
        </label>
        <input
          type='text'
          name='points'
          id='points'
          value={props.points}
          className='points'
          onChange={(e) => props.handleChangePoints(e.target.value)}
        />
      </div>

      <Timer key={props.idTimer} status={props.status} />

      <div className='actions'>
        <button onClick={props.handlePlay} className='btn'>
          {props.hasPlayed ? 'Restart' : 'Play'}
        </button>
        {props.status === Status.PLAYING && (
          <button className='btn auto-play' onClick={props.handleAutoPlay}>
            Auto play <span>{props.autoPlay ? 'OFF' : 'ON'}</span>
          </button>
        )}
      </div>
    </header>
  );
};

function Timer({ status }: { status: Status | null }) {
  const intervalRef = useRef<undefined | number>(undefined);
  const timerRef = useRef<null | HTMLSpanElement>(null);

  useEffect(() => {
    if (status === Status.PLAYING) {
      intervalRef.current = setInterval(() => {
        const time = Number(timerRef.current!.textContent);
        timerRef.current!.textContent = (time + 0.1).toFixed(1);
      }, 100);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status]);

  return (
    <div className='timer-container'>
      <p className='label'>Time:</p>
      <p className='timer'>
        <span ref={timerRef}>0.0</span>
        <span>s</span>
      </p>
    </div>
  );
}

export default Header;
