import React from 'react';
import { base64ArrayBuffer } from '../util/b64Encode';

export interface Props {
  type: string;
  data: Uint8Array;
}

const DataPreview: React.FC<Props> = ({ type, data }) => {
  if (type.indexOf('audio/') === 0) {
    const dataUrl = `data:${type};base64,${base64ArrayBuffer(data)}`;
    return (
      <audio controls src={dataUrl} style={{ width: '100%' }} />
    );
  }

  return (
    <div></div>
  );
};

export default DataPreview;
