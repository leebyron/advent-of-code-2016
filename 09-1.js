/*

--- Day 9: Explosives in Cyberspace ---

Wandering around a secure area, you come across a datalink port to a new part of the network. After briefly scanning it for interesting files, you find one file in particular that catches your attention. It's compressed with an experimental format, but fortunately, the documentation for the format is nearby.

The format compresses a sequence of characters. Whitespace is ignored. To indicate that some sequence should be repeated, a marker is added to the file, like (10x2). To decompress this marker, take the subsequent 10 characters and repeat them 2 times. Then, continue reading the file after the repeated data. The marker itself is not included in the decompressed output.

If parentheses or other characters appear within the data referenced by a marker, that's okay - treat it like normal data, not a marker, and then resume looking for markers after the decompressed section.

For example:

ADVENT contains no markers and decompresses to itself with no changes, resulting in a decompressed length of 6.
A(1x5)BC repeats only the B a total of 5 times, becoming ABBBBBC for a decompressed length of 7.
(3x3)XYZ becomes XYZXYZXYZ for a decompressed length of 9.
A(2x2)BCD(2x2)EFG doubles the BC and EF, becoming ABCBCDEFEFG for a decompressed length of 11.
(6x1)(1x3)A simply becomes (1x3)A - the (1x3) looks like a marker, but because it's within a data section of another marker, it is not treated any differently from the A that comes after it. It has a decompressed length of 6.
X(8x2)(3x3)ABCY becomes X(3x3)ABC(3x3)ABCY (for a decompressed length of 18), because the decompressed data from the (8x2) marker (the (3x3)ABC) is skipped and not processed further.
What is the decompressed length of the file (your puzzle input)? Don't count whitespace.

*/

const assert = require('assert')
assert(decompress('ADVENT') === 'ADVENT')
assert(decompress('A(1x5)BC') === 'ABBBBBC')
assert(decompress('(3x3)XYZ') === 'XYZXYZXYZ')
assert(decompress('A(2x2)BCD(2x2)EFG') === 'ABCBCDEFEFG')
assert(decompress('(6x1)(1x3)A') === '(1x3)A')
assert(decompress('X(8x2)(3x3)ABCY') === 'X(3x3)ABC(3x3)ABCY')

function decompress(input) {
  let output = ''
  let i = 0
  while (i < input.length) {
    const ch = input[i++]

    // Ignore whitespace
    if (ch === ' ' || ch === '\n') {
      continue
    }

    // If it's not a "marker", just add to the output.
    if (ch !== '(') {
      output += ch
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
    const data = input.slice(i, i + length)
    while (count--) {
      output += data
    }

    // Advance the pointer by length
    i += length
  }
  return output
}

const input = require('fs').readFileSync('09.txt', 'utf8')
console.log(decompress(input).length)
