import React, { useCallback, useEffect, useRef, useState } from 'react';
import Icon from './components/Icon';
import createSpiral from './vinyl/createSpiral';
import { Spiral } from './vinyl/Spiral';
import drawVinyl from './vinyl/drawVinyl';
import readWaves from './wave/readWaves';
import { WaveData } from './wave/WaveData';

const CreateVinylPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [spiralData, setSpiralData] = useState<Spiral>();
  const [spiralDiameter, setSpiralDiameter] = useState(0);
  const [waveData, setWaveData] = useState<WaveData>();

  const createVinyl = useCallback((): void => {
    if (!waveData) {
      return;
    }

    // Create the spiral.
    const spiral = createSpiral(waveData.data.length);
    setSpiralData(spiral);
    setSpiralDiameter(spiral.radius * 2 + 20);
  }, [waveData]);

  useEffect((): void => {
    // Draw the spiral.
    const context = canvasRef.current?.getContext('2d');
    if (!context || !spiralData || !waveData) {
      return;
    }
    drawVinyl(context, spiralData, waveData);
  }, [spiralData, waveData]);

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
