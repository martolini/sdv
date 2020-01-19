const INT_MIN = -2147483648;
const INT_MAX = 2147483647;
const MBIG = INT_MAX;
const MSEED = 161803398;

function CSRandom(Seed) {
  let ii;
  let mj;
  let mk;
  let i;
  let k;

  // Alternative to default argument
  if (typeof Seed === 'undefined') {
    Seed = Date.getTime();
  }
  Seed = parseInt(Seed, 10); // Force an integer since there is no type checking

  this.inext = 0;
  this.inextp = 0;
  this.SeedArray = [];

  const subtraction = Seed === INT_MIN ? INT_MAX : Math.abs(Seed);
  mj = MSEED - subtraction;
  this.SeedArray[55] = mj;
  mk = 1;
  for (i = 1; i < 55; i += 1) {
    ii = (21 * i) % 55;
    this.SeedArray[ii] = mk;
    mk = mj - mk;
    if (mk < 0) {
      mk += MBIG;
    }
    mj = this.SeedArray[ii];
  }
  for (k = 1; k < 5; k += 1) {
    for (i = 1; i < 56; i += 1) {
      this.SeedArray[i] -= this.SeedArray[1 + ((i + 30) % 55)];
      if (this.SeedArray[i] > INT_MAX) {
        this.SeedArray[i] -= Math.abs(INT_MIN) + INT_MAX;
      }
      if (this.SeedArray[i] < 0) {
        this.SeedArray[i] += MBIG;
      }
    }
  }
  this.inext = 0;
  this.inextp = 21;
  Seed = 1;
}

CSRandom.prototype.Sample = function Sample() {
  return parseFloat(this.InternalSample() * (1.0 / MBIG));
};

CSRandom.prototype.InternalSample = function InternalSample() {
  let retVal;
  let locINext = this.inext + 1;
  let locINextp = this.inextp + 1;

  if (locINext >= 56) {
    locINext = 1;
  }
  if (locINextp >= 56) {
    locINextp = 1;
  }
  retVal = this.SeedArray[locINext] - this.SeedArray[locINextp];
  if (retVal === MBIG) {
    retVal -= 1;
  }
  if (retVal < 0) {
    retVal += MBIG;
  }
  this.SeedArray[locINext] = retVal;
  this.inext = locINext;
  this.inextp = locINextp;
  return parseInt(retVal, 10);
};

CSRandom.prototype.GetSampleForLargeRange = function GetSampleForLargeRange() {
  // This might require special large integer handling
  let result = this.InternalSample();
  let d;

  if (this.InternalSample() % 2 === 0) {
    result = -result;
  }
  d = result;
  d += INT_MAX - 1;
  d /= 2 * INT_MAX - 1;
  return d;
};

CSRandom.prototype.Next = function Next(a, b) {
  // Next() gives range of [0..INT_MAX)
  // Next(a) gives range of [0..a)
  // Next(a,b) gives range of [a..b)
  let min = 0;
  let max = INT_MAX;
  let range;

  if (typeof b !== 'undefined') {
    // 2 parameter version
    max = b;
    min = typeof a !== 'undefined' ? a : 0;
    if (min > max) {
      throw new Error(
        `Argument out of range - min (${min}) should be smaller than max (${max})`
      );
    }
    range = max - min;
    if (range <= INT_MAX) {
      return parseInt(this.Sample() * range + min, 10);
    }
    return parseInt(this.GetSampleForLargeRange() * range + min, 10);
  }
  if (typeof a !== 'undefined') {
    // 1 parameter version
    max = a;
    if (max < 0) {
      throw new Error(`Argument out of range - max (${max}) must be positive`);
    }
    return parseInt(this.Sample() * max, 10);
  }
  return this.InternalSample();
};

CSRandom.prototype.NextDouble = function NextDouble() {
  return this.Sample();
};

export default CSRandom;
