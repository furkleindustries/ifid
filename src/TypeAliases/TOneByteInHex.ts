import {
  THexDigit,
} from '../TypeAliases/THexDigit';

/* Expresses the storage of one byte, or eight bits. */
 export type TOneByteInHex = [
  THexDigit, /* 1  */
  THexDigit  /* 2  */
];

export default TOneByteInHex;