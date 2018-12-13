import { readInput } from "../util";
import {
  ascend,
  difference,
  filter,
  flatten,
  head,
  identity,
  includes,
  isEmpty,
  pipe,
  prop,
  reduceBy,
  sort,
  uniq
} from 'ramda';

const parseInput = s => /^Step ([^\s]+) must be finished before step ([^\s]+) can begin.$/.exec(s).slice(1);

const input = readInput().map(parseInput);

function part1() {
  // get the list of unique steps
  const steps = uniq(flatten(input));

  // map each step to a list of prerequisite steps
  const dependencyGraph = reduceBy(
    (steps, [dependsOn]) => steps.concat(dependsOn),
    [],
    prop(1),
    input,
  );

  const done = [];

  const next = () => pipe(
    filter((s) => !includes(s, done) && isEmpty(difference(dependencyGraph[s] || [], done))),
    uniq,
    sort(ascend(identity)),
    head,
  )(steps);

  for(let step = next(); step; step = next()) {
    done.push(step);
  }

  console.log(done.join(''));
}

function part2() {

}

part1();
// part2();