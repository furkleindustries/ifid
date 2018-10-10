import {
  AGTVersions,
} from '../Enums/AGTVersions';
import {
  IFIDVersions,
} from '../Enums/IFIDVersions';
import {
  IUUID,
} from '../UUID/IUUID';
import {
  NamespaceIds,
} from '../Enums/NamespaceIds';
import {
  TUUIDVersion,
} from '../TypeAliases/TUUIDVersion';

export interface IIFIDOptions {
  version: IFIDVersions;

  /* To be used for any version that requires getting the digest of a file. */
  filepath?: string;

  /* To be used for UUIDv3 and UUIDv5. */
  name?: string;
  namespaceId?: NamespaceIds;

  /* To be used for Z-code releases. */
  releaseNumber?: number;
  serialCode?: string;

  /* To be used for post-1990 Z-code releases. */
  checksum?: string;

  /* To be used for legacy AGT releases. */
  agtVersion?: AGTVersions;
  agtSignature?: string;
  agtLargeOrSoggy?: boolean;

  fileGetter?: (path: string) => Buffer;
  uuidGenerator?: (version: TUUIDVersion) => IUUID;
}

export default IIFIDOptions;