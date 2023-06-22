/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-case-declarations */
import crypto from 'crypto';
import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { heading, panel, text } from '@metamask/snaps-ui';
import ethers from 'ethers';
import { randomBytes } from 'crypto';
import { nanoid } from 'nanoid';

import { getBIP44AddressKeyDeriver } from '@metamask/key-tree';

// const prime = `0x${(BigInt(Math.pow(2, 333)) - BigInt(1)).toString()}`;

// // Set the desired precision
// Big.DP = 5;

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  switch (request.method) {
    case 'split':
      const ethnode = await snap.request({
        method: "snap_getBip44Entropy",
        params: {
          coinType: 3,
        },
      });
      const keyDeriver = await getBIP44AddressKeyDeriver(ethnode);
      const key = await keyDeriver(0);
      const pvtKey = key.privateKey;

      function random(lower, upper) {
        if (lower > upper) {
          const temp = lower;
          lower = upper;
          upper = temp;
        }
      
        return lower.add(Decimal.random().times(upper.sub(lower + 1)).floor());
      }
      
      // Polynomial function where `a` is the coefficients
      function q(x, { a }) {
        let value = a[0];
        for (let i = 1; i < a.length; i++) {
          value = value.add(x.pow(i).times(a[i]));
        }
      
        return value;
      }

      function split(secret, n, k, prime){
        
      }

      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            heading(`${pvtKey}`),
            text(`Hello, **${key.privateKey}**!`),
            text('This custom confirmation is just for display purposes.'),
            text(' '),
          ]),
        },
      });
    default:
      throw new Error('Method not found.');
  }
};
