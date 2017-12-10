declare const window: { [key: string]: any, };

export const isNode: boolean = typeof window === 'undefined';

export default isNode;