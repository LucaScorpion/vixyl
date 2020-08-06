import React, { CanvasHTMLAttributes, ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import Icon from './components/Icon';
import { FileInfo } from './vinyl/FileInfo';
import { drawPixel } from './util/draw';
import { Encoding, getEncoder } from './vinyl/encoders/encoders';
import EncoderDecoder, { EncodeFormOption } from './vinyl/encoders/EncoderDecoder';
import FormOption from './vinyl/form/FormOption';

const CreateVinylPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [fileInfo, setFileInfo] = useState<FileInfo>();
  const [encoding, setEncoding] = useState(Encoding.RAINBOW_SPIRAL);
  const [encoder, setEncoder] = useState<EncoderDecoder<unknown>>();
  const [encoderOptions, setEncoderOptions] = useState<{ [key: string]: unknown }>();

  const [canvasProps, setCanvasProps] = useState<CanvasHTMLAttributes<HTMLCanvasElement>>({
    width: 0,
    height: 0,
  });
  const [canvasPropsResolve, setCanvasPropsResolve] = useState<() => void>();
  const [imgDataUrl, setImgDataUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get the encoder.
    const enc = getEncoder(encoding);
    setEncoder(enc);

    // Populate the encoder options with the default values, keeping matching values from the previous options.
    const opts: { [key: string]: unknown } = {};
    enc.getEncodeForm().forEach(opt => {
      if (encoderOptions && encoderOptions[opt.key] != null) {
        opts[opt.key] = encoderOptions[opt.key];
      } else {
        opts[opt.key] = opt.defaultValue;
      }
    });
    setEncoderOptions(opts);

    // We don't want to depend on encoderOptions, because that would turn into an infinite loop since we also update
    // them here. We only use them to copy over current values when the encoder changes, so no need to depend on them.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encoding]);

  const selectFile = useCallback((e: ChangeEvent<HTMLInputElement>) => {
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
  }, []);

  const createVinyl = useCallback(async (): Promise<void> => {
    const context = canvasRef.current?.getContext('2d');
    if (!fileInfo || !context || !encoder) {
      return;
    }

    setLoading(true);
    await encoder.encode(fileInfo, {
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
      form: encoderOptions,
    });

    // Set the top-left identifying pixels.
    drawPixel(context, 0, 0, {
      red: 86,    // V
      green: 105, // i
      blue: 120,  // x,
      alpha: 255,
    });
    drawPixel(context, 1, 0, {
      red: 121,   // y
      green: 108, // l
      blue: encoding,
      alpha: 255,
    });

    setImgDataUrl(context.canvas.toDataURL());
    setLoading(false);
  }, [fileInfo, encoding, encoder, encoderOptions]);

  useEffect(() => {
    // Resolve the canvas props propagation promise.
    if (canvasPropsResolve) {
      canvasPropsResolve();
    }

    // We don't want to depend on canvasPropsResolve, because we just want to resolve whenever the props change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasProps]);

  return (
    <main className='flex-center'>
      <div className='controls'>
        <input type='file' className='row' onChange={selectFile} />

        <select className='row' onChange={e => setEncoding(parseInt(e.currentTarget.value, 10))} value={encoding}>
          <option value={Encoding.GRAY_SPIRAL}>Gray Spiral</option>
          <option value={Encoding.RAINBOW_SPIRAL}>Rainbow Spiral</option>
        </select>
        {encoderOptions && encoder && encoder.getEncodeForm().map((option: EncodeFormOption) => (
          <div key={option.key} className='row'>
            <FormOption
              {...option}
              value={encoderOptions[option.key]}
              onChange={val => setEncoderOptions(prevState => ({ ...prevState, [option.key]: val }))}
            />
          </div>
        ))}

        <button className='big' onClick={createVinyl} disabled={!fileInfo}>
          Create <Icon icon='compact-disc' />
        </button>
        {imgDataUrl &&
        <a download='vinyl.png' href={imgDataUrl}>
            <button className='big'>
                Save <Icon icon='image' />
            </button>
        </a>
        }
        {loading &&
        <div className='big'>
            <Icon icon='spinner' className='fa-pulse' /> Loading...
        </div>
        }
      </div>
      <div>
        <canvas {...canvasProps} ref={canvasRef} />
      </div>
    </main>
  );
};

export default CreateVinylPage;
