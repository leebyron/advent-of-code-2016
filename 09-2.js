/*

--- Day 9: Explosives in Cyberspace ---

--- Part Two ---

Apparently, the file actually uses version two of the format.

In version two, the only difference is that markers within decompressed data are decompressed. This, the documentation explains, provides much more substantial compression capabilities, allowing many-gigabyte files to be stored in only a few kilobytes.

For example:

(3x3)XYZ still becomes XYZXYZXYZ, as the decompressed section contains no markers.
X(8x2)(3x3)ABCY becomes XABCABCABCABCABCABCY, because the decompressed data from the (8x2) marker is then further decompressed, thus triggering the (3x3) marker twice for a total of six ABC sequences.
(27x12)(20x12)(13x14)(7x10)(1x12)A decompresses into a string of A repeated 241920 times.
(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN becomes 445 characters long.
Unfortunately, the computer you brought probably doesn't have enough memory to actually decompress the file; you'll have to come up with another way to get its decompressed length.

What is the decompressed length of the file using this improved format?

*/

const assert = require('assert')
assert(decompressLength('ADVENT') === 6)
assert(decompressLength('(3x3)XYZ') === 9)
assert(decompressLength('X(8x2)(3x3)ABCY') === 20)
assert(decompressLength('(27x12)(20x12)(13x14)(7x10)(1x12)A') === 241920)
assert(decompressLength('(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN') === 445)

function decompressLength(input) {
  let output = 0
  let i = 0
  while (i < input.length) {
    const ch = input[i++]

    // Ignore whitespace
    if (ch === ' ' || ch === '\n') {
      continue
    }

    // If it's not a "marker", just add to the output.
    if (ch !== '(') {
      output += 1
      continue
    }
    // Otherwise, read up to x to get length
    let s = i++
    while (input[i++] !== 'x') {}
    const length = parseInt(input.slice(s, i - 1), 10)

    // Then read up to ) to get count
    s = i++
    while (input[i++] !== ')') {}
    let count = parseInt(input.slice(s, i - 1), 10)

    // Use length to get the data to repeat, and repeat it count times.
    const rawData = input.slice(i, i + length)
    // v2: first decompress the compressed section.
    const data = decompressLength(rawData)
    while (count--) {
      output += data
    }

    // Advance the pointer by length
    i += length
  }
  return output
}

const input = require('fs').readFileSync('09.txt', 'utf8')
console.log(decompressLength(input))
