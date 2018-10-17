import {
  IFID,
  strings,
} from '../../src/IFID/IFID';
import {
  AGTVersions,
  IFIDVersions,
  MagneticScrollsDocumentedTitles,
} from '../../src';

import {
  isIFIDVersion,
} from '../../src/TypeGuards/isIFIDVersion';
jest.mock('../../src/TypeGuards/isIFIDVersion');
import {
  isUUIDTypeIFIDVersion,
} from '../../src/TypeGuards/isUUIDTypeIFIDVersion';
jest.mock('../../src/TypeGuards/isUUIDTypeIFIDVersion');

import {
  cryptoJs,
} from 'big-uuid';
cryptoJs.hex.stringify = jest.fn();
cryptoJs.MD5 = jest.fn();
cryptoJs.SHA256 = jest.fn();

import {
  isAGTVersion,
} from '../../src/TypeGuards/isAGTVersion';
jest.mock('../../src/TypeGuards/isAGTVersion');

import {
  isFormatMDVersion,
} from '../../src/TypeGuards/isFormatMDVersion';
jest.mock('../../src/TypeGuards/isFormatMDVersion');

describe('General IFID tests.', () => {
  beforeEach(() => {
    (isIFIDVersion as any).mockImplementation(() => true);
    (cryptoJs.hex.stringify as any).mockImplementation((str: any) => str);
    (cryptoJs.MD5 as any).mockImplementation(() => 'test');
    (cryptoJs.SHA256 as any).mockImplementation(() => 'test');
  });

  afterEach(() => {
    (isIFIDVersion as any).mockClear();
    (cryptoJs.hex.stringify as any).mockClear();
    (cryptoJs.MD5 as any).mockClear();
    (cryptoJs.SHA256 as any).mockClear();
  });

  it('The __version property is emitted through the version getter.', () => {
    const ifid = new IFID({});
    const sym = Symbol();
    (ifid as any).__version = sym;
    expect(ifid.version).toBe(sym);
  });
  
  it('The __uuid property is emitted through the uuid getter.', () => {
    const ifid = new IFID({});
    const sym = Symbol();
    (ifid as any).__uuid = sym;
    expect(ifid.uuid).toBe(sym);
  });
  
  it('An error is thrown by the id getter if the version property meets the isUUIDTypeIFIDVersion type guard, but the uuid property is falsy.', () => {
    (isUUIDTypeIFIDVersion as any).mockImplementationOnce(() => true);
    const ifid = new IFID({});
    delete (ifid as any).__uuid;
    expect(() => ifid.id).toThrow(strings.UUID_INVALID);
  });
  
  it('The uuid property is emitted (as a string) through the id getter if the version property meets the isUUIDTypeIFIDVersion type guard and uuid is truthy.', () => {
    (isUUIDTypeIFIDVersion as any).mockImplementationOnce(() => true);
    
    const ifid = new IFID({});
    const str = 'foobarbaz';
    (ifid as any).__uuid = str;
    expect(ifid.id).toBe(str);
  });
  
  it('The __id property is emitted through the id getter if the version property does not meet the isUUIDTypeIFIDVersion type guard.', () => {
    (isUUIDTypeIFIDVersion as any).mockImplementationOnce(() => false);
    
    const ifid = new IFID({});
    const str1 = 'foobarbaz';
    const str2 = 'quuxbuux';
    (ifid as any).__uuid = str1;
    (ifid as any).__id = str2;
    expect(ifid.id).toBe(str2);
  });

  it('Emits the id property when toString is called.', () => {
    const ifid = new IFID({});
    (ifid as any).__id = 'testbar';
    expect(ifid.toString()).toBe('testbar');
  });

  it('If the version is not set, default to IFIDVersions.UUID.', () => {
    expect(
      // @ts-ignore
      new IFID()
        .version).toBe(IFIDVersions.UUID);
  });

  it('If the version is set in the options argument, set it in the object.', () => {
    expect(new IFID({ version: IFIDVersions.UUIDv4, }).version).toBe(IFIDVersions.UUIDv4);
  });

  it('Throws an error if a version is included, but it does not meet the isIFIDVersion type guard.', () => {
    (isIFIDVersion as any).mockClear();
    (isIFIDVersion as any).mockImplementationOnce(() => false);
    expect(() => new IFID({ version: 'foo' as any }).version).toThrow(strings.VERSION_INVALID);
  });

  it('If the version is set in the options argument, set it in the object.', () => {
    expect(new IFID({ version: IFIDVersions.UUIDv4, }).version).toBe(IFIDVersions.UUIDv4);
  });

  it('Allows the user to provide a UUID generator in the options object.', () => {
    const sym = Symbol();
    const func = () => sym;
    const ifid = new IFID({ uuidGenerator: func as any, });
    expect(ifid.uuid).toBe(sym);
  });
});

