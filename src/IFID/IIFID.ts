import {
  IUUID,
} from '../UUID/IUUID';
import {
  TUUIDVersion,
} from '../TypeAliases/TUUIDVersion';

export interface IIFID {
  id:         IUUID;
  version:    TUUIDVersion;
  toString(): string;
}

export default IIFID;