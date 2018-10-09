import {
  isBit,
} from './TypeGuards/isBit';
import {
  getHashFromNamespaceIdAndName,
} from './getHashFromNamespaceIdAndName';
import {
  isNode,
} from './isNode';
import {
  isSixBytesInHex,
} from './TypeGuards/isSixBytesInHex';
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
  TFourteenBits,
} from './TypeAliases/TFourteenBits';
import {
  TUUIDLastResults,
} from './TypeAliases/TUUIDLastResults';
import {
  TUUIDVersion,
} from './TypeAliases/TUUIDVersion';

export function clockSequenceGetter(version: TUUIDVersion): TFourteenBits {
  let clockSequence: TFourteenBits | null = null;
  const _lastResults = <TUUIDLastResults>lastResults;
  if (version === '1' && isNode) {
    clockSequence = _lastResults.clockSequence;
    const lastNodeIdentifier = _lastResults.nodeIdentifier;
    const currentNodeIdentifier = nodeIdentifierGetter(version);
    if (!isFourteenBits(clockSequence) ||
      !isSixBytesInHex(lastNodeIdentifier) ||
      !isSixBytesInHex(currentNodeIdentifier) ||
      lastNodeIdentifier !== currentNodeIdentifier)
    {
      return lastResults.clockSequence;
    } else {
      clockSequence = getRandomSeq();
      if (version.toString() === '1') {
        lastResults.clockSequence = clockSequence;
      }
    }
  } else {
    /* Version is 3 or 5. */
    const hash = getHashFromNamespaceIdAndName(
      version,
      namespaceId!,
      name!,
    );

    let clockSequenceStr = '';
    
    /* clock_seq_hi */
    clockSequenceStr += hash.slice(16, 18);
    /* clock_seq_low */
    clockSequenceStr += hash.slice(18, 20);
    const clockSequenceBinStr = parseInt(clockSequenceStr, 16).toString(2).padStart(14, '0');
    clockSequence = convertBinStrToUint8Array(clockSequenceBinStr);
  }

  _lastResults.clockSequence = clockSequence;
  return <TFourteenBits>clockSequence;
}

export default clockSequenceGetter;