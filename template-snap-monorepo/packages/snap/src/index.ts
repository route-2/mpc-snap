import crypto from 'crypto';
import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { heading, panel, text } from '@metamask/snaps-ui';

import { Decimal } from 'decimal.js';
import { getBIP44AddressKeyDeriver } from '@metamask/key-tree';

Decimal.set({ rounding: 5 });
Decimal.set({ modulo: Decimal.ROUND_FLOOR });
Decimal.set({ crypto: true });
Decimal.set({ precision: 1e4 });
Decimal.set({ toExpPos: 1000 });

const prime = new Decimal('2').pow(333).sub(1);

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
  switch (request.method) {
    case 'split':
      const ethnode = await snap.request({
        method: 'snap_getBip44Entropy',
        params: {
          coinType: 60,
        },
      });
      const keyDeriver = await getBIP44AddressKeyDeriver(ethnode);
      const key = await keyDeriver(0);
      const pvtKey: string = key.privateKey as string;

      /**
       *
       * @param lower
       * @param upper
       */
      function random(lower: Decimal, upper: Decimal): Decimal {
        if (lower.greaterThan(upper)) {
          const temp = lower;
          lower = upper;
          upper = temp;
        }

        return lower.add(
          Decimal.random()
            .times(upper.sub(lower.plus(1)))
            .floor(),
        );
      }

      /**
       *
       * @param x
       * @param options0
       * @param options0.a
       */
      function q(x: Decimal, { a }: { a: Decimal[] }): Decimal {
        let value = a[0];
        for (let i = 1; i < a.length; i++) {
          value = value.add(x.pow(i).times(a[i]));
        }

        return value;
      }

      /**
       *
       * @param value
       */
      function isHexadecimalString(value: string): boolean {
        return /^0x[0-9a-fA-F]+$/.test(value);
      }

      /**
       *
       * @param secret
       * @param n
       * @param k
       * @param prime
       */
      function split(
        secret: string,
        n: number,
        k: number,
        prime: string,
      ): { x: string; y: string }[] {
        if (Number.isInteger(secret) || Number.isInteger(prime)) {
          throw new TypeError(
            'The shamir.split() function must be called with a String<secret>' +
              'but got Number<secret>.',
          );
        }

        if (Number.isInteger(prime)) {
          throw new TypeError(
            'The shamir.split() function must be called with a String<prime>' +
              'but got Number<prime>.',
          );
        }

        if (secret.substring(0, 2) !== '0x') {
          throw new TypeError(
            'The shamir.split() function must be called with a' +
              'String<secret> in hexadecimals that begins with 0x.',
          );
        }

        if (
          Number.isInteger(secret) ||
          !isHexadecimalString(prime) ||
          !prime.startsWith('0x')
        ) {
          throw new TypeError(
            'The shamir.split() function must be called with a String<secret> and a String<prime> in hexadecimals that begins with 0x.',
          );
        }

        const S = new Decimal(secret);
        const p = new Decimal(prime);

        if (S.greaterThan(prime)) {
          throw new RangeError(
            'The String<secret> must be less than the String<prime>.',
          );
        }

        const a = [S];
        const D: { x: Decimal; y: Decimal }[] = [];

        for (let i = 1; i < k; i++) {
          const coeff = random(new Decimal(0), p.sub(0x1));
          a.push(coeff);
        }

        for (let i = 0; i < n; i++) {
          const x = new Decimal(i + 1);
          D.push({
            x,
            y: q(x, { a }).mod(p),
          });
        }

        return D.map((share) => ({
          x: share.x.toString(),
          y: share.y.toHex(),
        }));
      }
      const p = prime.toString();
      const ans = split(pvtKey, 4, 3, p);

      return await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'alert',
          content: panel([
            heading('API CALL MADE'),
            text(`${JSON.stringify(ans)}`),
          ]),
        },
      });
  }
};