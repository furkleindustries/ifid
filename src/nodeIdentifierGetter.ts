import {
  networkInterfaces,
} from 'os';

import {
  binaryToHexDigits,
} from './binaryToHexDigits';
import {
  getMAC,
} from './getMAC';
import {
  isSixBytesInHex,
} from './TypeGuards/isSixBytesInHex';
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
  TSixBytesInHex,
} from './TypeAliases/TSixBytesInHex';
import {
  TUUIDVersion,
} from './TypeAliases/TUUIDVersion';

export function nodeIdentifierGetter(version: TUUIDVersion): TSixBytesInHex {
  if (/^1$/.test(version)) { /* Create the node ID from the system time. */
    if (typeof networkInterfaces !== 'function') {
      throw new Error(strings.MAC_ADDRESS_UNAVAILABLE);
    }

    const MAC = getMAC();
    if (!isSixBytesInHex(MAC)) {
      throw new Error(strings.MAC_ADDRESS_INVALID);
    }

    return MAC;
  } else if (/^[345]$/.test(version)) {
    const bytes = <Array<TBit>>randomBytesGenerator(6).split('');
    return <TSixBytesInHex>binaryToHexDigits(bytes, 12);
  } else {
    throw new Error(strings.UUID_VERSION_INVALID);
  }
}

export default nodeIdentifierGetter;