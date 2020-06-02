import React, { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import VinylParser from './parser/VinylParser';
import createWaves from './parser/createWaves';

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageData, setImageData] = useState('');
  const [startX, setStartX] = useState<number>(0);
  const [startY, setStartY] = useState<number>(0);
  const [musicData, setMusicData] = useState('');
  const [loadingState, setLoadingState] = useState('');

  useEffect((): void => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) {
      return;
    }

    // Load the image onto the canvas.
    const image = new Image();
    image.addEventListener('load', () => {
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);
    });
    image.src = imageData;
  }, [imageData]);

  return (
    <div>
      <header>
        <h1>Vixyl</h1>
      </header>
      <main>
        <canvas ref={canvasRef} width={0} height={0} style={{
          marginRight: 48,
        }} />
        <div className='controls'>
          <input
            type='file'
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
                  setImageData(reader.result);
                }
              });
              reader.readAsDataURL(file);
            }}
            style={{
              marginBottom: 12,
            }}
          />
          <div style={{
            marginBottom: 12,
          }}>
            Starting X:
            <input
              type='number'
              min={0}
              onChange={(e) => setStartX(parseInt(e.currentTarget.value, 10))}
              value={startX}
              style={{
                marginLeft: 12,
              }}
            />
          </div>
          <div style={{
            marginBottom: 12,
          }}>
            Starting Y:
            <input
              type='number'
              min={0}
              onChange={(e) => setStartY(parseInt(e.currentTarget.value, 10))}
              value={startY}
              style={{
                marginLeft: 12,
              }}
            />
          </div>
          <button
            style={{
              display: 'block',
              width: '100%',
              fontSize: 24,
              padding: 12,
              marginBottom: 12,
            }}
            onClick={() => {
              const context = canvasRef.current?.getContext('2d');
              if (!context) {
                return;
              }

              setLoadingState('Decoding vinylized data streams...');
              setTimeout(() => {
                const parser = new VinylParser(context);
                const parsedData = parser.parseVinyl(startX, startY);
                setLoadingState('Reconfiguring data streams to physical wave mechanics...');
                setTimeout(() => {
                  setMusicData(createWaves(parsedData));
                  setLoadingState('');
                }, 0);
              });
            }}
            disabled={!imageData}
          >
            Read <Icon icon='music' />
          </button>
          <span>{loadingState}</span>
          {musicData && <audio controls src={musicData} />}
        </div>
      </main>
    </div>
  );
};

export default App;
