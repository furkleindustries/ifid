import {
  AGTVersions,
} from '../../src/Enums/AGTVersions';
import {
  isAGTVersion,
} from '../../src/TypeGuards/isAGTVersion';

describe('isAGTVersion tests.', () => {
  it('Returns false if the provided argument is not a member of the AGTVersions enum.', () => {
    expect(isAGTVersion('foobarbazbux')).toBe(false);
  });

  it('Returns true if the provided argument is a member of the AGTVersions enum', () => {
    let failed = false;
    (Object as any).values(AGTVersions).forEach((version: AGTVersions) => {
      if (!isAGTVersion(version)) {
        failed = true;
      }
    });

    expect(failed).toBe(false);
  });
});