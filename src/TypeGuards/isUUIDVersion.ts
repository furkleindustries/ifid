import {
  TUUIDVersion,
} from '../TypeAliases/TUUIDVersion';

export function isUUIDVersion(version: any): version is TUUIDVersion {
  return /^[1345]$/.test(version.toString());
}

export default isUUIDVersion;