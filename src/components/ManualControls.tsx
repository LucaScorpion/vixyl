import React, { useEffect } from 'react';
import { VinylMeta } from '../vinyl/VinylMeta';
import VinylParser from '../vinyl/VinylParser';
import useNumberState from '../hooks/useNumberState';

export interface Props {
  parser: VinylParser;
  setVinylMeta: (meta: VinylMeta) => void;
}

const ManualControls: React.FC<Props> = ({ parser, setVinylMeta }) => {
  const [startX, displayStartX, setStartX] = useNumberState(0);
  const [startY, displayStartY, setStartY] = useNumberState(0);
  const [sampleRate, displaySampleRate, setSampleRate] = useNumberState(4000);

  useEffect((): void => {
    setVinylMeta({
      trackStart: {
        x: startX,
        y: startY,
      },
      format: {
        sampleRate,
        bitsPerSample: 8,
        channels: 1,
      },
    });
  }, [setVinylMeta, startX, startY, sampleRate]);

  return (
    <>
      <div>Track starting point:</div>
      <div className='row'>
        <button
          onClick={(): void => {
            if (parser) {
              setTimeout((): void => {
                const starting = parser.detectStartingPoint();
                if (starting) {
                  setStartX(starting.x);
                  setStartY(starting.y);
                }
              }, 0);
            }
          }}
        >
          Detect
        </button>
        <div style={{ marginLeft: 12, display: 'inline-block' }}>
          X:
          <input
            type='number'
            min={0}
            onChange={(e) => setStartX(e.currentTarget.value)}
            value={displayStartX}
            style={{ marginLeft: 6 }}
          />
        </div>
        <div style={{ marginLeft: 12, display: 'inline-block' }}>
          Y:
          <input
            type='number'
            min={0}
            onChange={(e) => setStartY(e.currentTarget.value)}
            value={displayStartY}
            style={{ marginLeft: 6 }}
          />
        </div>
      </div>
      <div className='row'>
        Sample rate (Hz):
        <input
          type='number'
          min={0}
          onChange={(e) => setSampleRate(e.currentTarget.value)}
          value={displaySampleRate}
          style={{ marginLeft: 6 }}
        />
      </div>
    </>
  );
};

export default ManualControls;
