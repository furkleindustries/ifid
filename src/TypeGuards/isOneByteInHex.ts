import {
  isHexDigit,
} from './isHexDigit';
import {
  TOneByteInHex,
} from '../TypeAliases/TOneByteInHex';

export function isOneByteInHex(maybe: any): maybe is TOneByteInHex {
  return Array.isArray(maybe) &&
    maybe.filter((aa) => isHexDigit(aa)).length === 2;
}

export default isOneByteInHex;