import React from 'react';
import { EncodeFormOption } from '../encoders/EncoderDecoder';
import BooleanFormOption from './BooleanFormOption';
import ColorFormOption from './ColorFormOption';

export interface Props<T = any> {
  value: T;
  onChange: (val: T) => void;
}

const FormOption: React.FC<Props & EncodeFormOption> = (props) => {
  switch (props.type) {
    case 'boolean':
      return <BooleanFormOption {...props} />;
    case 'color':
      return <ColorFormOption {...props} />;
  }
};

export default FormOption;
