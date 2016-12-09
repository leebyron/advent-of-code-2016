/*

--- Day 7: Internet Protocol Version 7 ---

While snooping around the local network of EBHQ, you compile a list of IP addresses (they're IPv7, of course; IPv6 is much too limited). You'd like to figure out which IPs support TLS (transport-layer snooping).

An IP supports TLS if it has an Autonomous Bridge Bypass Annotation, or ABBA. An ABBA is any four-character sequence which consists of a pair of two different characters followed by the reverse of that pair, such as xyyx or abba. However, the IP also must not have an ABBA within any hypernet sequences, which are contained by square brackets.

For example:

abba[mnop]qrst supports TLS (abba outside square brackets).
abcd[bddb]xyyx does not support TLS (bddb is within square brackets, even though xyyx is outside square brackets).
aaaa[qwer]tyui does not support TLS (aaaa is invalid; the interior characters must be different).
ioxxoj[asdfgh]zxcvbn supports TLS (oxxo is outside square brackets, even though it's within a larger string).
How many IPs in your puzzle input support TLS?

*/

const assert = require('assert')
assert(supportsTLS('abba[mnop]qrst') === true)
assert(supportsTLS('abcd[bddb]xyyx') === false)
assert(supportsTLS('aaaa[qwer]tyui') === false)
assert(supportsTLS('ioxxoj[asdfgh]zxcvbn') === true)
assert(supportsTLS('abcd[abcd][dccd]abcd') === false)
assert(supportsTLS('xyyx[bddb]abcd') === false)

function supportsTLS(ip7) {
  let inHypernet = false
  let foundABBA = false

  for (let i = 1, l = ip7.length - 2; i < l; i++) {
    let ch = ip7[i]

    if (ch === '[') {
      inHypernet = true
      continue
    }

    if (ch === ']') {
      inHypernet = false
      continue
    }

    if (ch === ip7[i + 1] && ch !== ip7[i - 1] && ip7[i - 1] === ip7[i + 2]) {
      if (inHypernet) {
        return false
      }
      foundABBA = true
    }
  }

  return foundABBA
}

function countSupportTLS(input) {
  return input.split('\n').filter(supportsTLS).length
}

const input = require('fs').readFileSync('07.txt', 'utf8')

console.log(countSupportTLS(input))
