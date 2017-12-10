import {
  isFourteenBits,
} from './isFourteenBits';
import {
  isSixBytesInHex,
} from './isSixBytesInHex';
import {
  isSixtyBitsInHex,
} from './isSixtyBitsInHex';
import {
  TUUIDLastResults,
} from '../TypeAliases/TUUIDLastResults';

export function isValidLastResults(maybe: any): maybe is TUUIDLastResults {
  return typeof maybe === 'object' &&
    maybe &&
    isSixBytesInHex(maybe.node) &&
    isSixtyBitsInHex(maybe.timestamp) &&
    isFourteenBits(maybe.clockSequence);
}

export default isValidLastResults;