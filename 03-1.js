/*

--- Day 3: Squares With Three Sides ---

Now that you can think clearly, you move deeper into the labyrinth of hallways and office furniture that makes up this part of Easter Bunny HQ. This must be a graphic design department; the walls are covered in specifications for triangles.

Or are they?

The design document gives the side lengths of each triangle it describes, but... 5 10 25? Some of these aren't triangles. You can't help but mark the impossible ones.

In a valid triangle, the sum of any two sides must be larger than the remaining side. For example, the "triangle" given above is impossible, because 5 + 10 is not larger than 25.

In your puzzle input, how many of the listed triangles are possible?

*/

function isValidTriangle(sides) {
  const sortedSides = sides.slice().sort((a, b) => a < b ? 1 : -1)
  return sortedSides[0] < sortedSides[1] + sortedSides[2]
}

function parseTriangles(input) {
  return input.split('\n').map(line => [
    parseInt(line.substr(0, 5), 10),
    parseInt(line.substr(5, 10), 10),
    parseInt(line.substr(10, 15), 10)
  ])
}

function countValidTriangles(input) {
  return parseTriangles(input).filter(isValidTriangle).length
}

const input = require('fs').readFileSync('03.txt', 'utf8');

console.log(countValidTriangles(input))
