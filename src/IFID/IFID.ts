import {
  createHash,
} from 'crypto';
import {
  readFileSync,
} from 'fs';
import {
  IFIDVersions,
} from '../Enums/IFIDVersions';
import {
  IIFID,
} from './IIFID';
import {
  IIFIDOptions,
} from './IIFIDOptions';
import {
  isIFIDVersion,
} from '../TypeGuards/isIFIDVersion';
import {
  IUUID,
} from '../UUID/IUUID';
import {
  NamespaceIds,
} from '../Enums/NamespaceIds';
import {
  TUUIDVersion,
} from '../TypeAliases/TUUIDVersion';
import {
  UUID,
} from '../UUID/UUID';
import { isAGTVersion } from '../TypeGuards/isAGTVersion';
import { AGTVersions } from '../Enums/AGTVersions';

export const strings = {
  FILEPATH_MISSING:
    'An IFID version was selected requiring hashing a file, but no filepath ' +
    'was provided in the options object.',

  NAME_MISSING:
    'The name argument was not provided in the argument object.',

  NAMESPACE_ID_MISSING:
    'The namespace ID was not provided for the v3/5 UUID to be generated.',

  UUID_INVALID:
    'The UUID was not properly generated for the IFID before being requested.',

  VERSION_INVALID:
    'The version property of the provided argument object did not meet the ' +
    'isIFIDVersion type guard.',
};

export class IFID implements IIFID {
  private __version: IFIDVersions = IFIDVersions.UUID;
  get version(): IFIDVersions {
    return this.__version;
  }

  private __uuid?: IUUID;
  get uuid(): IUUID | undefined {
    return this.__uuid;
  }

  private __id: string = '';
  get id(): string {
    if (IFID.isUUIDVersion(this.version)) {
      if (!this.uuid) {
        throw new Error(strings.UUID_INVALID);
      }

      return this.uuid.toString();
    } else {
      return this.__id;
    }
  }

