"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("crypto");
var SharmirsSecretSharing = /** @class */ (function () {
    function SharmirsSecretSharing() {
    }
    var _a;
    _a = SharmirsSecretSharing;
    SharmirsSecretSharing.stdPrime = 4294967389n; // smallest prime larger than 2^32
    SharmirsSecretSharing.rndInt = function () {
        return (0, crypto_1.randomBytes)(64).readBigUInt64BE() % _a.stdPrime;
    };
    SharmirsSecretSharing.split = function (secret, totalShards, threshold) {
        if (threshold <= 0 || totalShards <= 0 || threshold > totalShards) {
            throw new Error('k should be less than total shards');
        }
        var buffer = Buffer.from(secret, 'utf-8');
        var fragShardTable = [];
        for (var i = 0; i < totalShards; i++) {
            fragShardTable[i] = [
                i.toString(16).padStart(4, '0'),
                threshold.toString(16).padStart(4, '0'),
                (4 - (buffer.byteLength % 4)).toString(),
            ];
        }
        for (var i = 0; i < Math.ceil(buffer.byteLength / 4); i++) {
            var fragment = buffer[i * 4 + 3] || 0;
            fragment *= 256;
            fragment += buffer[i * 4 + 2] || 0;
            fragment *= 256;
            fragment += buffer[i * 4 + 1] || 0;
            fragment *= 256;
            fragment += buffer[i * 4];
            _a.splitFrag(fragment, totalShards, threshold).map(function (shard, j) {
                fragShardTable[j].push(shard);
            });
        }
        return fragShardTable.map(function (row) {
            return row.join('');
        });
    };
    SharmirsSecretSharing.combine = function (shards) {
        var fragShardTable = [];
        var threshold = 0, remainder = 0;
        shards.forEach(function (shard) {
            threshold += Number("0x".concat(shard.slice(4, 8)));
            remainder += Number(shard.slice(8, 9));
        });
        if (shards.length != Math.round(threshold / shards.length)) {
            throw new Error('shard count not equal to threshold');
        }
        shards.slice(0, shards.length).forEach(function (shard) {
            var index = Number("0x".concat(shard.slice(0, 4)));
            for (var i = 0; i < Math.ceil(shard.length / 8); i++) {
                var fragShard = shard.slice(i * 8 + 9, i * 8 + 17);
                if (!fragShard) {
                    break;
                }
                if (!fragShardTable[i]) {
                    fragShardTable[i] = [];
                }
                fragShardTable[i].push({
                    id: index + 1,
                    data: BigInt("0x".concat(fragShard)),
                });
            }
        });
        var buffer = Buffer.from(new Uint8Array(fragShardTable.length * 4));
        fragShardTable.forEach(function (row, index) {
            var fragment = _a.combineFrag(row);
            buffer[4 * index] = fragment % 256;
            fragment /= 256;
            buffer[4 * index + 1] = fragment % 256;
            fragment /= 256;
            buffer[4 * index + 2] = fragment % 256;
            fragment /= 256;
            buffer[4 * index + 3] = fragment % 256;
        });
        return buffer
            .slice(0, buffer.byteLength - (Math.round(remainder / shards.length) % 4))
            .toString('utf-8');
    };
    SharmirsSecretSharing.splitFrag = function (secret, n, k) {
        var coeff = [BigInt(secret)];
        for (var i = 1; i < k; i++) {
            coeff.push(_a.rndInt());
        }
        var shards = [];
        for (var i = 1; i <= n; i++) {
            var accum = coeff[0];
            for (var j = 1; j < k; j++) {
                accum =
                    (accum +
                        ((coeff[j] * (BigInt(Math.pow(i, j)) % _a.stdPrime)) % _a.stdPrime)) %
                        _a.stdPrime;
            }
            shards.push(accum.toString(16).padStart(8, '0'));
        }
        return shards;
    };
    SharmirsSecretSharing.combineFrag = function (shards) {
        var accum = 0n, start, next;
        for (var i = 0; i < shards.length; i++) {
            var numerator = 1n, denominator = 1n;
            for (var j = 0; j < shards.length; j++) {
                if (i == j)
                    continue;
                start = shards[i].id;
                next = shards[j].id;
                numerator = (numerator * BigInt(-next)) % _a.stdPrime;
                denominator = (denominator * BigInt(start - next)) % _a.stdPrime;
            }
            accum =
                (_a.stdPrime +
                    accum +
                    shards[i].data * numerator * _a.modInv(denominator)) %
                    _a.stdPrime;
            while (accum < 0n) {
                accum += _a.stdPrime;
            }
        }
        return Number(accum);
    };
    SharmirsSecretSharing.gcd = function (a, b) {
        if (b == 0n)
            return [a, 1n, 0n];
        else {
            var n = a / b, c = a % b, r = _a.gcd(b, c);
            return [r[0], r[2], r[1] - r[2] * n];
        }
    };
    SharmirsSecretSharing.modInv = function (k) {
        k = k % _a.stdPrime;
        var r = k < 0 ? -_a.gcd(_a.stdPrime, -k)[2] : _a.gcd(_a.stdPrime, k)[2];
        return (_a.stdPrime + r) % _a.stdPrime;
    };
    return SharmirsSecretSharing;
}());
exports.default = SharmirsSecretSharing;
