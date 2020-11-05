import { format } from 'd3-format';

export const precision = (value: number, decimals = 1, toLocale = true): string =>
    format(`${toLocale ? ',.' : '.'}${decimals}f`)(value);

export const leadingZero = (value: number, zeros = 2): string => format(`0${zeros}d`)(value);
