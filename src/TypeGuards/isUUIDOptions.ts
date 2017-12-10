import {
  isUUIDVersion,
} from './isUUIDVersion';
import {
  IUUIDOptions,
} from '../UUID/UUIDOptions/IUUIDOptions';

export function isUUIDOptions(maybe: any): maybe is IUUIDOptions {
  return typeof maybe === 'object' &&
    maybe &&
    isUUIDVersion(maybe.version) &&
    typeof maybe.nodeIdentifierGetter === 'function' &&
    typeof maybe.timestampGetter === 'function' &&
    typeof maybe.clockSequenceGetter === 'function';
}

export default isUUIDOptions;