describe('UUID IFID tests.', () => {
  beforeEach(() => {
    (isIFIDVersion as any).mockImplementation(() => true);
    (cryptoJs.hex.stringify as any).mockImplementation((str: any) => str);
    (cryptoJs.MD5 as any).mockImplementation(() => 'test');
    (cryptoJs.SHA256 as any).mockImplementation(() => 'test');
  });

  afterEach(() => {
    (isIFIDVersion as any).mockClear();
    (cryptoJs.hex.stringify as any).mockClear();
    (cryptoJs.MD5 as any).mockClear();
    (cryptoJs.SHA256 as any).mockClear();
  });

  it('Passes 1 or "1" to the uuidGenerator if the version is IFIDVersions.UUIDv1.', () => {
    const uuidGenerator = jest.fn();
    new IFID({
      version: IFIDVersions.UUIDv1,
      uuidGenerator,
    });

    expect(uuidGenerator.mock.calls[0][0].toString()).toBe('1');
  });

  it('Passes 4 or "4" to the uuidGenerator if the version is IFIDVersions.UUIDv1.', () => {
    const uuidGenerator = jest.fn();
    new IFID({
      version: IFIDVersions.UUIDv4,
      uuidGenerator,
    });

    expect(uuidGenerator.mock.calls[0][0].toString()).toBe('4');
  });
});

describe('Generic file-based IFID tests.', () => {
  beforeEach(() => {
    (isIFIDVersion as any).mockImplementation(() => true);
    (cryptoJs.hex.stringify as any).mockImplementation((str: any) => str);
    (cryptoJs.MD5 as any).mockImplementation(() => 'test');
    (cryptoJs.SHA256 as any).mockImplementation(() => 'test');
  });

  afterEach(() => {
    (isIFIDVersion as any).mockClear();
    (cryptoJs.hex.stringify as any).mockClear();
    (cryptoJs.MD5 as any).mockClear();
    (cryptoJs.SHA256 as any).mockClear();
  });

  it('Throws if the version is IFIDVersions.FileBasedMD5 but the filepath option is not provided.', () => {
    expect(() => new IFID({ version: IFIDVersions.FileBasedMD5, })).toThrow(strings.FILE_CONTENTS_MISSING);
  });

  it('Throws if the version is IFIDVersions.FileBasedSHA but the filepath option is not provided.', () => {
    expect(() => new IFID({ version: IFIDVersions.FileBasedSHA, })).toThrow(strings.FILE_CONTENTS_MISSING);
  });

  it('Shortens the hash to 63 characters if the result is longer.', () => {
    (cryptoJs.hex.stringify as any).mockImplementation(() => 'a'.repeat(64));

    const ifid = new IFID({
      version: IFIDVersions.FileBasedSHA,
      fileContents: 'foobar',
    });

    expect(ifid.id.length).toBe(63);
  });
});

