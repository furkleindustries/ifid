import {
  networkInterfaces,
} from 'os';
import {
  strings,
} from './strings';

export function getMAC(): Uint8Array {
  const interfaces = networkInterfaces();
  const interfaceNames = Object.keys(interfaces);
  for (let ii = 0; ii < interfaceNames.length; ii += 1) {
    const interfaceName = interfaceNames[ii];
    const _interface = interfaces[interfaceName];
    for (let jj = 0; jj < _interface.length; jj += 1) {
      const val = _interface[jj];
      if (typeof val === 'object' && val) {
        const mac = val.mac;
        const empty = '00:00:00:00:00:00';
        if (typeof mac === 'string' && mac && mac !== empty) {
          const bytes = mac
            .split(':')
            .map((byteStr) => parseInt(byteStr, 16));

          /* TODO: set cast bit to multicast (1). */

          return new Uint8Array(bytes);
        }
      }
    }
  }

  throw new Error(strings.MAC_ADDRESS_UNAVAILABLE);
}

export default getMAC;