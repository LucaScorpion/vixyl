import React, { useRef } from 'react';

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div>
      <header>
        Vixyl
      </header>
      <main>
        <input type='file' onChange={(e) => {
          const file = e.currentTarget.files?.item(0);
          if (!file) {
            return;
          }

          const reader = new FileReader();
          reader.addEventListener('load', () => {
            const canvas = canvasRef.current;
            const context = canvas?.getContext('2d');
            if (typeof reader.result !== 'string' || !canvas || !context) {
              return;
            }

            const image = new Image();
            image.src = reader.result;
            image.addEventListener('load', () => {
              context.drawImage(image, 0, 0);

            });
          });
          reader.readAsDataURL(file);
        }} />
        <canvas ref={canvasRef} />
      </main>
    </div>
  );
};

export default App;
