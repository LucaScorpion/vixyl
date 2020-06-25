import { decodeInt24Pixel, Pixel } from '../../util/Pixel';
import { DecodedData } from './DecodedData';

export default abstract class VinylDecoder {
  protected abstract parsePixels(pixels: Pixel[]): Uint8Array;

  public decode(pixels: Pixel[]): DecodedData {
    // Read the file type.
    const fileTypeLength = decodeInt24Pixel(pixels[6]);
    let fileType = '';
    for (let i = 0; i < fileTypeLength; i++) {
      fileType = `${fileType}${String.fromCharCode(pixels[7 + i].red)}`
    }
    console.debug('File type:', fileTypeLength, fileType);

    // Read the data.
    const dataLength = decodeInt24Pixel(pixels[7 + fileTypeLength]);
    console.log('File size:', dataLength);
    const data = this.parsePixels(pixels.slice(8 + fileTypeLength)).slice(0, dataLength);

    return ({
      data,
      type: fileType,
    });
  }
}
