/*

--- Day 11: Radioisotope Thermoelectric Generators ---

--- Part Two ---

You step into the cleanroom separating the lobby from the isolated area and put on the hazmat suit.

Upon entering the isolated containment area, however, you notice some extra parts on the first floor that weren't listed on the record outside:

An elerium generator.
An elerium-compatible microchip.
A dilithium generator.
A dilithium-compatible microchip.
These work just like the other generators and microchips. You'll have to get them up to assembly as well.

What is the minimum number of steps required to bring all of the objects, including these four new ones, to the fourth floor?

*/

const KIND = [ 'G', 'M' ]
const ELEMENT = [ 'Pm', 'Co', 'Cm', 'Ru', 'Pu', 'El', 'Dl' ]

function visualizeState(state) {
  const floors = [ 'F1', 'F2', 'F3', 'F4' ]
  for (let f = 0; f < floors.length; f++) {
    floors[f] += f === state.elevator ? ' <E>' : ' .  '
  }
  for (let i = 0; i < state.items.length; i++) {
    for (let f = 0; f < floors.length; f++) {
      const k = i % 2
      const e = (i - k) / 2
      floors[f] += state.items[i] === f ? ' ' + ELEMENT[e] + KIND[k] : ' .  '
    }
  }
  console.log(floors.reverse().join('\n'))
  console.log('==============================================================')
}

function isFinalState(state) {
  for (let i = 0; i < state.items.length; i++) {
    if (state.items[i] !== 3) {
      return false
    }
  }
  return true
}

// A state is invalid if any Microchip (items[e + 1]) is not near it's Generator
// (items[e]) but on the same floor of another Generator.
function isValidState(state) {
  const items = state.items
  for (let i = 0; i < items.length; i += 2) {
    if (items[i] !== items[i + 1]) {
      for (let j = 0; j < items.length; j += 2) {
        if (items[j] === items[i + 1]) {
          return false
        }
      }
    }
  }
  return true
}

// If we think of all the possible states as a graph, with edges between
// possible moves, we don't want to get caught in a cycle, so we remember which
// edges we've explored and don't explore them again.
function nextValidUnexploredStates(exploredStates, state) {
  const possibleStates = nextPossibleStates(state)
  return possibleStates.filter(state => {
    const hash = stateHash(state)
    if (exploredStates[hash]) {
      return false
    }
    exploredStates[hash] = true
    return isValidState(state)
  })
}

// Note: a configuration with different elements in the same microchip + generator
// position would eventually reach the same outcome, so this hash intentionally
// looses that information via sorting pairs lexically.
function stateHash(state) {
  const elementPairs = [];
  for (let i = 0; i < state.items.length; i += 2) {
    elementPairs.push(String(state.items[i]) + String(state.items[i + 1]))
  }
  return state.elevator + elementPairs.sort().join('')
}

// From any position, the elevator can move one up or one down and take with it
// 1 or 2 items. Bias towards keeping more items higher on the elevator.
// Note: The elevator only works if it has an item in it.
function nextPossibleStates(state) {
  const canMove = []
  for (let i = 0; i < state.items.length; i++) {
    if (state.items[i] === state.elevator) {
      canMove.push(i)
    }
  }

  const states = []
  if (state.elevator !== 3) {
    for (let i = 0; i < canMove.length; i++) {
      for (let j = i + 1; j < canMove.length; j++) {
        states.push(movedState(states, state, 1, canMove[i], canMove[j]))
      }
      states.push(movedState(states, state, 1, canMove[i]))
    }
  }
  if (state.elevator !== 0) {
    for (let i = 0; i < canMove.length; i++) {
      states.push(movedState(states, state, -1, canMove[i]))
      for (let j = i + 1; j < canMove.length; j++) {
        states.push(movedState(states, state, -1, canMove[i], canMove[j]))
      }
    }
  }
  return states
}

// Compute a state which is one move away from the previous state
function movedState(states, state, direction, itemA, itemB) {
  const nextState = {}
  for (let item in state) {
    nextState[item] = state[item]
  }
  nextState.elevator += direction
  nextState.items = nextState.items.slice()
  nextState.items[itemA] += direction
  if (itemB !== undefined) {
    nextState.items[itemB] += direction
  }
  return nextState
}

// Add to a stack, used for keeping track of the path of moves towards a
// final state.
function conj(prev, state) {
  return { prev, state }
}

// Use a LL queue instead of an array for max perf.
function makeQueue() {
  return { head: null, tail: null, length: 0 }
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
  queue.length++
}

function pop(queue) {
  const node = queue.tail
  if (node) {
    queue.tail = node.next
    if (!queue.tail) {
      queue.head = null
    }
    node.next = null
    queue.length--
    return node.value
  }
}

// This will do a breadth-first-search over the possible states of the world.
// Essentially, djikstra's graph search algorithm.
function searchForSolution(initialState) {
  const exploredStates = {}

  const queue = makeQueue()
  push(queue, conj(null, initialState))

  let node
  while (node = pop(queue)) {
    const { state } = node

    // Return final state as a solution path.
    if (isFinalState(state)) {
      const steps = []
      while (node) {
        steps.push(node.state)
        node = node.prev
      }
      return steps.reverse()
    }

    // Otherwise continue the BFS
    const nextStates = nextValidUnexploredStates(exploredStates, state)
    for (let i = 0; i < nextStates.length; i++) {
      push(queue, conj(node, nextStates[i]))
    }
  }

  throw new Error('No solution found')
}

function visualizeSolution(solution) {
  solution.forEach(state => {
    sleep(150)
    console.log('\x1b[2J\x1b[H')
    visualizeState(state)
  })
}

function sleep(time) {
  var stop = Date.now() + time
  while (Date.now() < stop) {}
}

// The first floor contains a promethium generator and a promethium-compatible microchip.
// The second floor contains a cobalt generator, a curium generator, a ruthenium generator, and a plutonium generator.
// The third floor contains a cobalt-compatible microchip, a curium-compatible microchip, a ruthenium-compatible microchip, and a plutonium-compatible microchip.
const initialState = {
  elevator: 0,
  items: [
    0, 0, // Promethium
    1, 2, // Cobalt
    1, 2, // Curium
    1, 2, // Ruthenium
    1, 2, // Plutonium
    0, 0, // Elerium
    0, 0, // Dilithium
  ]
}

const solution = searchForSolution(initialState)
visualizeSolution(solution)
console.log('Found solution! Only ' + (solution.length - 1) + ' steps.')
