import {
  AGTVersions,
} from '../Enums/AGTVersions';

export const isAGTVersion = (maybe: any): maybe is AGTVersions => {
  return (Object as any).values(AGTVersions).indexOf(maybe) !== -1;
};

export default isAGTVersion;