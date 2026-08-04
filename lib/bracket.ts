// ----- Knockout bracket engine: seeding, byes, advancement -----

// Seed pairings for a full power-of-two bracket (1-indexed seed numbers).
// For 8 teams: [1,8],[4,5],[3,6],[2,7] so seed 1 meets the lowest seed [[2]].
const SEED_ORDER: Record<number, number[]> = {
  2: [1, 2],
  4: [1, 4, 2, 3],
  8: [1, 8, 4, 5, 3, 6, 2, 7],
  16: [1, 16, 8, 9, 4, 13, 5, 12, 3, 14, 6, 11, 2, 15, 7, 10],
  32: [
    1, 32, 16, 17, 8, 25, 9, 24, 4, 29, 13, 20, 5, 28, 12, 21,
    3, 30, 14, 19, 6, 27, 11, 22, 2, 31, 15, 18, 7, 26, 10, 23,
  ],
};

export function nextPowerOfTwo(n: number): number {
  let p = 1;
  while (p < n) p *= 2;
  return p;
}

export function totalRounds(size: number): number {
  return Math.log2(size);
}

// Returns seed slots where missing teams become byes (null).
export function buildSeedSlots(teamCount: number): (number | null)[] {
  const size = nextPowerOfTwo(teamCount);
  const order = SEED_ORDER[size] ?? SEED_ORDER[nextPowerOfTwo(size)] ?? [];
  // Teams are assigned seeds 1..teamCount; seeds beyond teamCount are byes.
  return order.map((seed) => (seed <= teamCount ? seed : null));
}

// Given winners advancing, produce the matchups for the next round.
export function advanceWinners(winners: (string | null)[]): (string | null)[][] {
  const rounds: (string | null)[][] = [];
  let current = winners;
  while (current.length > 1) {
    const next: (string | null)[] = [];
    for (let i = 0; i < current.length; i += 2) {
      // A bye (null opponent) means automatic advancement.
      const a = current[i];
      const b = current[i + 1];
      if (a === null && b === null) next.push(null);
      else if (b === null) next.push(a);
      else if (a === null) next.push(b);
      else next.push(null); // real match pending
    }
    rounds.push(next);
    current = next;
  }
  return rounds;
}