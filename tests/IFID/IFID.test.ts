import {
  IFID,
  strings,
} from '../../src/IFID/IFID';
import {
  IFIDVersions,
} from '../../src';

import {
  isIFIDVersion,
} from '../../src/TypeGuards/isIFIDVersion';
jest.mock('../../src/TypeGuards/isIFIDVersion');
import {
  isUUIDTypeIFIDVersion,
} from '../../src/TypeGuards/isUUIDTypeIFIDVersion';
jest.mock('../../src/TypeGuards/isUUIDTypeIFIDVersion');

jest.mock('big-uuid');

import {
  isNode,
} from '../../src/isNode';
jest.mock('../../src/isNode');

import {
  createHash,
} from 'crypto';
jest.mock('crypto');

import {
  readFileSync,
} from 'fs';
jest.mock('fs');

import {
  isFormatMDVersion,
} from '../../src/TypeGuards/isFormatMDVersion';
jest.mock('../../src/TypeGuards/isFormatMDVersion');

describe('General IFID tests.', () => {
  beforeEach(() => {
    (isIFIDVersion as any).mockImplementation(() => true);
    (isNode as any).mockImplementation(() => true);
    (createHash as any).mockImplementation(() => ({ digest: jest.fn(() => ''), update: jest.fn(), }));
  });

  afterEach(() => {
    (isIFIDVersion as any).mockClear();
    (isNode as any).mockClear();
    (createHash as any).mockClear();
    (readFileSync as any).mockClear();
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

  it('If the version is not set, default to IFIDVersions.UUID.', () => {
    expect(new IFID({}).version).toBe(IFIDVersions.UUID);
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

  it('Uses fs.readFileSync to get files by default.', () => {
    const sym = Symbol();
    new IFID({
      version: IFIDVersions.FileBasedMD5,
      filepath: sym as any,
    });

    expect((readFileSync as any).mock.calls).toEqual([
      [ sym, ],
    ]);
  });

  it('Allows the user to provide a file getter in the options object.', () => {
    (createHash as any).mockImplementationOnce(() => ({ digest: jest.fn(), update: jest.fn(), }))

    const sym = Symbol();
    const func = jest.fn();
    new IFID({
      version: IFIDVersions.FileBasedMD5,
      fileGetter: func as any,
      filepath: sym as any,
    });

    expect(func.mock.calls).toEqual([
      [ sym, ],
    ]);
  });
});

describe('UUID IFID tests.', () => {
  beforeEach(() => {
    (isIFIDVersion as any).mockImplementation(() => true);
    (isNode as any).mockImplementation(() => true);
    (createHash as any).mockImplementation(() => ({ digest: jest.fn(() => ''), update: jest.fn(), }));
  });

  afterEach(() => {
    (isIFIDVersion as any).mockClear();
    (isNode as any).mockClear();
    (createHash as any).mockClear();
    (readFileSync as any).mockClear();
  });

  it('Passes 1 or "1" to the uuidGenerator if the version is IFIDVersions.UUIDv1.', () => {
    const uuidGenerator = jest.fn();
    new IFID({
      version: IFIDVersions.UUIDv1,
      uuidGenerator,
    });

    expect(uuidGenerator.mock.calls[0][0].toString()).toBe('1');
  });

  it('Passes 3 or "3" to the uuidGenerator if the version is IFIDVersions.UUIDv1.', () => {
    const uuidGenerator = jest.fn();
    new IFID({
      version: IFIDVersions.UUIDv3,
      uuidGenerator,
      name: 'foo',
      namespaceId: 'foobar' as any,
    });

    expect(uuidGenerator.mock.calls[0][0].toString()).toBe('3');
  });

  it('Passes 4 or "4" to the uuidGenerator if the version is IFIDVersions.UUIDv1.', () => {
    const uuidGenerator = jest.fn();
    new IFID({
      version: IFIDVersions.UUIDv4,
      uuidGenerator,
    });

    expect(uuidGenerator.mock.calls[0][0].toString()).toBe('4');
  });

  it('Passes 5 or "5" to the uuidGenerator if the version is IFIDVersions.UUIDv1.', () => {
    const uuidGenerator = jest.fn();
    new IFID({
      version: IFIDVersions.UUIDv5,
      uuidGenerator,
      name: 'foo',
      namespaceId: 'foobar' as any,
    });

    expect(uuidGenerator.mock.calls[0][0].toString()).toBe('5');
  });

  it('Throws if the version is UUIDv3 and the namespaceId property is not in the options object.', () => {
    expect(() => new IFID({ version: IFIDVersions.UUIDv3, })).toThrow(strings.NAMESPACE_ID_MISSING);
  });

  it('Throws if the version is UUIDv5 and the namespaceId property is not in the options object.', () => {
    expect(() => new IFID({ version: IFIDVersions.UUIDv5, })).toThrow(strings.NAMESPACE_ID_MISSING);
  });

  it('Throws if the version is UUIDv3 and the name property is not in the options object.', () => {
    expect(() => new IFID({ version: IFIDVersions.UUIDv3, namespaceId: 'foo', })).toThrow(strings.NAME_MISSING);
  });

  it('Throws if the version is UUIDv5 and the name property is not in the options object.', () => {
    expect(() => new IFID({ version: IFIDVersions.UUIDv5, namespaceId: 'foo', })).toThrow(strings.NAME_MISSING);
  });
});

describe('Generic file-based IFID tests.', () => {
  beforeEach(() => {
    (isIFIDVersion as any).mockImplementation(() => true);
    (isNode as any).mockImplementation(() => true);
    (createHash as any).mockImplementation(() => ({ digest: jest.fn(() => ''), update: jest.fn(), }));
  });

  afterEach(() => {
    (isIFIDVersion as any).mockClear();
    (isNode as any).mockClear();
    (createHash as any).mockClear();
    (readFileSync as any).mockClear();
  });

  it('Throws if the version is IFIDVersions.FileBasedMD5 but the filepath option is not provided.', () => {
    expect(() => new IFID({ version: IFIDVersions.FileBasedMD5, })).toThrow(strings.FILEPATH_MISSING);
  });

  it('Throws if the version is IFIDVersion.FileBasedMD5 but isNode is false.', () => {
    (isNode as any).mockImplementationOnce(() => false);
    const func = () => new IFID({ version: IFIDVersions.FileBasedMD5, filepath: 'foo', });
    expect(func).toThrow(strings.MD5_IN_BROWSER);
  });

  it('Calls the fileGetter with the filepath as an argument.', () => {
    new IFID({
      version: IFIDVersions.FileBasedMD5,
      filepath: 'foobar',
    });

    expect((readFileSync as any).mock.calls).toEqual([
      [ 'foobar', ],
    ]);
  });

  it('Passes the md5 argument to the hasher when creating.', () => {
    new IFID({
      version: IFIDVersions.FileBasedMD5,
      filepath: 'foobar',
    });

    expect((createHash as any).mock.calls).toEqual([
      [ 'md5', ],
    ]);
  });

  it('Throws if the version is IFIDVersions.FileBasedSHA but the filepath option is not provided.', () => {
    expect(() => new IFID({ version: IFIDVersions.FileBasedSHA, })).toThrow(strings.FILEPATH_MISSING);
  });

  it('Throws if the version is IFIDVersion.FileBasedSHA but isNode is false.', () => {
    (isNode as any).mockImplementationOnce(() => false);
    const func = () => new IFID({ version: IFIDVersions.FileBasedSHA, filepath: 'foo', });
    expect(func).toThrow(strings.FILE_GET_IN_BROWSER);
  });

  it('Calls the fileGetter with the filepath as an argument.', () => {
    new IFID({
      version: IFIDVersions.FileBasedSHA,
      filepath: 'foobar',
    });

    expect((readFileSync as any).mock.calls).toEqual([
      [ 'foobar', ],
    ]);
  });

  it('Passes the sha228 argument to the hasher when creating.', () => {
    new IFID({
      version: IFIDVersions.FileBasedSHA,
      filepath: 'foobar',
    });

    expect((createHash as any).mock.calls).toEqual([
      [ 'sha228', ],
    ]);
  });

  it('Shortens the hash to 63 characters if the result is longer.', () => {
    (createHash as any).mockImplementation(() => ({
      digest: jest.fn(() => 'a'.repeat(64)),
      update: jest.fn(),
    }));
    
    const ifid = new IFID({
      version: IFIDVersions.FileBasedSHA,
      filepath: 'foobar',
    });

    expect(ifid.id.length).toBe(63);
  });
});

describe('Z-Code IFID tests.', () => {
  beforeEach(() => {
    (isIFIDVersion as any).mockImplementation(() => true);
    (isNode as any).mockImplementation(() => true);
  });

  afterEach(() => {
    (isIFIDVersion as any).mockClear();
    (isNode as any).mockClear();
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
    (isNode as any).mockImplementation(() => true);
    (createHash as any).mockImplementation(() => ({ digest: jest.fn(() => ''), update: jest.fn(), }));
    (isFormatMDVersion as any).mockImplementation(() => true);
  });

  afterEach(() => {
    (isIFIDVersion as any).mockClear();
    (isNode as any).mockClear();
    (createHash as any).mockClear();
    (readFileSync as any).mockClear();
    (isFormatMDVersion as any).mockClear();
  });

  afterAll(() => {
    (isFormatMDVersion as any).mockClear();
    (isFormatMDVersion as any).mockImplementation(() => false);
  });

  it('Throws if the filepath option is not provided.', () => {
    expect(() => new IFID({ version: IFIDVersions.LegacyTADS2, })).toThrow(strings.FILEPATH_MISSING);
  });

  it('Throws if isNode returns false.', () => {
    (isNode as any).mockImplementationOnce(() => false);

    const func = () => new IFID({
      version: IFIDVersions.LegacyTADS2,
      filepath: 'foobar',
    });

    expect(func).toThrow(strings.MD5_IN_BROWSER);
  });

  it('Calls the fileGetter with the filepath as an argument.', () => {
    new IFID({
      version: IFIDVersions.LegacyHugo,
      filepath: 'foobar',
    });

    expect((readFileSync as any).mock.calls).toEqual([
      [ 'foobar', ],
    ]);
  });

  it('Passes the md5 argument to the hasher when creating.', () => {
    new IFID({
      version: IFIDVersions.ELF,
      filepath: 'foobar',
    });

    expect((createHash as any).mock.calls).toEqual([
      [ 'md5', ],
    ]);
  });

  it('Creates the IFID for post-1990 as expected.', () => {
    (createHash as any).mockImplementationOnce(() => ({
      update: jest.fn(),
      digest: jest.fn(() => 'TESTHASH'),
    }));

    expect(new IFID({
      version: IFIDVersions.Java,
      filepath: 'foozle',
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
});