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
      console.log(key);
      const pvtKey = key.privateKey;

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
