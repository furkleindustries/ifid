import {
  convertBinStrToUint8Array,
} from './convertBinStrToUint8Array';
import {
  getHashFromNamespaceIdAndName,
} from './getHashFromNamespaceIdAndName';
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
  uintArrayAsNumber,
} from './uintArrayAsNumber';

export function timestampGetter(version: TUUIDVersion): TSixtyBitsInHex {
  const _lastResults = <TUUIDLastResults>lastResults;
  const timestamp = _lastResults.timestamp;
  const clockSequence = _lastResults.clockSequence;
  let newTimestamp: TSixtyBitsInHex;
  if (version === '1' && isSixtyBitsInHex(timestamp)) {
    const lastTimestamp = parseInt(timestamp.join(''), 16);
    const currentTimestamp = getHundredsOfNanosecondsSinceGregorianReform();
    /* Check if the last recorded timestamp is after the current time. */
    if (lastTimestamp > currentTimestamp && isFourteenBits(clockSequence)) {
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

    timestamp = new Uint8Array(inputArr);
  } else if (/^[35]$/.test(version.toString())) {    
    /* Version is 3 or 5. */
    const hash = getHashFromNamespaceIdAndName(
      version,
      namespaceId!,
      name!,
    );

    let timestampStr = '';
    /* time_low */
    timestampStr = hash.slice(0, 8);
    /* time_mid */
    timestampStr = hash.slice(8, 12) + timestampStr;
    /* time_hi */
    timestampStr = hash.slice(12, 16) + timestampStr;
    const timestampBinStr = parseInt(timestampStr, 16).toString(2).padStart(60, '0');
    timestamp = convertBinStrToUint8Array(timestampBinStr);
  } else {
    /* version is 4 */
    timestamp = randomBytesGenerator(8);
    /* Only take the most significant 4 bits of the last byte as the timestamp
     * is only 60 bits. */
    timestamp[7] = parseInt(timestamp[7].toString(2).slice(0, 4), 2);
  }

  _lastResults.timestamp = newTimestamp;
  return newTimestamp;
}

export default timestampGetter;