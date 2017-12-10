import {
  TUUIDVersion,
} from '../TypeAliases/TUUIDVersion';

export function isUUIDVersion(version: any): version is TUUIDVersion {
  return version === '1' ||
    version === '3' ||
    version === '4' ||
    version === '5';
}

export default isUUIDVersion;