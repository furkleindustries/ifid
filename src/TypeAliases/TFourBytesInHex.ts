import {
  THexDigit,
} from './THexDigit';

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

export default TFourBytesInHex;