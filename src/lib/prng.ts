/**
 * Deterministic PRNG implementation based on Mulberry32.
 * Given identical seed, guaranteed bit-for-bit identical outputs.
 */

export class MulberryPRNG {
  private state: number;

  constructor(seed: number | string) {
    if (typeof seed === 'string') {
      this.state = MulberryPRNG.hashString(seed);
    } else {
      this.state = seed >>> 0;
    }
    // Warm up the generator state
    this.next();
  }

  private static hashString(str: string): number {
    let hash = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      hash = Math.imul(hash ^ str.charCodeAt(i), 3432918353);
      hash = (hash << 13) | (hash >>> 19);
    }
    return hash >>> 0;
  }

  /**
   * Returns a pseudo-random floating point number in [0, 1)
   */
  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Returns an integer in range [min, max] inclusive
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Returns a float in range [min, max)
   */
  nextFloat(min: number, max: number, decimals: number = 2): number {
    const val = this.next() * (max - min) + min;
    const factor = Math.pow(10, decimals);
    return Math.round(val * factor) / factor;
  }

  /**
   * Returns a random element from an array
   */
  pick<T>(arr: readonly T[] | T[]): T {
    if (arr.length === 0) {
      throw new Error('Cannot pick from empty array');
    }
    const idx = Math.floor(this.next() * arr.length);
    return arr[idx];
  }

  /**
   * Returns true with the given probability (0 to 1, default 0.5)
   */
  boolean(chance: number = 0.5): boolean {
    return this.next() < chance;
  }

  /**
   * Returns a random integer in cents (useful for financial values)
   */
  nextCents(minDollars: number, maxDollars: number): number {
    return this.nextInt(minDollars * 100, maxDollars * 100);
  }
}

export function createPRNG(seed: number | string): MulberryPRNG {
  return new MulberryPRNG(seed);
}
