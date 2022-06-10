export default class Toolbox extends EventTarget {
    constructor(data) {
        super()
        this.toolboxElem = null
        this.toolboxClose = null
        this.toolboxPlay = null
        this.options = {}
        this.positionX = 0
        this.positionY = 0
        this.currentSpeaker = ''
        this.speakerId = ''
        this.speakerList = []
        this.speakerUpdateOptions = null
        this.toolboxTitle = ''
        this.selectList = []
        this.turnId = ''

        this.nameInput = null
        this.userSelectList = null
        this.addSpkBtn = null
    }
    show(x, y, turnId, turnStartTime, turnEndtime, speakerId, speakersList) {
        if (this.toolboxElem !== null) {
            this.hide()
        }
        this.turnId = turnId
        this.speakerId = speakerId
        this.speakerList = speakersList

        // Toolbox container
        this.toolboxElem = document.createElement('div')
        this.toolboxElem.setAttribute('style', `top: ${x - 20}px; left:${y}px;`)
        this.toolboxElem.classList.add('spk-toolbox')
        this.toolboxElem.classList.add('flex')
        this.toolboxElem.classList.add('col')

        this.toolboxClose = document.createElement('button')
        this.toolboxClose.setAttribute('id', 'spk-toolbox-close')


        // Title
        this.toolboxTitle = document.createElement('span')
        this.toolboxTitle.classList.add('speaker-toolbox-title')
        this.toolboxTitle.innerHTML = 'Update speaker'

        // Update options (turn || conversation)
        this.speakerUpdateOptions = document.createElement('select')

        let option1 = document.createElement('option')
        option1.value = 'turn'
        option1.innerHTML = 'For this turn'

        let option2 = document.createElement('option')
        option2.value = 'conversation'
        option2.innerHTML = 'For all turns'

        this.speakerUpdateOptions.append(option1)
        this.speakerUpdateOptions.append(option2)

        // Username input
        this.nameInput = document.createElement('input')
        this.nameInput.setAttribute('type', 'text')

        // Users select list
        this.userSelectList = document.createElement('div')
        this.userSelectList.classList.add('flex')
        this.userSelectList.classList.add('col')

        // Add speaker button
        this.addSpkBtn = document.createElement('button')
        this.addSpkBtn.classList.add('add-speaker-btn')
        this.addSpkBtn.classList.add('hidden')
        this.addSpkBtn.innerHTML = 'Add speaker'


        this.toolboxElem.append(this.toolboxClose)
        this.toolboxElem.append(this.toolboxTitle)
        this.toolboxElem.append(this.speakerUpdateOptions)
        this.toolboxElem.append(this.nameInput)
        this.toolboxElem.append(this.userSelectList)
        this.toolboxElem.append(this.addSpkBtn)

        this.toolboxClose.onclick = () => {
            this.hide()
        }

        this.addSpkBtn.onclick = () => {
            let updateMode = this.speakerUpdateOptions.value
            let currentSpeaker = this.speakerId
            this.dispatchEvent(new CustomEvent('create_and_update_speaker', {
                detail: {
                    speaker_name: this.nameInput.value,
                    turnId: this.turnId,
                    turnStartTime,
                    turnEndtime,
                    updateMode,
                    currentSpeaker
                }
            }))
            this.hide()

            // Todo: function AddSpeaker()
        }

        this.nameInput.oninput = (e) => {
            this.userSelectList.innerHTML = ''
            this.selectList = this.speakerList.filter(spk => spk.speaker_id !== this.speakerId && spk.speaker_name.indexOf(this.nameInput.value) >= 0)
            if (this.selectList.length > 0) {
                if (!this.addSpkBtn.classList.contains('hidden')) {
                    this.addSpkBtn.classList.add('hidden')

                }
                for (let usr of this.selectList) {
                    let usrBtn = document.createElement('button')
                    usrBtn.innerHTML = usr.speaker_name
                    this.userSelectList.append(usrBtn)

                    usrBtn.addEventListener('click', () => {
                        let updateMode = this.speakerUpdateOptions.value
                        let currentSpeaker = this.speakerId
                        let targetSpeaker = usr.speaker_id
                        this.dispatchEvent(new CustomEvent('update_speaker', {
                            detail: {
                                updateMode,
                                currentSpeaker,
                                targetSpeaker,
                                turnId: this.turnId
                            }
                        }))
                        this.hide()
                    })
                }
            } else {
                this.addSpkBtn.classList.remove('hidden')
            }
        }
        document.body.append(this.toolboxElem)
    }
    hide() {
        if (this.toolboxElem !== null) this.toolboxElem.remove()
    }
}