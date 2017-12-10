import {
  isBit,
} from './TypeGuards/isBit';
import {
  isFourteenBits,
} from './TypeGuards/isFourteenBits';
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
  nodeIdentifierGetter,
} from './nodeIdentifierGetter';
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
      clockSequence = null;
    }
  }

  if (!clockSequence) {
    /* If the clock sequence cannot be found, or a non-V1 ID is being 
     * generated, generate a random new clock sequence. */
    clockSequence = <TFourteenBits>randomBytesGenerator(2)
      .split('')
      .slice(0, 14);
  }
  
  if (clockSequence.filter((aa) => isBit(aa)).length !== 14) {
    throw new Error(strings.CLOCK_SEQUENCE_HIGH_INVALID);
  }

  _lastResults.clockSequence = clockSequence;
  return <TFourteenBits>clockSequence;
}

export default clockSequenceGetter;