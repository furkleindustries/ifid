import {
  TNamespaceId,
  TUUIDVersion,
  UUID,
} from 'big-uuid';
import {
  createHash,
} from 'crypto';
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
  isAGTVersion,
} from '../TypeGuards/isAGTVersion';
import {
  isFormatMDVersion,
} from '../TypeGuards/isFormatMDVersion';
import {
  isIFIDVersion,
} from '../TypeGuards/isIFIDVersion';
import {
  isUUIDTypeIFIDVersion,
} from '../TypeGuards/isUUIDTypeIFIDVersion';
import {
  isNode,
} from '../isNode';
import {
  MagneticScrollsDocumentedTitles,
} from '../Enums/MagneticScrollsDocumentedTitles';

export const strings = {
  AGT_SIGNATURE_INVALID:
    'The agtSignature option was missing from the options object. This ' +
    'property is needed for legacy AGT IFIDs.',

  AGT_VERSION_INVALID:
    'The agtVersion option was missing from the options object. This ' +
    'property is needed for legacy AGT IFIDs.',

  CHECKSUM_MISSING:
    'The checksum property was missing from the options object. This ' +
    'property is needed for post-1990 Z-Code IFIDs.',

  FILE_GET_IN_BROWSER:
    'There is no direct file access in the browser, therefore any ' +
    'IFID-generating method which relies on file access will fail in the ' +
    'browser.',

  FILEPATH_MISSING:
    'An IFID version was selected requiring hashing a file, but no filepath ' +
    'was provided in the options object.',

  MD5_IN_BROWSER:
    'MD5 is a completely outmoded and infeasible digest algorithm. While ' +
    'it has been provided for reverse-compatibility with the majority of ' +
    'Treaty of Babel in the Node.js version of this library, MD5 is not ' +
    'included in browsers by default and will not be added for this library.',

  NAME_MISSING:
    'The name argument was not provided in the argument object.',

  NAMESPACE_ID_MISSING:
    'The namespace ID was not provided for the v3/5 UUID to be generated.',

  RELEASE_NUMBER_MISSING:
    'The releaseNumber property was missing from the options object. This ' +
    'property is needed for Z-Code IFIDs.',

  SERIAL_CODE_MISSING:
    'The serialCode property was missing from the options object. This ' +
    'property is needed for Z-Code IFIDs.',

  UNRECOGNIZED_DOCUMENTED_MAGNETIC_SCROLLS_TITLE:
    'The title provided for a Magnetic Scrolls IFID was not recognized. An ' +
    'IFID should be constructed using the undocumented Magnetic Scrolls ' +
    'IFID pattern instead.',

  UUID_INVALID:
    'The UUID was not properly generated for the IFID before being requested.',

  VERSION_INVALID:
    'The version property of the provided argument object did not meet the ' +
    'isIFIDVersion type guard, or is not implemented.',
};

export class IFID implements IIFID {
  private __version: IFIDVersions = IFIDVersions.UUID;
  get version(): IFIDVersions {
    return this.__version;
  }

  private __uuid?: { toString(): string, };
  get uuid(): { toString(): string, } | undefined {
    return this.__uuid;
  }

  private __id: string = '';
  get id(): string {
    if (isUUIDTypeIFIDVersion(this.version)) {
      if (!this.uuid) {
        throw new Error(strings.UUID_INVALID);
      }

      return this.uuid.toString();
    } else {
      return this.__id;
    }
  }

