import React, { useCallback, useEffect, useRef, useState } from 'react';
import CanvasImage from './vinyl/CanvasImage';
import decodeVinylMeta from './vinyl/decoding/decodeVinylMeta';
import createWaves from './wave/createWaves';
import Icon from './components/Icon';
import VinylDecoder from './vinyl/decoding/VinylDecoder';

const ReadVinylPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [imageData, setImageData] = useState('');
  const [image, setImage] = useState<HTMLImageElement>();

  const [vinyl, setVinyl] = useState<CanvasImage>();
  const [vinylDecoder, setVinylDecoder] = useState<VinylDecoder>();

  const [musicData, setMusicData] = useState('');

  useEffect((): void => {
    // Load the image.
    const loadImg = new Image();
    loadImg.addEventListener('load', () => {
      setImage(loadImg);
    });
    loadImg.src = imageData;
  }, [imageData]);

  useEffect((): void => {
    // Get the canvas context.
    const context = canvasRef.current?.getContext('2d');
    if (!image || !context) {
      return;
    }

    // Clear the canvas, draw the image onto it.
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.drawImage(image, 0, 0);

    // Load the vinyl from the context.
    setVinyl(new CanvasImage(context));
  }, [image]);

  useEffect((): void => {
    if (!vinyl) {
      return;
    }

    // Parse the vinyl metadata.
    const decoder = decodeVinylMeta(vinyl);
    if (decoder) {
      setVinylDecoder(decoder);
    }
  }, [vinyl]);

  const readVinyl = useCallback(() => {
    if (!vinylDecoder) {
      return;
    }

    // Decode the vinyl.
    const data = vinylDecoder.decode();

    // Create the wave data.
    setMusicData(createWaves({
      data,
      format: vinylDecoder.meta.format,
    }));
  }, [vinylDecoder]);

  return (
    <main className='flex-center'>
      <div>
        <canvas
          ref={canvasRef}
          width={image?.width}
          height={image?.height}
          style={{
            marginRight: 48,
            width: image?.width,
            height: image?.height,
            maxWidth: 800,
            maxHeight: 800,
          }}
        />
      </div>
      <div className='controls'>
        <input
          type='file'
          accept='image/*'
          onChange={(e) => {
            // Check if a file is selected.
            const file = e.currentTarget.files?.item(0);
            if (!file) {
              return;
            }

            // Clear the previous sound data.
            setMusicData('');

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

        <button
          style={{
            width: '100%',
            fontSize: 24,
            padding: 12,
            marginBottom: 12,
          }}
          onClick={readVinyl}
          disabled={!vinylDecoder}
        >
          Read <Icon icon='music' />
        </button>
        {musicData && <audio controls src={musicData} style={{ width: '100%' }} />}
      </div>
    </main>
  );
};

export default ReadVinylPage;
