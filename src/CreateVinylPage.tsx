import React, { CanvasHTMLAttributes, useCallback, useEffect, useRef, useState } from 'react';
import Icon from './components/Icon';
import { ChromePicker, ColorResult, RGBColor } from 'react-color';
import { VixylEncoding } from './vinyl/VixylEncoding';
import getEncoder from './vinyl/encoders/getEncoder';
import { FileInfo } from './vinyl/FileInfo';

const CreateVinylPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [fileInfo, setFileInfo] = useState<FileInfo>();
  const [encoding, setEncoding] = useState(VixylEncoding.RAINBOW_SPIRAL);
  const [canvasProps, setCanvasProps] = useState<CanvasHTMLAttributes<HTMLCanvasElement>>({
    width: 0,
    height: 0,
  });
  const [canvasPropsResolve, setCanvasPropsResolve] = useState<() => void>();
  const [imgDataUrl, setImgDataUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const [addQr, setAddQr] = useState(true);
  const [bgColor, setBgColor] = useState<RGBColor>({
    r: 0,
    g: 0,
    b: 0,
    a: 0.99,
  });

  const createVinyl = useCallback(async (): Promise<void> => {
    const context = canvasRef.current?.getContext('2d');
    if (!fileInfo || !context) {
      return;
    }

    setLoading(true);
    const enc = getEncoder(encoding);
    await enc.encode(fileInfo, {
      setCanvasProps: async (props): Promise<CanvasRenderingContext2D> => {
        // Create a promise which resolves as soon as the canvas props propagate.
        const canvasPropsPromise = new Promise(resolve => {
          setCanvasPropsResolve(() => resolve);
        });

        // Set the canvas props, wait for the state change to propagate.
        setCanvasProps(props);
        await canvasPropsPromise;

        return context;
      },
    });
    setLoading(false);

    setImgDataUrl(context.canvas.toDataURL());
  }, [fileInfo, encoding]);

  useEffect(() => {
    // Resolve the canvas props propagation promise.
    if (canvasPropsResolve) {
      canvasPropsResolve();
    }
  }, [canvasProps]);

  const updateBgColor = useCallback((c: ColorResult) => {
    if (c.rgb.a == null) {
      c.rgb.a = 1;
    }

    c.rgb.a = Math.min(c.rgb.a, 0.99);
    setBgColor(c.rgb);
  }, []);

  return (
    <main className='flex-center'>
      <div>
        <canvas
          {...canvasProps}
          ref={canvasRef}
          style={{
            marginRight: 48,
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

            // Clear the old data.
            setFileInfo(undefined);
            setImgDataUrl('');
            setCanvasProps({
              width: 0,
              height: 0,
            });

            // Read the file contents.
            const reader = new FileReader();
            reader.addEventListener('load', () => {
              if (reader.result && typeof reader.result === 'object') {
                // Store the file data in state.
                setFileInfo({
                  type: file.type,
                  data: new Uint8Array(reader.result),
                });
              }
            });
            reader.readAsArrayBuffer(file);
          }}
          className='row'
        />

        {/* Encoder options */}
        <select className='row' onChange={e => setEncoding(parseInt(e.currentTarget.value, 10))} value={encoding}>
          <option value={VixylEncoding.GRAY_SPIRAL}>Gray</option>
          <option value={VixylEncoding.RAINBOW_SPIRAL}>Rainbow</option>
        </select>
        <div style={{ marginBottom: 12 }}>
          <input id='add-qr' type='checkbox' checked={addQr} onChange={(e) => setAddQr(e.currentTarget.checked)} />
          <label htmlFor='add-qr'>Add QR code</label>
        </div>
        <div className='row'>
          Background color
          <ChromePicker color={bgColor} onChange={updateBgColor} />
        </div>

        <button
          className='big'
          style={{
            marginBottom: 12,
          }}
          onClick={createVinyl}
          disabled={!fileInfo}
        >
          Create <Icon icon='compact-disc' />
        </button>
        {imgDataUrl &&
        <a download='vinyl.png' href={imgDataUrl}>
            <button className='big'>
                Save <Icon icon='image' />
            </button>
        </a>
        }
        {
          loading &&
          <div className='big'>
              <Icon icon='spinner' className='fa-pulse' /> Loading...
          </div>
        }
      </div>
    </main>
  );
};

export default CreateVinylPage;
