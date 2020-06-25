import React from 'react';
import { BooleanEncodeFormOption } from '../encoders/EncoderDecoder';
import { Props } from './FormOption';

const BooleanFormOption: React.FC<Props<boolean> & BooleanEncodeFormOption> = ({ value, onChange, text, defaultValue }) => {
  return (
    <>
      <input id={text} type='checkbox' checked={value} onChange={e => onChange(e.currentTarget.checked)} />
      <label htmlFor={text}>{text}</label>
    </>
  );
};

export default BooleanFormOption;
