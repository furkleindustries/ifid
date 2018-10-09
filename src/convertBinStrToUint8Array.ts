export const convertBinStrToUint8Array = (binStr: string): Uint8Array => {
  const len = binStr.length;
  const inputArr = [];
  for (let ii = len; ii > 0; ii -= 8) {
    const byte = binStr.slice(ii - 8, ii).padStart(8, '0');
    inputArr.unshift(parseInt(byte, 2));
  }

  return new Uint8Array(inputArr);
};

export default convertBinStrToUint8Array;