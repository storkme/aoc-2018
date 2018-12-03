import { fileToString } from '../util';

const inputNumbers = fileToString('./day1/input.txt')
    .split('\n')
    .map(s => Number(s.trim()));
const frequenciesFound = new Set();
let frequency = 0;
let i = 0;

do {
    frequency = frequency + inputNumbers[i++];

    if (frequenciesFound.has(frequency)) {

        console.log(frequency);
        break;
    }

    frequenciesFound.add(frequency);

    // reset counter i
    if (i === inputNumbers.length) {
        i = 0;
    }
} while (true);