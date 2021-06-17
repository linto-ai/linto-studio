<template>
  <div id="transcription" :class="editionMode ? 'editing' : ''">
    <table class="table table--transcription">
      <tr 
        v-for="(turn,i) in convoTextCustom" 
        :key="i" 
        :data-stime="turn.words.length > 0 ? turn.words[0].stime : '-1' "  
        :data-etime="turn.words.length > 0 ? turn.words[turn.words.length - 1].etime : '-1'"
        :data-turn="turn.pos"
        :class="[!editionMode && currentTurn === turn.pos ? 'active active--speaker' : '', editionMode ? 'editing':'']"
        class="table-speaker--turn"
        :id="`turn-${turn.pos}`"
      >
        <td class="transcription--turn"><span class="label">{{ turn.pos }}</span></td>
        <td class="transcription--speaker">
          <div class="table-speaker--edit">
            <button class="btn--inline btn--inline-transcription-speaker" @click="editSpeaker($event, speakersArray[speakersArray.findIndex(sp => sp.speaker_id === turn.speaker_id)], turn.turn_id)">
              <span class="label">{{ speakersArray[speakersArray.findIndex(sp => sp.speaker_id === turn.speaker_id)].speaker_name }}</span>
            </button>
          </div>
        </td>
        <td 
          class="transcription-speaker-sentence" 
          v-if="!!turn.words && turn.words.length > 0" 
          :data-key="turn.turn_id" 
          :data-turn-id="turn.turn_id"
          :data-pos="turn.pos"
          :data-speaker="turn.speaker_id"
          :class="editionMode ? 'editing' : ''"
          :contenteditable="editionMode"
        >
          <span 
            v-for="(word, j) in turn.words" 
            :key="j" 
            :data-word-id="word.wid" 
            :data-turn-id="turn.turn_id"
            :data-turn-pos="turn.pos"
            :data-stime="word.hasOwnProperty('stime') ? word.stime : ''" 
            :data-etime="!!word.hasOwnProperty('etime') ? word.etime : ''" 
            :data-pos="word.pos"
            class="transcription--word" 
            :class="[(!!word.stime && !!word.etime && parseFloat(word.stime) <= parseFloat(currentTime)) && (parseFloat(word.etime) >= parseFloat(currentTime)) ? 'isplaying' : '', highlightsActive.indexOf(word.wid) >= 0 ? 'highlighted' : '', keywordsActive.indexOf(word.wid) >= 0 ? 'keyword' : '']"
            @dblclick="playFromWord(word.stime)"
          >{{ word.word }}&nbsp;</span>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import { bus } from '../main.js'
