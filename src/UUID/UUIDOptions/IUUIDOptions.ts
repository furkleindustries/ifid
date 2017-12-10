import {
  TFourteenBits,
} from '../../TypeAliases/TFourteenBits';
import {
  TSixBytesInHex,
} from '../../TypeAliases/TSixBytesInHex';
import {
  TSixtyBitsInHex,
} from '../../TypeAliases/TSixtyBitsInHex';
import {
  TUUIDVersion,
} from '../../TypeAliases/TUUIDVersion';

export interface IUUIDOptions {
  skipCreation:         boolean;
  version:              TUUIDVersion;
  nodeIdentifierGetter: (version: TUUIDVersion) => TSixBytesInHex;
  timestampGetter:      (version: TUUIDVersion) => TSixtyBitsInHex;
  clockSequenceGetter:  (version: TUUIDVersion) => TFourteenBits;
};

export default IUUIDOptions;