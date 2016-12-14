/*

--- Day 13: A Maze of Twisty Little Cubicles ---

--- Part Two ---

How many locations (distinct x,y coordinates, including your starting location) can you reach in at most 50 steps?

*/

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

function positionsWithinDistance(favoriteNumber, fromX, fromY, distance) {
  if (!isOpenSpace(favoriteNumber, fromX, fromY)) {
    throw new Error('Origin is a wall')
  }

  const visitedPositions = Object.create(null)
  const queue = makeQueue()

  // Push initial state
  visitedPositions[fromX + ',' + fromY] = true
  push(queue, [ fromX, fromY, 0 ]) // Note: use 3rd index as "steps taken"

  let position
  while (position = pop(queue)) {
    // Don't walk further than distance
    if (position[2] === distance) {
      continue;
    }

    for (let i = 0; i < 4; i++) {
      const x = i % 2 === 0 ? position[0] : position[0] + i - 2
      const y = i % 2 === 1 ? position[1] : position[1] + i - 1

      // Explore next in a BFS
      if (isOpenSpace(favoriteNumber, x, y)) {
        // Don't visit the same spot twice
        const key = x + ',' + y
        if (!visitedPositions[key]) {
          visitedPositions[key] = true
          push(queue, [ x, y, position[2] + 1 ])
        }
      }
    }
  }

  return visitedPositions
}

function visualizePositions(favoriteNumber, distance, positions) {
  let maxX = 5
  let maxY = 5
  Object.keys(positions).forEach(pos => {
    const [ x, y ] = pos.split(',')
    maxX = Math.max(maxX, x)
    maxY = Math.max(maxY, y)
  })
  let display = ''
  for (let y = 0; y < maxY + 5; y++) {
    for (let x = 0; x < maxX + 5; x++) {
      display +=
        positions[x + ',' + y] ? '()' :
        isOpenSpace(favoriteNumber, x, y) ? '  ' : '##'
    }
    display += '\n'
  }
  console.log(display)
}

const positions = positionsWithinDistance(1350, 1, 1, 50)
visualizePositions(1350, 50, positions)
console.log(Object.keys(positions).length)
