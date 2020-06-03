import React, { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import VinylParser from './parser/VinylParser';
import createWaves from './parser/createWaves';
import GithubCorner from './GithubCorner';
import { VinylMeta } from './parser/VinylMeta';
import ManualControls from './ManualControls';

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [imageData, setImageData] = useState('');
  const [image, setImage] = useState<HTMLImageElement>();

  const [musicData, setMusicData] = useState('');
  const [loadingState, setLoadingState] = useState('');
  const [parser, setParser] = useState<VinylParser>();

  const [vinylMeta, setVinylMeta] = useState<VinylMeta>();

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
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      context.drawImage(image, 0, 0);
      setParser(new VinylParser(context));
    }
  }, [image]);

  return (
    <div>
      <header>
        <h1>Vixyl</h1>
      </header>
      <GithubCorner />
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
            className='row'
          />

          {parser && <ManualControls parser={parser} setVinylMeta={setVinylMeta} />}

          <button
            style={{
              width: '100%',
              fontSize: 24,
              padding: 12,
              marginBottom: 12,
            }}
            onClick={(): void => {
              if (!parser || !vinylMeta) {
                return;
              }

              setLoadingState('Decoding vinylized data streams...');
              setTimeout(() => {
                const parsedData = parser.parseVinyl(vinylMeta.trackStart);
                setLoadingState('Reconfiguring data streams to physical wave mechanics...');
                setTimeout(() => {
                  setMusicData(createWaves(parsedData, vinylMeta));
                  setLoadingState('');
                }, 0);
              });
            }}
            disabled={!parser || !vinylMeta}
          >
            Read <Icon icon='music' />
          </button>
          <span>{loadingState}</span>
          {musicData && <audio controls src={musicData} style={{ width: '100%' }} />}
        </div>
      </main>
    </div>
  );
};

export default App;
