export interface WaveFormat {
  channels: number;
  sampleRate: number;
  bitsPerSample: number;
}

/**
 * Get the wave format byte rate.
 *
 * ByteRate = SampleRate * Channels * (BitsPerSample / 8)
 *          = SampleRate * BlockAlign
 *
 * @param format The wave format.
 */
export function getByteRate(format: WaveFormat): number {
  return format.sampleRate * getBlockAlign(format);
}

/**
 * Get the wave format block align.
 *
 * BlockAlign = Channels * (BitsPerSample / 8)
 *
 * @param format The wave format.
 */
export function getBlockAlign(format: WaveFormat): number {
  return format.channels * (format.bitsPerSample / 8);
}
