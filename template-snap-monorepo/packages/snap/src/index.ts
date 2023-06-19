/* eslint-disable no-case-declarations */
import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { heading, panel, text } from '@metamask/snaps-ui';
import ethers from 'ethers';

import Decimal from 'decimal.js';
import { getBIP44AddressKeyDeriver } from '@metamask/key-tree';
import crypto from 'crypto';
// const Big = require('big.js');

// // Set the desired precision
// Big.DP = 5;
// const prime = Big(2).pow(333).minus(1);

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  switch (request.method) {
    case 'split':
      // eslint-disable-next-line no-case-declarations
      const ethnode = await snap.request({
        method: 'snap_getBip44Entropy',
        params: {
          coinType: 60,
        },
      });
      // eslint-disable-next-line no-case-declarations
      const keyDeriver = await getBIP44AddressKeyDeriver(ethnode);
      const key = await keyDeriver(0);
      const pvtKey = key.privateKey;

      // function random(lower: Big | number, upper: Big | number): Big {
      //   let lowerCopy = Big(lower);
      //   let upperCopy = Big(upper);

      //   if (lowerCopy.gt(upperCopy)) {
      //     const temp = lowerCopy;
      //     lowerCopy = upperCopy;
      //     upperCopy = temp;
      //   }

      //   return lowerCopy.plus(Big.random().times(upperCopy.minus(lowerCopy).plus(1)).round(0, 0)); // Round to nearest integer
      // }

      // // Polynomial function where `a` is the coefficients
      // function q(x: Big, { a }: { a: Big[] }): Big {
      //   let value = a[0];

      //   for (let i = 1; i < a.length; i++) {
      //     value = value.add(x.pow(i).times(a[i]));
      //   }

      //   return value;
      // }
      // function split(secret: string, n: number, k: number, prime: string): { x: string, y: string }[] {
      //   if (!secret.startsWith('0x')) {
      //     throw new TypeError('The shamir.split() function must be called with a String<secret> in hexadecimals that begins with 0x.');
      //   }

      //   if (!prime.startsWith('0x')) {
      //     throw new TypeError('The shamir.split() function must be called with a String<prime> in hexadecimals that begins with 0x.');
      //   }

      //   const S = Big(secret);
      //   const p = Big(prime);

      //   if (S.gt(p)) {
      //     throw new RangeError('The String<secret> must be less than the String<prime>.');
      //   }

      //   const a = [S];
      //   const D = [];

      //   for (let i = 1; i < k; i++) {
      //     const coeff = random(Big(0), p.minus(0x1));
      //     a.push(coeff);
      //   }

      //   for (let i = 0; i < n; i++) {
      //     const x = Big(i + 1);
      //     D.push({
      //       x,
      //       y: q(x, { a }).mod(p).toString(),
      //     });
      //   }

      //   return D;
      // }

      // const ans = pvtKey ? split(pvtKey, 4, 3, prime) : undefined;

      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            heading(`${pvtKey}`),
            text(`Hello, **${origin}**!`),
            text('This custom confirmation is just for display purposes.'),
            text(' '),
          ]),
        },
      });
    default:
      throw new Error('Method not found.');
  }
};
