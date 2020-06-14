import React, { useEffect, useRef, useState } from 'react';
import Vinyl from './parser/Vinyl';
import { VinylMeta } from './parser/VinylMeta';
import VinylParser from './parser/VinylParser';
import parseVinylMeta from './parser/parseVinylMeta';
import ManualControls from './components/ManualControls';
import createWaves from './parser/createWaves';
import Icon from './components/Icon';

const ReadVinylPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [imageData, setImageData] = useState('');
  const [image, setImage] = useState<HTMLImageElement>();

  const [vinyl, setVinyl] = useState<Vinyl>();
  const [vinylMeta, setVinylMeta] = useState<VinylMeta>();
  const [manualControls, setManualControls] = useState(false);

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
    setParser(new VinylParser(vinyl));
  }, [vinyl]);

  return (
    <>
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
    </>
  );
};

export default ReadVinylPage;
