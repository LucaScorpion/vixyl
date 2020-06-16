import React, { useCallback, useEffect, useRef, useState } from 'react';
import Vinyl from './vinyl/Vinyl';
import { VinylMeta } from './vinyl/VinylMeta';
import VinylReader from './vinyl/VinylReader';
import parseVinylMeta from './vinyl/parseVinylMeta';
import ManualControls from './components/ManualControls';
import createWaves from './wave/createWaves';
import Icon from './components/Icon';
import parseRainbowVinyl from './vinyl/parsers/parseRainbowVinyl';
import { VinylEncoding } from './vinyl/VinylEncoding';
import parseGrayVinyl from './vinyl/parsers/parseGrayVinyl';

const ReadVinylPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [imageData, setImageData] = useState('');
  const [image, setImage] = useState<HTMLImageElement>();

  const [vinyl, setVinyl] = useState<Vinyl>();
  const [vinylMeta, setVinylMeta] = useState<VinylMeta>();
  const [manualControls, setManualControls] = useState(false);

  const [musicData, setMusicData] = useState('');
  const [parser, setParser] = useState<VinylReader>();

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
    setVinyl(new Vinyl(context));
  }, [image]);

  useEffect((): void => {
    if (!vinyl) {
      return;
    }

    // Parse the vinyl metadata.
    const meta = parseVinylMeta(vinyl);
    if (meta) {
      setVinylMeta(meta);
      setManualControls(false);
    } else {
      setManualControls(true);
    }

    // Create the vinyl parser.
    setParser(new VinylReader(vinyl));
  }, [vinyl]);

  const readVinyl = useCallback(() => {
    if (!parser || !vinylMeta) {
      return;
    }

    // Read and parse the vinyl.
    const pixels = parser.readVinyl(vinylMeta.trackStart);
    let parsedData: Uint8Array;
    switch (vinylMeta.encoding) {
      case VinylEncoding.GRAY:
        parsedData = parseGrayVinyl(pixels);
        break;
      case VinylEncoding.RAINBOW:
        parsedData = parseRainbowVinyl(pixels);
        break;
      default:
        console.error('Unknown encoding:', vinylMeta.encoding);
        return;
    }

    // Create the wave data.
    setMusicData(createWaves({
      data: parsedData,
      format: vinylMeta.format,
    }));
  }, [parser, vinylMeta]);

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

        {manualControls && parser && <ManualControls parser={parser} setVinylMeta={setVinylMeta} />}

        <button
          style={{
            width: '100%',
            fontSize: 24,
            padding: 12,
            marginBottom: 12,
          }}
          onClick={readVinyl}
          disabled={!parser || !vinylMeta}
        >
          Read <Icon icon='music' />
        </button>
        {musicData && <audio controls src={musicData} style={{ width: '100%' }} />}
      </div>
    </main>
  );
};

export default ReadVinylPage;
