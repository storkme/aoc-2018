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
   * and return an array the same length as the input array, corresponding to the area of each point
   * @param input list of input commands
   * @param padding optional padding to make our simulated grid larger
   */
  const computeSizes = (input, padding = 0) => {
    // obj for tracking which point has the largest surrounding area
    const areaCounter = Array(input.length).fill(0);

    // loop through all points on our 'grid'
    for (let x = minX - padding; x < maxX + padding; x++) {
      for (let y = minY - padding; y < maxY + padding; y++) {

        // keep track of distances while looping through inputs
        const pointsDistances = Array(input.length);

        // keep track of lowest distance + index while iterating
        let minDistance = Number.MAX_SAFE_INTEGER;
        let minDistanceIndex;

        // loop through inputs
        for (let i = 0; i < input.length; i++) {
          const [px, py] = input[i];
          // calculate distance from this point
          pointsDistances[i] = manhattanDistance(x, y, px, py);
          minDistance = Math.min(minDistance, pointsDistances[i]);
        }

        // loop through point distances, get the array index of the min value
        // and if 2 points have the same min distance, we need to discount this point
        let pointFound = 0;
        for (let i = 0; i < input.length; i++) {
          if (pointsDistances[i] === minDistance) {
            pointFound++;
            if (pointFound === 1) {
              minDistanceIndex = i;
            } else if (pointFound === 2) {
              break;
            }
          }
        }

        // only count this cell if we found this point once in our list of point distances
        if (pointFound === 1) {
          areaCounter[minDistanceIndex] = areaCounter[minDistanceIndex] + 1;
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
  const boundedSizes = R.intersection(sizes, largerSizes);

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