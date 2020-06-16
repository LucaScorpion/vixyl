import React, { useCallback, useEffect, useRef, useState } from 'react';
import Icon from './components/Icon';
import createSpiral from './vinyl/createSpiral';
import { Spiral } from './vinyl/Spiral';
import drawVinylBase from './vinyl/drawVinylBase';
import readWaves from './wave/readWaves';
import { WaveData } from './wave/WaveData';
import drawGrayVinyl from './vinyl/drawers/drawGrayVinyl';
import drawRainbowVinyl from './vinyl/drawers/drawRainbowVinyl';
import { VinylEncoding } from './vinyl/VinylEncoding';

const CreateVinylPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [spiralData, setSpiralData] = useState<Spiral>();
  const [spiralDiameter, setSpiralDiameter] = useState(0);
  const [waveData, setWaveData] = useState<WaveData>();
  const [encoding, setEncoding] = useState(VinylEncoding.GRAY);

  const createVinyl = useCallback((): void => {
    if (!waveData) {
      return;
    }

    let length = waveData.data.length;
    if (encoding === VinylEncoding.RAINBOW) {
      length = Math.floor(length / 3);
    }

    // Create the spiral.
    const spiral = createSpiral(length);
    setSpiralData(spiral);
    setSpiralDiameter(spiral.radius * 2 + 20);
  }, [waveData, encoding]);

  useEffect((): void => {
    // Draw the spiral.
    const context = canvasRef.current?.getContext('2d');
    if (!context || !spiralData || !waveData) {
      return;
    }

    drawVinylBase(context, spiralData, waveData, encoding);
    switch (encoding) {
      case VinylEncoding.GRAY:
        drawGrayVinyl(context, spiralData, waveData);
        break;
      case VinylEncoding.RAINBOW:
        drawRainbowVinyl(context, spiralData, waveData);
        break;
      default:
        console.error('Invalid encoding method:', encoding);
    }
  }, [spiralData, spiralDiameter]);

  return (
    <main className='flex-center'>
      <div>
        <canvas
          ref={canvasRef}
          width={spiralDiameter}
          height={spiralDiameter}
          style={{
            marginRight: 48,
            width: spiralDiameter,
            height: spiralDiameter,
          }}
        />
      </div>
      <div className='controls'>
        <input
          type='file'
          accept='audio/wav'
          onChange={(e) => {
            // Check if a file is selected.
            const file = e.currentTarget.files?.item(0);
            if (!file) {
              return;
            }

            // Clear the wave data.
            setWaveData(undefined);

            // Read the file into state.
            const reader = new FileReader();
            reader.addEventListener('load', () => {
              if (reader.result && typeof reader.result === 'object') {
                // Read the wave file.
                const waves = readWaves(new Uint8Array(reader.result));
                if (!waves) {
                  return;
                }
                setWaveData(waves);
              }
            });
            reader.readAsArrayBuffer(file);
          }}
          className='row'
        />
        <select className='row' onChange={e => setEncoding(parseInt(e.currentTarget.value, 10))}>
          <option value={VinylEncoding.GRAY}>Gray</option>
          <option value={VinylEncoding.RAINBOW}>Rainbow</option>
        </select>
        <button
          style={{
            width: '100%',
            fontSize: 24,
            padding: 12,
            marginBottom: 12,
          }}
          onClick={createVinyl}
          disabled={!waveData}
        >
          Create <Icon icon='compact-disc' />
        </button>
      </div>
    </main>
  );
};

export default CreateVinylPage;
