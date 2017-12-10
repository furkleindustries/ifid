import {
  binaryToHexLookup,
} from './binaryToHexLookup';
import {
  isBit,
} from './TypeGuards/isBit';
import {
  strings,
} from './strings';
import {
  TBit,
} from './TypeAliases/TBit';
import {
  THexDigit,
} from './TypeAliases/THexDigit';

export function binaryToHexDigits(binary: Array<TBit>, digits?: number): Array<THexDigit> {
  if (!Array.isArray(binary) ||
    binary.length <= 0 ||
    binary.filter((aa) => isBit(aa)).length !== binary.length)
  {
    throw new Error(strings.BIT_ARRAY_INVALID);
  }

  const hexes: Array<THexDigit> = [];
  for (let ii = 0; ii < binary.length; ii += 4) {
    const slice = binary.slice(ii, ii + 4);
    hexes.push(binaryToHexLookup[slice.join('')]);
  }

  const digs = Number(digits);
  if ('2' in arguments && !Number.isNaN(digs)) {
    for (let ii = hexes.length; ii < digs; ii += 1) {
      hexes.unshift('0');
    }
  }

  return hexes;
}

export default binaryToHexDigits;