import {
  isFourBytesInHex,
} from '../TypeGuards/isFourBytesInHex';
import {
  isFourteenBits,
} from '../TypeGuards/isFourteenBits';
import {
  isOneByteInHex,
} from '../TypeGuards/isOneByteInHex';
import {
  isSixBytesInHex,
} from '../TypeGuards/isSixBytesInHex';
import {
  isSixtyBitsInHex,
} from '../TypeGuards/isSixtyBitsInHex';
import {
  isTwelveBitsInHex,
} from '../TypeGuards/isTwelveBitsInHex';
import {
  isTwoBytesInHex,
} from '../TypeGuards/isTwoBytesInHex';
import {
  isUUIDOptions,
} from '../TypeGuards/isUUIDOptions';
import {
  isUUIDVersion,
} from '../TypeGuards/isUUIDVersion';
import {
  IUUID,
} from './IUUID';
import {
  IUUIDOptions,
} from './UUIDOptions/IUUIDOptions';
import {
  strings,
} from '../strings';
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
  TTwelveBitsInHex,
} from '../TypeAliases/TTwelveBitsInHex';
import {
  TTwoBytesInHex,
} from '../TypeAliases/TTwoBytesInHex';
import {
  TUUIDVersion,
} from '../TypeAliases/TUUIDVersion';
import {
  UUIDOptions,
} from './UUIDOptions/UUIDOptions';;

/* The formal Augmented Backus-Naur Form grammar for UUIDs is as follows,
 * courtesy RFC-4112:
 * The formal definition of the UUID string representation is
 * provided by the following ABNF:
 *
 *    UUID                        = time-low "-" time-mid "-"
 *                                  time-high-and-version "-"
 *                                  clock-seq-high-and-reserved
 *                                  clock-seq-low "-" node
 *    time-low                    = 4hexOctet
 *    time-mid                    = 2hexOctet
 *    time-high-and-version       = 2hexOctet
 *    clock-seq-high-and-reserved = hexOctet
 *    clock-seq-low               = hexOctet
 *    node                        = 6hexOctet
 *    hexOctet                    = hexDigit hexDigit
 *    hexDigit =
 *          "0" / "1" / "2" / "3" / "4" / "5" / "6" / "7" / "8" / "9" /
 *          "a" / "b" / "c" / "d" / "e" / "f" /
 *          "A" / "B" / "C" / "D" / "E" / "F"
 */
export class UUID implements IUUID {
  constructor(options: IUUIDOptions = new UUIDOptions()) {
    /* Allow the calling function to generate an empty UUID. */
    if (options && options.skipCreation === true) {
      return;
    }

    if (!isUUIDOptions(options)) {
      throw new Error(strings.UUID_OPTIONS_INVALID);
    }

    const version = options.version;
    if (!isUUIDVersion(version)) {
      throw new Error(strings.UUID_VERSION_INVALID);
    }

    /* Clock sequence is highly dependent on other values and their 
     * availability, so it should be generated first. */
    const clockSequence = options.clockSequenceGetter(version);
    if (!isFourteenBits(clockSequence)) {
      throw new Error(strings.CLOCK_SEQUENCE_INVALID);
    }

    this.__clockSequence = clockSequence;

    const timestamp = options.timestampGetter(version);
    if (!isSixtyBitsInHex(timestamp)) {
      throw new Error(strings.TIMESTAMP_INVALID);
    }

    this.__timestamp = timestamp;

    const nodeIdentifier = options.nodeIdentifierGetter(version);
    if (!isSixBytesInHex(nodeIdentifier)) {
      throw new Error(strings.NODE_IDENTIFIER_INVALID);
    }

    this.__nodeIdentifier = nodeIdentifier;
  }

  private __version: TUUIDVersion;
  get version(): TUUIDVersion {
    return this.__version;
  }

  private __timestamp: TSixtyBitsInHex;
  get timestamp(): TSixtyBitsInHex {
    return this.__timestamp;
  }

  get timeLow(): TFourBytesInHex {
    const low = parseInt(this.timestamp.join(''), 16) & 0xFFFFFFFF;
    const timeLow = <TFourBytesInHex>low.toString(16).split('');

    /* Left-pad with necessary zeroes. */
    for (let ii = timeLow.length; ii < 8; ii += 1) {
      timeLow.unshift('0');
    }

    if (!isFourBytesInHex(timeLow)) {
      throw new Error(strings.TIME_LOW_INVALID);
    }

    return timeLow;
  }

  get timeMid(): TTwoBytesInHex {
    const mid = (parseInt(this.timestamp.join(''), 16) >> 32) & 0xFFFF;
    const timeMid = <TTwoBytesInHex>mid.toString(16).split('');
    
    /* Left-pad with necessary zeroes. */
    for (let ii = timeMid.length; ii < 4; ii += 1) {
      timeMid.unshift('0');
    }

    if (!isTwoBytesInHex(timeMid)) {
      throw new Error(strings.TIME_MID_INVALID);
    }

    return timeMid;
  }