describe('Z-Code IFID tests.', () => {
  beforeEach(() => {
    (isIFIDVersion as any).mockImplementation(() => true);
    (cryptoJs.hex.stringify as any).mockImplementation((str: any) => str);
    (cryptoJs.MD5 as any).mockImplementation(() => 'test');
    (cryptoJs.SHA256 as any).mockImplementation(() => 'test');
  });

  afterEach(() => {
    (isIFIDVersion as any).mockClear();
    (cryptoJs.hex.stringify as any).mockClear();
    (cryptoJs.MD5 as any).mockClear();
    (cryptoJs.SHA256 as any).mockClear();
  });

  it('Throws for pre-1990 if no releaseNumber option is provided.', () => {
    expect(() => new IFID({ version: IFIDVersions.Pre1990ZCode, })).toThrow(strings.RELEASE_NUMBER_MISSING);
  });

  it('Throws for pre-1990 if no serialCode option is provided.', () => {
    const func = () => new IFID({
      version: IFIDVersions.Pre1990ZCode,
      releaseNumber: 5,
    });

    expect(func).toThrow(strings.SERIAL_CODE_MISSING);
  });

  it('Creates the IFID for pre-1990 as expected.', () => {
    expect(new IFID({
      version: IFIDVersions.Pre1990ZCode,
      releaseNumber: 16,
      serialCode: '830506',
    }).id).toBe('ZCODE-16-830506');
  });

  it('Throws for post-1990 if no releaseNumber option is provided.', () => {
    expect(() => new IFID({ version: IFIDVersions.Post1990ZCode, })).toThrow(strings.RELEASE_NUMBER_MISSING);
  });

  it('Throws for post-1990 if no serialCode option is provided.', () => {
    const func = () => new IFID({
      version: IFIDVersions.Post1990ZCode,
      releaseNumber: 5,
    });

    expect(func).toThrow(strings.SERIAL_CODE_MISSING);
  });

  it('Throws for post-1990 if no checksum option is provided.', () => {
    const func = () => new IFID({
      version: IFIDVersions.Post1990ZCode,
      releaseNumber: 5,
      serialCode: '320405',
    });

    expect(func).toThrow(strings.CHECKSUM_MISSING);
  });

  it('Creates the IFID for post-1990 as expected.', () => {
    expect(new IFID({
      version: IFIDVersions.Post1990ZCode,
      releaseNumber: 16,
      serialCode: '830506',
      checksum: 'adcf',
    }).id).toBe('ZCODE-16-830506-adcf');
  });
});

describe('FORMAT-MD IFID tests.', () => {
  beforeEach(() => {
    (isIFIDVersion as any).mockImplementation(() => true);
    (isFormatMDVersion as any).mockImplementation(() => true);
    (cryptoJs.hex.stringify as any).mockImplementation((str: any) => str);
    (cryptoJs.MD5 as any).mockImplementation(() => 'test');
    (cryptoJs.SHA256 as any).mockImplementation(() => 'test');
  });

  afterEach(() => {
    (isIFIDVersion as any).mockClear();
    (isFormatMDVersion as any).mockClear();
    (cryptoJs.hex.stringify as any).mockClear();
    (cryptoJs.MD5 as any).mockClear();
    (cryptoJs.SHA256 as any).mockClear();
  });

  afterAll(() => {
    (isFormatMDVersion as any).mockClear();
    (isFormatMDVersion as any).mockImplementation(() => false);
  });

  it('Throws if the fileContents option is not provided.', () => {
    expect(() => new IFID({ version: IFIDVersions.LegacyTADS2, })).toThrow(strings.FILE_CONTENTS_MISSING);
  });

  it('Creates the IFID for FORMAT-MD as expected.', () => {
    (cryptoJs.hex.stringify as any).mockImplementationOnce(() => 'TESTHASH');

    expect(new IFID({
      version: IFIDVersions.Java,
      fileContents: 'foozle',
    }).id).toBe('JAVA-TESTHASH');
  });
});

