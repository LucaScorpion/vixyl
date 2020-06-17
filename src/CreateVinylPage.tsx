import React, { useCallback, useEffect, useRef, useState } from 'react';
import Icon from './components/Icon';
import { VinylFormat } from './vinyl/VinylFormat';
import getVinylEncoder from './vinyl/encoding/getVinylEncoder';
import VinylEncoder from './vinyl/encoding/VinylEncoder';
import { SpiralData } from './vinyl/encoding/SpiralData';

const CreateVinylPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [uploadedData, setUploadedData] = useState<Uint8Array>();
  const [fileType, setFileType] = useState('');
  const [format, setFormat] = useState(VinylFormat.GRAY);

  const [encoder, setEncoder] = useState<VinylEncoder>();
  const [spiralData, setSpiralData] = useState<SpiralData>();

  const createVinyl = useCallback((): void => {
    // Encode the file.
    if (!uploadedData) {
      return;
    }
    const enc = getVinylEncoder(format);
    setEncoder(enc);
    setSpiralData(enc.encode({ type: fileType, data: uploadedData }));
  }, [uploadedData, format, fileType]);

  useEffect((): void => {
    // Update the canvas.
    const context = canvasRef.current?.getContext('2d');
    if (!encoder || !context || !spiralData) {
      return;
    }
    encoder.draw(context, spiralData);
  }, [spiralData, encoder]);

  return (
    <main className='flex-center'>
      <div>
        <canvas
          ref={canvasRef}
          width={spiralData?.size}
          height={spiralData?.size}
          style={{
            marginRight: 48,
            width: spiralData?.size,
            height: spiralData?.size,
            maxWidth: 800,
            maxHeight: 800,
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

            // Clear the data.
            setUploadedData(undefined);

            // Read the data into state.
            setFileType(file.type);
            const reader = new FileReader();
            reader.addEventListener('load', () => {
              if (reader.result && typeof reader.result === 'object') {
                setUploadedData(new Uint8Array(reader.result));
              }
            });
            reader.readAsArrayBuffer(file);
          }}
          className='row'
        />
        <select className='row' onChange={e => setFormat(parseInt(e.currentTarget.value, 10))}>
          <option value={VinylFormat.GRAY}>Gray</option>
          <option value={VinylFormat.RAINBOW}>Rainbow</option>
        </select>
        <button
          style={{
            width: '100%',
            fontSize: 24,
            padding: 12,
            marginBottom: 12,
          }}
          onClick={createVinyl}
          disabled={!uploadedData}
        >
          Create <Icon icon='compact-disc' />
        </button>
      </div>
    </main>
  );
};

export default CreateVinylPage;
