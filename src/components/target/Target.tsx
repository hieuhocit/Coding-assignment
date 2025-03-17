// Styles
import './Target.css';

// React
import { memo, useEffect, useRef, useState } from 'react';

// Types
import { Status } from '../../App';
import { TargetType } from '../game/Game';

type TargetProps = {
  target: TargetType;
  status: Status | null;
  handleSelectedTarget: (target: number) => void;
  zIndex: number;
  playNow: boolean;
  autoPlay: boolean;
  targetSize: {
    width: number;
    height: number;
  };
};

const Target = memo((props: TargetProps) => {
  //
  const [hasClicked, setHasClicked] = useState(false);

  // Target reference
  const targetRef = useRef<HTMLDivElement | null>(null);

  // ID for interval
  const intervalRef = useRef<undefined | number>(undefined);
  const countdownRef = useRef<null | HTMLSpanElement>(null);

  // Handle when auto play is stopped
  const timeoutRef = useRef<undefined | number>(undefined);

  // Auto play
  useEffect(() => {
    if (props.autoPlay && props.playNow) {
      timeoutRef.current = setTimeout(() => {
        handleClickTarget();
      }, 1000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [props.autoPlay, props.playNow]);

  // Countdown
  useEffect(() => {
    if (!countdownRef.current || !hasClicked) return;

    intervalRef.current = setInterval(() => {
      const time = Number(countdownRef.current!.textContent);

      if (time === 0) {
        targetRef.current!.style.display = 'none';
        targetRef.current!.style.zIndex = '-99999';
        clearInterval(intervalRef.current);
        return;
      }

      countdownRef.current!.textContent = (time - 0.1).toFixed(1);
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [hasClicked, props.target.time]);

  // Animation
  useEffect(() => {
    if (props.status !== Status.PLAYING) {
      targetRef.current!.style.animationPlayState = 'paused';
      clearInterval(intervalRef.current);
    }
  }, [props.status]);

  const handleClickTarget = () => {
    // Prevent click when auto play
    if (props.autoPlay && !props.playNow) return;

    // Not click when not playing and has clicked
    if (props.status !== 'PLAYING' || hasClicked) return;

    // Set state when clicked
    setHasClicked(true);

    //
    props.handleSelectedTarget(props.target.value);
  };

  return (
    <>
      <div
        ref={targetRef}
        className={'target-container'}
        style={{
          top: props.target.y,
          left: props.target.x,
          width: props.targetSize.width,
          height: props.targetSize.height,
          zIndex: props.zIndex,
          background: `${hasClicked ? 'brown' : 'white'}`,
          animation: `${hasClicked ? 'disappear 3s linear forwards' : 'none'}`,
        }}
        onClick={handleClickTarget}
      >
        <p className='target'>{props.target.value}</p>
        <p
          style={{ display: hasClicked ? 'block' : 'none' }}
          className='countdown'
        >
          <span ref={countdownRef}>{props.target.time}</span>
          <span>s</span>
        </p>
      </div>
    </>
  );
});

export default Target;
