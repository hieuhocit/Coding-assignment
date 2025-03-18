// React
import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';

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
  const [nextTarget, setNextTarget] = useState<number>(0);

  const [targets, setTargets] = useState<TargetType[]>([]);

  const targetSizeRef = useRef({ width: 50, height: 50 });

  const [isPending, startTransition] = useTransition();

  //
  const autoPlayRef = useRef(props.autoPlay);
  const stateRef = useRef(props.status);

  // Prevent render all targets when autoplay is changed
  useEffect(() => {
    stateRef.current = props.status;
    autoPlayRef.current = props.autoPlay;
  }, [props.autoPlay, props.status]);

  // Create targets
  useEffect(() => {
    if (!containerRef.current) return;

    const handleNewTargets = () => {
      const domRect = containerRef.current!.getBoundingClientRect();
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
    };

    startTransition(handleNewTargets);
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
            return prevNextTarget;
          }

          // NOT THE LAST TARGET
          return prevNextTarget + 1;
        }

        // Incorrect target
        // Use setTimeout to delay setStatus to avoid error setState when rendering another component
        setTimeout(() => props.setStatus(Status.LOST), 0);
        return prevNextTarget;
      });
    },
    [props.points]
  );

  return (
    <main className='main'>
      <div ref={containerRef} className='container'>
        {isPending && <div className='loading'>Loading...</div>}
        {targets.length > 0 &&
          targets.map((target, index) => {
            if (index - nextTarget < 1500)
              return (
                <Target
                  key={index}
                  target={target}
                  // status={props.status}
                  statusRef={stateRef}
                  handleSelectedTarget={handleSelectedTarget}
                  zIndex={targets.length - target.value}
                  // autoPlay={props.autoPlay}
                  autoPlayRef={autoPlayRef}
                  playNow={props.autoPlay ? nextTarget === target.value : false}
                  targetSize={targetSizeRef.current}
                />
              );
            else return null;
          })}
      </div>
      {!isPending && props.status === Status.PLAYING && nextTarget && (
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
