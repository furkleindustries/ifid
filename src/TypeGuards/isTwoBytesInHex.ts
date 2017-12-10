import {
  isHexDigit,
} from './isHexDigit';
import {
  TTwoBytesInHex,
} from '../TypeAliases/TTwoBytesInHex';

export function isTwoBytesInHex(maybe: any): maybe is TTwoBytesInHex {
  return Array.isArray(maybe) &&
    maybe.filter((aa) => isHexDigit(aa)).length === 4;
}

export default isTwoBytesInHex;