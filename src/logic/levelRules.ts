

/** Convert a 0..24 index to {row, col} on a 5x5 grid */
function indexToRC(index: number): { row: number; col: number } {
  return {
    row: Math.floor(index / GRID_SIZE),
    col: index % GRID_SIZE,
  };
}

/** Convert row and col back to index */
function rcToIndex(row: number, col: number): number {
  return row * GRID_SIZE + col;
}

/** Simple prime checker for small numbers (0..24) */
function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

/* ---------- Level rule implementations ---------- */

/**
 * Level 1: Even indices
 * Rule: index % 2 === 0
 */
export function levelEvenIndices(): Set<number> {
  const s = new Set<number>();
  for (let i = 0; i < TOTAL_CELLS; i++) {
    if (i % 2 === 0) s.add(i);
  }
  return s;
}

/**
 * Level 2: Diagonals
 * Rule: primary diagonal (row === col) OR secondary diagonal (row + col === 4)
 * This lights up the classic "X" on the 5x5 grid.
 */
export function levelDiagonals(): Set<number> {
  const s = new Set<number>();
  for (let i = 0; i < TOTAL_CELLS; i++) {
    const { row, col } = indexToRC(i);
    if (row === col || row + col === GRID_SIZE - 1) {
      s.add(i);
    }
  }
  return s;
}

/**
 * Level 3: Prime indices
 * Rule: only indices that are prime numbers (2,3,5,7,11,13,17,19,23, ...)
 */
export function levelPrimes(): Set<number> {
  const s = new Set<number>();
  for (let i = 0; i < TOTAL_CELLS; i++) {
    if (isPrime(i)) s.add(i);
  }
  return s;
}

/**
 * Level 4: Center cluster
 * Rule: center (index 12) plus its 4 direct neighbors (up/down/left/right)
 *
 * Layout reminder (indices):
 *  0  1  2  3  4
 *  5  6  7  8  9
 * 10 11 12 13 14   <-- center is 12 (row=2,col=2)
 * 15 16 17 18 19
 * 20 21 22 23 24
 */
export function levelCenterCluster(): Set<number> {
  const s = new Set<number>();
  const center = rcToIndex(2, 2); // row 2, col 2 -> index 12
  s.add(center);

  const neighbors = [
    { r: 2 - 1, c: 2 }, // up
    { r: 2 + 1, c: 2 }, // down
    { r: 2, c: 2 - 1 }, // left
    { r: 2, c: 2 + 1 }, // right
  ];

  for (const { r, c } of neighbors) {
    // sanity check bounds although we know these are valid for a 5x5 grid
    if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
      s.add(rcToIndex(r, c));
    }
  }

  return s;
}

/**
 * Level 5: (row + col) % 3 === 0
 * Rule uses the row and column and checks modular arithmetic.
 */
export function levelMod3RowCol(): Set<number> {
  const s = new Set<number>();
  for (let i = 0; i < TOTAL_CELLS; i++) {
    const { row, col } = indexToRC(i);
    if ((row + col) % 3 === 0) s.add(i);
  }
  return s;
}

/* ---------- Convenience: Get rule by level number ---------- */

/**
 * getLevelIndices
 * - Accepts a level number (1-based) and returns the Set of active indices.
 * - Returns an empty Set for unknown levels (so the caller can handle adding new levels safely).
 */
export function getLevelIndices(level: number): Set<number> {
  switch (level) {
    case 1:
      return levelEvenIndices();
    case 2:
      return levelDiagonals();
    case 3:
      return levelPrimes();
    case 4:
      return levelCenterCluster();
    case 5:
      return levelMod3RowCol();
    default:
      // If you extend to new levels later, add them here.
      console.warn(`getLevelIndices: no rule defined for level ${level}`);
      return new Set<number>();
  }
}

/* ---------- (Optional) Export helpers if you want to test them directly ---------- */
export const helpers = {
  indexToRC,
  rcToIndex,
  isPrime,
};