  get timeHigh(): TTwelveBitsInHex {
    const high = (parseInt(this.timestamp.join(''), 16) >> 48) & 0x0FFF;
    const timeHigh = <TTwelveBitsInHex>high.toString(16).split('');

    /* Left-pad with necessary zeroes. */
    for (let ii = timeHigh.length; ii < 3; ii += 1) {
      timeHigh.unshift('0');
    }

    if (!isTwelveBitsInHex(timeHigh)) {
      throw new Error(strings.TIME_HIGH_INVALID);
    }

    return timeHigh;
  }

  get timeHighAndVersion(): TTwoBytesInHex {
    const _timeHigh = parseInt(this.timeHigh.join(''), 16);
    const _version = parseInt(this.version, 16) << 12;
    const high = _timeHigh | _version;
    const timeHigh = <TTwoBytesInHex>high.toString(16).split('');

    /* Left-pad with necessary zeroes. */
    for (let ii = timeHigh.length; ii < 4; ii += 1) {
      timeHigh.unshift('0');
    }

    if (!isTwoBytesInHex(timeHigh)) {
      throw new Error(strings.TIME_HIGH_AND_VERSION_INVALID);
    }

    return timeHigh;
  }

  private __clockSequence: TFourteenBits;
  get clockSequence(): TFourteenBits {
    return this.__clockSequence;
  }
  
  get clockSequenceLow(): TOneByteInHex {
    const low = parseInt(this.clockSequence.join(''), 2) >> 8;
    const clockSequenceLow = <TOneByteInHex>low.toString(16).split('');

    /* Left-pad with necessary zeroes. */
    for (let ii = clockSequenceLow.length; ii < 2; ii += 1) {
      clockSequenceLow.unshift('0');
    }

    if (!isOneByteInHex(clockSequenceLow)) {
      throw new Error(strings.CLOCK_SEQUENCE_LOW_INVALID);
    }

    return clockSequenceLow;
  }

  get clockSequenceHigh(): TOneByteInHex {
    const high = (parseInt(this.clockSequence.join(''), 2) & 0x3F00) >> 8;
    const clockHigh = <TOneByteInHex>high.toString(16).split('');

    /* Left-pad with necessary zeroes. */
    for (let ii = clockHigh.length; ii < 2; ii += 1) {
      clockHigh.unshift('0');
    }

    if (!isOneByteInHex(clockHigh)) {
      throw new Error(strings.CLOCK_SEQUENCE_HIGH_INVALID);
    }

    return clockHigh;
  }

  get reserved(): [ '0', '8' ] {
    return [ '0', '8', ];
  }

  get clockSequenceHighAndReserved(): TOneByteInHex {
    const _clockHigh = parseInt(this.clockSequenceHigh.join(''), 16);
    const _reserved = parseInt(this.reserved.join(''), 16);
    const high = _clockHigh | _reserved;
    const clockHigh = <TOneByteInHex>high.toString(16).split('');

    /* Left-pad with necessary zeroes. */
    for (let ii = clockHigh.length; ii < 2; ii += 1) {
      clockHigh.unshift('0');
    }

    if (!isOneByteInHex(clockHigh)) {
      throw new Error(strings.CLOCK_HIGH_AND_RESERVED_INVALID);
    }

    return clockHigh;
  }

  private __nodeIdentifier: TSixBytesInHex;
  get nodeIdentifier(): TSixBytesInHex {
    return this.__nodeIdentifier;
  }

  static parse(text: string): IUUID {
    const split = text.split('-');
    if (split.length !== 5) {
      throw new Error(strings.UUID_STRING_INVALID);
    }

    const version = <TUUIDVersion>parseInt(split[2], 16).toString();
    if (!isUUIDVersion(version)) {
      throw new Error(strings.UUID_VERSION_INVALID);
    }

    const tsNum = parseInt(split[0] + split[1] + split[2], 16);
    const num = (tsNum >> 64);
    const ts = 0 |
      ((num & 0x0000000000000fff) << 48) |
      ((num & 0x00000000ffff0000) << 16) |
      ((num & 0xffffffff00000000) >> 32);

    const timestamp = <TSixtyBitsInHex>ts.toString(16).split('');
    if (!isSixtyBitsInHex(timestamp)) {
      throw new Error(strings.TIMESTAMP_INVALID);
    }

    const csHighReserved = parseInt(split[3].slice(0, split[3].length / 2), 16);
    const csLow = parseInt(split[3].slice(split[3].length / 2), 16);
    const cs = (csHighReserved << 8) | csLow;
    const clockSequence = <TFourteenBits>cs.toString(2).split('');
    if (!isFourteenBits(clockSequence)) {
      throw new Error(strings.CLOCK_SEQUENCE_INVALID);
    }

    const nodeIdentifier = <TSixBytesInHex>split[4].split('');
    if (!isSixBytesInHex(nodeIdentifier)) {
      throw new Error(strings.NODE_IDENTIFIER_INVALID);
    }

    return Object.assign({}, this.prototype, {
      __version: version,
      __timestamp: timestamp,
      __clockSequence: clockSequence,
      __nodeIdentifier: nodeIdentifier,
    });
  }

  toString(): string {
    return this.timeLow.join('') +
      '-' +
      this.timeMid.join('') +
      '-' +
      this.timeHighAndVersion.join('') +
      '-' +
      this.clockSequenceHighAndReserved.join('') +
      this.clockSequenceLow.join('') +
      '-' +
      this.nodeIdentifier.join('');
  }
}