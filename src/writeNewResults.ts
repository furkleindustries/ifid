import {
  writeFileSync,
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
  strings,
} from './strings';
import {
  TUUIDLastResults,
} from './TypeAliases/TUUIDLastResults';

export const writeNewResults = (lastResults: TUUIDLastResults) => {
  if (!isValidLastResults(lastResults)) {
    throw new Error(strings.UUID_LAST_RESULTS_INVALID);
  }

  const formattedLastResults = {
    clockSequence:  Array.from(lastResults.clockSequence),
    nodeIdentifier: Array.from(lastResults.nodeIdentifier),
    timestamp:      Array.from(lastResults.timestamp),
  };

  try {
    writeFileSync(
      join(homedir(), 'ifid'),
      JSON.stringify(formattedLastResults),
      {
        encoding: 'utf8',
      },
    );
  } catch (e) {
    console.error('Could not save results.');
  }
}

export default writeNewResults;