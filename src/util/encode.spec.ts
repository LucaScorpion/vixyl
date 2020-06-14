import { encodeInt, encodeShort, encodeString } from './encode';

describe('encodeString', (): void => {
  it('encodes a string', (): void => {
    const data = new Uint8Array(4);
    encodeString(data, 0, 'Test');
    expect(data).toStrictEqual(new Uint8Array([84, 101, 115, 116]));
  });

  it('encodes a string at an offset', (): void => {
    const data = new Uint8Array(6);
    encodeString(data, 1, 'Test');
    expect(data).toStrictEqual(new Uint8Array([0, 84, 101, 115, 116, 0]));
  });
});

describe('encodeShort', (): void => {
  it('encodes a short', (): void => {
    const data = new Uint8Array(2);
    encodeShort(data, 0, 1000);
    expect(data).toStrictEqual(new Uint8Array([232, 3]));
    expect(data[0] + (data[1] << 8)).toBe(1000);
  });

  it('encodes a short at an offset', (): void => {
    const data = new Uint8Array(3);
    encodeShort(data, 1, 1000);
    expect(data).toStrictEqual(new Uint8Array([0, 232, 3]));
  });

  it('discards bits larges than max short', (): void => {
    const data = new Uint8Array(4);
    encodeShort(data, 0, 1234567);
    expect(data).toStrictEqual(new Uint8Array([135, 214, 0, 0]));
  });
});

describe('encodeInt', (): void => {
  it('encodes an int', (): void => {
    const data = new Uint8Array(4);
    encodeInt(data, 0, 123456789);
    expect(data).toStrictEqual(new Uint8Array([21, 205, 91, 7]));
    expect(data[0] + (data[1] << 8) + (data[2] << 16) + (data[3] << 24)).toBe(123456789);
  });

  it('encodes an int at an offset', (): void => {
    const data = new Uint8Array(5);
    encodeInt(data, 1, 123456789);
    expect(data).toStrictEqual(new Uint8Array([0, 21, 205, 91, 7]));
  });
});
