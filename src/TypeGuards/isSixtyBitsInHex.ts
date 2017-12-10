import {
  isHexDigit,
} from './isHexDigit';
import {
  TSixtyBitsInHex,
} from '../TypeAliases/TSixtyBitsInHex';

export function isSixtyBitsInHex(maybe: any): maybe is TSixtyBitsInHex {
  return Array.isArray(maybe) &&
    maybe.filter((aa) => isHexDigit(aa)).length === 15;
}

export default isSixtyBitsInHex;