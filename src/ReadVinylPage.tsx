import React, { useCallback, useEffect, useRef, useState } from 'react';
import CanvasImage from './vinyl/CanvasImage';
import Icon from './components/Icon';
import detectStartingPoint from './vinyl/decoding/detectStartingPoint';
import readVinylTrack from './vinyl/decoding/readVinylTrack';
import decodeVinylMeta from './vinyl/decoding/decodeVinylMeta';
import DataPreview from './components/DataPreview';
import { DecodedData } from './vinyl/decoding/DecodedData';

const ReadVinylPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [imageData, setImageData] = useState('');
  const [image, setImage] = useState<HTMLImageElement>();
  const [vinyl, setVinyl] = useState<CanvasImage>();

  const [decodedData, setDecodedData] = useState<DecodedData>();

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

  const readVinyl = useCallback(() => {
    if (!vinyl) {
      return;
    }

    // Detect the track starting point, read the pixels.
    const startingPoint = detectStartingPoint(vinyl);
    if (!startingPoint) {
      console.error('No track starting point found.');
      return;
    }
    const pixels = readVinylTrack(vinyl, startingPoint);

    // Parse the vinyl metadata.
    const decoder = decodeVinylMeta(pixels);
    if (!decoder) {
      return;
    }

    // Decode the vinyl.
    setDecodedData(decoder.decode(pixels));
  }, [vinyl]);

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

            // Clear the previous decoded data.
            setDecodedData(undefined);

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
          disabled={!vinyl}
        >
          Read <Icon icon='music' />
        </button>
        {decodedData && <DataPreview type={decodedData.type} data={decodedData.data} />}
      </div>
    </main>
  );
};

export default ReadVinylPage;
