import { base64ArrayBuffer } from './b64Encode';

export interface WaveFormat {
  sampleRate: number;
}

export default function createWaves(data: Uint8Array, format: WaveFormat): string {
  const waveData = getWaveData(data, format);
  const encodedData = base64ArrayBuffer(waveData);
  return `data:audio/wav;base64,${encodedData}`;
}

function getWaveData(data: Uint8Array, format: WaveFormat): Uint8Array {
  // Create all the chunks.
  const riffChunk = createRiffChunk(data);
  const fmtChunk = createFmtChunk(format);
  const dataChunk = createDataChunk(data);

  // Concatenate the chunks.
  const waveData = new Uint8Array(riffChunk.length + fmtChunk.length + dataChunk.length);
  waveData.set(riffChunk, 0);
  waveData.set(fmtChunk, riffChunk.length);
  waveData.set(dataChunk, riffChunk.length + fmtChunk.length);
  return waveData;
}

/**
 * Create the "RIFF" chunk.
 *
 * Chunk layout:
 * | Field     | Size | Value |
 * |-----------|------|-------|
 * | ChunkID   | 4    | "RIFF" (hex: 52, 49, 46, 46)
 * | ChunkSize | 4    | 36 + data size (or 4 + 8 + Subchunk1Size + 8 + Subchunk2Size)
 * | Format    | 4    | "WAVE" (hex: 57, 41, 56, 45)
 *
 * @param data The sound data used in the "data" subchunk.
 */
function createRiffChunk(data: Uint8Array): Uint8Array {
  const chunk = new Uint8Array(12);
  encodeString(chunk, 0, 'RIFF');
  encodeInt(chunk, 4, 36 + data.length);
  encodeString(chunk, 8, 'WAVE');
  return chunk;
}

/**
 * Create the "fmt " subchunk.
 *
 * Chunk layout:
 * | Field         | Size | Value |
 * |---------------|------|-------|
 * | ChunkID       | 4    | "fmt " (hex: 66, 6D, 74, 20)
 * | ChunkSize     | 4    | 16 (for PCM)
 * | AudioFormat   | 2    | 1 (PCM, i.e. linear quantization)
 * | Channels      | 2    | 1 = mono, 2 = stereo, etc.
 * | SampleRate    | 4    |
 * | ByteRate      | 4    | SampleRate * Channels * (BitsPerSample / 8)
 * | BlockAlign    | 2    | Channels * (BitsPerSample / 8)
 * | BitsPerSample | 2    |
 *
 * @param format The sound format information.
 */
function createFmtChunk(format: WaveFormat): Uint8Array {
  const chunk = new Uint8Array(24);
  encodeString(chunk, 0, 'fmt ');
  encodeInt(chunk, 4, 16);
  encodeShort(chunk, 8, 1); // AudioFormat
  encodeShort(chunk, 10, 1); // Channels
  encodeInt(chunk, 12, format.sampleRate); // SampleRate
  encodeInt(chunk, 16, format.sampleRate); // ByteRate
  encodeShort(chunk, 20, 1); // BlockAlign
  encodeShort(chunk, 22, 8); // BitsPerSample
  return chunk;
}

/**
 * Create the "data" subchunk.
 *
 *  Chunk layout:
 * | Field     | Size | Value |
 * |-----------|------|-------|
 * | ChunkID   | 4    | "data" (hex: 64, 61, 74, 61)
 * | ChunkSize | 4    | Length of Data, i.e.: Samples * Channels * (BitsPerSample / 8)
 * | Data      | ?    | Sound data
 *
 * @param data The sound data.
 */
function createDataChunk(data: Uint8Array): Uint8Array {
  const chunk = new Uint8Array(8 + data.length);
  encodeString(chunk, 0, 'data');
  encodeInt(chunk, 4, data.length);
  chunk.set(data, 8);
  return chunk;
}

function encodeString(data: Uint8Array, offset: number, value: string): void {
  for (let i = 0; i < value.length; i++) {
    data[offset + i] = value.charCodeAt(i);
  }
}

function encodeShort(data: Uint8Array, offset: number, value: number): void {
  data[offset] = value & 0xFF;
  data[offset + 1] = (value >> 8) & 0xFF;
}

function encodeInt(data: Uint8Array, offset: number, value: number): void {
  encodeShort(data, offset, value);
  encodeShort(data, offset + 2, value >> 16);
}
