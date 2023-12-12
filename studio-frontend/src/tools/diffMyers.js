// Will uses an implementation from github instead of own implementation, but will keep own implementation for reference
import { bestSubSequence } from "fast-array-diff"

// https://blog.robertelder.org/diff-algorithm/
// https://blog.jcoglan.com/2017/02/17/the-myers-diff-algorithm-part-3/

//D : number of edits/moves
//K : x - y
// Own implementation (not used)
export function shortestPath(wordsBefore, wordsAfter) {
  const numberWordsBefore = wordsBefore.length
  const numberWordsAfter = wordsAfter.length
  const max = numberWordsBefore + numberWordsAfter
  const size = 1 + 2 * max

  const v = new Array(size)
  v[1] = 0
  let trace = []
  for (let D = 0; D <= max; D++) {
    trace.push(JSON.parse(JSON.stringify(v)))
    for (let K = -D; K <= D; K = K + 2) {
      let x
      if (K == -D || (K != D && v[K - 1] < v[K + 1])) {
        x = v[K + 1]
      } else {
        x = v[K - 1] + 1
      }
      let y = x - K
      while (
        x < numberWordsBefore &&
        y < numberWordsAfter &&
        wordsBefore[x].word == wordsAfter[y].word
      ) {
        x++
        y++
      }

      v[K] = x

      if (x >= numberWordsBefore && y >= numberWordsAfter) {
        return trace
      }
    }
  }
}

export function backtrack(wordsBefore, wordsAfter, shortestEdit) {
  let x = wordsBefore.length
  let y = wordsAfter.length
  let res = []
  //const reversedShortestEdit = shortestEdit.reverse()

  for (let d = shortestEdit.length - 1; d >= 0; d--) {
    let v = shortestEdit[d]
    let k = x - y
    let prev_k
    //console.log({ d, v, k })
    if (k == -d || (k != d && v[k - 1] < v[k + 1])) {
      prev_k = k + 1
    } else {
      prev_k = k - 1
    }

    let prev_x = v[prev_k]
    let prev_y = prev_x - prev_k

    if (d > 0) {
      res = translateToDelta({ x1: prev_x, y1: prev_y, x2: x, y2: y }).concat(
        res
      )
    }
    x = prev_x
    y = prev_y
  }

  return res
}

function translateToDelta({ x1, y1, x2, y2 }) {
  let res = []
  if (x2 - x1 > y2 - y1) {
    res.push({ delete: x2 - x1 - (y2 - y1) })
    if (y2 - y1 > 0) res.push({ retain: y2 - y1 })
  } else {
    res.push({ insert: y2 - y1 - (x2 - x1) })
    if (x2 - x1 > 0) res.push({ retain: x2 - x1 })
  }
  return res
}

export function diffMyers(wordsBefore, wordsAfter) {
  const delta = []

  function pushChange(
    type, // "add" | "remove" | "same",
    oldArr, // T[],
    oldStart, // number,
    oldEnd, // number,
    newArr, // T[],
    newStart, // number,
    newEnd // number
  ) {
    if (type === "same") {
      delta.push({ retain: oldEnd - oldStart })
    }
    if (type === "add") {
      let items = []
      for (let i = newStart; i < newEnd; ++i) {
        //console.log("add", newArr[i])
        items.push(newArr[i].word)
      }

      delta.push({ insert: items })
    }
    if (type === "remove") {
      delta.push({ delete: oldEnd - oldStart })
    }
  }

  bestSubSequence(
    wordsBefore,
    wordsAfter,
    (a, b) => a.word == b.word,
    pushChange
  )

  //console.log(shortestEdit)
  //const delta = backtrack(wordsBefore, wordsAfter, shortestEdit)
  return delta
}
