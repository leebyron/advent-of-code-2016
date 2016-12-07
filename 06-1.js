/**

--- Day 6: Signals and Noise ---

Something is jamming your communications with Santa. Fortunately, your signal is only partially jammed, and protocol in situations like this is to switch to a simple repetition code to get the message through.

In this model, the same message is sent repeatedly. You've recorded the repeating message signal (your puzzle input), but the data seems quite corrupted - almost too badly to recover. Almost.

All you need to do is figure out which character is most frequent for each position. For example, suppose you had recorded the following messages:

eedadn
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
enarar
The most common character in the first column is e; in the second, a; in the third, s, and so on. Combining these characters returns the error-corrected message, easter.

Given the recording in your puzzle input, what is the error-corrected version of the message being sent?

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
enarar`) === 'easter')

function readSignal(input) {
  return zip(input.split('\n')).map(mostCommonChar).join('')
}

function mostCommonChar(chars) {
  const count = {};
  for (let i = 0; i < chars.length; i++) {
    count[chars[i]] = (count[chars[i]] || 0) + 1
  }
  return Object.entries(count)
    .sort(([,c1], [,c2]) => c2 - c1)
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
