/*

--- Day 5: How About a Nice Game of Chess? ---

As the door slides open, you are presented with a second door that uses a slightly more inspired security mechanism. Clearly unimpressed by the last version (in what movie is the password decrypted in order?!), the Easter Bunny engineers have worked out a better solution.

Instead of simply filling in the password from left to right, the hash now also indicates the position within the password to fill. You still look for hashes that begin with five zeroes; however, now, the sixth character represents the position (0-7), and the seventh character is the character to put in that position.

A hash result of 000001f means that f is the second character in the password. Use only the first result for each position, and ignore invalid positions.

For example, if the Door ID is abc:

The first interesting hash is from abc3231929, which produces 0000015...; so, 5 goes in position 1: _5______.
In the previous method, 5017308 produced an interesting hash; however, it is ignored, because it specifies an invalid position (8).
The second interesting hash is at index 5357525, which produces 000004e...; so, e goes in position 4: _5__e___.
You almost choke on your popcorn as the final character falls into place, producing the password 05ace8e3.

Given the actual Door ID and this new method, what is the password? Be extra proud of your solution if it uses a cinematic "decrypting" animation.

*/

const assert = require('assert')
assert(findPassword('abc') === '05ace8e3')


// lazy iterators!

function counter() {
  let i = 0
  return {
    [Symbol.iterator]() { return this },
    next() {
      return { done: false, value: i++ }
    }
  }
}

function map(iter, mapper) {
  return {
    [Symbol.iterator]() { return this },
    next() {
      const step = iter.next()
      return step.done ? step : { done: false, value: mapper(step.value) }
    }
  }
}

function filter(iter, pred) {
  return {
    [Symbol.iterator]() { return this },
    next() {
      let step
      do {
        step = iter.next()
      } while (!step.done && !pred(step.value))
      return step
    }
  }
}

function take(iter, count) {
  return {
    [Symbol.iterator]() { return this },
    next() {
      return count-- > 0 ? iter.next() : { done: true, value: undefined }
    }
  }
}

function reduce(iter, reducer, initial) {
  let value = initial
  for (let item of iter) {
    value = reducer(value, item)
    if (value instanceof Reduced) {
      return value.reduced
    }
  }
  return value
}

function Reduced(value) {
  this.reduced = value
}

function md5(value) {
  var md5sum = require('crypto').createHash('md5')
  md5sum.update(value)
  return md5sum.digest('hex')
}

function isInteresting(hash) {
  return hash.slice(0, 5) === '00000'
}

function positionBit(hash) {
  return parseInt(hash[5], 10)
}

function passBit(hash) {
  return hash[6]
}

function passwordReducer(progress, hash) {
  const position = positionBit(hash)
  if (position < 8 && progress[position] === '_') {
    const newPass = progress.slice(0, position) + passBit(hash) + progress.slice(position + 1)
    console.log(newPass) // for cinematic effect
    return newPass.indexOf('_') === -1 ? new Reduced(newPass) : newPass
  }
  return progress
}

function findPassword(input) {
  let iter = counter()
  iter = map(iter, n => md5(input + n))
  iter = filter(iter, isInteresting)
  return reduce(iter, passwordReducer, '________')
}

const input = require('fs').readFileSync('05.txt', 'utf8')

console.log(findPassword(input))