describe('Documented Magnetic Scrolls IFID tests.', () => {
  beforeEach(() => {
    (isIFIDVersion as any).mockImplementation(() => true);
  });

  afterEach(() => {
    (isIFIDVersion as any).mockClear();
  });

  it('Throws if no name option is provided.', () => {
    const func = () => new IFID({ version: IFIDVersions.DocumentedMagneticScrolls, });
    expect(func).toThrow(strings.NAME_MISSING);
  });

  it('Creates an ID of "MAGNETIC-1" if the name option is MagneticScrollsDocumenedTitles.ThePawn.', () => {
    const ifid = new IFID({
      version: IFIDVersions.DocumentedMagneticScrolls,
      name: MagneticScrollsDocumentedTitles.ThePawn,
    });

    expect(ifid.id).toBe('MAGNETIC-1');
  });

  it('Creates an ID of "MAGNETIC-1" if the name option is a string which coerces (lowering, and removing spaces, question marks, and exclamation points) to "thepawn".', () => {
    const ifid = new IFID({
      version: IFIDVersions.DocumentedMagneticScrolls,
      name: 'the pawn',
    });

    expect(ifid.id).toBe('MAGNETIC-1');
  });

  it('Creates an ID of "MAGNETIC-2" if the name option is MagneticScrollsDocumenedTitles.GuildOfThieves.', () => {
    const ifid = new IFID({
      version: IFIDVersions.DocumentedMagneticScrolls,
      name: MagneticScrollsDocumentedTitles.GuildOfThieves,
    });

    expect(ifid.id).toBe('MAGNETIC-2');
  });

  it('Creates an ID of "MAGNETIC-2" if the name option is a string which coerces to "guildofthieves".', () => {
    const ifid = new IFID({
      version: IFIDVersions.DocumentedMagneticScrolls,
      name: 'guild of thieves',
    });

    expect(ifid.id).toBe('MAGNETIC-2');
  });

  it('Creates an ID of "MAGNETIC-3" if the name option is MagneticScrollsDocumenedTitles.Jinxster.', () => {
    const ifid = new IFID({
      version: IFIDVersions.DocumentedMagneticScrolls,
      name: MagneticScrollsDocumentedTitles.Jinxter,
    });

    expect(ifid.id).toBe('MAGNETIC-3');
  });

  it('Creates an ID of "MAGNETIC-3" if the name option is a string which coerces to "jinxter".', () => {
    const ifid = new IFID({
      version: IFIDVersions.DocumentedMagneticScrolls,
      name: 'jinxter',
    });

    expect(ifid.id).toBe('MAGNETIC-3');
  });

  it('Creates an ID of "MAGNETIC-4" if the name option is MagneticScrollsDocumenedTitles.Corruption.', () => {
    const ifid = new IFID({
      version: IFIDVersions.DocumentedMagneticScrolls,
      name: MagneticScrollsDocumentedTitles.Corruption,
    });

    expect(ifid.id).toBe('MAGNETIC-4');
  });

  it('Creates an ID of "MAGNETIC-4" if the name option is a string which coerces to "corruption".', () => {
    const ifid = new IFID({
      version: IFIDVersions.DocumentedMagneticScrolls,
      name: 'corruption',
    });

    expect(ifid.id).toBe('MAGNETIC-4');
  });

  it('Creates an ID of "MAGNETIC-5" if the name option is MagneticScrollsDocumenedTitles.Fish.', () => {
    const ifid = new IFID({
      version: IFIDVersions.DocumentedMagneticScrolls,
      name: MagneticScrollsDocumentedTitles.Fish,
    });

    expect(ifid.id).toBe('MAGNETIC-5');
  });

  it('Creates an ID of "MAGNETIC-5" if the name option is a string which coerces to "fish".', () => {
    const ifid = new IFID({
      version: IFIDVersions.DocumentedMagneticScrolls,
      name: 'fish',
    });

    expect(ifid.id).toBe('MAGNETIC-5');
  });

  it('Creates an ID of "MAGNETIC-6" if the name option is MagneticScrollsDocumenedTitles.Myth.', () => {
    const ifid = new IFID({
      version: IFIDVersions.DocumentedMagneticScrolls,
      name: MagneticScrollsDocumentedTitles.Myth,
    });

    expect(ifid.id).toBe('MAGNETIC-6');
  });

  it('Creates an ID of "MAGNETIC-6" if the name option is a string which coerces to "myth".', () => {
    const ifid = new IFID({
      version: IFIDVersions.DocumentedMagneticScrolls,
      name: 'myth',
    });

    expect(ifid.id).toBe('MAGNETIC-6');
  });

  it('Creates an ID of "MAGNETIC-7" if the name option is MagneticScrollsDocumenedTitles.Wonderland.', () => {
    const ifid = new IFID({
      version: IFIDVersions.DocumentedMagneticScrolls,
      name: MagneticScrollsDocumentedTitles.Wonderland,
    });

    expect(ifid.id).toBe('MAGNETIC-7');
  });

  it('Creates an ID of "MAGNETIC-7" if the name option is a string which coerces to "wonderland".', () => {
    const ifid = new IFID({
      version: IFIDVersions.DocumentedMagneticScrolls,
      name: 'wonderland',
    });

    expect(ifid.id).toBe('MAGNETIC-7');
  });

  it('Throws if no matches are made.', () => {
    const func = () => new IFID({
      version: IFIDVersions.DocumentedMagneticScrolls,
      name: 'doesnotexist',
    });

    expect(func).toThrow(strings.UNRECOGNIZED_DOCUMENTED_MAGNETIC_SCROLLS_TITLE);
  });
});

