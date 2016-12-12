/*

--- Day 11: Radioisotope Thermoelectric Generators ---

You come upon a column of four floors that have been entirely sealed off from the rest of the building except for a small dedicated lobby. There are some radiation warnings and a big sign which reads "Radioisotope Testing Facility".

According to the project status board, this facility is currently being used to experiment with Radioisotope Thermoelectric Generators (RTGs, or simply "generators") that are designed to be paired with specially-constructed microchips. Basically, an RTG is a highly radioactive rock that generates electricity through heat.

The experimental RTGs have poor radiation containment, so they're dangerously radioactive. The chips are prototypes and don't have normal radiation shielding, but they do have the ability to generate an elecromagnetic radiation shield when powered. Unfortunately, they can only be powered by their corresponding RTG. An RTG powering a microchip is still dangerous to other microchips.

In other words, if a chip is ever left in the same area as another RTG, and it's not connected to its own RTG, the chip will be fried. Therefore, it is assumed that you will follow procedure and keep chips connected to their corresponding RTG when they're in the same room, and away from other RTGs otherwise.

These microchips sound very interesting and useful to your current activities, and you'd like to try to retrieve them. The fourth floor of the facility has an assembling machine which can make a self-contained, shielded computer for you to take with you - that is, if you can bring it all of the RTGs and microchips.

Within the radiation-shielded part of the facility (in which it's safe to have these pre-assembly RTGs), there is an elevator that can move between the four floors. Its capacity rating means it can carry at most yourself and two RTGs or microchips in any combination. (They're rigged to some heavy diagnostic equipment - the assembling machine will detach it for you.) As a security measure, the elevator will only function if it contains at least one RTG or microchip. The elevator always stops on each floor to recharge, and this takes long enough that the items within it and the items on that floor can irradiate each other. (You can prevent this if a Microchip and its Generator end up on the same floor in this way, as they can be connected while the elevator is recharging.)

You make some notes of the locations of each component of interest (your puzzle input). Before you don a hazmat suit and start moving things around, you'd like to have an idea of what you need to do.

When you enter the containment area, you and the elevator will start on the first floor.

For example, suppose the isolated area has the following arrangement:

The first floor contains a hydrogen-compatible microchip and a lithium-compatible microchip.
The second floor contains a hydrogen generator.
The third floor contains a lithium generator.
The fourth floor contains nothing relevant.
As a diagram (F# for a Floor number, E for Elevator, H for Hydrogen, L for Lithium, M for Microchip, and G for Generator), the initial state looks like this:

F4 .  .  .  .  .
F3 .  .  .  LG .
F2 .  HG .  .  .
F1 E  .  HM .  LM
Then, to get everything up to the assembling machine on the fourth floor, the following steps could be taken:

Bring the Hydrogen-compatible Microchip to the second floor, which is safe because it can get power from the Hydrogen Generator:

F4 .  .  .  .  .
F3 .  .  .  LG .
F2 E  HG HM .  .
F1 .  .  .  .  LM
Bring both Hydrogen-related items to the third floor, which is safe because the Hydrogen-compatible microchip is getting power from its generator:

F4 .  .  .  .  .
F3 E  HG HM LG .
F2 .  .  .  .  .
F1 .  .  .  .  LM
Leave the Hydrogen Generator on floor three, but bring the Hydrogen-compatible Microchip back down with you so you can still use the elevator:

F4 .  .  .  .  .
F3 .  HG .  LG .
F2 E  .  HM .  .
F1 .  .  .  .  LM
At the first floor, grab the Lithium-compatible Microchip, which is safe because Microchips don't affect each other:

F4 .  .  .  .  .
F3 .  HG .  LG .
F2 .  .  .  .  .
F1 E  .  HM .  LM
Bring both Microchips up one floor, where there is nothing to fry them:

F4 .  .  .  .  .
F3 .  HG .  LG .
F2 E  .  HM .  LM
F1 .  .  .  .  .
Bring both Microchips up again to floor three, where they can be temporarily connected to their corresponding generators while the elevator recharges, preventing either of them from being fried:

F4 .  .  .  .  .
F3 E  HG HM LG LM
F2 .  .  .  .  .
F1 .  .  .  .  .
Bring both Microchips to the fourth floor:

F4 E  .  HM .  LM
F3 .  HG .  LG .
F2 .  .  .  .  .
F1 .  .  .  .  .
Leave the Lithium-compatible microchip on the fourth floor, but bring the Hydrogen-compatible one so you can still use the elevator; this is safe because although the Lithium Generator is on the destination floor, you can connect Hydrogen-compatible microchip to the Hydrogen Generator there:

F4 .  .  .  .  LM
F3 E  HG HM LG .
F2 .  .  .  .  .
F1 .  .  .  .  .
Bring both Generators up to the fourth floor, which is safe because you can connect the Lithium-compatible Microchip to the Lithium Generator upon arrival:

F4 E  HG .  LG LM
F3 .  .  HM .  .
F2 .  .  .  .  .
F1 .  .  .  .  .
Bring the Lithium Microchip with you to the third floor so you can use the elevator:

F4 .  HG .  LG .
F3 E  .  HM .  LM
F2 .  .  .  .  .
F1 .  .  .  .  .
Bring both Microchips to the fourth floor:

F4 E  HG HM LG LM
F3 .  .  .  .  .
F2 .  .  .  .  .
F1 .  .  .  .  .
In this arrangement, it takes 11 steps to collect all of the objects at the fourth floor for assembly. (Each elevator stop counts as one step, even if nothing is added to or removed from it.)

In your situation, what is the minimum number of steps required to bring all of the objects to the fourth floor?

*/

const KIND = [ 'G', 'M' ]
const ELEMENT = [ 'Pm', 'Co', 'Cm', 'Ru', 'Pu' ]

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
  console.log('==============================================')
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
  ]
}

const solution = searchForSolution(initialState)
visualizeSolution(solution)
console.log('Found solution! Only ' + (solution.length - 1) + ' steps.')
