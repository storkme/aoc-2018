import { readInput } from '../util';

const input = readInput();

// parse the input line into the id (n), left(l),top(t), width(w),height(h)
function parseLine(s) {
  const [n, l, t, w, h] = /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/.exec(s).slice(1);
  return { n: Number(n), l: Number(l), t: Number(t), w: Number(w), h: Number(h) };
}

/**
 * Create a grid from the list of lines (see above)
 * @param lines
 * @param cellFunction function to call on each
 * @returns {*}
 */
function createGrid(lines, cellFunction) {
  return lines.reduce((a, { n, l, t, w, h }) => {
    const r = l + w;
    const b = t + h;

    // resize horizontal
    if (a.length < r) {
      a = [...a, ...Array(r - a.length).fill([])];
    }

    for (let x = l; x < r; x++) {
      // resize vertical
      if (a[x].length < b) {
        a[x] = [...a[x], ...Array(b - a[x].length).fill(0)];
      }

      for (let y = t; y < b; y++) {
        a[x][y] = cellFunction(a[x][y], n);
      }
    }

    return a;
  }, [[]]);
}

function part1() {
  const grid = createGrid(
    input.map(s => parseLine(s)),
    cellValue => cellValue + 1
  );

  // count all cells that have a >1 value
  console.log(grid.reduce((result, cols) => result + cols.reduce((r, cell) => r + (cell > 1 ? 1 : 0), 0), 0));
}

function part2() {
  const lines = input.map(s => parseLine(s));
  const overwrittenIds = new Set();
  const ids = new Set(lines.map(({ n }) => n));

  const grid = createGrid(
    lines,
    (currentCellValue, n) => {
      if (currentCellValue !== 0) {
        overwrittenIds.add(currentCellValue);
        overwrittenIds.add(n);
      }

      return n;
    }
  );

  console.log(
    [...ids].find(e => !overwrittenIds.has(e))
  );
}

part1();
part2();