import { fileToString } from '../util';

console.log(
    fileToString( './day1/input.txt')
        .split('\n')
        .map(s => s.trim())
        .reduce((sum, line) => {
            return sum + Number(line);
        }, 0)
);