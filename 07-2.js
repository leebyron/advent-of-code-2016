/*

--- Day 7: Internet Protocol Version 7 ---

--- Part Two ---

You would also like to know which IPs support SSL (super-secret listening).

An IP supports SSL if it has an Area-Broadcast Accessor, or ABA, anywhere in the supernet sequences (outside any square bracketed sections), and a corresponding Byte Allocation Block, or BAB, anywhere in the hypernet sequences. An ABA is any three-character sequence which consists of the same character twice with a different character between them, such as xyx or aba. A corresponding BAB is the same characters but in reversed positions: yxy and bab, respectively.

For example:

aba[bab]xyz supports SSL (aba outside square brackets with corresponding bab within square brackets).
xyx[xyx]xyx does not support SSL (xyx, but no corresponding yxy).
aaa[kek]eke supports SSL (eke in supernet with corresponding kek in hypernet; the aaa sequence is not related, because the interior character must be different).
zazbz[bzb]cdb supports SSL (zaz has no corresponding aza, but zbz has a corresponding bzb, even though zaz and zbz overlap).

*/

const assert = require('assert')
// assert(supportsTLS('abba[mnop]qrst') === true)
// assert(supportsTLS('abcd[bddb]xyyx') === false)
// assert(supportsTLS('aaaa[qwer]tyui') === false)
// assert(supportsTLS('ioxxoj[asdfgh]zxcvbn') === true)
// assert(supportsTLS('abcd[abcd][dccd]abcd') === false)
// assert(supportsTLS('xyyx[bddb]abcd') === false)

assert(supportsSSL('aba[bab]xyz') === true)
assert(supportsSSL('xyx[xyx]xyx') === false)
assert(supportsSSL('aaa[kek]eke') === true)
assert(supportsSSL('zazbz[bzb]cdb') === true)
assert(supportsSSL('zaz[zaz]aza') === true)
assert(supportsSSL('aba[xyz]bab') === false)


function supportsSSL(ip7) {
  let inHypernet = false
  const ABAs = {} // 'AB' for ABA
  const BABs = {} // 'AB' for ABA

  for (let i = 1, l = ip7.length - 1; i < l; i++) {
    let ch = ip7[i]

    if (ch === '[') {
      inHypernet = true
      continue
    }

    if (ch === ']') {
      inHypernet = false
      continue
    }

    const nextCh = ip7[i + 1]
    if (ch !== nextCh && nextCh === ip7[i - 1]) {
      // Does the corresponding pair exist?
      if (inHypernet ? ABAs[nextCh + ch] : BABs[nextCh + ch]) {
        return true
      }
      // Otherwise, record this pair for future comparison
      (inHypernet ? BABs : ABAs)[ch + nextCh] = true;
    }
  }

  return false
}

function countSupportSSL(input) {
  return input.split('\n').filter(supportsSSL).length
}

const input = require('fs').readFileSync('07.txt', 'utf8')

console.log(countSupportSSL(input))
