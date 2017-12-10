export function getHundredsOfNanosecondsSinceGregorianReform(): number {
  /* Months start at 0, so 9 is October. */
  return (new Date().getTime() - new Date(1582, 9, 15).getTime()) *
    /* Javascript returns only microseconds, so the value has to be increased
    * an order of magnitude. */
    10;
}

export default getHundredsOfNanosecondsSinceGregorianReform;