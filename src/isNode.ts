export const isNode = () => Boolean(typeof process !== 'undefined' &&
                                    process.versions &&
                                    process.versions.node);

export default isNode;