describe('Undocumented Magnetic Scrolls IFID tests.', () => {
  beforeEach(() => {
    (isIFIDVersion as any).mockImplementation(() => true);
    (cryptoJs.hex.stringify as any).mockImplementation((str: any) => str);
    (cryptoJs.MD5 as any).mockImplementation(() => 'test');
    (cryptoJs.SHA256 as any).mockImplementation(() => 'test');
  });

  afterEach(() => {
    (isIFIDVersion as any).mockClear();
    (cryptoJs.hex.stringify as any).mockClear();
    (cryptoJs.MD5 as any).mockClear();
    (cryptoJs.SHA256 as any).mockClear();
  });

  it('Throws if the filepath option is not provided.', () => {
    expect(() => new IFID({ version: IFIDVersions.UndocumentedMagneticScrolls, })).toThrow(strings.FILE_CONTENTS_MISSING);
  });

  it('Creates the IFID for undocumented Magnetic Scrolls as expected.', () => {
    (cryptoJs.hex.stringify as any).mockImplementationOnce(() => 'TESTHASH');

    expect(new IFID({
      version: IFIDVersions.UndocumentedMagneticScrolls,
      fileContents: 'foozle',
    }).id).toBe('MAGNETIC-TESTHASH');
  });
});

describe('Documented Magnetic Scrolls IFID tests.', () => {
  beforeEach(() => {
    (isIFIDVersion as any).mockImplementation(() => true);
    (isAGTVersion as any).mockImplementation(() => true);
    (cryptoJs.hex.stringify as any).mockImplementation((str: any) => str);
    (cryptoJs.MD5 as any).mockImplementation(() => 'test');
    (cryptoJs.SHA256 as any).mockImplementation(() => 'test');
  });

  afterEach(() => {
    (isIFIDVersion as any).mockClear();
    (isAGTVersion as any).mockClear();
    (cryptoJs.hex.stringify as any).mockClear();
    (cryptoJs.MD5 as any).mockClear();
    (cryptoJs.SHA256 as any).mockClear();
  });

  it('Throws if the agtVersion option does not meet the isAGTVersion type guard.', () => {
    (isAGTVersion as any).mockImplementationOnce(() => false);

    const func = () => new IFID({ version: IFIDVersions.LegacyAGT, });
    expect(func).toThrow(strings.AGT_VERSION_INVALID);
  });

  it('Throws if the agtSignature argument is not of type string.', () => {
    const func = () => new IFID({ version: IFIDVersions.LegacyAGT, });
    expect(func).toThrow(strings.AGT_SIGNATURE_INVALID);
  });

  it('Throws if the agtSignature argument is an empty string.', () => {
    const func = () => new IFID({
      version: IFIDVersions.LegacyAGT,
      agtSignature: '',
    });

    expect(func).toThrow(strings.AGT_SIGNATURE_INVALID);
  });

  it('Throws if the agtSignature argument is not eight characters long.', () => {
    const func = () => new IFID({
       version: IFIDVersions.LegacyAGT,
       agtSignature: '1234567',
    });

    expect(func).toThrow(strings.AGT_SIGNATURE_INVALID);
  });

  it('Constructs the ID as AGT-VERSION-SIGNATURE.', () => {
    const ifid = new IFID({
       version: IFIDVersions.LegacyAGT,
       agtVersion: AGTVersions.Magx_0_0,
       agtSignature: '12345678',
    });

    expect(ifid.id).toBe('AGT-20000-12345678');
  });

  it('Changes the last digit of the AGT version to 1 if the agtLargeOrSoggy option is truthy.', () => {
    const ifid = new IFID({
      version: IFIDVersions.LegacyAGT,
      agtVersion: AGTVersions.ME_1_0,
      agtSignature: '789abcde',
      agtLargeOrSoggy: true,
    });

    expect(ifid.id).toBe('AGT-10001-789abcde');
  });
});