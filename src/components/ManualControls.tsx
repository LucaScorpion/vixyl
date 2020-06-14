import React, { useEffect, useState } from 'react';
import { VinylMeta } from '../vinyl/VinylMeta';
import VinylParser from '../vinyl/VinylParser';

export interface Props {
  parser: VinylParser;
  setVinylMeta: (meta: VinylMeta) => void;
}

const ManualControls: React.FC<Props> = ({ parser, setVinylMeta }) => {
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [sampleRate, setSampleRate] = useState(4000);

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
            onChange={(e) => setStartX(parseInt(e.currentTarget.value, 10))}
            value={startX}
            style={{ marginLeft: 6 }}
          />
        </div>
        <div style={{ marginLeft: 12, display: 'inline-block' }}>
          Y:
          <input
            type='number'
            min={0}
            onChange={(e) => setStartY(parseInt(e.currentTarget.value, 10))}
            value={startY}
            style={{ marginLeft: 6 }}
          />
        </div>
      </div>
      <div className='row'>
        Sample rate (Hz):
        <input
          type='number'
          min={0}
          onChange={(e) => setSampleRate(parseInt(e.currentTarget.value, 10))}
          value={sampleRate}
          style={{ marginLeft: 6 }}
        />
      </div>
    </>
  );
};

export default ManualControls;
