/*

--- Day 1: No Time for a Taxicab ---

Santa's sleigh uses a very high-precision clock to guide its movements, and the clock's oscillator is regulated by stars. Unfortunately, the stars have been stolen... by the Easter Bunny. To save Christmas, Santa needs you to retrieve all fifty stars by December 25th.

Collect stars by solving puzzles. Two puzzles will be made available on each day in the advent calendar; the second puzzle is unlocked when you complete the first. Each puzzle grants one star. Good luck!

You're airdropped near Easter Bunny Headquarters in a city somewhere. "Near", unfortunately, is as close as you can get - the instructions on the Easter Bunny Recruiting Document the Elves intercepted start here, and nobody had time to work them out further.

The Document indicates that you should start at the given coordinates (where you just landed) and face North. Then, follow the provided sequence: either turn left (L) or right (R) 90 degrees, then walk forward the given number of blocks, ending at a new intersection.

There's no time to follow such ridiculous instructions on foot, though, so you take a moment and work out the destination. Given that you can only walk on the street grid of the city, how far is the shortest path to the destination?

For example:

Following R2, L3 leaves you 2 blocks East and 3 blocks North, or 5 blocks away.
R2, R2, R2 leaves you 2 blocks due South of your starting position, which is 2 blocks away.
R5, L5, R5, R3 leaves you 12 blocks away.
How many blocks away is Easter Bunny HQ?

*/

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

function move(state, step) {
  state.facing = (state.facing + step.turn + 4) % 4
  switch (state.facing) {
    case FACING.NORTH: state.y += step.dist; break
    case FACING.SOUTH: state.y -= step.dist; break
    case FACING.EAST: state.x += step.dist; break
    case FACING.WEST: state.x -= step.dist; break
  }
  return state
}

const input = require('fs').readFileSync('01.txt', 'utf8');

const steps = input.split(', ').map(pair => ({
  turn: pair[0] === 'R' ? TURN.RIGHT : TURN.LEFT,
  dist: parseInt(pair.slice(1), 10),
}))

const finalState = steps.reduce(move, initialState)

const blockDistance = Math.abs(finalState.x) + Math.abs(finalState.y)

console.log(blockDistance)
