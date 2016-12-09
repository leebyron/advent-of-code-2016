/*

--- Day 8: Two-Factor Authentication ---

You come across a door implementing what you can only assume is an implementation of two-factor authentication after a long game of requirements telephone.

To get past the door, you first swipe a keycard (no problem; there was one on a nearby desk). Then, it displays a code on a little screen, and you type that code on a keypad. Then, presumably, the door unlocks.

Unfortunately, the screen has been smashed. After a few minutes, you've taken everything apart and figured out how it works. Now you just have to work out what the screen would have displayed.

The magnetic strip on the card you swiped encodes a series of instructions for the screen; these instructions are your puzzle input. The screen is 50 pixels wide and 6 pixels tall, all of which start off, and is capable of three somewhat peculiar operations:

rect AxB turns on all of the pixels in a rectangle at the top-left of the screen which is A wide and B tall.
rotate row y=A by B shifts all of the pixels in row A (0 is the top row) right by B pixels. Pixels that would fall off the right end appear at the left end of the row.
rotate column x=A by B shifts all of the pixels in column A (0 is the left column) down by B pixels. Pixels that would fall off the bottom appear at the top of the column.
For example, here is a simple sequence on a smaller screen:

rect 3x2 creates a small rectangle in the top-left corner:

###....
###....
.......
rotate column x=1 by 1 rotates the second column down by one pixel:

#.#....
###....
.#.....
rotate row y=0 by 4 rotates the top row right by four pixels:

....#.#
###....
.#.....
rotate column x=1 by 1 again rotates the second column down by one pixel, causing the bottom pixel to wrap back to the top:

.#..#.#
#.#....
.#.....
As you can see, this display technology is extremely powerful, and will soon dominate the tiny-code-displaying-screen market. That's what the advertisement on the back of the display tries to convince you, anyway.

There seems to be an intermediate check of the voltage used by the display: after you swipe your card, if the screen did work, how many pixels should be lit?

--- Part Two ---

You notice that the screen is only capable of displaying capital letters; in the font it uses, each letter is 5 pixels wide and 6 tall.

After you swipe your card, what code is the screen trying to display?

*/

const SCREEN_WIDTH = 50
const SCREEN_HEIGHT = 6
const SCREEN_SIZE = SCREEN_WIDTH * SCREEN_HEIGHT

// Test:
let test = blankScreen()
test = turnOnRect(test, 3, 2)
test = rotateCol(test, 1, 1)
test = rotateRow(test, 0, 4)
test = rotateCol(test, 1, 1)
renderScreen(test)


function blankScreen() {
  return new Array(SCREEN_SIZE)
}

function renderScreen(screen) {
  for (let i = 0; i < SCREEN_SIZE; i++) {
    process.stdout.write(screen[i] ? '#' : ' ')
    if ((i + 1) % SCREEN_WIDTH === 0) {
      process.stdout.write('\n')
    }
  }
  return screen
}

function turnOnRect(screen, width, height) {
  let r = 0
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      screen[r + x] = true
    }
    r += SCREEN_WIDTH
  }
  return screen
}

function rotateRow(screen, row, by) {
  let tmp = new Array(by)
  for (let x = 0; x < by; x++) {
    tmp[x] = screen[row * SCREEN_WIDTH + SCREEN_WIDTH - by + x]
  }
  for (let x = SCREEN_WIDTH - 1; x >= 0; x--) {
    screen[row * SCREEN_WIDTH + x] =
      x >= by ? screen[row * SCREEN_WIDTH - by + x] : tmp[x]
  }
  return screen
}

function rotateCol(screen, col, by) {
  let tmp = new Array(by)
  for (let y = 0; y < by; y++) {
    tmp[y] = screen[(SCREEN_HEIGHT - by + y) * SCREEN_WIDTH + col]
  }
  for (let y = SCREEN_HEIGHT - 1; y >= 0; y--) {
    screen[y * SCREEN_WIDTH + col] =
      y >= by ? screen[(y - by) * SCREEN_WIDTH + col] : tmp[y]
  }
  return screen
}

const RECT_RX = /^rect (\d+)x(\d)$/
const ROTATE_ROW = /^rotate row y=(\d+) by (\d+)$/
const ROTATE_COL = /^rotate column x=(\d+) by (\d+)$/

function readInstruction(line) {
  let match
  if (match = RECT_RX.exec(line)) {
    return { type: 'rect', width: parseInt(match[1], 10), height: parseInt(match[2], 10) }
  }
  if (match = ROTATE_ROW.exec(line)) {
    return { type: 'rotate-row', y: parseInt(match[1], 10), by: parseInt(match[2], 10) }
  }
  if (match = ROTATE_COL.exec(line)) {
    return { type: 'rotate-col', x: parseInt(match[1], 10), by: parseInt(match[2], 10) }
  }
  throw new Error('Could not understand: ' + line)
}

function runInstruction(screen, instruction) {
  sleep(50)
  console.log('\x1b[2J\x1b[H', instruction)
  switch (instruction.type) {
    case 'rect': return renderScreen(turnOnRect(screen, instruction.width, instruction.height))
    case 'rotate-row': return renderScreen(rotateRow(screen, instruction.y, instruction.by))
    case 'rotate-col': return renderScreen(rotateCol(screen, instruction.x, instruction.by))
    default: throw new Error('Do not understand instruction')
  }
}

function sleep(time) {
  var stop = Date.now() + time
  while (Date.now() < stop) {}
}

function produceScreen(input) {
  return input.split('\n').map(readInstruction).reduce(runInstruction, blankScreen())
}

function countOnPixels(screen) {
  return screen.reduce((sum, pxl) => pxl ? sum + 1 : sum, 0)
}

const input = require('fs').readFileSync('08.txt', 'utf8')

const screen = produceScreen(input)
console.log(countOnPixels(screen))
