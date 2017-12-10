import {
  IFIDOptions,
} from './IFIDOptions/IFIDOptions';
import {
  IIFID,
} from './IIFID';
import {
  IIFIDOptions,
} from './IFIDOptions/IIFIDOptions';
import {
  IUUID,
} from '../UUID/IUUID';
import {
  UUID,
} from '../UUID/UUID';
import {
  TUUIDVersion,
} from '../TypeAliases/TUUIDVersion';

export class IFID implements IIFID {
  readonly id:      IUUID;
  readonly version: TUUIDVersion = '1';

  static parse(text: string): IIFID {
    const id = UUID.parse(text);
    const version = id.version;
    const obj = {
      id,
      version,
    };

    return Object.assign({}, IFID, obj);
  }

  constructor(options: IIFIDOptions = new IFIDOptions()) {
    this.id = new UUID(options);
    this.version = options.version;
  }

  toString(): string {
    return this.id.toString();
  }
}

export default IFID;