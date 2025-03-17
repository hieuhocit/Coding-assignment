// React
import { memo, useCallback, useEffect, useRef, useState } from 'react';

// Components
import Target from '../target/Target';

// Styles
import './Game.css';

// Types
import { Status } from '../../App';
import { createRandomNumber } from '../../utils/helpers/createRandomNumber';

export type TargetType = {
  value: number;
  x: number;
  y: number;
  time: number;
};

type GameProps = {
  points: number;
  status: Status | null;
  autoPlay: boolean;
  setStatus: (status: Status) => void;
};

const Game = memo((props: GameProps) => {
  const containerRef = useRef<null | HTMLDivElement>(null);
  const [nextTarget, setNextTarget] = useState<number | null>(null);

  const [targets, setTargets] = useState<TargetType[]>([]);

  const targetSizeRef = useRef({ width: 50, height: 50 });

  useEffect(() => {
    if (!containerRef.current) return;

    const domRect = containerRef.current.getBoundingClientRect();
    const width = domRect.width;
    const height = domRect.height;

    const newTargets = Array.from({ length: props.points }, (_, index) => {
      return {
        value: index + 1,
        x: createRandomNumber(0, width - targetSizeRef.current.width - 5),
        y: createRandomNumber(0, height - targetSizeRef.current.height - 5),
        time: 3,
      };
    });

    setNextTarget(1);
    setTargets(newTargets);
  }, [props.points]);

  const handleSelectedTarget = useCallback(
    (targetValue: number) => {
      setNextTarget((prevNextTarget) => {
        // If choose the correct target
        if (targetValue === prevNextTarget) {
          // WIN
          if (prevNextTarget === props.points) {
            setTimeout(() => {
              props.setStatus(Status.WON);
            }, 3000);
            return null;
          }

          // NOT THE LAST TARGET
          return prevNextTarget + 1;
        }

        // Incorrect target
        props.setStatus(Status.LOST);
        return null;
      });
    },
    [props.points]
  );

  return (
    <main className='main'>
      <div ref={containerRef} className='container'>
        {targets.length > 0 &&
          targets.map((target, index) => {
            return (
              <Target
                key={index}
                target={target}
                status={props.status}
                handleSelectedTarget={handleSelectedTarget}
                zIndex={targets.length - target.value}
                autoPlay={props.autoPlay}
                playNow={props.autoPlay ? nextTarget === target.value : false}
                targetSize={targetSizeRef.current}
              />
            );
          })}
      </div>
      {nextTarget && (
        <div className='next-target'>
          <p>
            Next: <span>{nextTarget}</span>
          </p>
        </div>
      )}
    </main>
  );
});

export default Game;
