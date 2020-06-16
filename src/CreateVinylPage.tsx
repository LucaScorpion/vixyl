import React, { useEffect, useRef, useState } from 'react';
import Icon from './components/Icon';
import createSpiral from './vinyl/createSpiral';
import { Spiral } from './vinyl/Spiral';

const CreateVinylPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [musicData, setMusicData] = useState('');
  const [spiralData, setSpiralData] = useState<Spiral>();
  const [spiralDiameter, setSpiralDiameter] = useState(0);

  useEffect((): void => {
    const context = canvasRef.current?.getContext('2d');
    if (!context || !spiralData) {
      return;
    }

    context.clearRect(0, 0, spiralDiameter, spiralDiameter);
    const center = spiralDiameter / 2;

    // Draw the back circle.
    context.fillStyle = 'black';
    context.beginPath();
    context.arc(center, center, spiralData.radius + 10, 0, 2 * Math.PI);
    context.fill();

    // Draw the spiral.
    context.fillStyle = 'white';
    spiralData.points.forEach((p) => {
      context.fillRect(p.x + center, p.y + center, 1, 1);
    });
  }, [spiralData]);

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

            // Read the file into state.
            const reader = new FileReader();
            reader.addEventListener('load', () => {
              if (typeof reader.result === 'string') {
                const dataUrl = reader.result;

                // Check if the file is actually a wave file.
                if (dataUrl.indexOf('data:audio/wav;base64,') !== 0) {
                  console.error(`Incorrect file type: ${dataUrl.substring(5, dataUrl.indexOf(';'))}`);
                  return;
                }

                setMusicData(reader.result);
              }
            });
            reader.readAsDataURL(file);
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
          onClick={() => {
            const result = createSpiral(10000);
            setSpiralData(result);
            setSpiralDiameter(result.radius * 2 + 20);
          }}
        >
          Create <Icon icon='compact-disc' />
        </button>
      </div>
    </main>
  );
};

export default CreateVinylPage;
