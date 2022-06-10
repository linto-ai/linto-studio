export default class EditorSettings extends EventTarget {
    constructor(data) {
        super()

        this.wrapperId = 'editor-settings'
        this.showSettings = false
        this.paginationValue = data.pagination

        this.editorSettingsWrapper = document.getElementById(this.wrapperId)

        // Create editor settings button
        this.settingsBtn = document.createElement('button')
        this.settingsBtn.setAttribute('id', 'editor-settings-btn')
        this.settingsBtn.innerHTML = 'Settings'
        this.editorSettingsWrapper.append(this.settingsBtn)

        // Create editor settings frame
        this.settingsFrame = document.createElement('div')
        this.settingsFrame.setAttribute('id', 'editor-settings-frame')
        this.settingsFrame.classList.add('hidden')
        this.settingsFrame.classList.add('flex')
        this.settingsFrame.classList.add('row')
        this.editorSettingsWrapper.append(this.settingsFrame)

        // settings FORM
        this.enablePaginationCheckbox = document.createElement('input')
        this.enablePaginationCheckbox.setAttribute('type', 'checkbox')
        if (this.paginationValue > 0) {
            this.enablePaginationCheckbox.setAttribute('checked', true)
        }

        this.enablePaginationLabel = document.createElement('label')
        this.enablePaginationLabel.innerHTML = 'Enable pagination'

        this.paginationInputValue = document.createElement('input')
        this.paginationInputValue.setAttribute('type', 'number')
        if (this.paginationValue > 0) {
            this.paginationInputValue.classList.add('visible')
            this.paginationInputValue.value = this.paginationValue
        } else {
            this.paginationInputValue.classList.add('hidden')
        }

        this.settingsFrame.append(this.enablePaginationCheckbox)
        this.settingsFrame.append(this.enablePaginationLabel)
        this.settingsFrame.append(this.paginationInputValue)

        this.settingsBtn.onclick = () => {
            if (this.showSettings) this.hide()
            else this.show()
        }

        this.enablePaginationCheckbox.onchange = () => {
            if (this.enablePaginationCheckbox.checked) {
                this.paginationInputValue.value = 6 // minimal value
                this.showPaginationInput()
            } else {
                this.paginationInputValue.value = 0
                this.hidePaginationInput()
            }
            this.updatePaginationValue(this.paginationInputValue.value)
        }
        this.paginationInputValue.onchange = (e) => {
            this.updatePaginationValue(this.paginationInputValue.value)
        }
    }
    show() {
        this.settingsFrame.classList.remove('hidden')
        this.settingsFrame.classList.add('visible')
        this.showSettings = true

    }
    hide() {
        this.settingsFrame.classList.remove('visible')
        this.settingsFrame.classList.add('hidden')
        this.showSettings = false
    }

    showPaginationInput() {
        this.paginationInputValue.classList.remove('hidden')
        this.paginationInputValue.classList.add('visible')
    }

    hidePaginationInput() {
        this.paginationInputValue.classList.remove('visible')
        this.paginationInputValue.classList.add('hidden')
    }
    updatePaginationValue(value) {
        this.dispatchEvent(new CustomEvent('pagination_settings_update', { detail: { value } }))
    }

}