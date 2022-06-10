export default class Toolbox extends EventTarget {
    constructor(data) {
        super()
        this.toolboxElem = null
        this.toolboxClose = null
        this.toolboxPlay = null
        this.options = {}
        this.positionX = 0
        this.positionY = 0
        this.words = []
    }
    show(x, y, words) {
        if (this.toolboxElem !== null) {
            this.hide()
        }
        this.words = words
            // Toolbox container
        this.toolboxElem = document.createElement('div')
        this.toolboxElem.setAttribute('id', 'conversation-toolbox')
        this.toolboxElem.setAttribute('style', `top: ${x - 40}px; left:${y}px;`)
        this.toolboxElem.classList.add('flex')
        this.toolboxElem.classList.add('row')

        // toolboxClose
        this.toolboxClose = document.createElement('button')
        this.toolboxClose.classList.add('toolbox-btn')
        this.toolboxClose.classList.add('toolbox-btn-close')

        // toolboxPlay
        this.toolboxPlay = document.createElement('button')
        this.toolboxPlay.classList.add('toolbox-btn-play')
        this.toolboxPlay.classList.add('toolbox-btn')


        this.toolboxElem.append(this.toolboxPlay)
        this.toolboxElem.append(this.toolboxClose)
        document.body.append(this.toolboxElem)

        this.toolboxPlay.onclick = () => {
            this.dispatchEvent(new CustomEvent('play_from_word', {
                detail: {
                    time: words[0].startTime
                }
            }))
            this.hide(words)
        }

        this.toolboxClose.onclick = () => {
            this.hide(words)
        }
    }
    hide() {
        if (this.toolboxElem !== null) this.toolboxElem.remove()
        for (let word of this.words) {
            word.wordSpan.classList.remove('selected')
        }

    }
}