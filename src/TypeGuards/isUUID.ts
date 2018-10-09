
import {
  IUUID,
} from '../UUID/IUUID';

export function isUUID(maybe: any): maybe is IUUID {
  return typeof maybe === 'object' &&
    maybe &&
    maybe.version &&
    maybe.timestamp &&
    maybe.timeLow &&
    maybe.timeMid &&
    maybe.timeHigh &&
    maybe.timeHighAndVersion &&
    maybe.clockSequence &&
    maybe.clockSequenceHighAndReserved &&
    maybe.clockSequenceLow &&
    maybe.nodeIdentifier &&
    typeof maybe.toString === 'function';
}

export default isUUID;