import {
  binaryToHexDigits,
} from './binaryToHexDigits';
import {
  isFourteenBits,
} from './TypeGuards/isFourteenBits';
import {
  isHexDigit,
} from './TypeGuards/isHexDigit';
import {
  isSixtyBitsInHex,
} from './TypeGuards/isSixtyBitsInHex';
import {
  getHundredsOfNanosecondsSinceGregorianReform,
} from './getHundredsOfNanosecondsSinceGregorianReform';
import {
  lastResults,
} from './lastResults';
import {
  randomBytesGenerator,
} from './randomBytesGenerator';
import {
  strings,
} from './strings';
import {
  TBit,
} from './TypeAliases/TBit';
import {
  TFourteenBits,
} from './TypeAliases/TFourteenBits';
import {
  TSixtyBitsInHex,
} from './TypeAliases/TSixtyBitsInHex';
import { TUUIDLastResults } from './TypeAliases/TUUIDLastResults';

export function timestampGetter(): TSixtyBitsInHex {
  const _lastResults = <TUUIDLastResults>lastResults;
  const timestamp = _lastResults.timestamp;
  const clockSequence = _lastResults.clockSequence;
  let newTimestamp: TSixtyBitsInHex;
  if (this.version === '1' &&
    isSixtyBitsInHex(timestamp))
  {
    const lastTimestamp = parseInt(timestamp.join(''), 16);
    const currentTimestamp = getHundredsOfNanosecondsSinceGregorianReform();
    /* Check if the last recorded timestamp is after the current time. */
    if (lastTimestamp > currentTimestamp &&
      isFourteenBits(clockSequence))
    {
      /* Increment the clock sequence given that the timestamp is invalid. */
      _lastResults.clockSequence = ((): TFourteenBits => {
        const csNum = parseInt(clockSequence.join(''), 2) + 1;
        if (csNum > parseInt('11111111111111', 2)) {
          /* Prevent overflowing 14-bit space. */
          return <TFourteenBits>'00000000000000'.split('');
        } else {
          return <TFourteenBits>csNum.toString(2).split('');
        }
      })();
    }

    /* Return the current timestamp. */
    newTimestamp = <TSixtyBitsInHex>currentTimestamp.toString(16).split('');
    /* Left-pad timestamp up to 15 digits. */
    for (let ii = newTimestamp.length; ii < 15; ii += 1) {
      newTimestamp.unshift('0');
    }
  } else {
    const bin = randomBytesGenerator(8);
    if (bin.length < 60) {
      throw new Error(strings.TIMESTAMP_GENERATION_FAILED);
    }

    const values = <Array<TBit>>bin.slice(0, 60).split('');
    const hexes = <TSixtyBitsInHex>binaryToHexDigits(values, 15);
    if (hexes.filter((aa) => isHexDigit(aa)).length !== hexes.length) {
      throw new Error(strings.TIMESTAMP_GENERATION_FAILED);
    }

    newTimestamp = hexes;
  }

  _lastResults.timestamp = newTimestamp;
  return newTimestamp;
}

export default timestampGetter;