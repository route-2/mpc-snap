global.crypto = require('crypto');

function divmod(a, b, n) {
  let t = BigInt(0);
  let nt = BigInt(1);
  let r = n;
  let nr = b % n;
  let tmp;

  while (nr !== 0n) {
    const quot = r / nr;

    tmp = nt;
    nt = t - quot * nt;
    t = tmp;

    tmp = nr;
    nr = r - quot * nr;
    r = tmp;
  }

  if (r > 1n) return 0n;
  if (t < 0n) t += n;

  return a * t % n;
}

function random(lower, upper) {
  if (lower > upper) {
    const temp = lower;
    lower = upper;
    upper = temp;
  }

  const range = upper - lower + 1n;
  const randomValue = BigInt('0x' + crypto.randomBytes(8).toString('hex'));
  return lower + randomValue % range;
}

// Polynomial function where `a` is the coefficients
function q(x, { a }) {
  let value = a[0];
  for (let i = 1; i < a.length; i++) {
    value = value + x ** BigInt(i) * a[i];
  }

  return value;
}

function split(secret, n, k, prime) {
  if (typeof secret !== 'string' || typeof prime !== 'string') {
    throw new TypeError('The shamir.split() function must be called with a String<secret> and String<prime>.');
  }

  if (!secret.startsWith('0x') || !prime.startsWith('0x')) {
    throw new TypeError('The shamir.split() function must be called with a String<secret> and String<prime> in hexadecimals that begins with 0x.');
  }

  const S = BigInt(secret);
  const p = BigInt(prime);

  if (S >= p) {
    throw new RangeError('The String<secret> must be less than the String<prime>.');
  }

  const a = [];
  for (let i = 0; i < k - 1; i++) {
    let coeff = random(1n, p - 1n);
    a.push(coeff);
  }

  let shares = [];

  for (let i = 1; i <= n; i++) {
    let x = BigInt(i);
    let y = q(x, { a }) % p;

    shares.push({
      x: x.toString(),
      y: y.toString(16),
    });
  }

  shares.push({
    x: '0',
    y: S.toString(16),
  });

  return shares;
}

function lagrangeBasis(data, j) {
  // Lagrange basis evaluated at 0, i.e. L(0).
  // You don't need to interpolate the whole polynomial to get the secret, you
  // only need the constant term.
  let denominator = 1n;
  let numerator = 1n;
  for (let i = 0; i < data.length; i++) {
    if (data[j].x !== data[i].x) {
      denominator *= data[i].x - data[j].x;
    }
  }

  for (let i = 0; i < data.length; i++) {
    if (data[j].x !== data[i].x) {
      numerator *= data[i].x;
    }
  }

  return {
    numerator,
    denominator,
  };
}

function lagrangeInterpolate(data, p) {
  let S = 0n;

  for (let i = 0; i < data.length; i++) {
    let basis = lagrangeBasis(data, i);
    S += data[i].y * divmod(basis.numerator, basis.denominator, p);
  }

  const rest = S % p;

  return rest;
}

function combine(shares, prime) {
  const p = BigInt(prime);

  // Wrap with BigInt on the input shares
  const bigIntShares = shares.map((share) => ({
    x: BigInt(share.x),
    y: BigInt('0x' + share.y),
  }));

  return lagrangeInterpolate(bigIntShares, p).toString(16);
}

const pvtKey = '0x5b1c32040fad747da544476076de2997bbb06c39353d96a4d72b1db3e60bcc82';
const prime = '0x' + (2n ** 333n - 1n).toString(16);
const ans = split(pvtKey, 4, 3, prime);
console.log(ans);

const combi = combine(ans, prime);
console.log(combi);

exports.split = split;
exports.combine = combine;
exports.divmod = divmod;