export default {
  props: ['convoText', 'editionMode', 'currentTime', 'currentTurn', 'speakersArray', 'convoSpeakers', 'convoId', 'convoIsFiltered','highlightsOptions', 'userAccess'],
  data () {
    return {
      refresh: 1,
      toolBoxOption: {
        comment: false,
        highlight: true,
        keywords: true,
        split: true,
        speakerEdit: false
      },
      highlightsActive: [],
      keywordsActive: [],
      convoTextCustom: []
    }
  },
  mounted () {
    // Enable transcription text selection
    setTimeout(()=>{
      if(this.userAccess.canEdit) {
      this.bindTextSelection()
      }
    },500)

    // BUS listeners
    bus.$on('clear_text_selection', () => {
      this.cancelTextSelection()
    })
    bus.$on('update_speaker', async (data) => {
      this.speakerEdit = false
    })
    bus.$on('scroll_to_current', () => {
      this.scrollToCurrentTurn(this.currentTurn)
    })
    bus.$on('transcription_update_highlights', (data) => {
      this.setHighlights(data.highlightsOptions)
    })
    bus.$on('transcription_update_keywords', (data) => {
      this.setKeywords(data.keywordsOptions)
    })
    bus.$on('enable_text_selection', () => {
      this.bindTextSelection()
    })
    bus.$on('disable_text_selection', () => {
      this.unbindTextSelection()
    })
    bus.$on('transcription_bind_enter', () => {
      if(window.editionMode === true) {
        setTimeout(()=>{this.createTurn()}, 500)
      }
    })
    bus.$on('filter_update', (data) => {
      this.convoTextCustom = data.convoText
    })

    this.convoTextCustom = this.convoText
  },
  watch: {
    currentTurn (data) {
      // if audio is playing: smooth scroll to current turn 
      this.scrollToCurrentTurn(data)
    }
  },
  methods: {
    updateConvoFilters () {
      this.convoTextCustom = this.convoText
    },
    // On press "enter" when editing text
    createTurn() {
      if(document.activeElement.classList.contains('transcription-speaker-sentence')) {
        const turns = document.getElementsByClassName('transcription-speaker-sentence')
        let textPayload = []
        let turnIndex = 0
        for(let i = 0; i < turns.length; i++) { // TURNS
          let turn = turns[i]
          let words = turn.childNodes
          let realWordPos = 0
          let turnPayload = {
            speaker_id: turn.getAttribute('data-speaker'),
            turn_id: turn.getAttribute('data-turn-id'),
            pos: turnIndex,
            words: []
          }

          for(let j = 0; j < words.length; j++) { // WORDS
            let word = words[j]
            let wordVal = word.innerHTML.replace(/&nbsp;/g,"",' ').trim()
  
            // Create new Turn
            if(wordVal.indexOf('<br>') >= 0) {
              let splitBr = wordVal.split('<br>')
              let wordValue = ""
              
              // word = '<br>word' || 'word<br>' || 'wo<br>rd'
              if (splitBr.length === 2) {
                const wordId = word.getAttribute('data-word-id')
                const wordOptions = this.getHlAndKwByWordId(wordId)
                //'word<br>'
                if(splitBr[0] !== "" && splitBr[1] === '') {
                  wordValue = splitBr[0].trim()
                  let wordObj = {
                    wid: wordId,
                    etime: word.getAttribute('data-etime'),
                    stime: word.getAttribute('data-stime'),
                    pos: realWordPos,
                    word: wordValue,
                    highlights: wordOptions.highlights,
                    keywords: wordOptions.keywords
                  }
                  turnPayload.words.push(wordObj)
                  textPayload[turnIndex] = turnPayload
                  turnIndex++
                  realWordPos = 0
                  turnPayload = {
                    speaker_id: turn.getAttribute('data-speaker'),
                    turn_id: "todefine",
                    pos: turnIndex,
                    words: []
                  }
                  word.innerHTML = wordValue + '&nbsp;'
                } 
                //'<br>word'
                else if (splitBr[0] === "" && splitBr[1] !== '') {
                  wordValue = splitBr[1].trim()
                  textPayload[turnIndex] = turnPayload
                  turnIndex++
                  realWordPos = 0
                  turnPayload = {
                    speaker_id: turn.getAttribute('data-speaker'),
                    turn_id: "todefine",
                    pos: turnIndex,
                    words: [{
                      wid: wordId,
                      etime: word.getAttribute('data-etime'),
                      stime: word.getAttribute('data-stime'),
                      pos: realWordPos,
                      word: wordValue,
                      highlights: wordOptions.highlights,
                      keywords: wordOptions.keywords
                    }]
                  }
                  word.innerHTML = wordValue + '&nbsp;'
                }
                // word = 'wo<br>rd'
                else if (splitBr[0] !== "" && splitBr[1] !== '') { 
                  // Finish current turn
                  let wordCurrentTurn = splitBr[0].trim()
                  let wordNextTurn = splitBr[1].trim()
                  let wordCurrentObj = {
                    wid: wordId,
                    etime: word.getAttribute('data-etime'),
                    stime: word.getAttribute('data-stime'),
                    pos: realWordPos,
                    word: wordCurrentTurn,
                    highlights: wordOptions.highlights,
                    keywords: wordOptions.keywords
                  }
                  turnPayload.words.push(wordCurrentObj)
                  textPayload[turnIndex] = turnPayload
                  word.innerHTML = wordCurrentTurn + '&nbsp;'

                  turnIndex++
                  realWordPos = 0

                  // Start next turn
                  turnPayload = {
                    speaker_id: turn.getAttribute('data-speaker'),
                    turn_id: "todefine",
                    pos: turnIndex,
                    words: [{
                      wid: "todefine",
                      etime: word.getAttribute('data-etime'),
                      stime: word.getAttribute('data-stime'),
                      pos: realWordPos,
                      word: wordNextTurn,
                      highlights: wordOptions.highlights,
                      keywords: wordOptions.keywords
                    }]
                  }
                }
              }
            }
            else {
              let wordSplit = wordVal.split(' ')
              if (wordSplit.length > 1) { // If words have been added
                // console.log('word added ?')
                for (let k = 0; k < wordSplit.length; k++) {
                  let wordObj = {}
                  const wordId = word.getAttribute('data-word-id')
                  const wordOptions = this.getHlAndKwByWordId(wordId)
                  wordObj = {
                    wid: 'todefine',
                    etime: word.getAttribute('data-etime') ? word.getAttribute('data-etime') : -1,
                    stime: word.getAttribute('data-stime') ? word.getAttribute('data-stime') : -1,
                    pos: realWordPos,
                    word: wordSplit[k],
                    highlights: wordOptions.highlights,
                    keywords: wordOptions.keywords
                    
                  }
                  turnPayload.words.push(wordObj)
                  realWordPos++
                }
              } else if(wordSplit.length === 1 && wordSplit[0] !== "") {
                const wordId = word.getAttribute('data-word-id')
                const wordOptions = this.getHlAndKwByWordId(wordId)
                let wordObj = {
                  wid: wordId,
                  etime: word.getAttribute('data-etime'),
                  stime: word.getAttribute('data-stime'),
                  pos: realWordPos,
                  word: wordVal,
                  highlights: wordOptions.highlights,
                  keywords: wordOptions.keywords
                }
                turnPayload.words.push(wordObj)
                realWordPos++
              }
            }
          }
          textPayload[turnIndex] = turnPayload
          turnIndex++
        }
        this.convoTextCustom = textPayload
      }
      return 
    },
    
    // Get Highlights and Keywords by id
    getHlAndKwByWordId (wordId) {
      let options = {
        highlights: [],
        keywords: []
      }
      this.convoText.map(turn => {
        turn.words.map(word => {
          if (word.wid === wordId) {
            options.keywords = word.keywords
            options.highlights = word.highlights
          }
        })
      })
      return options
    },

    /*** HIGHLIGHTS ***/
    // Hihglihts show/hide
    setHighlights (data) {
      this.highlightsActive = []
      const allWords = document.getElementsByClassName('transcription--word')
      for(let word of allWords) {
          word.setAttribute('style','')
      }

      for (let hl of data) {
        if(hl.selected) {
          if(hl.words.length > 0) {
            for(let word of hl.words) {
              this.highlightsActive.push(word)
              let wordSpan = document.querySelectorAll(`.transcription--word[data-word-id="${word}"]`)
              if(wordSpan.length > 0) {
                wordSpan[0].setAttribute('style', `background-color: ${hl.color}`)
              }
            }
          }
        }
      }
    },

    /*** KEYWORDS ***/

    // Keywords show/hide 
    setKeywords (data) {
      this.keywordsActive = []
      const allWords = document.getElementsByClassName('transcription--word')
      for (let kw of data) {
        if(kw.selected) {
          
          if(kw.words.length > 0) {
            for(let word of kw.words) {
              this.keywordsActive.push(word)
            }
          }
        }
      }
    },

    /*** TEXT SELECTION ***/

    // Enable text selection
    bindTextSelection () {
      const transcription = document.getElementById('transcription')
      transcription.addEventListener('selectstart', this.initTextSelection)
    },
    // Disable text selection
    unbindTextSelection () {
      const transcription = document.getElementById('transcription')
      transcription.removeEventListener('selectstart', this.initTextSelection)
    },
    // Text selection event
    initTextSelection () {
      let startClick = new Date()
      if (window.Event) {
        document.captureEvents(Event.MOUSEMOVE)
      }
      const transcription = document.getElementById('transcription')
      transcription.onmouseup = (e) => {
        if(window.editionMode === false && !this.convoIsFiltered) {
          const stopClick = new Date()
          this.clickTime = stopClick - startClick
          const selection = window.getSelection()
          this.selectedText = []
          
          // > Selection: first element
          // chrome = selection.baseNode
          // firefox = selection.anchorNode
          let startWord = !selection.baseNode ? selection.anchorNode.parentNode : selection.baseNode.parentNode 
          let endWord = !selection.extentNode ? selection.focusNode.parentNode : selection.extentNode.parentNode

          // check if: selection from left to right)
          let startWordPos = parseInt(startWord.getAttribute('data-pos'))
          let startTurnPos = parseInt(startWord.getAttribute('data-turn-pos'))
          let endWordPos = parseInt(endWord.getAttribute('data-pos'))
          let endTurnPos = parseInt(endWord.getAttribute('data-turn-pos'))
          if (startTurnPos > endTurnPos || (startTurnPos === endTurnPos && startWordPos > endWordPos)) {
            const tmp = endWord
            endWord = startWord
            startWord = tmp
          }
          const startWordId = startWord.getAttribute('data-word-id')
          const startWordPosition = startWord.getAttribute('data-pos')
          const startTurnId = startWord.getAttribute('data-turn-id')
          const startTurn = document.querySelectorAll(`.transcription-speaker-sentence[data-turn-id="${startTurnId}"]`)[0]
          const startTurnPosition = startTurn.getAttribute('data-pos')
          const startTurnSpeakerId = startTurn.getAttribute('data-speaker')
          // > Selection: last element
          // chrome = selection.extendNode
          // firefox = selection.focusNode
          
          const endWordId = endWord.getAttribute('data-word-id')
          const endWordPosition = endWord.getAttribute('data-pos')
          const endTurnId = endWord.getAttribute('data-turn-id')
          const endTurn = document.querySelectorAll(`.transcription-speaker-sentence[data-turn-id="${endTurnId}"]`)[0]
          const endTurnPosition = endTurn.getAttribute('data-pos')
          const endTurnSpeakerId = endTurn.getAttribute('data-speaker')
          this.selectionObj = {
            startWord,
            startWordId,
            startWordPosition,
            startTurn,
            startTurnId,
            startTurnPosition,
            startTurnSpeakerId,
            endWord,
            endWordId,
            endWordPosition,
            endTurn,
            endTurnId,
            endTurnPosition,
            endTurnSpeakerId
          }
          this.selectionObj.words = startTurnId === endTurnId ? this.$store.getters.wordsToTextBetweenWordIds(this.convoId, this.selectionObj) : []
          if(!startTurn.classList.contains('transcription-speaker-sentence') || !endTurn.classList.contains('transcription-speaker-sentence')) {
            return false 
          } else {
            if (this.clickTime > 150) {
              this.setTextSelection(this.selectionObj)
            } else {
              this.selectionObj = null
            }
          }
        }
      }
    },
    // Render text selection and open Toolbox
    setTextSelection (selectionObj) {
      console.log(selectionObj)
      this.cancelTextSelection()
      this.playerPause()
      setTimeout(() => {
        let allParents = document.getElementsByClassName('transcription-speaker-sentence')
        const startTurnPosition = parseInt(selectionObj.startTurnPosition)
        const endTurnPosition= parseInt(selectionObj.endTurnPosition)
        const startWordPosition = parseInt(selectionObj.startWordPosition)
        const endWordPosition = parseInt(selectionObj.endWordPosition)
        if (selectionObj.startTurnId === selectionObj.endTurnId) { // 1 turn selection
          this.toolBoxOption = {
            comment: true,
            highlight: true,
            unhighlight: false,
            keywords: true,
            split: true
          }
          // Check if selected words got highlights
          let highlights = []
          if(!!selectionObj.words && selectionObj.words.words !== []) {
            for(let word of selectionObj.words.words){
              if(word.highlights.length > 0) {
                for(let hl of word.highlights) {
                  if(highlights.findIndex(allHl => allHl === hl) < 0) {
                    highlights.push(hl)
                  }
                }
              }
            }
          }
          if(highlights.length > 0) {
            this.toolBoxOption.unhighlight = true
            this.toolBoxOption.wordsHighlights = highlights
          }
          // Set text-selected class
          for(let parent of allParents) {
            const turnId = parent.getAttribute('data-turn-id')
            if(turnId === selectionObj.startTurnId) {
              if (!!parent.childNodes && parent.childNodes.length > 0) {
                for(let word of parent.childNodes) {
                  let wordPos = parseInt(word.getAttribute('data-pos'))
                  if (wordPos >= startWordPosition && wordPos <= endWordPosition) {
                    word.classList.add('text-selected')
                  }
                }
              }
            }
          }
        } else { // Many turns selection
          this.toolBoxOption = {
            comment: false,
            highlight: false,
            uuhighlight: false,
            keywords: false,
            split: true,
            merge: true
          }
          for(let parent of allParents) {
            if (!!parent.childNodes && parent.childNodes.length > 0) {
              const turnPosition = parseInt(parent.getAttribute('data-pos'))
              if(turnPosition === startTurnPosition) { // start Turn
                for(let word of parent.childNodes) {
                  let wordPos = parseInt(word.getAttribute('data-pos'))
                  if (wordPos >= startWordPosition) {
                    word.classList.add('text-selected')
                  }
                }
              } else if (turnPosition === endTurnPosition) { // end Turn
                for(let word of parent.childNodes) {
                  let wordPos = parseInt(word.getAttribute('data-pos'))
                  if (wordPos <= endWordPosition) {
                    word.classList.add('text-selected')
                  }
                }
              } else if (turnPosition > startTurnPosition && turnPosition < endTurnPosition) { // middle turn(s)
                for(let word of parent.childNodes) {
                    word.classList.add('text-selected')
                }
              }
            }
          }
        }
        if(window.editionMode === false) {
          this.showToolBox(selectionObj)
        }
      }, 100)
    },
    // Cancel text selection
    cancelTextSelection () {
      this.closeToolBox()
      this.selectedText = []
      let selected = document.getElementsByClassName('text-selected')
      if(selected.length > 0) {
        Array.from(document.querySelectorAll('.transcription--word')).forEach(function(el) { 
            el.classList.remove('text-selected');
        })
      }
    },
    // Show Toolbox
    showToolBox (selectionObj) {
      const bounce = selectionObj.endWord.getBoundingClientRect()
      const offsetX = bounce.x
      const offsetY = bounce.y
      // Show toolbox and place it
      bus.$emit('show_selected_toolbox', {
        selectionObj,
        offsetX,
        offsetY,
        convoId: this.convoId,
        toolBoxOption: this.toolBoxOption
      })
      // cancel "onmouseup" event bind
      const transcription = document.getElementById('transcription')
      transcription.onmouseup = (e) => {
        e.preventDefault()
      }
    },
    // Close Toolbox
    closeToolBox () {
      if (window.getSelection) {
        if (window.getSelection().empty) {  // Chrome
          window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) {  // Firefox
          window.getSelection().removeAllRanges();
        }
      } else if (document.selection) {  // IE?
        document.selection.empty();
      }
    },

    /*** SPEAKER EDIT ***/
    
    // Edit Speaker
    editSpeaker (event, speaker, turnId) {
      if (!this.speakerEdit) {
        const btn = event.target
        const bounce = btn.getBoundingClientRect()
        const EditSpeakerTranscriptionFrame = document.getElementById('edit-speaker-frame')
        EditSpeakerTranscriptionFrame.setAttribute('style',`top: ${bounce.y > 500 ? 500 : bounce.y -100}px; left: ${bounce.x - 60}px`)
        const target = event.target
        target.classList.add('active')
        bus.$emit(`edit_speaker_transcription`, {
          speaker, 
          conversationId: this.convoId, 
          turnId
        })
        this.speakerEdit = true
      }
    },
    
    /*** SCROLL TO ***/
    // Scroll to current turn
    scrollToCurrentTurn (pos) {
      const targetTurn = document.getElementById(`turn-${pos}`)
      if(!!targetTurn.offsetTop && pos > 0) {
        transcription.scrollTo({top: targetTurn.offsetTop - 200, behavior: 'smooth' })
      }
    },
    
    /*** CURSOR POSITION ***/
    // Get cursor position
    getCursorXY(e) {
      this.cursorX = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
      this.cursorY = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
    },

    /*** AUDIO PLAYER EVENTS ***/
    
    // Audio player: play from a word
    playFromWord (stime) {
      if(window.editionMode === false) {
        this.closeToolBox()
        if(stime !== ''){
          bus.$emit('audio_player_playfrom', {time: stime})
        }
      }
    },
    // Audio player pause
    playerPause() {
      bus.$emit('audio_player_pause',{})
    }
  }
}
</script>