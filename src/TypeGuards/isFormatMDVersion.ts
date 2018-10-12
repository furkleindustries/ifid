import {
  IFIDVersions,
} from '../Enums/IFIDVersions';

type FormatMDVersion = 
  IFIDVersions.LegacyTADS2 |
  IFIDVersions.LegacyTADS3 |
  IFIDVersions.LegacyHugo |
  IFIDVersions.LegacyAdvSys |
  IFIDVersions.MSDOS |
  IFIDVersions.Windows |
  IFIDVersions.OS2 |
  IFIDVersions.ELF |
  IFIDVersions.Java |
  IFIDVersions.AmigaOS |
  IFIDVersions.Script |
  IFIDVersions.MacOSX |
  IFIDVersions.MachO |
  IFIDVersions.PreOSX |
  IFIDVersions.ALAN;

export const isFormatMDVersion = (maybe: any): maybe is FormatMDVersion => (
  /* All FORMAT-MD, where MD is the MD5 digest. */
  maybe === IFIDVersions.LegacyTADS2 ||
  maybe === IFIDVersions.LegacyTADS3 ||
  maybe === IFIDVersions.LegacyHugo ||
  maybe === IFIDVersions.LegacyAdvSys ||
  maybe === 'MZ' ||
  maybe === IFIDVersions.ELF ||
  maybe === IFIDVersions.Java ||
  maybe === IFIDVersions.AmigaOS ||
  maybe === IFIDVersions.Script ||
  maybe === 'MACHO' ||
  maybe === IFIDVersions.PreOSX ||
  maybe === IFIDVersions.ALAN
);

export default isFormatMDVersion;