  toString(): string {
    return this.id;
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

    const uuidGenerator: (version: TUUIDVersion, namespaceId?: TNamespaceId, name?: string) => { toString(): string, } = (() => {
      if (options && typeof options.uuidGenerator === 'function') {
        return options.uuidGenerator;
      } else {
        return (version: TUUIDVersion, namespaceId?: TNamespaceId, name?: string) => (
          new UUID({
            name,
            namespaceId,
            version,
          })
        );
      }
    })();

    /* istanbul ignore else */ 
    if (this.version === IFIDVersions.UUIDv1) {
      this.__uuid = uuidGenerator(1);
    } else if (
      this.version === IFIDVersions.UUIDv3 ||
      this.version === IFIDVersions.UUIDv5)
    {
      if (!options.namespaceId) {
        throw new Error(strings.NAMESPACE_ID_MISSING);
      } else if (!options.name) {
        throw new Error(strings.NAME_MISSING);
      }

      if (this.version === IFIDVersions.UUIDv3) {
        this.__uuid = uuidGenerator(3, options.namespaceId, options.name);
      } else {
        /* v5 */
        this.__uuid = uuidGenerator(5, options.namespaceId, options.name);
      }
    } else if (this.version === IFIDVersions.UUIDv4) {
      this.__uuid = uuidGenerator(4);
    } else if (this.version === IFIDVersions.FileBasedMD5) {
      if (!options.fileContents) {
        throw new Error(strings.FILEPATH_MISSING);
      } else if (!isNode()) {
        throw new Error(strings.MD5_IN_BROWSER);
      }

      const hasher = createHash('md5');
      hasher.update(options.fileContents);
      this.__id = hasher.digest('hex');
    } else if (this.version === IFIDVersions.FileBasedSHA) {
      if (!options.fileContents) {
        throw new Error(strings.FILEPATH_MISSING);
      } else if (!isNode()) {
        throw new Error(strings.FILE_GET_IN_BROWSER);
      }

      const hasher = createHash('sha228');
      hasher.update(options.fileContents);
      const hashed = hasher.digest('hex');
      if (hashed.length > 63) {
        this.__id = hashed.slice(0, 63);
      } else {
        this.__id = hashed;
      }
    } else if (this.version === IFIDVersions.Pre1990ZCode) {
      if (!options.releaseNumber) {
        throw new Error(strings.RELEASE_NUMBER_MISSING);
      } else if (!options.serialCode) {
        throw new Error(strings.SERIAL_CODE_MISSING);
      }

      this.__id = `ZCODE-${options.releaseNumber}-${options.serialCode}`;
    } else if (this.version === IFIDVersions.Post1990ZCode) {
      if (!options.releaseNumber) {
        throw new Error(strings.RELEASE_NUMBER_MISSING);
      } else if (!options.serialCode) {
        throw new Error(strings.SERIAL_CODE_MISSING);
      } else if (!options.checksum) {
        throw new Error(strings.CHECKSUM_MISSING);
      }

      this.__id = `ZCODE-${options.releaseNumber}-${options.serialCode}-${options.checksum}`;
    } else if (isFormatMDVersion(this.version)) {
      if (!options.fileContents) {
        throw new Error(strings.FILEPATH_MISSING);
      } else if (!isNode()) {
        throw new Error(strings.MD5_IN_BROWSER);
      }

      const hasher = createHash('md5');
      hasher.update(options.fileContents);
      const hashed = hasher.digest('hex');
      this.__id = `${this.version}-${hashed}`;
    } else if (this.version === IFIDVersions.DocumentedMagneticScrolls) {
      if (!options.name) {
        throw new Error(strings.NAME_MISSING);
      }

      const format = (str: string) => str.replace(/[ ?!]/g, '').toLowerCase()

      const name = options.name;
      if (name === MagneticScrollsDocumentedTitles.ThePawn ||
          format(name) === 'thepawn')
      {
        this.__id = 'MAGNETIC-1';
      } else if (name === MagneticScrollsDocumentedTitles.GuildOfThieves ||
                 format(name) === 'guildofthieves')
      {
        this.__id = 'MAGNETIC-2';
      } else if (name === MagneticScrollsDocumentedTitles.Jinxter ||
                 format(name) === 'jinxter')
      {
        this.__id = 'MAGNETIC-3';
      } else if (name === MagneticScrollsDocumentedTitles.Corruption ||
                 format(name) === 'corruption')
      {
        this.__id = 'MAGNETIC-4';
      } else if (name === MagneticScrollsDocumentedTitles.Fish ||
                 format(name) === 'fish')
      {
        this.__id = 'MAGNETIC-5';
      } else if (name === MagneticScrollsDocumentedTitles.Myth ||
                 format(name) === 'myth')
      {
        this.__id = 'MAGNETIC-6';
      } else if (name === MagneticScrollsDocumentedTitles.Wonderland ||
                 format(name) === 'wonderland')
      {
        this.__id = 'MAGNETIC-7';
      } else {
        throw new Error(strings.UNRECOGNIZED_DOCUMENTED_MAGNETIC_SCROLLS_TITLE);
      }
    } else if (this.version === IFIDVersions.UndocumentedMagneticScrolls) {
      if (!options.fileContents) {
        throw new Error(strings.FILEPATH_MISSING);
      } else if (!isNode()) {
        throw new Error(strings.MD5_IN_BROWSER);
      }

      const hasher = createHash('md5');
      hasher.update(options.fileContents);
      const hashed = hasher.digest('hex');
      this.__id = `MAGNETIC-${hashed}`;
    } else if (this.version === IFIDVersions.LegacyAGT) {
      if (!isAGTVersion(options.agtVersion)) {
        throw new Error(strings.AGT_VERSION_INVALID);
      } else if (typeof options.agtSignature !== 'string' ||
                 !options.agtSignature ||
                 options.agtSignature.length !== 8)
      {
        throw new Error(strings.AGT_SIGNATURE_INVALID);
      }

      const agtVer = options.agtVersion;
      let agtId =
        'AGT-' +
        (options.agtLargeOrSoggy ? agtVer.slice(0, -1) + '1' : agtVer) +
        `-${options.agtSignature}`;
      
      this.__id = agtId;
    }
  }
}

export default IFID;