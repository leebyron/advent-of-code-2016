/*

--- Day 4: Security Through Obscurity ---

Finally, you come across an information kiosk with a list of rooms. Of course, the list is encrypted and full of decoy data, but the instructions to decode the list are barely hidden nearby. Better remove the decoy data first.

Each room consists of an encrypted name (lowercase letters separated by dashes) followed by a dash, a sector ID, and a checksum in square brackets.

A room is real (not a decoy) if the checksum is the five most common letters in the encrypted name, in order, with ties broken by alphabetization. For example:

aaaaa-bbb-z-y-x-123[abxyz] is a real room because the most common letters are a (5), b (3), and then a tie between x, y, and z, which are listed alphabetically.
a-b-c-d-e-f-g-h-987[abcde] is a real room because although the letters are all tied (1 of each), the first five are listed alphabetically.
not-a-real-room-404[oarel] is a real room.
totally-real-room-200[decoy] is not.
Of the real rooms from the list above, the sum of their sector IDs is 1514.

What is the sum of the sector IDs of the real rooms?

*/

// Test
const assert = require('assert')
assert(isValid(parseRoomID('aaaaa-bbb-z-y-x-123[abxyz]')))
assert(isValid(parseRoomID('a-b-c-d-e-f-g-h-987[abcde]')))
assert(isValid(parseRoomID('not-a-real-room-404[oarel]')))
assert(isValid(parseRoomID('totally-real-room-200[decoy]')) === false)

function parseRoomID(roomID) {
  const match = /([a-z-]+?)-(\d+)\[([a-z]+)\]/.exec(roomID)
  return {
    name: match[1],
    sectorID: parseInt(match[2], 10),
    checksum: match[3],
  }
}

function calculateChecksum(roomName) {
  const chars = roomName.split('')
  const buckets = {}
  chars.forEach(char => {
    if (char !== '-') {
      buckets[char] = (buckets[char] || 0) + 1
    }
  })
  const sorted = Object.entries(buckets).sort(([ charA, freqA ], [ charB, freqB ]) =>
    freqA < freqB ? 1 :
    freqA > freqB ? -1 :
    charA > charB ? 1 : -1
  )
  return sorted.map(([ char, freq]) => char).slice(0, 5).join('')
}

function isValid(room) {
  return calculateChecksum(room.name) === room.checksum
}

function sumOfSectorIDs(input) {
  return input
    .split('\n')
    .map(parseRoomID)
    .filter(isValid)
    .reduce((sum, room) => sum + room.sectorID, 0)
}

const input = require('fs').readFileSync('04.txt', 'utf8')

console.log(sumOfSectorIDs(input))
