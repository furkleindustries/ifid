import {
  TBit,
} from './TBit';

/* Expresses the storage of 14 bits, or 1.75 bytes. */
export type TFourteenBits = [
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

export default TBit;