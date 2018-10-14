import {
  AGTVersions,
} from '../Enums/AGTVersions';
import {
  IFIDVersions,
} from '../Enums/IFIDVersions';
import {
  TNamespaceId,
  TUUIDVersion,
} from 'big-uuid';

export interface IIFIDOptions {
  version: IFIDVersions;

  /* To be used for any version that requires getting the digest of a file. */
  fileContents?: string | Buffer | DataView;

  /* To be used for UUIDv3 and UUIDv5. */
  name?: string;
  namespaceId?: TNamespaceId;

  /* To be used for Z-code releases. */
  releaseNumber?: number;
  serialCode?: string;

  /* To be used for post-1990 Z-code releases. */
  checksum?: string;

  /* To be used for legacy AGT releases. */
  agtVersion?: AGTVersions;
  agtSignature?: string;
  agtLargeOrSoggy?: boolean;

  uuidGenerator?: (version: TUUIDVersion) => { toString(): string };
}

export default IIFIDOptions;