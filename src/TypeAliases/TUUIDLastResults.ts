import {
  TSixBytesInHex,
} from './TSixBytesInHex';
import {
  TSixtyBitsInHex,
} from './TSixtyBitsInHex';
import {
  TFourteenBits,
} from './TFourteenBits';

export type TUUIDLastResults = {
  nodeIdentifier:          TSixBytesInHex;
  timestamp:     TSixtyBitsInHex;
  clockSequence: TFourteenBits;
};

export default TUUIDLastResults;