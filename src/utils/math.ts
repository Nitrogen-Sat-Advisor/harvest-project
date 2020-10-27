/**
 * Return evenly spaced numbers over a specified interval (similar to numpy.linspace).
 * @param start The starting value of the sequence.
 * @param stop The end value of the sequence.
 * @param num Number of samples to generate.
 * @returns There are `num` equally spaced samples in the closed interval `[start, stop]`
 */
export const linspace = (start: number, stop: number, num: number): number[] => {
    const multiplier = (stop - start) / (num - 1);
    return new Array(num).fill(0).map((_, i) => i * multiplier);
};

type MeanInput = number | MeanInput[];

export const mean = (arr: MeanInput[], axis = 0): MeanInput => {
    if (typeof arr[0] === 'number') {
        return arr.reduce((sum: number, i) => sum + (i as number), 0) / arr.length;
    }
    return arr.reduce((sum: MeanInput[], i) => {
        sum.push(mean(i as MeanInput[], axis - 1));
        return sum;
    }, []);
};
