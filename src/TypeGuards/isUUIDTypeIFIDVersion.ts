import {
  IFIDVersions,
} from '../Enums/IFIDVersions';

type UUIDTypeIFIDVersion = IFIDVersions.UUIDv1 | IFIDVersions.UUIDv3 | IFIDVersions.UUIDv4 | IFIDVersions.UUIDv5;

export const isUUIDTypeIFIDVersion = (maybe: any): maybe is UUIDTypeIFIDVersion => (
  maybe === IFIDVersions.UUIDv1 ||
  maybe === IFIDVersions.UUIDv3 ||
  maybe === IFIDVersions.UUIDv4 ||
  maybe === IFIDVersions.UUIDv5
);

export default isUUIDTypeIFIDVersion;