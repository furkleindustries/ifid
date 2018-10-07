import {
  convertBinStrToUint8Array,
} from './convertBinStrToUint8Array';
import {
  createHash,
} from 'crypto';
import {
  getMAC,
} from './getMAC';
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

export function nodeIdentifierGetter(
  version: TUUIDVersion,
  namespaceId?: NamespaceIds,
  name?: string,
): Uint8Array
{
  let nodeIdentifier: Uint8Array;
  if (version.toString() === '1') { /* Create the node ID from the system time. */
    if (lastResults.nodeIdentifier &&
        'BYTES_PER_ELEMENT' in lastResults.nodeIdentifier)
    {
      return lastResults.nodeIdentifier;
    }

    nodeIdentifier = getMAC();
    lastResults.nodeIdentifier = nodeIdentifier;
  } else if (/^[35]$/.test(version.toString())) {
    if (!namespaceId) {
      throw new Error(strings.NAMESPACE_ID_MISSING);
    } else if (!name) {
      throw new Error(strings.NAME_MISSING);
    }

    let hash: string;
    let hasher;
    if (version.toString() === '3') {
      hasher = createHash('md5');
    } else {
      hasher = createHash('sha1');
    }

    hasher.update(namespaceId + name);
    hash = hasher.digest('hex');

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

  return nodeIdentifier;
}

export default nodeIdentifierGetter;