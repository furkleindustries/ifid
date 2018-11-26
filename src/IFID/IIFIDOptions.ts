import {
  AGTVersions,
} from '../Enums/AGTVersions';
import {
  IFIDVersions,
} from '../Enums/IFIDVersions';

export interface IIFIDOptions {
  version: IFIDVersions;

  name?: string;

  /* To be used for any version that requires getting the digest of a file. */
  fileContents?: string;

  /* To be used for Z-code releases. */
  releaseNumber?: number;
  serialCode?: string;

  /* To be used for post-1990 Z-code releases. */
  checksum?: string;

  /* To be used for legacy AGT releases. */
  agtVersion?: AGTVersions;
  agtSignature?: string;
  agtLargeOrSoggy?: boolean;

  uuidGenerator?: (version: IFIDVersions.UUIDv1 | IFIDVersions.UUIDv4) => string;
}

export default IIFIDOptions;