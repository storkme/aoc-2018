import { readInput } from '../util';

function part1() {
  console.log(
    readInput()
      .reduce((sum, line) => {
        return sum + Number(line);
      }, 0)
  );
}

function part2() {
  const inputNumbers = readInput().map(s => Number(s));
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
}

part1();
part2();