import { base64ArrayBuffer } from '../util/b64Encode';
import { getBlockAlign, getByteRate } from './WaveFormat';
import { WaveData } from './WaveData';
import { encodeInt, encodeShort, encodeString } from '../util/encode';

export default function createWaves(wave: WaveData): string {
  const waveBinData = getWaveData(wave);
  const encodedData = base64ArrayBuffer(waveBinData);
  return `data:audio/wav;base64,${encodedData}`;
}

function getWaveData(wave: WaveData): Uint8Array {
  // Create all the chunks.
  const riffChunk = createRiffChunk(wave);
  const fmtChunk = createFmtChunk(wave);
  const dataChunk = createDataChunk(wave);

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
 * @param wave The wave data.
 */
function createRiffChunk(wave: WaveData): Uint8Array {
  const chunk = new Uint8Array(12);
  encodeString(chunk, 0, 'RIFF');
  encodeInt(chunk, 4, 36 + wave.data.length);
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
 * @param wave The wave data.
 */
function createFmtChunk(wave: WaveData): Uint8Array {
  const chunk = new Uint8Array(24);
  encodeString(chunk, 0, 'fmt ');
  encodeInt(chunk, 4, 16);
  encodeShort(chunk, 8, 1); // AudioFormat
  encodeShort(chunk, 10, wave.format.channels); // Channels
  encodeInt(chunk, 12, wave.format.sampleRate); // SampleRate
  encodeInt(chunk, 16, getByteRate(wave.format)); // ByteRate
  encodeShort(chunk, 20, getBlockAlign(wave.format)); // BlockAlign
  encodeShort(chunk, 22, wave.format.bitsPerSample); // BitsPerSample
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
 * @param wave The wave data.
 */
function createDataChunk(wave: WaveData): Uint8Array {
  const chunk = new Uint8Array(8 + wave.data.length);
  encodeString(chunk, 0, 'data');
  encodeInt(chunk, 4, wave.data.length);
  chunk.set(wave.data, 8);
  return chunk;
}
