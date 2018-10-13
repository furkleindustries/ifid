import {
  IFIDVersions,
} from '../../src/Enums/IFIDVersions';
import {
  isFormatMDVersion,
} from '../../src/TypeGuards/isFormatMDVersion';

describe('isFormatMDVersion tests.', () => {
  it('Returns false if the provided argument is not one of the relevant members of the AGTVersions enum.', () => {
    expect(isFormatMDVersion('foobarbazbux')).toBe(false);
  });

  it('Returns true if the provided argument is IFIDVersions.LegacyTADS2.', () => {
    expect(isFormatMDVersion(IFIDVersions.LegacyTADS2)).toBe(true);
  });

  it('Returns true if the provided argument is IFIDVersions.LegacyTADS3.', () => {
    expect(isFormatMDVersion(IFIDVersions.LegacyTADS3)).toBe(true);
  });

  it('Returns true if the provided argument is IFIDVersions.LegacyHugo.', () => {
    expect(isFormatMDVersion(IFIDVersions.LegacyHugo)).toBe(true);
  });

  it('Returns true if the provided argument is IFIDVersions.LegacyAdvSys.', () => {
    expect(isFormatMDVersion(IFIDVersions.LegacyAdvSys)).toBe(true);
  });

  it('Returns true if the provided arugment is "MZ".', () => {
    expect(isFormatMDVersion('MZ')).toBe(true);
  });

  it('Returns true if the provided argument is IFIDVersions.MSDOS', () => {
    expect(isFormatMDVersion(IFIDVersions.MSDOS)).toBe(true);
  });

  it('Returns true if the provided argument is IFIDVersions.Windows.', () => {
    expect(isFormatMDVersion(IFIDVersions.Windows)).toBe(true);
  });
  
  it('Returns true if the provided argument is IFIDVersions.OS2.', () => {
    expect(isFormatMDVersion(IFIDVersions.OS2)).toBe(true);
  });

  it('Returns true if the provided argument is IFIDVersions.ELF.', () => {
    expect(isFormatMDVersion(IFIDVersions.ELF)).toBe(true);
  });

  it('Returns true if the provided argument is IFIDVersions.Java.', () => {
    expect(isFormatMDVersion(IFIDVersions.Java)).toBe(true);
  });

  it('Returns true if the provided argument is IFIDVersions.AmigaOS.', () => {
    expect(isFormatMDVersion(IFIDVersions.AmigaOS)).toBe(true);
  });

  it('Returns true if the provided argument is IFIDVersions.Script.', () => {
    expect(isFormatMDVersion(IFIDVersions.Script)).toBe(true);
  });

  it('Returns true if the provided argument is "MACHO".', () => {
    expect(isFormatMDVersion("MACHO")).toBe(true);
  });

  it('Returns true if the provided argument is IFIDVersions.MacOS.', () => {
    expect(isFormatMDVersion(IFIDVersions.MacOSX)).toBe(true);
  });

  it('Returns true if the provided argument is IFIDVersions.MachO.', () => {
    expect(isFormatMDVersion(IFIDVersions.MachO)).toBe(true);
  });

  it('Returns true if the provided argument is IFIDVersions.PreOSX.', () => {
    expect(isFormatMDVersion(IFIDVersions.PreOSX)).toBe(true);
  });

  it('Returns true if the provided argument is IFIDVersions.ALAN.', () => {
    expect(isFormatMDVersion(IFIDVersions.ALAN)).toBe(true);
  });
});