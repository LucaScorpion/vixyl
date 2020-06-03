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

function createRiffChunk(data: Uint8Array): Uint8Array {
  const chunk = new Uint8Array(12);
  encodeString(chunk, 0, 'RIFF');
  encodeInt(chunk, 4, 36 + data.length); // Total chunk size, i.e. number of bytes following this number
  encodeString(chunk, 8, 'WAVE');
  return chunk;
}

function createFmtChunk(format: WaveFormat): Uint8Array {
  const chunk = new Uint8Array(24);
  encodeString(chunk, 0, 'fmt ');
  encodeInt(chunk, 4, 16); // Subchunk size = 16 for PCM
  encodeShort(chunk, 8, 1); // Audio format = 1 for PCM (linear quantization, no compression)
  encodeShort(chunk, 10, 1); // Audio channels = 1 (mono)
  encodeInt(chunk, 12, format.sampleRate); // Sample rate
  encodeInt(chunk, 16, format.sampleRate); // Bitrate = sample rate * channels * bytes per sample
  encodeShort(chunk, 20, 1); // Block align = channels * bytes per sample
  encodeShort(chunk, 22, 8); // Bits per sample
  return chunk;
}

function createDataChunk(data: Uint8Array): Uint8Array {
  const chunk = new Uint8Array(8 + data.length);
  encodeString(chunk, 0, 'data');
  encodeInt(chunk, 4, data.length); // Subchunk size = bytes in data = samples * channels * bytes per sample
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
