/*

--- Day 10: Balance Bots ---

You come upon a factory in which many robots are zooming around handing small microchips to each other.

Upon closer examination, you notice that each bot only proceeds when it has two microchips, and once it does, it gives each one to a different bot or puts it in a marked "output" bin. Sometimes, bots take microchips from "input" bins, too.

Inspecting one of the microchips, it seems like they each contain a single number; the bots must use some logic to decide what to do with each chip. You access the local control computer and download the bots' instructions (your puzzle input).

Some of the instructions specify that a specific-valued microchip should be given to a specific bot; the rest of the instructions indicate what a given bot should do with its lower-value or higher-value chip.

For example, consider the following instructions:

value 5 goes to bot 2
bot 2 gives low to bot 1 and high to bot 0
value 3 goes to bot 1
bot 1 gives low to output 1 and high to bot 0
bot 0 gives low to output 2 and high to output 0
value 2 goes to bot 2
Initially, bot 1 starts with a value-3 chip, and bot 2 starts with a value-2 chip and a value-5 chip.
Because bot 2 has two microchips, it gives its lower one (2) to bot 1 and its higher one (5) to bot 0.
Then, bot 1 has two microchips; it puts the value-2 chip in output 1 and gives the value-3 chip to bot 0.
Finally, bot 0 has two microchips; it puts the 3 in output 2 and the 5 in output 0.
In the end, output bin 0 contains a value-5 microchip, output bin 1 contains a value-2 microchip, and output bin 2 contains a value-3 microchip. In this configuration, bot number 2 is responsible for comparing value-5 microchips with value-2 microchips.

Based on your instructions, what is the number of the bot that is responsible for comparing value-61 microchips with value-17 microchips?

*/

const VALUE_RX = /^value (\d+) goes to bot (\d+)$/
const RULE_RX = /^bot (\d+) gives low to (output|bot) (\d+) and high to (output|bot) (\d+)$/

function parseInstructions(input) {
  const outputs = []
  const bots = []
  const rules = []
  const needsToZoom = []

  input.split('\n').forEach(line => {
    let match
    if (match = VALUE_RX.exec(line)) {
      const [, value, id] = match
      if (!bots[id]) {
        bots[id] = []
      }
      bots[id].push(parseInt(value, 10))
      if (bots[id].length === 2) {
        needsToZoom.push(id)
      }
    } else if (match = RULE_RX.exec(line)) {
      const [, botID, lowKind, lowID, highKind, highID] = match
      rules[botID] = { lowKind, lowID, highKind, highID }
    }
  })

  return { outputs, bots, rules, needsToZoom }
}

function zoomAround(state, observer) {
  const { bots, rules, needsToZoom } = state

  while (needsToZoom.length > 0) {

    // Which bot is zooming right now?
    const botID = needsToZoom[needsToZoom.length - 1]

    // Reset this bot's values
    const [ lowVal, highVal ] = bots[botID].sort((a, b) => a - b)

    // Rules for this bot?
    const { lowKind, lowID, highKind, highID } = rules[botID]

    // Let the observer know, it can stop the show.
    if (observer && observer({ botID, lowKind, lowID, lowVal, highKind, highID, highVal }, state)) {
      break
    }

    // Put the values where they go.
    needsToZoom.pop()
    bots[botID] = undefined
    moveToDestination(state, highKind, highID, highVal)
    moveToDestination(state, lowKind, lowID, lowVal)
  }

  return state
}

function moveToDestination(state, kind, id, val) {
  const destinations = (kind === 'output' ? state.outputs : state.bots)
  const destination = destinations[id] || (destinations[id] = [])
  destination.push(val)
  if (kind === 'bot' && destination.length === 2) {
    state.needsToZoom.push(id)
  }
}

// TEST:

const assert = require('assert')
let testState = parseInstructions(`value 5 goes to bot 2
bot 2 gives low to bot 1 and high to bot 0
value 3 goes to bot 1
bot 1 gives low to output 1 and high to bot 0
bot 0 gives low to output 2 and high to output 0
value 2 goes to bot 2`)
assert(testState.bots[1][0] === 3)
assert(testState.bots[2][0] === 5)
assert(testState.bots[2][1] === 2)
let whichBotCompares5And2
testState = zoomAround(testState, ({ botID, highVal, lowVal }) => {
  if (highVal === 5 && lowVal === 2) {
    whichBotCompares5And2 = botID
  }
})
assert(whichBotCompares5And2 === '2')
assert(testState.outputs[0][0] === 5)
assert(testState.outputs[1][0] === 2)
assert(testState.outputs[2][0] === 3)

// RUN:

const input = require('fs').readFileSync('10.txt', 'utf8')
let whichBotCompares61And17
const finalState = zoomAround(parseInstructions(input), ({ botID, lowKind, lowID, lowVal, highKind, highID, highVal }, state) => {
  console.log(`bot ${botID} gives ${lowVal} to ${lowKind} ${lowID} and ${highVal} to ${highKind} ${highID}`)
  if (highVal === 61 && lowVal === 17) {
    whichBotCompares61And17 = botID
  }
})

console.log(' --- ')

console.log(`Bot ${whichBotCompares61And17} compared 61 and 17`)

console.log(finalState.outputs[0][0] * finalState.outputs[1][0]  * finalState.outputs[2][0]);
