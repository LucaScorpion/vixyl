import React, { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import VinylParser from './parser/VinylParser';

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageData, setImageData] = useState('');
  const [startX, setStartX] = useState<number>(0);
  const [startY, setStartY] = useState<number>(0);

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
        Vixyl
      </header>
      <main>
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
          }} />
        <canvas ref={canvasRef} style={{
          display: 'block',
          marginTop: 24,
          marginBottom: 24,
        }} />
        <input
          type='number'
          min={0}
          onChange={(e) => setStartX(parseInt(e.currentTarget.value, 10))}
          value={startX}
        />
        <input
          type='number'
          min={0}
          onChange={(e) => setStartY(parseInt(e.currentTarget.value, 10))}
          value={startY}
        />
        <button
          style={{
            display: 'block',
            width: 256,
            marginTop: 24,
            fontSize: 24,
            padding: 12,
          }}
          onClick={() => {
            const context = canvasRef.current?.getContext('2d');
            if (!context) {
              return;
            }

            const parser = new VinylParser(context);
            parser.parseVinyl(startX, startY);
          }}
          disabled={!imageData}
        >
          Read <Icon icon='music' />
        </button>
      </main>
    </div>
  );
};

export default App;
