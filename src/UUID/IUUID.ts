import {
  TFourBytesInHex,
} from '../TypeAliases/TFourBytesInHex';
import {
  TFourteenBits,
} from '../TypeAliases/TFourteenBits';
import {
  TOneByteInHex,
} from '../TypeAliases/TOneByteInHex';
import {
  TSixBytesInHex,
} from '../TypeAliases/TSixBytesInHex';
import {
  TSixtyBitsInHex,
} from '../TypeAliases/TSixtyBitsInHex';
import {
  TTwoBytesInHex,
} from '../TypeAliases/TTwoBytesInHex';
import {
  TUUIDVersion,
} from '../TypeAliases/TUUIDVersion';

export interface IUUID {
  readonly version:                      TUUIDVersion;
  readonly timestamp:                    TSixtyBitsInHex;
  readonly timeLow:                      TFourBytesInHex;
  readonly timeMid:                      TTwoBytesInHex;
  readonly timeHigh:                     TOneByteInHex;
  readonly timeHighAndVersion:           TTwoBytesInHex;
  readonly clockSequence:                TFourteenBits;
  readonly clockSequenceHighAndReserved: TOneByteInHex;
  readonly clockSequenceLow:             TOneByteInHex;
  readonly nodeIdentifier:               TSixBytesInHex;
  toString():                            string;
}

export default IUUID;