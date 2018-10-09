export const uintArrayAsNumber = (uintArray: Uint8Array | Uint16Array | Uint32Array): number => {
  return parseInt(Buffer.from(uintArray as any).toString('hex'), 16);
};

export default uintArrayAsNumber;