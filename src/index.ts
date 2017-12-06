/* An RFC-4112 UUID generator for generating IFIDs, or Interactive Fiction
 * Identifiers. */
import {
  randomBytes,
} from 'crypto';
import {
  readFileSync,
} from 'fs';
import {
  networkInterfaces,
} from 'os';

const isNode: boolean = typeof window === 'undefined';

export const strings = {
  ENDIANNESS_INVALID:
    'The endianness of the host machine could not be detected as ' +
    'little-endian or big-endian. This is almost certainly a problem with ' +
    'the ifid package rather than the host machine.',

  UUID_VERSION_INVALID:
    'The version argument was not a valid UUID version.',

  RANDOM_GENERATOR_INVALID:
    'A suitable random number generator could not be found.',

  RANDOM_BYTES_COUNT_INVALID:
    'The num argument, representing the number of random bytes to generate, ' +
    'was not an integer greater than or equal to 1.',

  TIMESTAMP_GENERATION_FAILED:
    'The random number generator did not produce an acceptable value for ' +
    'the random number used in place of a stable timestamp.',

  TIMESTAMP_INVALID:
    'The timestamp property of the UUID object is malformed.',

  CLOCK_SEQUENCE_INVALID:
    'The clockSequence property of the UUID object is malformed.',
    
  CLOCK_SEQUENCE_GENERATION_FAILED:
    'The random number generator did not produce an acceptable value for ' +
    'the random number used in place of a stable clock sequence.',

  CLOCK_SEQUENCE_LOW_INVALID:
    'The clockSequenceLow property of the UUID object is malformed.',

  CLOCK_SEQUENCE_HIGH_INVALID:
    'The clockSequenceHigh property of the UUID object is malformed.',

  CLOCK_HIGH_AND_RESERVED_INVALID:
    'The clockSequenceHighAndReserved property of the UUID object is ' +
    'malformed.',

  MAC_ADDRESS_UNAVAILABLE:
    'The MAC address is unavailable, which makes creating the version 1 ' +
    'node ID impossible.',

  MAC_ADDRESS_INVALID:
    'The MAC address was found, but it was malformed.',

  UUID_STRING_INVALID:
    'The text argument passed to UUID.parse was malformed.',

  UUID_OPTIONS_INVALID:
    'The options argument passed to one of the UUID methods did not meet ' +
    'the isUUIDOptions type guard.',

  TIME_LOW_INVALID:
    'The timestamp property did not produce a valid low portion of the ' +
    'timestamp.',

  TIME_MID_INVALID:
    'The timestamp property did not produce a valid mid portion of the ' +
    'timestamp.',

  TIME_HIGH_INVALID:
    'The timestamp property did not produce a valid high portion of the ' +
    'timestamp.',
    
  TIME_HIGH_AND_VERSION_INVALID:
    'The timestamp property did not produce a valid high-and-version ' +
    'multiplex.',

  NODE_IDENTIFIER_INVALID:
    'The nodeIdentifier property of the UUID object was malformed.',
};

const endianness = ((): 'LE' | 'BE' => {
  const arrayBuffer = new ArrayBuffer(2);
  const uint8 = new Uint8Array(arrayBuffer);
  const uint16 = new Uint16Array(arrayBuffer);
  uint8[0] = 0x00;
  uint8[1] = 0x01;
  if (uint16[0] === 0x1000) {
    return 'LE';
  } else if (uint16[0] === 0x0001) {
    return 'BE';
  } else {
    throw new Error(strings.ENDIANNESS_INVALID);
  }
})();

const randomBytesGenerator = (() => {
  let func: Function;
  if (isNode) {
    func = randomBytes;
  } else if (typeof window.crypto === 'object' &&
    window.crypto &&
    typeof window.crypto.randomBytes === 'function')
  {
    func = window.crypto.randomBytes;
  } else {
    throw new Error(strings.RANDOM_GENERATOR_INVALID);
  }

  return (num: number): Buffer | Uint8Array => {
    if (!(num >= 1 && num % 1 === 0)) {
      throw new Error(strings.RANDOM_BYTES_COUNT_INVALID);
    }

    return func(num);
  };
})();

declare const window: { [key: string]: any; };

