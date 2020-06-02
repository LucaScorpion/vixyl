import React, { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import VinylParser from './parser/VinylParser';
import createWaves from './parser/createWaves';

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [imageData, setImageData] = useState('');
  const [image, setImage] = useState<HTMLImageElement>();

  const [startX, setStartX] = useState<number>(0);
  const [startY, setStartY] = useState<number>(0);
  const [musicData, setMusicData] = useState('');
  const [loadingState, setLoadingState] = useState('');
  const [parser, setParser] = useState<VinylParser>();

  useEffect((): void => {
    // Load the image.
    const loadImg = new Image();
    loadImg.addEventListener('load', () => {
      setImage(loadImg);
    });
    loadImg.src = imageData;
  }, [imageData]);

  useEffect((): void => {
    // Draw the image onto the canvas, load the parser.
    const context = canvasRef.current?.getContext('2d');
    if (image && context) {
      context.drawImage(image, 0, 0);
      setParser(new VinylParser(context));
    }
  }, [image]);

  return (
    <div>
      <header>
        <h1>Vixyl</h1>
      </header>
      <main>
        <div>
          <canvas
            ref={canvasRef}
            width={image?.width}
            height={image?.height}
            style={{
              marginRight: 48,
              width: image?.width,
              height: image?.height,
            }}
          />
        </div>
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
              width: '100%',
              fontSize: 16,
              padding: 12,
              marginBottom: 12,
            }}
            disabled={!parser}
            onClick={(): void => {
              if (parser) {
                setTimeout((): void => {
                  console.log(parser.detectStartingPoint());
                }, 0);
              }
            }}
          >
            Detect starting point
          </button>
          <button
            style={{
              width: '100%',
              fontSize: 24,
              padding: 12,
              marginBottom: 12,
            }}
            onClick={(): void => {
              if (!parser) {
                return;
              }

              setLoadingState('Decoding vinylized data streams...');
              setTimeout(() => {
                const parsedData = parser.parseVinyl(startX, startY);
                setLoadingState('Reconfiguring data streams to physical wave mechanics...');
                setTimeout(() => {
                  setMusicData(createWaves(parsedData));
                  setLoadingState('');
                }, 0);
              });
            }}
            disabled={!parser}
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
