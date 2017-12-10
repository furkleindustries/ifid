import {
  isHexDigit,
} from './isHexDigit';
import {
  TFourBytesInHex,
} from '../TypeAliases/TFourBytesInHex';

export function isFourBytesInHex(maybe: any): maybe is TFourBytesInHex {
  return Array.isArray(maybe) &&
    maybe.filter((aa) => isHexDigit(aa)).length === 8;
}

export default isFourBytesInHex;