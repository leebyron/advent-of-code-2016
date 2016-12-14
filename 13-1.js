/*

--- Day 13: A Maze of Twisty Little Cubicles ---

You arrive at the first floor of this new building to discover a much less welcoming environment than the shiny atrium of the last one. Instead, you are in a maze of twisty little cubicles, all alike.

Every location in this area is addressed by a pair of non-negative integers (x,y). Each such coordinate is either a wall or an open space. You can't move diagonally. The cube maze starts at 0,0 and seems to extend infinitely toward positive x and y; negative values are invalid, as they represent a location outside the building. You are in a small waiting area at 1,1.

While it seems chaotic, a nearby morale-boosting poster explains, the layout is actually quite logical. You can determine whether a given x,y coordinate will be a wall or an open space using a simple system:

Find x*x + 3*x + 2*x*y + y + y*y.
Add the office designer's favorite number (your puzzle input).
Find the binary representation of that sum; count the number of bits that are 1.
If the number of bits that are 1 is even, it's an open space.
If the number of bits that are 1 is odd, it's a wall.
For example, if the office designer's favorite number were 10, drawing walls as # and open spaces as ., the corner of the building containing 0,0 would look like this:

  0123456789
0 .#.####.##
1 ..#..#...#
2 #....##...
3 ###.#.###.
4 .##..#..#.
5 ..##....#.
6 #...##.###
Now, suppose you wanted to reach 7,4. The shortest route you could take is marked as O:

  0123456789
0 .#.####.##
1 .O#..#...#
2 #OOO.##...
3 ###O#.###.
4 .##OO#OO#.
5 ..##OOO.#.
6 #...##.###
Thus, reaching 7,4 would take a minimum of 11 steps (starting from your current location, 1,1).

What is the fewest number of steps required for you to reach 31,39?

Your puzzle input is 1350.

*/

const assert = require('assert')
assert(findPath(10, 1, 1, 7, 4).length - 1 === 11)
// visualizeSolution(10, findPath(10, 1, 1, 7, 4))

function isOpenSpace(favoriteNumber, x, y) {
  if (x < 0 || y < 0) {
    return false
  }
  var val = x*x + 3*x + 2*x*y + y + y*y
  val += favoriteNumber
  return bitCount(val) % 2 === 0
}

function bitCount(x) {
  x = x - ((x >> 1) & 0x55555555)
  x = (x & 0x33333333) + ((x >> 2) & 0x33333333)
  x = (x + (x >> 4)) & 0x0f0f0f0f
  x = x + (x >> 8)
  x = x + (x >> 16)
  return x & 0x7f
}

// Add to a stack, used for keeping track of the path of moves towards a
// final position.
function conj(prev, value) {
  return { prev, value }
}

// Use a LL queue instead of an array for max perf.
function makeQueue() {
  return { head: null, tail: null }
}

function push(queue, value) {
  const node = { next: null, value }
  if (queue.head) {
    queue.head.next = node
  }
  queue.head = node
  if (!queue.tail) {
    queue.tail = node
  }
}

function pop(queue) {
  const node = queue.tail
  if (node) {
    queue.tail = node.next
    if (!queue.tail) {
      queue.head = null
    }
    node.next = null
    return node.value
  }
}

function findPath(favoriteNumber, fromX, fromY, toX, toY) {
  if (!isOpenSpace(favoriteNumber, fromX, fromY)) {
    throw new Error('Origin is a wall')
  }

  if (!isOpenSpace(favoriteNumber, toX, toY)) {
    throw new Error('Destination is a wall')
  }

  const visitedPositions = {}
  const queue = makeQueue()

  // Push initial state
  visitedPositions[fromX + ',' + fromY] = true
  push(queue, conj(null, [ fromX, fromY ]))

  let stackNode
  while (stackNode = pop(queue)) {
    const position = stackNode.value

    for (let i = 0; i < 4; i++) {
      const x = i % 2 === 0 ? position[0] : position[0] + (position[0] > toX ? i - 2 : 2 - i)
      const y = i % 2 === 1 ? position[1] : position[1] + (position[1] > toY ? i - 1 : 1 - i)

      // If the destination is found, return the path from starting position
      if (x === toX && y === toY) {
        const path = [[ x, y ]]
        while (stackNode) {
          path.push(stackNode.value)
          stackNode = stackNode.prev
        }
        return path.reverse()
      }

      // Explore next in a BFS
      if (isOpenSpace(favoriteNumber, x, y)) {
        // Don't visit the same spot twice
        const key = x + ',' + y
        if (!visitedPositions[key]) {
          visitedPositions[key] = true
          push(queue, conj(stackNode, [ x, y ]))
        }
      }
    }
  }

  throw new Error('Could not find path to destination')
}


function visualizeSolution(favoriteNumber, path) {
  path.forEach(position => {
    sleep(150)
    console.log('\x1b[2J\x1b[H')
    visualizePosition(favoriteNumber, position)
  })
}

function visualizePosition(favoriteNumber, position) {
  let display = '@ ' + position[0] + ' x ' + position[1] + '\n'
  for (let y = position[1] - 5; y <= position[1] + 5; y++) {
    for (let x = position[0] - 5; x <= position[0] + 5; x++) {
      display +=
        x === position[0] && y === position[1] ? '()' :
        x < 0 || y < 0 ? '%%' :
        isOpenSpace(favoriteNumber, x, y) ? '  ' : '##'
    }
    display += '\n'
  }
  console.log(display)
}

function sleep(time) {
  var stop = Date.now() + time
  while (Date.now() < stop) {}
}

const path = findPath(1350, 1, 1, 31, 39)
visualizeSolution(1350, path)
console.log(path.length - 1)

