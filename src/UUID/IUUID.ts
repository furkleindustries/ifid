import {
  TUUIDVersion,
} from '../TypeAliases/TUUIDVersion';

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
  /* Parsed into 4 bits. */
  readonly version:                      TUUIDVersion;

  /* 60 bits */
  readonly timestamp:                    Uint8Array;

  /* 4 bytes */
  readonly timeLow:                      Uint8Array;

  /* 2 bytes */
  readonly timeMid:                      Uint8Array;

  /* 12 bits */
  readonly timeHigh:                     Uint8Array;

  /* 2 bytes */
  readonly timeHighAndVersion:           Uint8Array;

  /* 14 bits */
  readonly clockSequence:                Uint8Array;

  /* 1 byte */
  readonly clockSequenceHighAndReserved: Uint8Array;

  /* 1 byte */
  readonly clockSequenceLow:             Uint8Array;

  /* 6 bits */
  readonly clockSequenceHigh:            Uint8Array;

  /* 2 bits */
  readonly reserved:                     Uint8Array;  

  /* 6 bytes */
  readonly nodeIdentifier:               Uint8Array;

  toString():                            string;
}

export default IUUID;