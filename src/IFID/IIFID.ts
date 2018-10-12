import {
  IFIDVersions,
} from '../Enums/IFIDVersions';

export interface IIFID {
  uuid?: { toString(): string, };
  version: IFIDVersions;
  toString(): string;
}

export default IIFID;