import {
  THexDigit,
} from './THexDigit';

/* Expresses the storage of two bytes, or 16 bits. */
export type TTwoBytesInHex = [
  THexDigit, /* 1  */
  THexDigit, /* 2  */
  THexDigit, /* 3  */
  THexDigit  /* 4  */
];

export default TTwoBytesInHex;