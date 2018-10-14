import {
  IFIDVersions,
} from '../../src/Enums/IFIDVersions';
import {
  isIFIDVersion,
} from '../../src/TypeGuards/isIFIDVersion';

describe('isIFIDVersion tests.', () => {
  it('Returns false if the provided argument is not a member of the IFIDVersions enum.', () => {
    expect(isIFIDVersion('foobarbazbux')).toBe(false);
  });

  it('Returns true if the provided argument is a member of the IFIDVersions enum', () => {
    let failed = false;
    (Object as any).values(IFIDVersions).forEach((version: IFIDVersions) => {
      if (!isIFIDVersion(version)) {
        failed = true;
      }
    });

    expect(failed).toBe(false);
  });
});