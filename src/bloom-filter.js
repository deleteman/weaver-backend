const BITS = 8192;
const BYTES = BITS / 8; // 1024 bytes
const K = 3;            // number of hash functions

function fnv1a(str) {
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash = Math.imul(hash, 16777619) >>> 0;
    }
    return hash;
}

function djb2(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0;
    }
    return hash;
}

// Kirsch-Mitzenmacher double-hashing: h_i(x) = h1(x) + i * h2(x)
// Produces K independent positions from two base hashes without K separate hash functions.
function getBitPositions(key) {
    const h1 = fnv1a(key);
    const h2 = djb2(key);
    return Array.from({ length: K }, (_, i) => ((h1 + i * h2) >>> 0) % BITS);
}

class BloomFilter {
    constructor(bytes = null) {
        this.bytes = bytes instanceof Uint8Array ? bytes : new Uint8Array(BYTES);
    }

    add(key) {
        for (const pos of getBitPositions(key)) {
            this.bytes[pos >> 3] |= 1 << (pos & 7);
        }
    }

    has(key) {
        return getBitPositions(key).every(pos => (this.bytes[pos >> 3] & (1 << (pos & 7))) !== 0);
    }

    // URL-safe base64 (no +, /, or = padding) so the value can go directly in a query param.
    toBase64() {
        const buf = Buffer.from(this.bytes.buffer, this.bytes.byteOffset, this.bytes.byteLength);
        return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }

    static fromBase64(str) {
        // Restore standard base64 before decoding.
        const padded = str.replace(/-/g, '+').replace(/_/g, '/') +
            '=='.slice(0, (4 - (str.length % 4)) % 4);
        const buf = Buffer.from(padded, 'base64');
        if (buf.length !== BYTES) throw new Error(`Bloom filter must be ${BYTES} bytes`);
        return new BloomFilter(new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength));
    }

    static empty() {
        return new BloomFilter();
    }
}

module.exports = { BloomFilter, BLOOM_BITS: BITS, BLOOM_K: K };
