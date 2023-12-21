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
}
