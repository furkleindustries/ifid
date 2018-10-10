import {
  convertBinStrToUint8Array,
} from './convertBinStrToUint8Array';
import {
  getHashFromNamespaceIdAndName,
} from './getHashFromNamespaceIdAndName';
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

  return nodeIdentifier;
}

export default nodeIdentifierGetter;