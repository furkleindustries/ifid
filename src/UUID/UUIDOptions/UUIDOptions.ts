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
  skipCreation = false;
  version: TUUIDVersion = '4';

  constructor(version?: TUUIDVersion) {
    if ('0' in arguments && !isUUIDVersion(version)) {
      throw new Error(strings.UUID_VERSION_INVALID);
    }

    this.version = version || this.version;
    if (/^[^1345]$/.test(this.version)) {
      throw new Error(strings.UUID_VERSION_INVALID);
    }
  }

  timestampGetter      = timestampGetter;
  nodeIdentifierGetter = nodeIdentifierGetter;
  clockSequenceGetter  = clockSequenceGetter;
}

export default UUIDOptions;