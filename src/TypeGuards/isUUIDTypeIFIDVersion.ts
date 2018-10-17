import {
  IFIDVersions,
} from '../Enums/IFIDVersions';

type UUIDTypeIFIDVersion = IFIDVersions.UUIDv1 | IFIDVersions.UUIDv4;

export const isUUIDTypeIFIDVersion = (maybe: any): maybe is UUIDTypeIFIDVersion => (
  maybe === IFIDVersions.UUIDv1 ||
  maybe === IFIDVersions.UUIDv4
);

export default isUUIDTypeIFIDVersion;