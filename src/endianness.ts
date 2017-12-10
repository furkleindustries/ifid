import {
  strings,
} from './strings';

export const endianness = ((): 'LE' | 'BE' => {
  const arrayBuffer = new ArrayBuffer(2);
  const uint8 = new Uint8Array(arrayBuffer);
  const uint16 = new Uint16Array(arrayBuffer);
  uint8[0] = 0x00;
  uint8[1] = 0x01;
  if (uint16[0] === 0x100) {
    return 'LE';
  } else if (uint16[0] === 0x001) {
    return 'BE';
  } else {
    throw new Error(strings.ENDIANNESS_INVALID);
  }
})();

export default endianness;