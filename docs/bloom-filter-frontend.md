# Bloom Filter — Frontend Integration Guide

The backend now accepts an optional `?bf=<base64>` query parameter on the
`GET /api/map/:x/:y/:radius` endpoint. When provided, each tile in the response
will have `isDiscovered: true` if the player has previously visited that coordinate.

The filter is a fixed-size **8192-bit bloom filter** serialised as URL-safe base64
(~1,365 characters, always the same length regardless of how many coordinates are stored).
It lives entirely in `localStorage` — the server never stores it.

A bloom filter can produce **false positives** (a tile shows as discovered when it wasn't),
but never false negatives (a visited tile will always show as discovered). At 500 visited
coordinates the false positive rate is under 2%, which is acceptable for fog-of-war.

---

## Step 1 — Copy the BloomFilter class

Create `bloomFilter.js`. The hash functions are **identical** to the backend — do not
change them or `isDiscovered` will be wrong for every tile.

```js
// bloomFilter.js
const BITS = 8192;
const BYTES = BITS / 8; // 1024
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
function getBitPositions(key) {
    const h1 = fnv1a(key);
    const h2 = djb2(key);
    return Array.from({ length: K }, (_, i) => ((h1 + i * h2) >>> 0) % BITS);
}

export class BloomFilter {
    constructor(bytes = null) {
        this.bytes = bytes instanceof Uint8Array ? bytes : new Uint8Array(BYTES);
    }

    add(key) {
        for (const pos of getBitPositions(key)) {
            this.bytes[pos >> 3] |= 1 << (pos & 7);
        }
    }

    has(key) {
        return getBitPositions(key).every(
            pos => (this.bytes[pos >> 3] & (1 << (pos & 7))) !== 0
        );
    }

    // URL-safe base64 — uses only [A-Za-z0-9\-_], safe in query strings without escaping.
    toBase64() {
        return btoa(String.fromCharCode(...this.bytes))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }

    static fromBase64(str) {
        const padded = str.replace(/-/g, '+').replace(/_/g, '/') +
            '=='.slice(0, (4 - (str.length % 4)) % 4);
        const binary = atob(padded);
        const bytes = new Uint8Array(BYTES);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return new BloomFilter(bytes);
    }

    // Load from localStorage, or return a fresh empty filter.
    static load() {
        try {
            const stored = localStorage.getItem('discoveryFilter');
            return stored ? BloomFilter.fromBase64(stored) : new BloomFilter();
        } catch {
            // Corrupted storage — start fresh.
            localStorage.removeItem('discoveryFilter');
            return new BloomFilter();
        }
    }

    static save(filter) {
        localStorage.setItem('discoveryFilter', filter.toBase64());
    }
}
```

---

## Step 2 — Mark a coordinate as visited after every chunk load

Call this every time `GET /api/chunk/:x/:y` succeeds.

```js
import { BloomFilter } from './bloomFilter.js';

async function loadChunk(x, y) {
    const response = await fetch(`/api/chunk/${x}/${y}`);
    const chunk = await response.json();

    const filter = BloomFilter.load();
    filter.add(`${x},${y}`);   // key format: "x,y" — no spaces, no "world_X" prefix
    BloomFilter.save(filter);

    return chunk;
}
```

> **Key format is critical.** The backend checks membership using the string `` `${x},${y}` ``
> (e.g. `"0,0"`, `"-3,7"`). Any deviation means `isDiscovered` will always be `false`.

---

## Step 3 — Send the filter when requesting the map

```js
import { BloomFilter } from './bloomFilter.js';

async function loadMiniMap(x, y, radius = 1) {
    const filter = BloomFilter.load();
    const url = `/api/map/${x}/${y}/${radius}?bf=${filter.toBase64()}`;
    const response = await fetch(url);
    return response.json();
}
```

No `encodeURIComponent` is needed — URL-safe base64 only uses `[A-Za-z0-9\-_]`.

---

## Reference

| Property | Value |
|----------|-------|
| Filter size | Always 1,024 bytes → ~1,365 base64 chars |
| localStorage key | `"discoveryFilter"` |
| False positive rate | <0.7% at 100 visits, <2% at 500 visits, <6% at 1,000 visits |
| Reset for new game | `localStorage.removeItem('discoveryFilter')` |
| Corruption handling | `BloomFilter.load()` catches any parse error and resets automatically |
| `?bf` omitted | All tiles return `isDiscovered: false` (safe default, matches old behaviour) |
