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
  isUUIDVersion,
} from './TypeGuards/isUUIDVersion';
import {
  lastResults,
} from './lastResults';
import {
  NamespaceIds,
} from './Enums/NamespaceIds';
import {
  randomBytesGenerator,
} from './randomBytesGenerator';
import {
  strings,
} from './strings';
import {
  TUUIDVersion,
} from './TypeAliases/TUUIDVersion';
import {
  uintArrayAsNumber,
} from './uintArrayAsNumber';

export function timestampGetter(
  version: TUUIDVersion,
  namespaceId?: NamespaceIds,
  name?: string,
): Uint8Array
{
  if (!isUUIDVersion(version)) {
    throw new Error(strings.UUID_VERSION_INVALID);
  }
  
  let timestamp: Uint8Array;
  if (version.toString() === '1') {
    const oldTimestamp = lastResults.timestamp;
    const currentTimestamp = getHundredsOfNanosecondsSinceGregorianReform();
    /* Check if the last recorded timestamp is after the current time. */
    if ((oldTimestamp && 'BYTES_PER_ELEMENT' in oldTimestamp) &&
        (uintArrayAsNumber(oldTimestamp) > currentTimestamp) &&
        (lastResults.clockSequence && 'BYTES_PER_ELEMENT' in lastResults.clockSequence))
    {
      /* Increment the clock sequence given that the timestamp is invalid. */
      lastResults.clockSequence[1] += 1;
    }

    const timestampStr = currentTimestamp.toString(2).padStart(60, '0');
    const inputArr = [];
    for (let ii = 60; ii > 0; ii -= 8) {
      const byte = timestampStr.slice(ii - 8, ii).padStart(8, '0');
      inputArr.unshift(parseInt(byte, 2));
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

  lastResults.timestamp = timestamp;
  return timestamp;
}

export default timestampGetter;