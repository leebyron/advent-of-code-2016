/*

--- Day 4: Security Through Obscurity ---

--- Part Two ---

With all the decoy data out of the way, it's time to decrypt this list and get moving.

The room names are encrypted by a state-of-the-art shift cipher, which is nearly unbreakable without the right software. However, the information kiosk designers at Easter Bunny HQ were not expecting to deal with a master cryptographer like yourself.

To decrypt a room name, rotate each letter forward through the alphabet a number of times equal to the room's sector ID. A becomes B, B becomes C, Z becomes A, and so on. Dashes become spaces.

For example, the real name for qzmt-zixmtkozy-ivhz-343 is very encrypted name.

What is the sector ID of the room where North Pole objects are stored?

*/

// Test
const assert = require('assert')
assert(isValid(parseRoomID('aaaaa-bbb-z-y-x-123[abxyz]')))
assert(isValid(parseRoomID('a-b-c-d-e-f-g-h-987[abcde]')))
assert(isValid(parseRoomID('not-a-real-room-404[oarel]')))
assert(isValid(parseRoomID('totally-real-room-200[decoy]')) === false)
assert(decryptRoomName('qzmt-zixmtkozy-ivhz', 343) === 'very encrypted name')

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

function shiftCypher(char, dist) {
  // 97 is ASCII for a
  // 26 letters from a - z
  return String.fromCharCode((char.charCodeAt(0) - 97 + dist) % 26 + 97)
}

function decryptRoomName(roomName, sectorID) {
  return roomName
    .split('')
    .map(char => char === '-' ? ' ' : shiftCypher(char, sectorID))
    .join('')
}

function isValid(room) {
  return calculateChecksum(room.name) === room.checksum
}

function sumOfSectorIDs(input) {
  return input
    .split('\n')
    .map(parseRoomID)
    .filter(isValid)
    .filter(room => decryptRoomName(room.name, room.sectorID) === 'northpole object storage')
    .map(room => room.sectorID)[0]
}

const input = require('fs').readFileSync('04.txt', 'utf8')

console.log(sumOfSectorIDs(input))
