import { Dispatch, useCallback, useState } from 'react';

/**
 * A custom state hook for use with `input` elements which returns the number value, a display value and a dispatch.
 * The display value should be used for the `input` value prop.
 *
 * Passing a `NaN` value to an `input` element will generate an error, hence the need for a (string) display value.
 *
 * @param initialState The initial state.
 */
export default function useNumberState(initialState: number): [number, string, Dispatch<string | number>] {
  const [val, setVal] = useState(initialState);
  const displayVal = isNaN(val) ? '' : val.toString();

  const parseVal = useCallback((newValue: string | number) => {
    if (typeof newValue === 'number') {
      setVal(newValue);
    } else {
      setVal(parseInt(newValue, 10));
    }
  }, []);

  return [val, displayVal, parseVal];
}
