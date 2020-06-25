import React, { useCallback, useEffect, useRef, useState } from 'react';
import CanvasImage from './vinyl/CanvasImage';
import Icon from './components/Icon';
import DataPreview from './components/DataPreview';
import { FileInfo } from './vinyl/FileInfo';
import { getDecoder } from './vinyl/encoders/encoders';

const ReadVinylPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [imageData, setImageData] = useState('');
  const [image, setImage] = useState<HTMLImageElement>();
  const [vinyl, setVinyl] = useState<CanvasImage>();

  const [fileData, setFileData] = useState<FileInfo>();
  const [loading, setLoading] = useState(false);

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

  const readVinyl = useCallback(async () => {
    if (!vinyl) {
      return;
    }
    setFileData(undefined);

    const decoder = getDecoder(vinyl);
    if (!decoder) {
      return;
    }

    setLoading(true);
    setFileData(await decoder.decode(vinyl));
    setLoading(false);
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
            setFileData(undefined);

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
          className='big'
          style={{
            marginBottom: 12,
          }}
          onClick={readVinyl}
          disabled={!vinyl}
        >
          Read <Icon icon='music' />
        </button>
        {loading &&
        <div className='big'>
            <Icon icon='spinner' className='fa-pulse' /> Loading...
        </div>
        }
        {fileData && <DataPreview type={fileData.type} data={fileData.data} />}
      </div>
    </main>
  );
};

export default ReadVinylPage;
