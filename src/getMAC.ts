import {
  isSixBytesInHex,
} from './TypeGuards/isSixBytesInHex';
import {
  networkInterfaces,
} from 'os';
import {
  strings,
} from './strings';
import {
  TSixBytesInHex,
} from './TypeAliases/TSixBytesInHex';

export function getMAC(): TSixBytesInHex {
  const interfaces = networkInterfaces();
  const interfaceNames = Object.keys(interfaces);
  for (let ii = 0; ii < interfaceNames.length; ii += 1) {
    const interfaceName = interfaceNames[ii];
    const inter = interfaces[interfaceName];
    for (let jj = 0; jj < inter.length; jj += 1) {
      const val = inter[jj];
      if (typeof val === 'object' && val) {
        const mac = val.mac;
        const empty = '00:00:00:00:00:00';
        if (typeof mac === 'string' && mac && mac !== empty) {
          const bytes = mac.split(':').join('').split('');
          if (!isSixBytesInHex(bytes)) {
            throw new Error(strings.MAC_ADDRESS_INVALID);
          }

          /* TODO: set cast bit to multicast (1). */

          return bytes;
        }
      }
    }
  }

  throw new Error(strings.MAC_ADDRESS_UNAVAILABLE);
}

export default getMAC;