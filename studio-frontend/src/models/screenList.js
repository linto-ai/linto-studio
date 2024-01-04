export class ScreenList {
  constructor() {
    this.screens = new Map()
    this.size = 0
    this.first = null
  }

  [Symbol.iterator]() {
    let currentId = this.first
    let currentScreen = this.get(currentId)
    return {
      next: () => {
        if (currentScreen) {
          let value = currentScreen
          currentId = currentScreen.next
          currentScreen = this.screens.get(currentId)
          return { value: value, done: false }
        }
        return { done: true }
      },
    }
  }

  static from(screens) {
    let obj = new ScreenList()
    for (let [i, screen] of screens.entries()) {
      obj.screens.set(screen.screen_id, {
        screen: screen,
        prev: i > 0 ? screens[i - 1].screen_id : null,
        next: i < screens.length - 1 ? screens[i + 1].screen_id : null,
      })
    }
    if (screens.length > 0) {
      obj.first = screens[0].screen_id
    }
    obj.size = screens.length
    return obj
  }

  get(screenId) {
    return this.screens.get(screenId)
  }

  set(screenId, screen) {
    if (this.screens.has(screenId)) {
      this.screens.set(screenId, screen)
    }
  }

  add(screenId, newScreen, after) {
    let addedScreen = {
      prev: null,
      next: null,
      screen: newScreen,
    }
    let target = this.get(screenId)

    if (target.prev === null && !after) {
      this.first = newScreen.screen_id
    }

    if (after) {
      addedScreen.prev = screenId
      addedScreen.next = target.next
      if (target.next) {
        this.get(target.next).prev = newScreen.screen_id
      }
      target.next = newScreen.screen_id
    } else {
      addedScreen.prev = target.prev
      addedScreen.next = screenId
      if (target.prev) {
        this.get(target.prev).next = newScreen.screen_id
      }
      target.prev = newScreen.screen_id
    }

    this.screens.set(newScreen.screen_id, addedScreen)
    this.size++
  }

  merge(screenId, deleteAfter) {
    let target = this.get(screenId)
    let screenToDelete
    if (deleteAfter) {
      screenToDelete = this.get(target.next)

      target.screen.text = target.screen.text.concat(screenToDelete.screen.text)
      target.screen.words = target.screen.words.concat(
        screenToDelete.screen.words
      )

      target.screen.etime = screenToDelete.screen.etime
    } else {
      screenToDelete = this.get(target.prev)

      target.screen.text = screenToDelete.screen.text.concat(target.screen.text)
      target.screen.words = screenToDelete.screen.words.concat(
        target.screen.words
      )

      target.screen.stime = screenToDelete.screen.stime
    }

    return this.delete(screenToDelete.screen.screen_id)
  }

  delete(screenId) {
    let target = this.get(screenId)

    let prev = this.get(target.prev)
    let next = this.get(target.next)

    if (target.prev === null) {
      this.first = target.next
    }

    if (prev) {
      // general case
      prev.next = target.next
      if (next) {
        // end of list
        next.prev = target.prev
      }
    } else if (next) {
      // start of list
      next.prev = target.prev
    }

    this.screens.delete(screenId)
    this.size--
    return screenId
  }
}
