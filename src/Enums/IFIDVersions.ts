export enum IFIDVersions {
  /* Default to v4. */
  UUID = 'UUIDv4',
  UUIDv1 = 'UUIDv1',
  UUIDv3 = 'UUIDv3',
  UUIDv4 = 'UUIDv4',
  UUIDv5 = 'UUIDv5',
  FileBased = 'SHA228',
  FileBasedMD5 = 'MD5',
  FileBasedSHA = 'SHA228',

  /* Unlikely to be used, but provided for conformance with the Treaty of
   * Babel, rev. 9. */
  Pre1990ZCode = 'Pre1990ZCode',
  Post1990ZCode = 'Post1990ZCode',
  LegacyTADS2 = 'TADS2',
  LegacyTADS3 = 'TADS3',
  LegacyHugo = 'HUGO',
  DocumentedMagneticScrolls = 'DocumentedMagneticScrolls',
  UndocumentedMagneticScrolls = 'MAGNETIC',
  LegacyAGT = 'LegacyAGT',
  LegacyAdvSys = 'ADVSYS',
  MSDOS = 'MZ',
  Windows = 'MZ',
  OS2 = 'MZ',
  ELF = 'ELF',
  Java = 'JAVA',
  AmigaOS = 'AMIGA',
  Script = 'SCRIPT',
  MacOSX = 'MACHO',
  MachO = 'MACHO',
  PreOSX = 'MAC',
  ALAN = 'ALAN',
}

export default IFIDVersions;