import {
  IFIDVersions,
} from '../Enums/IFIDVersions';
import {
  IUUID,
} from '../UUID/IUUID';

export interface IIFID {
  uuid?: IUUID;
  version: IFIDVersions;
  toString(): string;
}

export default IIFID;