export interface IIFIDLastResults {
  node:          TSixBytesInHex;
  timestamp:     TSixtyBitsInHex;
  clockSequence: TFourteenBitsInHex;
}

export function isValidLastResults(maybe: any): maybe is IIFIDLastResults {
  return typeof maybe === 'object' &&
    maybe &&
    isTwoBytesInHex(maybe.node) &&
    isSixtyBitsInHex(maybe.timestamp) &&
    isFourteenBitsInHex(maybe.clockSequence);
}

export interface IIFID {
  id:         IUUID;
  version:    TUUIDVersion;
  toString(): string;
}

export class IFID implements IIFID {
  readonly id:      IUUID;
  readonly version: TUUIDVersion;

  static generate(options: IIFIDOptions): IIFID {
    return new this(options);
  }

  static parse(text: string): IIFID {
    const id = UUID.parse(text);
    const version = id.version;
    const obj = {
      id,
      version,
    };

    return Object.assign(IFID, obj);
  }

  constructor(options: IIFIDOptions) {
    this.id = new UUID(options);
    this.version = options.version;
  }

  toString(): string {
    return this.id.toString();
  }
}

export interface IIFIDOptions extends IUUIDOptions {}

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

export interface IUUID {
  readonly version:                      TUUIDVersion;
  readonly timestamp:                    TSixtyBitsInHex;
  readonly timeLow:                      TFourBytesInHex;
  readonly timeMid:                      TTwoBytesInHex;
  readonly timeHigh:                     TOneByteInHex;
  readonly timeHighAndVersion:           TTwoBytesInHex;
  readonly clockSequence:                TFourteenBitsInHex;
  readonly clockSequenceHighAndReserved: TOneByteInHex;
  readonly clockSequenceLow:             TOneByteInHex;
  readonly nodeIdentifier:               TSixBytesInHex;
  toString():                            string;
}

export class UUID implements IUUID {
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
    if (!isFourBytesInHex(timeLow)) {
      throw new Error(strings.TIME_LOW_INVALID);
    }

