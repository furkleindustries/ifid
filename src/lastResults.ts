import {
  readFileSync,
} from 'fs';
import {
  isValidLastResults,
} from './TypeGuards/isValidLastResults';
import {
  homedir,
} from 'os';
import {
  join,
} from 'path';
import {
  TUUIDLastResults,
} from './TypeAliases/TUUIDLastResults';

export const lastResults: TUUIDLastResults = (() => {
  let lastResults: TUUIDLastResults | null = null;
  try {
    const fileStr = readFileSync(join(homedir(), 'ifid'), 'utf8');
    lastResults = JSON.parse(fileStr);
  } catch (e) { /* Do nothing. */ }

  if (isValidLastResults(lastResults)) {
    return lastResults;
  } else {
    return {} as TUUIDLastResults;
  }
})();

export default lastResults;