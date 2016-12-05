/*

--- Day 5: How About a Nice Game of Chess? ---

You are faced with a security door designed by Easter Bunny engineers that seem to have acquired most of their security knowledge by watching hacking movies.

The eight-character password for the door is generated one character at a time by finding the MD5 hash of some Door ID (your puzzle input) and an increasing integer index (starting with 0).

A hash indicates the next character in the password if its hexadecimal representation starts with five zeroes. If it does, the sixth character in the hash is the next character of the password.

For example, if the Door ID is abc:

The first index which produces a hash that starts with five zeroes is 3231929, which we find by hashing abc3231929; the sixth character of the hash, and thus the first character of the password, is 1.
5017308 produces the next interesting hash, which starts with 000008f82..., so the second character of the password is 8.
The third time a hash starts with five zeroes is for abc5278568, discovering the character f.
In this example, after continuing this search a total of eight times, the password is 18f47a30.

Given the actual Door ID, what is the password?

*/

const assert = require('assert')
assert(findPassword('abc') === '18f47a30')


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

function md5(value) {
  var md5sum = require('crypto').createHash('md5')
  md5sum.update(value)
  return md5sum.digest('hex')
}

function isInteresting(hash) {
  return hash.slice(0, 5) === '00000'
}

function passBit(hash) {
  return hash[5]
}

function findPassword(input) {
  let iter = counter()
  iter = map(iter, n => md5(input + n))
  iter = filter(iter, isInteresting)
  iter = map(iter, passBit)
  iter = take(iter, 8)
  return [ ...iter ].join('')
}

const input = require('fs').readFileSync('05.txt', 'utf8')

console.log(findPassword(input))
