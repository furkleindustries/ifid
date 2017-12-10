import {
  readFileSync,
} from 'fs';
import {
  homedir,
} from 'os';
import {
  join,
} from 'path';

import {
  TUUIDLastResults,
} from './TypeAliases/TUUIDLastResults';

export const lastResults: TUUIDLastResults | {} = (() => {
  let lastResults: TUUIDLastResults | null = null;
  try {
    const fileStr = readFileSync(join(homedir(), 'ifid'), 'utf8');
    lastResults = JSON.parse(fileStr);
  } catch (e) { /* Do nothing. */ }

  if (typeof lastResults === 'object' && lastResults) {
    return lastResults;
  } else {
    return {};
  }
})();

export default lastResults;