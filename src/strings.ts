export const strings = {
  BIT_ARRAY_INVALID:
    'The array of bits was not an array, had no contents, or had one or ' +
    'more items which did not meet the isBit type guard.',

  UUID_VERSION_INVALID:
    'The version argument was not a valid UUID version.',

  TIMESTAMP_GENERATION_FAILED:
    'The random number generator did not produce an acceptable value for ' +
    'the random number used in place of a stable timestamp.',

  TIMESTAMP_INVALID:
    'The timestamp property of the UUID object is malformed.',

  NAMESPACE_ID_MISSING:
    'In order to construct a v3 or v5 UUID, you need to provide a ' +
    'namespace ID to be hashed.',

  NAME_MISSING:
    'In order to construct a v3 or v5 UUID, you need to provide a ' +
    'name to be hashed.',

  CLOCK_SEQUENCE_INVALID:
    'The clockSequence property of the UUID object is malformed.',

  CLOCK_SEQUENCE_GENERATION_FAILED:
    'The random number generator did not produce an acceptable value for ' +
    'the random number used in place of a stable clock sequence.',

  CLOCK_SEQUENCE_LOW_INVALID:
    'The clockSequenceLow property of the UUID object is malformed.',

  CLOCK_SEQUENCE_HIGH_INVALID:
    'The clockSequenceHigh property of the UUID object is malformed.',

  CLOCK_HIGH_AND_RESERVED_INVALID:
    'The clockSequenceHighAndReserved property of the UUID object is ' +
    'malformed.',

  MAC_ADDRESS_UNAVAILABLE:
    'The MAC address is unavailable, which makes creating the version 1 ' +
    'node ID impossible.',

  MAC_ADDRESS_INVALID:
    'The MAC address was found, but it was malformed.',

  UUID_LAST_RESULTS_INVALID:
    'The provided last results object did not meet the isValidLastResults ' +
    'type guard.',

  UUID_STRING_INVALID:
    'The text argument passed to UUID.parse was malformed.',

  UUID_OPTIONS_INVALID:
    'The options argument passed to one of the UUID methods did not meet ' +
    'the isUUIDOptions type guard.',

  TIME_LOW_INVALID:
    'The timestamp property did not produce a valid low portion of the ' +
    'timestamp.',

  TIME_MID_INVALID:
    'The timestamp property did not produce a valid mid portion of the ' +
    'timestamp.',

  TIME_HIGH_INVALID:
    'The timestamp property did not produce a valid high portion of the ' +
    'timestamp.',
  
  TIME_HIGH_AND_VERSION_INVALID:
    'The timestamp property did not produce a valid high-and-version ' +
    'multiplex.',

  NODE_IDENTIFIER_INVALID:
    'The nodeIdentifier property of the UUID object was malformed.',
};