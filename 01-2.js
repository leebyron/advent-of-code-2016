/*

--- Day 1: No Time for a Taxicab ---

--- Part Two ---

Then, you notice the instructions continue on the back of the Recruiting Document. Easter Bunny HQ is actually at the first location you visit twice.

For example, if your instructions are R8, R4, R4, R8, the first location you visit twice is 4 blocks away, due East.

How many blocks away is the first location you visit twice?

*/

const input = 'R3, L5, R1, R2, L5, R2, R3, L2, L5, R5, L4, L3, R5, L1, R3, R4, R1, L3, R3, L2, L5, L2, R4, R5, R5, L4, L3, L3, R4, R4, R5, L5, L3, R2, R2, L3, L4, L5, R1, R3, L3, R2, L3, R5, L194, L2, L5, R2, R1, R1, L1, L5, L4, R4, R2, R2, L4, L1, R2, R53, R3, L5, R72, R2, L5, R3, L4, R187, L4, L5, L2, R1, R3, R5, L4, L4, R2, R5, L5, L4, L3, R5, L2, R1, R1, R4, L1, R2, L3, R5, L4, R2, L3, R1, L4, R4, L1, L2, R3, L1, L1, R4, R3, L4, R2, R5, L2, L3, L3, L1, R3, R5, R2, R3, R1, R2, L1, L4, L5, L2, R4, R5, L2, R4, R4, L3, R2, R1, L4, R3, L3, L4, L3, L1, R3, L2, R2, L4, L4, L5, R3, R5, R3, L2, R5, L2, L1, L5, L1, R2, R4, L5, R2, L4, L5, L4, L5, L2, L5, L4, R5, R3, R2, R2, L3, R3, L2, L5'

const TURN = {
  RIGHT: 1,
  LEFT: -1,
}

const FACING = {
  NORTH: 0,
  EAST: 1,
  SOUTH: 2,
  WEST: 3,
}

const initialState = {
  facing: FACING.NORTH,
  x: 0,
  y: 0,
}

function moveAndFindIntersection(steps, initialState) {
  const visited = { '0,0': true }
  let state = initialState
  for (let step of steps) {
    state.facing = (state.facing + step.turn + 4) % 4
    let dist = step.dist
    for (let d = 1; d <= dist; d++) {
      switch (state.facing) {
        case FACING.NORTH: state.y++; break
        case FACING.SOUTH: state.y--; break
        case FACING.EAST: state.x++; break
        case FACING.WEST: state.x--; break
      }
      const location = state.x + ',' + state.y
      if (visited[location]) {
        return state
      }
      visited[location] = true
    }
  }
}

const steps = input.split(', ').map(pair => ({
  turn: pair[0] === 'R' ? TURN.RIGHT : TURN.LEFT,
  dist: parseInt(pair.slice(1), 10),
}))

const finalState = moveAndFindIntersection(steps, initialState)

const blockDistance = Math.abs(finalState.x) + Math.abs(finalState.y)

console.log(blockDistance)
