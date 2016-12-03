/*

--- Day 3: Squares With Three Sides ---

--- Part Two ---

Now that you've helpfully marked up their design documents, it occurs to you that triangles are specified in groups of three vertically. Each set of three numbers in a column specifies a triangle. Rows are unrelated.

For example, given the following specification, numbers with the same hundreds digit would be part of the same triangle:

101 301 501
102 302 502
103 303 503
201 401 601
202 402 602
203 403 603

In your puzzle input, and instead reading by columns, how many of the listed triangles are possible?

*/

function isValidTriangle(sides) {
  const sortedSides = sides.slice().sort((a, b) => a < b ? 1 : -1)
  return sortedSides[0] < sortedSides[1] + sortedSides[2]
}

function parseTriangles(input) {
  const rows = input.split('\n').map(line => [
    parseInt(line.substr(0, 5), 10),
    parseInt(line.substr(5, 10), 10),
    parseInt(line.substr(10, 15), 10)
  ])
  return partition(concat(zip(rows)), 3)
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

function concat(input) {
  return input.reduce((out, item) => out.concat(item), []);
}

function partition(input, size) {
  const output = [];
  for (let i = 0; i < input.length; i += size) {
    output.push(input.slice(i, i + size));
  }
  return output;
}

function countValidTriangles(input) {
  return parseTriangles(input).filter(isValidTriangle).length
}

const input = require('fs').readFileSync('03.txt', 'utf8');

console.log(countValidTriangles(input))
