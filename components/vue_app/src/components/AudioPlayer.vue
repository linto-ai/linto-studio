<template>
  <div id="audio-player" class="flex1 flex row" :class="audioIsPlaying ? 'isPlaying' : ''">
    <div class="flex col control">
      <button @click="playPrevSpeaker()" class="audio-player--control" >
        <span class="icon prevspeaker"></span>
      </button>
      <span class="audio-player--control__label">Prev. speaker</span>
    </div>
    <div class="flex col control">
      <button @click="audioIsPlaying ? pause() : play()" class="audio-player--control">
        <span class="icon" :class="audioIsPlaying ? 'pause' : 'play'"></span>
      </button>
    </div>
    <div class="flex col control">
      <button @click="playNextSpeaker()" class="audio-player--control">
        <span class="icon nextspeaker"></span>
      </button>
      <span class="audio-player--control__label">Next speaker</span>
    </div>
    <div class="flex col control">
     <button class="audio-player--control" @click="toggleAudioSpeedOptions()">
        <span class="icon speed"></span>
        <span class="icon speed-label">x{{ audioSpeed }}</span>
      </button>
      <span class="audio-player--control__label">Speed</span>
      <div class="audio-player-speed-options flex col" :class="showAudioSpeed ? 'visible' : 'hidden'">
        <button 
          v-for="(range, i) in audioSpeedRange" 
          :key="i" 
          :class="range === audioSpeed ? 'active' : ''"
          class="audio-player-speed-item"
          @click="setAudioSpeed(range)"
        >{{ range }}</button>
      </div>
    </div>
    
    <div class="audio-player--timeline flex1">
      <input 
        type="range" 
        class="audio-player--timeline__input" 
        @click="playFromTimeLine($event)" 
        @change="playFromTimeLine($event)" 
        @input="updateTimeline($event)"
      />
      <span class="audio-player--timeline__played" :style="`width: ${prctTimelineSelected}%`"></span>
      <span class="audio-player--timeline__bg"></span>
    </div>
    <span class="audio-player--timeline__time"> {{ currentTimeHMS }} / {{ durationHMS }}</span>
    <button class="keyboard-commands-btn" @click="showKeyboardCommands()"></button>
  </div>
</template>
<script>
import { bus } from '../main.js'
export default {
  props: ['audioPath', 'duration', 'nbTurns', 'currentTurn', 'editionMode', 'convoIsFiltered', 'convoText'],
  data () {
    return {
      currentTime: 0,
      prctTimelineSelected: 0,
      showAudioSpeed: false,
      audioSpeed: 1,
      audioSpeedRange: [0.5, 0.75, 1, 1.25, 1.5, 2],
      audioIsPlaying: false,
      audioPlayer: null,
      playSegments: []
    }
  },
  mounted () {
    this.initAudioPlayer()
  },
  computed : {
    
    prctTimeline () {
      return this.currentTime * 100 / this.duration
    },
    currentTimeHMS () {
      return this.timeToHMS(this.currentTime)
    },
    durationHMS () {
      return this.timeToHMS(this.duration)
    }
  },
  watch:  {
    prctTimeline (data) {
      this.prctTimelineSelected = data
    },
    audioIsPlaying (data) {
      if(data) {
        bus.$emit('scroll_to_current', {})
      }
    },
    convoText (data) {
      this.pause()
      if (this.convoIsFiltered) {
        this.playSegments = []
        if(data.length > 0) {
          data.map(turn => {
            if(turn.words.length > 0) {
              this.playSegments.push({
                stime: turn.words[0].stime,
                etime: turn.words[turn.words.length - 1].etime
              })
            }
          })
        }
      }
      if(this.playSegments.length > 0) {
        this.audioPlayer.currentTime = this.playSegments[0].stime
      }
    },
    audioSpeed (data) {
      this.audioPlayer.playbackRate = data
    }
  },
  methods : {
    initAudioPlayer() {
      this.audioPlayer = new Audio()
      this.audioPlayer.src = this.audioPath
      this.audioPlayer.ontimeupdate = () => {
        this.updateTime()
      }
      this.audioPlayer.addEventListener('playing', () => {
        this.audioIsPlaying = true
      })
      
      this.audioPlayer.addEventListener('pause', () => {
        this.audioIsPlaying = false
      })

      bus.$on('audio_player_playfrom', (data) => {
        this.playFrom(data.time)
      })
      bus.$on('audio_player_pause', (data) => {
        if(this.audioIsPlaying) {
          this.pause()
        }
      })
      bus.$on('audio_player_play', (data) => {
        this.play()
      })

      bus.$on('audio_player_play_pause', (data) => {
        if(!this.editionMode) {
          if(this.audioIsPlaying) {
           this.pause()
          } else {
            this.play()
          }
        }
      })

      bus.$on('audio_player_next_turn', () => {
        if(!this.editionMode) {
          this.playNextSpeaker()
        }
      })

      bus.$on('audio_player_prev_turn', () => {
        if(!this.editionMode) {
          this.playPrevSpeaker()
        }
      })
    },
    playFrom(time) {
      this.pause()
      this.audioPlayer.currentTime = time
      setTimeout(()=>{
        this.play()
      }, 100)
    },
    playFromTimeLine (e) {
      const val = e.srcElement.value
      const targetTime = parseInt(val * this.duration / 100)
      this.playFrom(targetTime)
    },
    updateTime () {
      this.currentTime = this.audioPlayer.currentTime
      bus.$emit('audio_player_currenttime', {time : this.currentTime })
    },
    play () {
      this.audioPlayer.play()
    },
    pause () {
      this.audioPlayer.pause()
    },
    toggleAudioSpeedOptions () {
      this.showAudioSpeed = !this.showAudioSpeed
    },
    setAudioSpeed (speed) {
      this.audioSpeed = speed
      this.showAudioSpeed = false
    },
    timeToHMS (time) {
      return this.$options.filters.timeToHMS(time) 
    },
    updateTimeline (e) {
      this.prctTimelineSelected = e.srcElement.value
    },
    playPrevSpeaker () {
      const tr = document.getElementsByClassName('active--speaker')
      if (tr.length === 0) {
        this.playFrom(this.currentTime)
      } else {
        if (parseInt(this.currentTurn) === 1) {
          this.playFrom(0)
        } else {
          const items = document.getElementsByClassName('table-speaker--turn')
          for(let item of items) {
            const targetTurn = parseInt(this.currentTurn) - 1
            const itemTurn = item.getAttribute('data-turn')
            if (parseInt(itemTurn) === parseInt(targetTurn)) {
              const targetTime = item.getAttribute('data-stime')
              this.playFrom(targetTime)
            }
          }
        }
      }
    },
    playNextSpeaker () {
      const tr = document.getElementsByClassName('active--speaker')
      if (tr.length === 0) {
        this.playFrom(this.currentTime)
      } else {
        if (parseInt(this.currentTurn) === this.nbTurns - 1) {
          return
        } else {
          const items = document.getElementsByClassName('table-speaker--turn')
          for(let item of items) {
            const targetTurn = parseInt(this.currentTurn) + 1
            const itemTurn = item.getAttribute('data-turn')
            if (parseInt(itemTurn) === parseInt(targetTurn)) {
              const targetTime = item.getAttribute('data-stime')
              this.playFrom(targetTime)
            }
          }
        }
      }
    },
    showKeyboardCommands () {
      bus.$emit('show_player_commands', {})
    }
  }
}
</script>