  constructor(options: Partial<IIFIDOptions>) {
    if (options) {
      if ('version' in options) {
        if (isIFIDVersion(options.version)) {
          this.__version = options.version;
        } else {
          throw new Error(strings.VERSION_INVALID);
        }
      }
    }

    if (IFID.isUUIDVersion(this.version)) {
      const uuidGenerator = (() => {
        if (options && typeof options.uuidGenerator === 'function') {
          return (version: TUUIDVersion) => options.uuidGenerator!(version);
        } else {
          return (version: TUUIDVersion, namespaceId?: NamespaceIds, name?: string) => (
            new UUID({
              name,
              namespaceId,
              version,
            })
          );
        }
      })();

      const fileGetter = (() => {
        if (options && typeof options.fileGetter === 'function') {
          return (path: string) => options.fileGetter!(path);
        } else {
          return (path: string) => readFileSync(path);
        }
      })();

      if (this.version === IFIDVersions.UUIDv1) {
        this.__uuid = uuidGenerator(1);
      } else if (
        this.version === IFIDVersions.UUIDv3 ||
        this.version === IFIDVersions.UUIDv5)
      {
        if (!options || !options.namespaceId) {
          throw new Error(strings.NAMESPACE_ID_MISSING);
        } else if (!options.name) {
          throw new Error(strings.NAME_MISSING);
        }

        this.__uuid = new UUID();
      } else if (this.version === IFIDVersions.UUIDv4) {
        this.__uuid = uuidGenerator(4);
      } else if (this.version === IFIDVersions.FileBasedMD5) {
        if (!options || !options.filepath) {
          throw new Error(strings.FILEPATH_MISSING);
        }

        const fileContents = fileGetter(options.filepath);
        const hasher = createHash('md5');
        hasher.update(fileContents);
        this.__id = hasher.digest('hex');
      } else if (this.version === IFIDVersions.FileBasedSHA) {
        if (!options || !options.filepath) {
          throw new Error(strings.FILEPATH_MISSING);
        }

        const fileContents = fileGetter(options.filepath);
        const hasher = createHash('sha228');
        hasher.update(fileContents);
        const hashed = hasher.digest('hex');
        if (hashed.length > 63) {
          this.__id = hashed.slice(0, 63);
        } else {
          this.__id = hashed;
        }
      } else if (this.version === IFIDVersions.Pre1990ZCode) {
        if (!options || !options.releaseNumber) {
          throw new Error(strings.RELEASE_NUMBER_MISSING);
        } else if (!options.serialCode) {
          throw new Error(strings.SERIAL_CODE_MISSING);
        }

        this.__id = `ZCODE-${options.releaseNumber}-${options.serialCode}`;
      } else if (this.version === IFIDVersions.Post1990ZCode) {
        if (!options || !options.releaseNumber) {
          throw new Error(strings.RELEASE_NUMBER_MISSING);
        } else if (!options.serialCode) {
          throw new Error(strings.SERIAL_CODE_MISSING);
        } else if (!options.checksum) {
          throw new Error(strings.CHECKSUM_MISSING);
        }

        this.__id = `ZCODE-${options.releaseNumber}-${options.serialCode}-${options.checksum}`;
      } else if (
        this.version === IFIDVersions.LegacyTADS2 ||
        this.version === IFIDVersions.LegacyTADS3 ||
        this.version === IFIDVersions.LegacyHugo ||
        this.version === IFIDVersions.LegacyAdvSys ||
        this.version === 'MZ' ||
        this.version === IFIDVersions.ELF ||
        this.version === IFIDVersions.Java ||
        this.version === IFIDVersions.AmigaOS ||
        this.version === IFIDVersions.Script ||
        this.version === 'MACHO' ||
        this.version === IFIDVersions.PreOSX ||
        this.version === IFIDVersions.ALAN)
      {
        /* All FORMAT-MD, where MD is the MD5 digest. */
        if (!options || !options.filepath) {
          throw new Error(strings.FILEPATH_MISSING);
        }

        const fileContents = fileGetter(options.filepath);
        const hasher = createHash('md5');
        hasher.update(fileContents);
        const hashed = hasher.digest('hex');
        this.__id = `${this.version}-${hashed}`;
      } else if (this.version === IFIDVersions.DocumentedMagneticScrolls) {
        if (!options || !options.name) {
          throw new Error(strings.NAME_MISSING);
        }

        const name = options.name.toLowerCase();
        if (name === 'the pawn') {
          this.__id = 'MAGNETIC-1';
        } else if (name === 'guild of thieves') {
          this.__id = 'MAGNETIC-2';
        } else if (name === 'jinxter') {
          this.__id = 'MAGNETIC-3';
        } else if (name === 'corruption') {
          this.__id = 'MAGNETIC-4';
        } else if (name === 'fish!') {
          this.__id = 'MAGNETIC-5';
        } else if (name === 'myth') {
          this.__id = 'MAGNETIC-6';
        } else if (name === 'wonderland') {
          this.__id = 'MAGNETIC-7';
        } else {
          throw new Error(strings.UNRECOGNIZED_DOCUMENTED_MAGNETIC_SCROLLS_TITLE);
        }
      } else if (this.version === IFIDVersions.UndocumentedMagneticScrolls) {
        if (!options || !options.filepath) {
          throw new Error(strings.FILEPATH_MISSING);
        }

        const fileContents = fileGetter(options.filepath);
        const hasher = createHash('md5');
        hasher.update(fileContents);
        const hashed = hasher.digest('hex');
        this.__id = `MAGNETIC-${hashed}`;
      } else if (this.version === IFIDVersions.LegacyAGT) {
        if (!options || !isAGTVersion(options.agtVersion)) {
          throw new Error(strings.AGT_VERSION_INVALID);
        } else if (!options.agtSignature || options.agtSignature.length !== 8) {
          throw new Error(strings.AGT_SIGNATURE_INVALID);
        }
  
        const agtVer = options.agtVersion;
        let agtId = 'AGT-';
        if (agtVer === AGTVersions.v1_0) {
          agtId += '00000';
        } else if (agtVer === AGTVersions.v1_18) {
          agtId += '01800';
        } else if (agtVer === AGTVersions.v1_19) {
          agtId += '01900';
        } else if (agtVer === AGTVersions.v1_20) {
          agtId += '02000';
        } else if (agtVer === AGTVersions.v1_32_COS) {
          agtId += '03200';
        } else if (agtVer === AGTVersions.v1_35) {
          agtId += '03500';
        } else if (agtVer === AGTVersions.v1_5H) {
          agtId += '05000';
        } else if (agtVer === AGTVersions.v1_5F) {
          agtId += '05050';
        } else if (agtVer === AGTVersions.v1_6) {
          agtId += '05070';
        } else if (agtVer === AGTVersions.v1_82) {
          agtId += '08200';
        } else if (agtVer === AGTVersions.v1_83) {
          agtId += '08300';
        } else if (agtVer === AGTVersions.ME_1_0) {
          agtId += '10000';
        } else if (agtId === AGTVersions.ME_1_5) {
          agtId += '15000';
        } else if (agtId === AGTVersions.ME_1_6) {
          agtId += '16000';
        } else if (agtId === AGTVersions.Magx_0_0) {
          agtId += '20000';
        }
  
        if (options.agtLargeOrSoggy) {
          agtId = agtId.slice(0, -1) + '1';
        }
  
        agtId += `-${options.agtSignature}`;
        
        this.__id = agtId;
      }
    }
  }

  static isUUIDVersion(version: IFIDVersions) {
    return (
      version === IFIDVersions.UUIDv1 ||
      version === IFIDVersions.UUIDv3 ||
      version === IFIDVersions.UUIDv4 ||
      version === IFIDVersions.UUIDv5
    );
  }

  toString(): string {
    return this.__id;
  }

  static parse(version: IFIDVersions, text: string): IIFID {
    if (version === IFIDVersions.UUIDv1 ||
        version === IFIDVersions.UUIDv3 ||
        version === IFIDVersions.UUIDv4 ||
        version === IFIDVersions.UUIDv5)
    {
      const uuid = UUID.parse(text);
      const obj = {
        uuid,
        version,
      };

      return Object.assign({}, IFID, obj);
    } else {
      throw new Error('Non-UUID parsing not implemented yet.');
    }
  }
}

export default IFID;