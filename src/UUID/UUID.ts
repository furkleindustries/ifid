import {
  isNode,
} from '../isNode';
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
  numberAsLittleEndianHexStr,
} from '../numberAsLittleEndianHexStr';
import {
  strings,
} from '../strings';
import {
  TUUIDVersion,
} from '../TypeAliases/TUUIDVersion';
import {
  uintArrayAsNumber,
} from '../uintArrayAsNumber';
import {
  UUIDOptions,
} from './UUIDOptions/UUIDOptions';
import {
  writeNewResults,
} from '../writeNewResults';

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
  constructor(options?: Partial<IUUIDOptions>) {
    const opts = new UUIDOptions();

    if (typeof options === 'object' && options) {
      if (options.version) {
        opts.version = options.version;
      }

      if (options.clockSequenceGetter) {
        opts.clockSequenceGetter = options.clockSequenceGetter;
      }

      if (options.timestampGetter) {
        opts.timestampGetter = options.timestampGetter;
      }

      if (options.nodeIdentifierGetter) {
        opts.nodeIdentifierGetter = options.nodeIdentifierGetter;
      }

      if (options.namespaceId) {
        opts.namespaceId = options.namespaceId;
      }

      if (options.name) {
        opts.name = options.name;
      }
    }

    const version = opts.version;
    if (!isUUIDVersion(version)) {
      throw new Error(strings.UUID_VERSION_INVALID);
    }

    if (!isNode()) {
      if (version.toString() === '1') {
        console.error('The time-based version 1 UUID cannot be created ' +
                      'within the browser. Falling back to the ' +
                      'pseudo-random version 4.');
      }
    }

    this.__version = version;
    
    if (/^[35]$/.test(version.toString())) {
      /* Clock sequence is highly dependent on other values and their 
       * availability, so it should be generated first. */
      const clockSequence = opts.clockSequenceGetter(
        version,
        opts.namespaceId,
        opts.name
      );

      this.__clockSequence = clockSequence;
      
      const timestamp = opts.timestampGetter(
        version,
        opts.namespaceId,
        opts.name,
      );
      
      this.__timestamp = timestamp;

      const nodeIdentifier = opts.nodeIdentifierGetter(
        version,
        opts.namespaceId,
        opts.name,
      );

      this.__nodeIdentifier = nodeIdentifier;
    } else {
      const clockSequence = opts.clockSequenceGetter(version);
      this.__clockSequence = clockSequence;
      
      const timestamp = opts.timestampGetter(version);
      this.__timestamp = timestamp;
      
      const nodeIdentifier = opts.nodeIdentifierGetter(version);
      this.__nodeIdentifier = nodeIdentifier;
      
      if (isNode() && this.version.toString() === '1') {
        writeNewResults(this);
      }
    }

    /* Obviously we can't serialize state to file in the browser. */
  }

  /* Parsed into 4 bits. */
  private __version: TUUIDVersion;
  get version(): TUUIDVersion {
    return this.__version;
  }

  /* 60 bits */
  private __timestamp: Uint8Array;
  get timestamp(): Uint8Array {
    return this.__timestamp;
  }

  /* 4 bytes */
  get timeLow(): Uint8Array {
    const timeLow = this.timestamp.slice(4, 8);
    return timeLow;
  }

  /* 2 bytes */
  get timeMid(): Uint8Array {
    const timeMid = this.timestamp.slice(2, 4);
    return timeMid;
  }

  /* 12 bits */
  get timeHigh(): Uint8Array {
    const timeHigh = this.timestamp.slice(0, 2);
    return timeHigh;
  }

  /* 2 bytes */
  get timeHighAndVersion(): Uint8Array {
    const timeHigh = this.timeHigh;
    const version = parseInt(this.version.toString()).toString(2);
    const timeHighNum = uintArrayAsNumber(timeHigh).toString(2);
    const binStr = version.padStart(4, '0') + timeHighNum.padStart(12, '0');
    const firstByte = parseInt(binStr.slice(0, 8), 2);
    const secondByte = parseInt(binStr.slice(8, 16), 2);
    return new Uint8Array([ firstByte, secondByte, ]);
  }

  /* 14 bits */
  private __clockSequence: Uint8Array;
  get clockSequence(): Uint8Array {
    return this.__clockSequence;
  }

  /* 1 byte */
  get clockSequenceLow(): Uint8Array {
    return this.clockSequence.slice(0, 1);
  }

  /* 1 byte */
  get clockSequenceHigh(): Uint8Array {
    return this.clockSequence.slice(1);
  }

  get reserved(): Uint8Array {
    return new Uint8Array([ 2, ]);
  }

  get clockSequenceHighAndReserved(): Uint8Array {
    const clockHigh = uintArrayAsNumber(this.clockSequenceHigh).toString(2);
    const reserved = uintArrayAsNumber(this.reserved).toString(2);
    const byte = clockHigh.padStart(6, '0') + reserved.padStart(2, '0');
    return new Uint8Array([ parseInt(byte, 2), ]);
  }

  /* 6 bytes */
  private __nodeIdentifier: Uint8Array;
  get nodeIdentifier(): Uint8Array {
    return this.__nodeIdentifier;
  }

  /* text: e.g. 103314af-205e-0080-002b-7cd2a900a098 */
  static parse(text: string): IUUID {
    const split = text.split('-');
    if (split.length !== 5) {
      throw new Error(strings.UUID_STRING_INVALID);
    }

    const leHexToBeHex = (leHex: string) => (
      parseInt(
        parseInt(leHex, 16).toString(2).split('').reverse().join(),
        2
      ).toString(16)
    );

    const timeLow = leHexToBeHex(split[0]);
    const timeMid = leHexToBeHex(split[1]);
    const timeHighAndVersion = leHexToBeHex(split[2]);

    const timeHigh = timeHighAndVersion.slice(0, 3);
    const version = timeHighAndVersion[4];

    const timestampHex = timeHigh + timeMid + timeLow;
    const timestampArr = [];
    for (let ii = 0; ii < 16; ii += 2) {
      timestampArr.push(parseInt(timestampHex.slice(ii, ii + 2), 16));
    }

    const timestamp = new Uint8Array(timestampArr);

    const clockSequenceHighAndReservedAndLow = leHexToBeHex(split[3]);
    const clockSequenceHighAndReservedHex =
      clockSequenceHighAndReservedAndLow.slice(0, 2);
    const clockSequenceHighHex =
      parseInt(
        parseInt(clockSequenceHighAndReservedHex, 16).toString(2).slice(2),
        2
      ).toString(16);

    const clockSequenceLowHex =
      clockSequenceHighAndReservedAndLow.slice(2, 4);

    const clockSequenceHex = clockSequenceLowHex + clockSequenceHighHex;
    const clockSequenceArr = [];
    for (let ii = 0; ii < 7; ii += 2) {
      clockSequenceArr.push(parseInt(clockSequenceHex.slice(ii, ii + 2), 16));
    }

    const clockSequence = new Uint8Array(clockSequenceArr);

    const nodeIdentifierHex = leHexToBeHex(split[4]);
    const nodeIdentifierArr = [];
    for (let ii = 0; ii < 12; ii += 2) {
      nodeIdentifierArr.push(parseInt(nodeIdentifierHex.slice(ii, ii + 2), 16));
    }

    const nodeIdentifier = new Uint8Array(nodeIdentifierArr);

    return Object.assign({}, this.prototype, {
      __version: version,
      __timestamp: timestamp,
      __clockSequence: clockSequence,
      __nodeIdentifier: nodeIdentifier,
    });
  }

  toString(): string {
    const format = (value: Uint8Array, toPad: number = 0) => (
      numberAsLittleEndianHexStr(uintArrayAsNumber(value))
        /* Pad any missing most-significant-digits. */
        .padEnd(toPad, '0')
    );

    return (
      format(this.timeLow, 8) +
      '-' +
      format(this.timeMid, 4) +
      '-' +
      format(this.timeHighAndVersion, 4) +
      '-' +
      format(this.clockSequenceHighAndReserved, 2) +
      format(this.clockSequenceLow, 2) +
      '-' +
      format(this.nodeIdentifier, 12)
    );
  }
}

export default UUID;