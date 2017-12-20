import {
  IIFID,
} from '../IFID/IIFID';
import {
  isUUID,
} from './isUUID';
import {
  isUUIDVersion,
} from './isUUIDVersion';

export function isIFID(maybe: any): maybe is IIFID {
  return typeof maybe === 'object' &&
    maybe &&
    isUUID(maybe.id) &&
    isUUIDVersion(maybe.version) &&
    typeof maybe.toString === 'function';
}

export default isIFID;