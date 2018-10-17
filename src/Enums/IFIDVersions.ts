export enum IFIDVersions {
  /* Default to v4. */
  UUID = 'UUIDv4',
  UUIDv1 = 'UUIDv1',
  UUIDv4 = 'UUIDv4',
  FileBased = 'FileBasedSHA',
  FileBasedSHA = 'FileBasedSHA',
  
  /* Unlikely to be used, but provided for conformance with the Treaty of
  * Babel, rev. 9. */
  FileBasedMD5 = 'FileBasedMD5',
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