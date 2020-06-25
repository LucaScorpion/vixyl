import React from 'react';
import createDataUrl from '../util/createDataUrl';
import Icon from './Icon';

export interface Props {
  type: string;
  data: Uint8Array;
}

const DataPreview: React.FC<Props> = ({ type, data }) => {
  const dataUrl = createDataUrl(type, data);

  if (type.indexOf('audio/') === 0) {
    return (
      <audio controls src={dataUrl} style={{ width: '100%' }} />
    );
  }

  if (type.indexOf('image/') === 0) {
    return (
      <img src={dataUrl} alt='' />
    );
  }

  return (
    <a download={'file'} href={dataUrl}>
      <button className='big'>
        Download <Icon icon='download' />
      </button>
    </a>
  );
};

export default DataPreview;
