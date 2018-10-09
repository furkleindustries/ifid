import {
  randomBytes,
} from 'crypto';

export const randomBytesGenerator: (size: number) => Uint8Array = (() => {
  return (size: number) => new Uint8Array(randomBytes(size));
})();

export default randomBytesGenerator;