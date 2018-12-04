import { readInput } from '../util';
import * as R from 'ramda';

const input = readInput();

const asleep = Symbol.for('asleep');
const awake = Symbol.for('awake');
const beginShift = Symbol.for('beginShift');

function parseLine(s) {
  const [, time, msg] = /^\[(.+)\] (.+)$/.exec(s);
  let guard;
  let op;
  if (msg === 'wakes up') {
    op = awake;
  } else if (msg === 'falls asleep') {
    op = asleep;
  } else {
    [, guard] = /^Guard #(\d+)/.exec(msg);
    op = beginShift;
  }
  return { op, time, guard };
}

function parseTime(input) {
  const [, year, month, day, hour, min] = /^(\d{4})-(\d\d)-(\d\d) (\d\d):(\d\d)$/.exec(input);
  return R.map(Number, { year, month, day, hour, min });
}

function parseGuards() {
  // reducer function which will be called once for every event
  const reducer = (a, { time, op, guard }) => {
    ({
      [asleep]: () => {
        a.asleepFrom = parseTime(time);
      },
      [awake]: () => {
        const minsLatest = parseTime(time).min;
        const { asleepFor, mins } = (a.guards[a.lastGuard] || { asleepFor: 0, mins: Array(60).fill(0) });
        a.guards[a.lastGuard] = {
          asleepFor: asleepFor + (minsLatest - a.asleepFrom.min),
          mins: mins.map((c, i) => i >= a.asleepFrom.min && i < minsLatest ? c + 1 : c),
        };
      },
      [beginShift]: () => {
        a.lastGuard = guard;
      }
    })[op]();

    return a;
  };

  const { guards } = input.map(parseLine)
  // sort input by event time
    .sort((a, b) => a.time.localeCompare(b.time))
    .reduce(reducer, { guards: {} });

  return guards;
}

function part1() {
  const guards = parseGuards();

  const laziestGuardNumber = Object.keys(guards).sort((b, a) => guards[a].asleepFor - guards[b].asleepFor)[0];
  const laziestGuard = guards[laziestGuardNumber];
  // find max value in `mins` array
  const maxSleep = Math.max(...laziestGuard.mins);

  // find first index of that max value to get the 'sleepiest minute'
  const sleepiestMinute = laziestGuard.mins.findIndex(c => c === maxSleep);

  console.log(laziestGuardNumber * sleepiestMinute);
}

function part2() {
  const guards = parseGuards();

  // find the most sleepy minute for each guard
  const guardsMins = Object.keys(guards)
    .map((g) => [...guards[g].mins].sort((a, b) => a - b)[59]);
  // get the most sleepy minute for all guards
  const mostSlept = guardsMins.reduce((a, b) => Math.max(a, b), 0);
  // get the number of the guard that had the sleepiest minute
  const sleepiestGuard = Object.keys(guards)[guardsMins.indexOf(mostSlept)];

  // multiply the sleepiest guard by the minute they slept `mostSlept` times
  console.log(sleepiestGuard * guards[sleepiestGuard].mins.indexOf(mostSlept));
}

part1();
part2();