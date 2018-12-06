import { readInput } from '../util';
import * as R from 'ramda';

// used as the seed values for when we call reduce() to get the bounding box for the input
const minMax = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];

// helper fn for manhattan distance
const manhattanDistance = (x1, y1, x2, y2) => Math.abs(x2 - x1) + Math.abs(y2 - y1);

// read & parse input
const input = readInput().map(s => /^(\d+),\s*(\d+)$/.exec(s).slice(1).map(Number));

// work out bounding box for input data
const [[minX, maxX], [minY, maxY]] = input.reduce(([[minX, maxX], [minY, maxY]], [x, y]) => [
  [Math.min(minX, x), Math.max(maxX, x)],
  [Math.min(minY, y), Math.max(maxY, y)],
], [minMax, minMax]);

function part1() {
  /**
   * Loop through our 'grid' e.g. every cell in our bounding box (as defined above) plus some optional padding
   * and return a map index->size, where index is the array index of the point, and size is the total area belong to
   * that point in the grid.
   * @param input list of input commands
   * @param padding optional padding to make our simulated grid larger
   */
  const computeSizes = (input, padding = 0) => {
    // obj for tracking which point has the largest surrounding area
    const areaCounter = {};

    // loop through all points on our 'grid'
    for (let x = minX - padding; x < maxX + padding; x++) {
      for (let y = minY - padding; y < maxY + padding; y++) {
        // work out distances to each point
        const distances = input.map(([px, py], i) => ({
          i,
          d: manhattanDistance(x, y, px, py),
        }));

        // sort the distances and take the first 2 values (e.g. the 2 closest points)
        const [minDistance, secondMinDistance] = R.pipe(
          R.sort(R.ascend(R.prop('d'))),
          R.take(2),
        )(distances);

        // check to see if the 2 closest points aren't equal
        if (minDistance.d !== secondMinDistance.d) {
          // increment the size of this points area
          areaCounter[minDistance.i] = areaCounter[minDistance.i] + 1 || 1;
        }
      }
    }

    return areaCounter;
  };

  // compute our sizes
  const sizes = computeSizes(input);
  // recompute our sizes with a slightly larger bounding box
  const largerSizes = computeSizes(input, 1);

  // take the intersection of the two sets of sizes
  // this means we're excluding sizes that got larger as our grid did
  const boundedSizes = R.intersection(R.values(sizes), R.values(largerSizes));

  // sort the sizes descendingly and take the first one
  console.log(
    R.pipe(
      R.sort(R.descend(R.identity)),
      R.head,
    )(boundedSizes)
  );
}

function part2() {

  let items = 0;
  for (let x = minX; x < maxX; x++) {
    for (let y = minY; y < maxY; y++) {
      // work out distances to each point
      const distances = input.reduce((total, [px, py]) => total + manhattanDistance(x, y, px, py), 0);

      if (distances < 10000) {
        items++;
      }
    }
  }

  console.log(items);
}

part1();
part2();