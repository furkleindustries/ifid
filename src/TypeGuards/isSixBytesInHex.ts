import {
  isHexDigit,
} from './isHexDigit';
import {
  TSixBytesInHex,
} from '../TypeAliases/TSixBytesInHex';

export function isSixBytesInHex(maybe: any): maybe is TSixBytesInHex {
  return Array.isArray(maybe) &&
    maybe.filter((aa) => isHexDigit(aa)).length === 12;
}

export default isSixBytesInHex;