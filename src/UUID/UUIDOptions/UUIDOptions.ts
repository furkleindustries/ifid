import {
  clockSequenceGetter,
} from '../../clockSequenceGetter';
import {
  isUUIDVersion,
} from '../../TypeGuards/isUUIDVersion';
import {
  IUUIDOptions,
} from './IUUIDOptions';
import {
  NamespaceIds,
} from '../../Enums/NamespaceIds';
import {
  nodeIdentifierGetter,
} from '../../nodeIdentifierGetter';
import {
  strings,
} from '../../strings';
import {
  timestampGetter,
} from '../../timestampGetter';
import {
  TUUIDVersion,
} from '../../TypeAliases/TUUIDVersion';

export class UUIDOptions implements IUUIDOptions {
  version: TUUIDVersion = '4';
  clockSequenceGetter = clockSequenceGetter;
  nodeIdentifierGetter = nodeIdentifierGetter;
  timestampGetter = timestampGetter;
  name?: string;
  namespaceId?: NamespaceIds;

  constructor(_args: { [key: string]: any } = {}) {
    const args = _args || {};
    if (args.version) {
      if (!isUUIDVersion(args.version)) {
        throw new Error(strings.UUID_VERSION_INVALID);
      }

      this.version = args.version;
    }

    if (typeof args.clockSequenceGetter === 'function') {
      this.clockSequenceGetter = args.clockSequenceGetter;
    }

    if (typeof args.nodeIdentifierGetter === 'function') {
      this.nodeIdentifierGetter = args.nodeIdentifierGetter; 
    }

    if (typeof args.timestampGetter === 'function') {
      this.timestampGetter = args.timestampGetter;
    }

    if (args.name && typeof args.name === 'string') {
      this.name = args.name;
    }

    if (args.namespaceId && typeof args.namespaceId === 'string') {
      this.namespaceId = args.namespaceId as NamespaceIds;
    }

    if (/^[35]$/.test(this.version.toString())) {
      if (!this.namespaceId) {
        throw new Error(strings.NAMESPACE_ID_MISSING);
      } else if (!this.name) {
        throw new Error(strings.NAME_MISSING);
      }
    }
  }
}

export default UUIDOptions;