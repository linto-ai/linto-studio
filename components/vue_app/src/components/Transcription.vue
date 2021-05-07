<template>
  <div id="transcription">
    <table class="table table--transcription">
      <tr 
        v-for="turn in convoText" 
        :key="turn.turn_id" 
        :data-stime="turn.words.length > 0 ? turn.words[0].stime : '-1' "  
        :data-etime="turn.words.length > 0 ? turn.words[turn.words.length - 1].etime : '-1'"
        :data-turn="turn.pos"
        
        :class="!editionMode && currentTurn === turn.pos ? 'active active--speaker' : ''"
        class="table-speaker--turn"
        :id="`turn-${turn.pos}`"
      >
      
        <td><span class="transcription--turn">{{ turn.pos }}</span></td>
        <td class="transcription--speaker-td">
          <div class="table-speaker--edit">
            <button class="btn--inline btn--inline-transcription-speaker" @click="editSpeaker($event, speakersArray[speakersArray.findIndex(sp => sp.speaker_id === turn.speaker_id)], turn.turn_id)">
              <span class="label transcription--speaker">{{ speakersArray[speakersArray.findIndex(sp => sp.speaker_id === turn.speaker_id)].speaker_name }}</span>
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
            v-for="word in turn.words" 
            :key="word.wid" 
            :data-word-id="word.wid" 
            :data-turn-id="turn.turn_id"
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
  props: ['convoText', 'editionMode', 'currentTime', 'currentTurn', 'speakersArray', 'convoSpeakers', 'convoId', 'convoIsFiltered','highlightsOptions'],
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
      keywordsActive: []
    }
  },
  mounted () {
    bus.$on('close_selected_toolbox', () => {
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

    this.initTextSelection()
  },
  watch: {
    currentTurn (data) {
      // on playing : smooth scroll to current turn 
      const transcription = document.getElementById('transcription')
      this.scrollToCurrentTurn(data)
    },
    
  },
  methods: {
    setHighlights (data) {
      console.log('1/', data)
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
    scrollToCurrentTurn (pos) {
        const targetTurn = document.getElementById(`turn-${pos}`)
          transcription.scrollTo({top: targetTurn.offsetTop - 200, behavior: 'smooth' })
      },
     editSpeaker (event, speaker, turnId) {
      if (!this.speakerEdit) {
        const btn = event.target
        const bounce = btn.getBoundingClientRect()
        const EditSpeakerTranscriptionFrame = document.getElementById('edit-speaker-frame')
        EditSpeakerTranscriptionFrame.setAttribute('style',`top: ${bounce.y}px; left: ${bounce.x - 60}px`)
        const target = event.target
        target.classList.add('active')
        bus.$emit(`edit_speaker_transcription`, {
          speaker, 
          speakers: this.convoSpeakers, 
          conversationId: this.convoId, 
          turnId
        })
        this.speakerEdit = true
      }
    },
    /* TEXT SELECTION */
    initTextSelection () {
      if (window.Event) {
        document.captureEvents(Event.MOUSEMOVE)
      }
      const transcription = document.getElementById('transcription')
      // text selection event in "transcription" block
      transcription.addEventListener('selectstart', (e) => {
        if(!this.editionMode && !this.convoIsFiltered) {
          let startClick = new Date()
          transcription.onmouseup = (e) => {
            const stopClick = new Date()
            this.clickTime = stopClick - startClick
            const selection = window.getSelection()
            this.selectedText = []
            
            // > Selection: first element
            // chrome = selection.baseNode
            // firefox = selection.anchorNode
            const startWord = !selection.baseNode ? selection.anchorNode.parentNode : selection.baseNode.parentNode 
            const startWordId = startWord.getAttribute('data-word-id')
            const startWordPosition = startWord.getAttribute('data-pos')
            const startTurnId = startWord.getAttribute('data-turn-id')

    
            const startTurn = document.querySelectorAll(`.transcription-speaker-sentence[data-turn-id="${startTurnId}"]`)[0]
            const startTurnPosition = startTurn.getAttribute('data-pos')
            const startTurnSpeakerId = startTurn.getAttribute('data-speaker')
            // > Selection: last element
            // chrome = selection.extendNode
            // firefox = selection.focusNode
            const endWord = !selection.extentNode ? selection.focusNode.parentNode : selection.extentNode.parentNode
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
      })
    },
    setTextSelection (selectionObj) {
      this.cancelTextSelection()
      console.log(selectionObj)
      this.playerPause()
      setTimeout(() => {
        let allParents = document.getElementsByClassName('transcription-speaker-sentence')
        const startTurnPosition = parseInt(selectionObj.startTurnPosition)
        const endTurnPosition= parseInt(selectionObj.endTurnPosition)
        const startWordPosition = parseInt(selectionObj.startWordPosition)
        const endWordPosition = parseInt(selectionObj.endWordPosition)
        if(selectionObj.startTurnId === selectionObj.endTurnId) { // 1 turn selection
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
        if(!this.editionMode) {
          this.showToolBox(selectionObj)
        }
      }, 100)
    },
    cancelTextSelection () {
      this.showSelectToolbox = false
      this.closeToolBox()
      this.selectedText = []
      let selected = document.getElementsByClassName('text-selected')
      if(selected.length > 0) {
        Array.from(document.querySelectorAll('.transcription--word')).forEach(function(el) { 
            el.classList.remove('text-selected');
        })
      }
    },
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
    getCursorXY(e) {
      this.cursorX = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
      this.cursorY = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
    },
    /* Audio player */
    playFromWord (stime) {
      if(!this.editionMode) {
        if(stime !== '' && this.clickTime <= 150){
          bus.$emit('audio_player_playfrom', {time: stime})
        }
      }
    },
    playerPause() {
      bus.$emit('audio_player_pause',{})
    }
  }
}
</script>