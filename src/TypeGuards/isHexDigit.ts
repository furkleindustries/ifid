import {
  THexDigit,
} from '../TypeAliases/THexDigit';

export function isHexDigit(maybe: any): maybe is THexDigit {
  return /^[0123456789abcdef]$/i.test(maybe);
}

export default isHexDigit;