    return timeLow;
  }

  get timeMid(): TTwoBytesInHex {
    const mid = (parseInt(this.timestamp.join(''), 16) >> 32) & 0xFFFF;
    const timeMid = <TTwoBytesInHex>mid.toString(16).split('');
    if (!isTwoBytesInHex(timeMid)) {
      throw new Error(strings.TIME_MID_INVALID);
    }

    return timeMid;
  }

  get timeHigh(): TOneByteInHex {
    const high = (parseInt(this.timestamp.join('')) >> 48) & 0x0FFF;
    const timeHigh = <TOneByteInHex>high.toString(16).split('');
    if (!isOneByteInHex(timeHigh)) {
      throw new Error(strings.TIME_HIGH_INVALID);
    }

    return timeHigh;
  }

  get timeHighAndVersion(): TTwoBytesInHex {
    const _timeHigh = parseInt(this.timeHigh.join(''), 16);
    const _version = parseInt(this.version, 16) << 12;
    const high = _timeHigh | _version;
    const timeHigh = <TTwoBytesInHex>high.toString(16).split('');
    if (!isTwoBytesInHex(timeHigh)) {
      throw new Error(strings.TIME_HIGH_AND_VERSION_INVALID);
    }

    return timeHigh;
  }

  private __clockSequence: TFourteenBitsInHex;
  get clockSequence(): TFourteenBitsInHex {
    return this.__clockSequence;
  }
  
  get clockSequenceLow(): TOneByteInHex {
    const low = parseInt(this.clockSequence.join(''), 16) >> 8;
    const clockSequenceLow = <TOneByteInHex>low.toString(16).split('');
    if (!isOneByteInHex(clockSequenceLow)) {
      throw new Error(strings.CLOCK_SEQUENCE_LOW_INVALID);
    }

    return clockSequenceLow;
  }

  get clockSequenceHigh(): TOneByteInHex {
    const high = (parseInt(this.clockSequence.join('')) & 0x3F00) >> 8;
    const clockHigh = <TOneByteInHex>high.toString(16).split('');
    if (!isOneByteInHex(clockHigh)) {
      throw new Error(strings.CLOCK_SEQUENCE_HIGH_INVALID);
    }

    return clockHigh;
  }

  get reserved(): [ '8', '0' ] {
    return [ '8', '0', ];
  }

  get clockSequenceHighAndReserved(): TOneByteInHex {
    const _clockHigh = parseInt(this.clockSequenceHigh.join(''), 16);
    const _reserved = parseInt(this.reserved.join(''), 16);
    const high = _clockHigh | _reserved;
    const clockHigh = <TOneByteInHex>high.toString(16).split('');
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

    const timestamp = <TSixBytesInHex>ts.toString(16).split('');
    if (!isSixBytesInHex(timestamp)) {
      throw new Error(strings.TIMESTAMP_INVALID);
    }

    const csHighReserved = parseInt(split[3].slice(0, split[3].length / 2), 16);
    const csLow = parseInt(split[3].slice(split[3].length / 2), 16);
    const cs = (csHighReserved << 8) | csLow;
    const clockSequence = <TFourteenBitsInHex>cs.toString(2).split('');
    if (!isFourteenBitsInHex(clockSequence)) {
      throw new Error(strings.CLOCK_SEQUENCE_INVALID);
    }

    const nodeIdentifier = <TSixBytesInHex>split[4].split('');
    if (!isSixBytesInHex(nodeIdentifier)) {
      throw new Error(strings.NODE_IDENTIFIER_INVALID);
    }

    const uuid = new UUID({
      skipCreation: true,
      version,
      timestampGetter: () => {},
      clockSequenceGetter: () => {},
      nodeIdentifierGetter: () => {},
    });

    return Object.assign(uuid, {
      __version: version,
      __timestamp: timestamp,
      __clockSequence: clockSequence,
      __nodeIdentifier: nodeIdentifier,
    });
  }

  constructor(options: IUUIDOptions) {
    if (options.skipCreation === true) {
      return;
    }

    if (!isUUIDOptions(options)) {
      throw new Error(strings.UUID_OPTIONS_INVALID);
    }

    const version = options.version;
    if (!isUUIDVersion(version)) {
      throw new Error(strings.UUID_VERSION_INVALID);
    }

    const timestamp = options.timestampGetter();
    if (!isSixtyBitsInHex(timestamp)) {
      throw new Error(strings.TIMESTAMP_GENERATION_FAILED);
    }

    this.__timestamp = timestamp;

    const nodeIdentifier = options.nodeIdentifierGetter();
    if (!isSixBytesInHex(nodeIdentifier)) {
      throw new Error(strings.NODE_IDENTIFIER_INVALID);
    }

    this.__nodeIdentifier = nodeIdentifier;
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

export interface IUUIDOptions {
  skipCreation:         boolean;
  version:              TUUIDVersion;
  nodeIdentifierGetter: Function;
  timestampGetter:      Function;
  clockSequenceGetter:  Function;
};

export function isUUIDOptions(maybe: any): maybe is IUUIDOptions {
  return typeof maybe === 'object' &&
    maybe &&
    isUUIDVersion(maybe.version) &&
    typeof maybe.nodeIdGetter === 'function' &&
    typeof maybe.timestampGetter === 'function' &&
    typeof maybe.clockSequenceGetter === 'function';
}

export class UUIDOptions implements IUUIDOptions {
  skipCreation = false;
  version: TUUIDVersion = '4';
  private __lastResults: IIFIDLastResults | null = null;

  constructor(version?: TUUIDVersion) {
    if (typeof version !== 'undefined' && !isUUIDVersion(version)) {
      throw new Error(strings.UUID_VERSION_INVALID);
    }

    this.version = version || this.version;
    if (version === '1') {
      if (!isNode) {
        throw new Error(strings.MAC_ADDRESS_UNAVAILABLE);
      }

      try {
        const resultsObj = JSON.parse(readFileSync('~/ifid', 'utf8'));
        if (isValidLastResults(resultsObj)) {
          this.__lastResults = resultsObj;
        }
      } catch (e) {
        /* Do nothing. */
      }
    }
  }

  timestampGetter(): TSixtyBitsInHex {
    if (this.version === '1' &&
      this.__lastResults &&
      isSixtyBitsInHex(this.__lastResults.timestamp))
    {
      const lts = this.__lastResults.timestamp.join('');
      const lastTimestamp = parseInt(lts, 16);
      if (lastTimestamp > getHundredsOfNanosecondsSinceGregorianReform() &&
        isFourteenBitsInHex(this.__lastResults.clockSequence))
      {
        const cs = this.__lastResults.clockSequence.join('');
        let csNum = parseInt(cs, 16);
        csNum += 1;
        const bin = csNum.toString(2);
        this.__lastResults.clockSequence = <TFourteenBitsInHex>bin.split('');
      }
      /* Get the last known timestamp. */
      return this.__lastResults.timestamp;
    } else {
      const bufferOrArray = randomBytesGenerator(8);
      let binStr = bufferOrArray.join('');
      if (endianness === 'LE') {
        binStr = binStr.split('').reverse().join('');
      }

      if (binStr.length < 60) {
        throw new Error(strings.RANDOM_BYTES_COUNT_INVALID);
      }

      const values = parseInt(binStr, 8).toString(2).slice(0, 60);
      const hexDigits: Array<THexDigit> = [];
      for (let ii = 0; ii < values.length; ii += 4) {
        const slice = values.slice(ii, ii + 4);
        if (slice.split('').filter((aa: string) => isBit(aa)).length !== 4) {
          throw new Error(strings.TIMESTAMP_GENERATION_FAILED);
        }

        const hexDigit = <THexDigit>parseInt(slice, 2).toString(16);
        hexDigits.push(hexDigit);
      }

      return <TSixtyBitsInHex>hexDigits;
    }
  }

  nodeIdentifierGetter(): TSixBytesInHex {
    if (this.version === '1') { /* Create the node ID from the system time. */
      if (!Array.isArray(networkInterfaces) ||
        !('0' in networkInterfaces) ||
        !('mac' in networkInterfaces[0]))
      {
        throw new Error(strings.MAC_ADDRESS_UNAVAILABLE);
      }

      const rawId = networkInterfaces[0].mac;
      const octets = rawId.split(':');
      if (!isTwoBytesInHex(octets)) {
        throw new Error(strings.MAC_ADDRESS_INVALID);
      }

      /* TODO: set cast bit to multicast (1). */

      return <TSixBytesInHex>octets;
    } else if (/3|4|5/.test(this.version)) {
      const bytes = randomBytesGenerator(6);
      const hex = parseInt(bytes.join(''), 8).toString(16).split('');
      return <TSixBytesInHex>hex;
    } else {
      throw new Error(strings.UUID_VERSION_INVALID);
    }
  }

  clockSequenceGetter(): TFourteenBitsInHex {
    if (isNode && this.__lastResults) {
      const clockSequence = this.__lastResults.clockSequence;
      if (isFourteenBitsInHex(clockSequence)) {
        return clockSequence;
      }
    }

    const values = <Buffer | Uint8Array>randomBytesGenerator(2);
    const bits: Array<TBit> = [];
    let counter = 0;
    for (let value of values) {
      if (counter >= 14) {
        break;
      }

      const _bits = value.toString(2).split('');
      for (let bit of _bits) {
        bits.push(<TBit>bit);
        counter += 1;
        if (counter >= 14) {
          break;
        }
      }
    }

    if (bits.filter((aa) => isBit(aa)).length !== 14) {
      throw new Error(strings.CLOCK_SEQUENCE_GENERATION_FAILED);
    }

    return <TFourteenBitsInHex>bits;
  }
}

export class IFIDOptions extends UUIDOptions {}

export type TUUIDVersion = '1' | '3' | '4' | '5';

export function isUUIDVersion(version: any): version is TUUIDVersion {
  return version === '1' ||
    version === '3' ||
    version === '4' ||
    version === '5';
}

/* Expresses the storage of a single bit. */
export type TBit = '0' | '1';

export function isBit(maybe: any): maybe is TBit {
  return maybe === '0' || maybe === '1';
}

/* Expresses the storage of one nibble, or four bits, or one half-byte. */
export type THexDigit =
  '0' |
  '1' |
  '2' |
  '3' |
  '4' |
  '5' |
  '6' |
  '7' |
  '8' |
  '9' |
  '0' |
  'a' |
  'A' |
  'b' |
  'B' |
  'c' |
  'C' |
  'd' |
  'D' |
  'e' |
  'E' |
  'f' |
  'F';

export function isHexDigit(maybe: any): maybe is THexDigit {
  return /^0123456789abcdef$/i.test(maybe);
}

 /* Expresses the storage of one byte, or eight bits. */
export type TOneByteInHex = [
  THexDigit, /* 1  */
  THexDigit  /* 2  */
];

export function isOneByteInHex(maybe: any): maybe is TOneByteInHex {
  return Array.isArray(maybe) &&
    maybe.filter((aa) => isHexDigit(aa)).length === 2;
}

/* Expresses the storage of 14 bits, or 1.75 bytes. */
export type TFourteenBitsInHex = [
  TBit,      /* 1  */
  TBit,      /* 2  */
  TBit,      /* 3  */
  TBit,      /* 4  */
  TBit,      /* 5  */
  TBit,      /* 6  */
  TBit,      /* 7  */
  TBit,      /* 8  */
  TBit,      /* 9  */
  TBit,      /* 10 */
  TBit,      /* 11 */
  TBit,      /* 12 */
  TBit,      /* 13 */
  TBit       /* 14 */
];

export function isFourteenBitsInHex(maybe: any): maybe is TFourteenBitsInHex {
  return Array.isArray(maybe) &&
    maybe.filter((aa) => isBit(aa)).length === 14;
}

/* Expresses the storage of two bytes, or 16 bits. */
export type TTwoBytesInHex = [
  THexDigit, /* 1  */
  THexDigit, /* 2  */
  THexDigit, /* 3  */
  THexDigit  /* 4  */
];

export function isTwoBytesInHex(maybe: any): maybe is TTwoBytesInHex {
  return Array.isArray(maybe) &&
    maybe.filter((aa) => isHexDigit(aa)).length === 4;
}

/* Expresses the storage of four bytes, or 32 bits. */
export type TFourBytesInHex = [
  THexDigit, /* 1  */
  THexDigit, /* 2  */
  THexDigit, /* 3  */
  THexDigit, /* 4  */
  THexDigit, /* 5  */
  THexDigit, /* 6  */
  THexDigit, /* 7  */
  THexDigit  /* 8  */
];

export function isFourBytesInHex(maybe: any): maybe is TFourBytesInHex {
  return Array.isArray(maybe) &&
    maybe.filter((aa) => isHexDigit(aa)).length === 8;
}

/* Expresses the storage of six bytes, or 48 bits. */
export type TSixBytesInHex = [
  THexDigit, /* 1  */
  THexDigit, /* 2  */
  THexDigit, /* 3  */
  THexDigit, /* 4  */
  THexDigit, /* 5  */
  THexDigit, /* 6  */
  THexDigit, /* 7  */
  THexDigit, /* 8  */
  THexDigit, /* 9  */
  THexDigit, /* 10 */
  THexDigit, /* 11 */
  THexDigit  /* 12 */
];

export function isSixBytesInHex(maybe: any): maybe is TSixBytesInHex {
  return Array.isArray(maybe) &&
    maybe.filter((aa) => isHexDigit(aa)).length === 12;
}

/* Expresses the storage of 15 hex digits, 7.5 bytes, or 60 bits. */
export type TSixtyBitsInHex = [
  THexDigit, /* 1  */
  THexDigit, /* 2  */
  THexDigit, /* 3  */
  THexDigit, /* 4  */
  THexDigit, /* 5  */
  THexDigit, /* 6  */
  THexDigit, /* 7  */
  THexDigit, /* 8  */
  THexDigit, /* 9  */
  THexDigit, /* 10 */
  THexDigit, /* 11 */
  THexDigit, /* 13 */
  THexDigit, /* 14 */
  THexDigit  /* 15 */
];

export function isSixtyBitsInHex(maybe: any): maybe is TSixtyBitsInHex {
  return Array.isArray(maybe) &&
    maybe.filter((aa) => isHexDigit(aa)).length === 15;
}

export function getHundredsOfNanosecondsSinceGregorianReform(): number {
  /* Months start at 0, so 9 is October. */
  return (new Date().getTime() - new Date(1582, 9, 15).getTime()) *
    /* Javascript returns only microseconds, so the value has to be increased
    * an order of magnitude. */
    10;
}