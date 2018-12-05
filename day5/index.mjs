import { readInput } from '../util';
import * as R from 'ramda';

// get first line of input (there should only be 1 line anyway..)
const input = R.head(readInput());

/**
 * loop through input string repeatedly collapsing matching tokens
 * @param inputStr
 * @returns {string[]}
 */
function collapse(inputStr) {
  const s = inputStr.split('');

  const isSame = (a, b) => a && b && a.toLowerCase() === b.toLowerCase();
  const isUppercase = c => c.toUpperCase() === c;

  // side effecting fn, modifies `s`
  const collapseIter = (fromIndex = s.length - 1) => {
    for (let i = fromIndex; i > 0; i--) {
      if (isSame(s[i], s[i - 1]) && (isUppercase(s[i]) ^ isUppercase(s[i - 1]))) {
        s.splice(i - 1, 2);
        return i - 1;
      }
    }
    return 0;
  };

  // run collapse fn on input string until no more changes
  for (let fromIndex; (fromIndex = collapseIter(fromIndex)) !== 0;) {
  }

  return s;
}

function part1() {
  console.log(collapse(input).length);
}

function part2() {
  // get list of all unique tokens used in input
  const tokens = [...input.split('').reduce((a, c) => a.add(c.toLowerCase()), new Set())];

  console.log(
    R.pipe(
      // map token to length of collapsed input string with that token removed
      R.map(token => collapse(input.replace(new RegExp(token, 'ig'), '')).length),
      // sort resulting array numerically
      R.sort((a, b) => a - b),
      // take first item from array (e.g. smallest value)
      R.head
    )(tokens)
  );
}

part1();
part2();
