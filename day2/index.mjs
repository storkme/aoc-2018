import { readInput } from '../util';

const input = readInput();

function part1() {
  function freqs(word) {
    return word.split('').reduce((a, c) => (a[c] = a[c] + 1 || 1, a), {});
  }

  function hasLetterFreqs(letterFreqs, counts) {
    const freqs = Object.values(letterFreqs);
    return counts.map(c => freqs.includes(c));
  }

  const [pairs, triplets] = input.reduce(([twos, threes], s) => {
    const [has2, has3] = hasLetterFreqs(freqs(s), [2, 3]);

    return [twos + (has2 ? 1 : 0), threes + (has3 ? 1 : 0)];
  }, [0, 0]);

  console.log(pairs * triplets);
}


function part2() {
  function compare(a, b) {
    let diff = 0;
    let offset = -1;
    for (let i = 0; i < a.length && i < b.length; i++) {
      if (a[i] !== b[i]) {
        diff++;
        offset = i;
      }
    }
    if (diff === 1) {
      console.log(a.slice(0, offset) + a.slice(offset + 1));
    }
  }

  input.forEach(s => input.forEach(v => compare(s, v)));
}

part1();
part2();