import {
  isHexDigit,
} from './isHexDigit';
import {
  TTwelveBitsInHex,
} from '../TypeAliases/TTwelveBitsInHex';

export function isTwelveBitsInHex(maybe: any): maybe is TTwelveBitsInHex {
  return Array.isArray(maybe) &&
    maybe.filter((aa) => isHexDigit(aa)).length === 3;
}

export default isTwelveBitsInHex;