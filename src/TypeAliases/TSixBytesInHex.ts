import {
  THexDigit,
} from './THexDigit';

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

export default TSixBytesInHex;