import {
  IFIDVersions,
} from '../../src/Enums/IFIDVersions';
import {
  isUUIDTypeIFIDVersion,
} from '../../src/TypeGuards/isUUIDTypeIFIDVersion';

describe('isUUIDTypeIFIDVersion tests.', () => {
  it('Returns false if the provided argument is not one of the relevant members of the AGTVersions enum.', () => {
    expect(isUUIDTypeIFIDVersion('foobarbazbux')).toBe(false);
  });

  it('Returns true if the provided argument is IFIDVersions.UUID.', () => {
    expect(isUUIDTypeIFIDVersion(IFIDVersions.UUID)).toBe(true);
  });

  it('Returns true if the provided argument is IFIDVersions.UUIDv1.', () => {
    expect(isUUIDTypeIFIDVersion(IFIDVersions.UUIDv1)).toBe(true);
  });

  it('Returns true if the provided argument is IFIDVersions.UUIDv4.', () => {
    expect(isUUIDTypeIFIDVersion(IFIDVersions.UUIDv4)).toBe(true);
  });
});