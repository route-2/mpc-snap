const Big = require('big.js');

// Set the desired precision
Big.DP = 5;

function divmod(a: number | Big, b: number | Big, n: number | Big): Big {
  const aCopy = Big(a);
  const bCopy = Big(b);
  const nCopy = Big(n);
  let t = Big(0);
  let nt = Big(1);
  let r = nCopy;
  let nr = bCopy.mod(nCopy);
  let tmp: Big;

  while (!nr.eq(0)) {
    const quot = r.div(nr).round(0, 0); // Round to nearest integer
    tmp = nt;
    nt = t.sub(quot.times(nt));
    t = tmp;
    tmp = nr;
    nr = r.sub(quot.times(nr));
    r = tmp;
  }

  if (r.gt(1)) return Big(0);
  if (t.lt(0)) t = t.add(n);

  return aCopy.times(t).mod(n);
}

function random(lower: Big | number, upper: Big | number): Big {
  let lowerCopy = Big(lower);
  let upperCopy = Big(upper);

  if (lowerCopy.gt(upperCopy)) {
    const temp = lowerCopy;
    lowerCopy = upperCopy;
    upperCopy = temp;
  }

  return lowerCopy.plus(Big.random().times(upperCopy.minus(lowerCopy).plus(1)).round(0, 0)); // Round to nearest integer
}

// Polynomial function where `a` is the coefficients
function q(x: Big, { a }: { a: Big[] }): Big {
  let value = a[0];

  for (let i = 1; i < a.length; i++) {
    value = value.add(x.pow(i).times(a[i]));
  }

  return value;
}

function split(secret: string, n: number, k: number, prime: string): { x: string, y: string }[] {
  if (!secret.startsWith('0x')) {
    throw new TypeError('The shamir.split() function must be called with a String<secret> in hexadecimals that begins with 0x.');
  }

  if (!prime.startsWith('0x')) {
    throw new TypeError('The shamir.split() function must be called with a String<prime> in hexadecimals that begins with 0x.');
  }

  const S = Big(secret);
  const p = Big(prime);

  if (S.gt(p)) {
    throw new RangeError('The String<secret> must be less than the String<prime>.');
  }

  const a = [S];
  const D = [];

  for (let i = 1; i < k; i++) {
    const coeff = random(Big(0), p.minus(0x1));
    a.push(coeff);
  }

  for (let i = 0; i < n; i++) {
    const x = Big(i + 1);
    D.push({
      x,
      y: q(x, { a }).mod(p).toString(),
    });
  }

  return D;
}

function lagrangeBasis(data: { x: Big, y: Big }[], j: number): { numerator: Big, denominator: Big } {
  let denominator = Big(1);
  let numerator = Big(1);

  for (let i = 0; i < data.length; i++) {
    if (!data[j].x.eq(data[i].x)) {
      denominator = denominator.times(data[i].x.minus(data[j].x));
    }
  }

  for (let i = 0; i < data.length; i++) {
    if (!data[j].x.eq(data[i].x)) {
      numerator = numerator.times(data[i].x);
    }
  }

  return {
    numerator,
    denominator,
  };
}

function lagrangeInterpolate(data: { x: Big, y: Big }[], p: Big): Big {
  let S = Big(0);

  for (let i = 0; i < data.length; i++) {
    const basis = lagrangeBasis(data, i);
    S = S.add(data[i].y.times(divmod(basis.numerator, basis.denominator, p)));
  }

  const rest = S.mod(p);

  return rest;
}

function combine(shares: { x: string, y: string }[], prime: string): Big {
  const p = Big(prime);
  const decimalShares = shares.map((share) => ({
    x: Big(share.x),
    y: Big(share.y),
  }));

  return lagrangeInterpolate(decimalShares, p);
}

export {
  split,
  combine,
  divmod
};
