export const numberAsLittleEndianHexStr = (num: number): string => {
  const bin = num.toString(2);
  let littleEndianHex = '';

  for (let ii = 0; ii < bin.length; ii += 4) {
    const nibble = bin.slice(ii, ii + 4);
    littleEndianHex = parseInt(nibble, 2).toString(16) + littleEndianHex;
  }

  return littleEndianHex;
};

export default numberAsLittleEndianHexStr;