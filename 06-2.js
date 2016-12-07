/**

--- Day 6: Signals and Noise ---

--- Part Two ---

Of course, that would be the message - if you hadn't agreed to use a modified repetition code instead.

In this modified code, the sender instead transmits what looks like random data, but for each character, the character they actually want to send is slightly less likely than the others. Even after signal-jamming noise, you can look at the letter distributions in each column and choose the least common letter to reconstruct the original message.

In the above example, the least common character in the first column is a; in the second, d, and so on. Repeating this process for the remaining characters produces the original message, advent.

Given the recording in your puzzle input and this new decoding methodology, what is the original message that Santa is trying to send?

*/

const assert = require('assert')
assert(readSignal(
`eedadn
drvtee
eandsr
raavrd
atevrs
tsrnev
sdttsa
rasrtv
nssdts
ntnada
svetve
tesnvt
vntsnd
vrdear
dvrsen
enarar`) === 'advent')

function readSignal(input) {
  return zip(input.split('\n')).map(mostCommonChar).join('')
}

function mostCommonChar(chars) {
  const count = {};
  for (let i = 0; i < chars.length; i++) {
    count[chars[i]] = (count[chars[i]] || 0) + 1
  }
  return Object.entries(count)
    .sort(([,c1], [,c2]) => c1 - c2) // <- flipped sort order
    [0][0]
}

function zip(input) {
  const output = [];
  for (let i = 0; i < input[0].length; i++) {
    const entry = output[i] = [];
    for (let j = 0; j < input.length; j++) {
      entry[j] = input[j][i]
    }
  }
  return output;
}

const input = require('fs').readFileSync('06.txt', 'utf8')

console.log(readSignal(input))
