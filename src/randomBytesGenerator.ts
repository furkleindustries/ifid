import {
  randomBytes,
} from 'crypto';
import {
  strings,
} from './strings';

declare const window: { [key: string]: any };

export const randomBytesGenerator = (() => {
  let func: Function;
  if (typeof window === 'undefined') {
    func = randomBytes;
  } else if (typeof window.crypto === 'object' &&
    window.crypto &&
    typeof window.crypto.randomBytes === 'function')
  {
    func = window.crypto.randomBytes;
  } else {
    throw new Error(strings.RANDOM_GENERATOR_INVALID);
  }

  return (num: number): string => {
    if (!(num >= 1 && num % 1 === 0)) {
      throw new Error(strings.RANDOM_BYTES_COUNT_INVALID);
    }

    let bits = Object.values(func(num)).map((int) => int.toString(2)).join('');
    for (let ii = bits.length; ii < num * 8; ii += 1) {
      /* Left-pad bits, given that they're displayed in big-endian. */
      bits = '0' + bits;
    }

    return bits;
  };
})();

export default randomBytesGenerator;