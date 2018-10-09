import {
  networkInterfaces,
} from 'os';

import {
  getHashFromNamespaceIdAndName,
} from './getHashFromNamespaceIdAndName';
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

    nodeIdentifier = getMAC();
    lastResults.nodeIdentifier = nodeIdentifier;
  } else if (/^[35]$/.test(version.toString())) {
    const hash = getHashFromNamespaceIdAndName(
      version,
      namespaceId!,
      name!,
    );

    let nodeIdentifierStr = '';
    
    /* node_identifier */
    nodeIdentifierStr += hash.slice(20, 32);
    const nodeIdentifierBinStr = parseInt(nodeIdentifierStr, 16)
      .toString(2)
      .padStart(48, '0');

    nodeIdentifier = convertBinStrToUint8Array(nodeIdentifierBinStr);
  } else if (version.toString() === '4') {
    nodeIdentifier = randomBytesGenerator(6);
  } else {
    throw new Error(strings.UUID_VERSION_INVALID);
  }
}

export default nodeIdentifierGetter;