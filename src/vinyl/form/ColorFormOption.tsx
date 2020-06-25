import React from 'react';
import { ColorEncodeFormOption } from '../encoders/EncoderDecoder';
import { ChromePicker, RGBColor } from 'react-color';
import { Props } from './FormOption';

const ColorFormOption: React.FC<Props<RGBColor> & ColorEncodeFormOption> = ({ value, onChange, text, defaultValue }) => {
  return (
    <>
      {text}
      <ChromePicker color={value} onChange={e => onChange(e.rgb)} />
    </>
  );
};

export default ColorFormOption;
