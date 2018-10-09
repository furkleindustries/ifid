import {
  TUUIDVersion,
} from '../../TypeAliases/TUUIDVersion';
import {
  NamespaceIds,
} from '../../Enums/NamespaceIds';

export interface IUUIDOptions {
  version: TUUIDVersion;
  name?: string;
  namespaceId?: NamespaceIds;
  nodeIdentifierGetter: (version: TUUIDVersion, namespaceId?: NamespaceIds, name?: string) => Uint8Array;
  timestampGetter:      (version: TUUIDVersion, namespaceId?: NamespaceIds, name?: string) => Uint8Array;
  clockSequenceGetter:  (version: TUUIDVersion, namespaceId?: NamespaceIds, name?: string) => Uint8Array;
};

export default IUUIDOptions;