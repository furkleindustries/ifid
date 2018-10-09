import {
  IFIDVersions,
} from '../Enums/IFIDVersions';

export const isIFIDVersion = (maybe: any): maybe is IFIDVersions => {
  return (Object as any).values(IFIDVersions).indexOf(maybe) !== -1;
};

export default isIFIDVersion;