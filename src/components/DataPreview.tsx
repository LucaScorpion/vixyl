import React from 'react';
import createDataUrl from '../util/createDataUrl';

export interface Props {
  type: string;
  data: Uint8Array;
}

const DataPreview: React.FC<Props> = ({ type, data }) => {
  if (type.indexOf('audio/') === 0) {
    return (
      <audio controls src={createDataUrl(type, data)} style={{ width: '100%' }} />
    );
  }

  if (type.indexOf('image/') === 0) {
    return (
      <img src={createDataUrl(type, data)} />
    );
  }

  return (
    <div></div>
  );
};

export default DataPreview;
