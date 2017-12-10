import {
  THexDigit,
} from './THexDigit';

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

export default TSixtyBitsInHex;