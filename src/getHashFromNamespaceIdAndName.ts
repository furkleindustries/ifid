import {
  createHash,
} from 'crypto';
import {
  NamespaceIds,
} from './Enums/NamespaceIds';
import {
  strings,
} from './strings';
import {
  TUUIDVersion,
} from './TypeAliases/TUUIDVersion';

export const getHashFromNamespaceIdAndName = (
  version: TUUIDVersion,
  namespaceId: NamespaceIds,
  name: string,
): string => {
  if (!namespaceId) {
    throw new Error(strings.NAMESPACE_ID_MISSING);
  } else if (!name) {
    throw new Error(strings.NAME_MISSING);
  }

  let hasher;
  if (version.toString() === '3') {
    hasher = createHash('md5');
  } else {
    hasher = createHash('sha1');
  }

  const bigEndianNamespaceId = namespaceId.split('-').map((segment) => {
    const len = segment.length;
    return parseInt(
      parseInt(segment, 16)
        .toString(2)
        .split('')
        .reverse()
        .join(''),
      2
    ).toString(16).padEnd(len, '0');
  }).join('-');

  hasher.update(bigEndianNamespaceId + name);
  return hasher.digest('hex');
}