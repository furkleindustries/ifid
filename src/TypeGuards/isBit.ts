import {
  TBit,
} from '../TypeAliases/TBit';

export function isBit(maybe: any): maybe is TBit {
  return maybe === '0' || maybe === '1';
}

export default isBit;