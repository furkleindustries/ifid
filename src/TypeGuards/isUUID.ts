import {
  isUUIDVersion,
} from './isUUIDVersion';
import {
  IUUID,
} from '../UUID/IUUID';
import {
  isFourBytesInHex,
} from './isFourBytesInHex';
import {
  isOneByteInHex,
} from './isOneByteInHex';
import {
  isSixtyBitsInHex,
} from './isSixtyBitsInHex';
import {
  isTwoBytesInHex,
} from './isTwoBytesInHex';
import { isFourteenBits } from './isFourteenBits';
import { isSixBytesInHex } from './isSixBytesInHex';

export function isUUID(maybe: any): maybe is IUUID {
  return typeof maybe === 'object' &&
    maybe &&
    isUUIDVersion(maybe.version) &&
    isSixtyBitsInHex(maybe.timestamp) &&
    isFourBytesInHex(maybe.timeLow) &&
    isTwoBytesInHex(maybe.timeMid) &&
    isOneByteInHex(maybe.timeHigh) &&
    isTwoBytesInHex(maybe.timeHighAndVersion) &&
    isFourteenBits(maybe.clockSequence) &&
    isOneByteInHex(maybe.clockSequenceHighAndReserved) &&
    isOneByteInHex(maybe.clockSequenceLow) &&
    isSixBytesInHex(maybe.nodeIdentifier) &&
    typeof maybe.toString === 'function';
}

export default isUUID;