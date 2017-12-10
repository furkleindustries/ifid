import {
  isBit,
} from './isBit';
import {
  TFourteenBits,
} from '../TypeAliases/TFourteenBits';

export function isFourteenBits(maybe: any): maybe is TFourteenBits {
  return Array.isArray(maybe) && maybe.filter((aa) => isBit(aa)).length === 14;
}

export default isFourteenBits;