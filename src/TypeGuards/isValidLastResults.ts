import {
  TUUIDLastResults,
} from '../TypeAliases/TUUIDLastResults';

export function isValidLastResults(maybe: any): maybe is TUUIDLastResults {
  return typeof maybe === 'object' &&
    maybe &&
    maybe.clockSequence &&
    'BYTES_PER_ELEMENT' in maybe.clockSequence &&
    maybe.nodeIdentifier &&
    'BYTES_PER_ELEMENT' in maybe.nodeIdentifier &&
    maybe.timestamp &&
    'BYTES_PER_ELEMENT' in maybe.timestamp;
}

export default isValidLastResults;