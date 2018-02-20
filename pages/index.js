import {Guest, Video} from '../models'
import shuffle from 'lodash/shuffle'
import Vue from 'vue'
import VueYouTubeEmbed from 'vue-youtube-embed'

Vue.use(VueYouTubeEmbed)

export default {
  components: {

  },
  data() {
    return {
      hasLoaded: false,
      isFirstLoad: true,
      videos: [],
      filteredVideos: [],
      explanation: {},
      currentVideoId: null,
    }
  },
  created() {
    this.modes = ['exclusion', 'inclusion']
    this.mode = this.modes[0]
    this.counts = {}
    this.filter = {}
  },
  mounted() {
    Promise.all([
      Guest.load(),
      Video.load(),
    ]).then(data => {
      console.log('mounted and loaded')
      data.forEach(d => Object.assign(this, d))
      this.filteredVideos = this.videos.sort((a, b) => a.id - b.id)
      this.currentVideoId = this.videos && this.videos[0].url
      this.initGuests()
    })
  },
  methods: {
    ready(player) {
      console.log('player ready')
      this.player = player
      let iframe = this.$el.querySelector('iframe')
      iframe.style.height = '100%'
      iframe.style.width = '100%'
      this.hasLoaded = true
    },
    playing(player) {
      let data = player.getVideoData()
    },
    stop() {
      this.player.stopVideo()
    },
    pause() {
      this.player.pauseVideo()
    },
    scrollToTop() {
      window.scrollTo(0, 0)
    },
    playVideo(url) {
      this.isFirstLoad = false
      this.player.loadVideoById(url)
      this.setCurrentVideo(url)
    },
    playAll() {
      if(!this.filteredVideos.length) return
      this.isFirstLoad = false
      let urls = []
      this.filteredVideos.forEach(v => urls.push(v.url))
      this.player.loadPlaylist({playlist: urls})
      this.setCurrentVideo(urls[0])
    },
    playRandom() {
      if(!this.filteredVideos.length) return
      this.isFirstLoad = false
      let urls = []
      shuffle(this.filteredVideos).forEach(v => urls.push(v.url))
      this.player.loadPlaylist({playlist: urls})
      this.setCurrentVideo(urls[0])
    },
    setCurrentVideo(url) {
      this.currentVideoId = url

      setTimeout(() => {
        let list = this.$refs.list
        let currentEl = this.$refs.list.querySelector('.video.current')
        if(list && currentEl) {
          let listScroll = list.scrollTop + list.clientHeight
          let currentElPos = currentEl.clientHeight + (currentEl.offsetTop - list.offsetTop)
          if(listScroll < currentElPos || listScroll > currentElPos + list.clientHeight) {
            list.scrollTop = currentEl.offsetTop - list.offsetTop
          }
        }
      }, 1)
    },
    setMode(mode) {
      this.mode = mode
      this.resetFilter()
      this.filterVideos()
      this.getExplanation()
    },
    guestsFromTags(video) {
      return video.tags
        .split(',')
        .map(t => this.guests.find(g => g.tag === t).name)
        .join(', ')
    },
    toggleGuest(guest) {
      if(this.filter.included.includes(guest.tag)) {
        this.filter.included = this.filter.included.filter(t => t !== guest.tag)
        if(this.filter.included.length > 0) {
          this.filter.excluded.push(guest.tag)
        } else {
          this.filter.excluded = []
        }
      } else if(this.mode === 'inclusion' && this.filter.excluded.includes(guest.tag)) {
        this.filter.excluded = this.filter.excluded.filter(t => t !== guest.tag)
      } else {
        this.filter.excluded = this.filter.excluded.filter(t => t !== guest.tag)
        this.filter.included.push(guest.tag)
      }
      this.filterVideos()
      this.getExplanation()
    },
    initGuests() {
      this.resetFilter()
      this.counts = {}
      this.videos.forEach(v => {
        v.guestTags.forEach(tag => {
          let foundGuest = this.guests.find(g => g.tag === tag)
          this.counts[foundGuest.tag]
          if(typeof this.counts[foundGuest.tag] === 'undefined') {
            this.counts[foundGuest.tag] = 0
          }
          if(foundGuest.tag === tag) this.counts[foundGuest.tag]++
        })
      })
      this.guests
        .sort((a, b) => b.tag > a.tag ? -1 : 1)
        .sort((a, b) => this.counts[b.tag] - this.counts[a.tag])
      this.filterVideos()
      this.getExplanation()
    },
    guestClass(guest) {
      switch(true) {
        case this.isIncluded(guest):
          return 'included'
          break
        case (this.mode === 'exclusion' && !this.isIncluded(guest)) ||
          (this.mode === 'inclusion' && this.isExcluded(guest)):
          return 'excluded'
          break
        case this.mode === 'inclusion' &&
          !this.isIncluded(guest) &&
          !this.isExcluded(guest):
          return 'disabled'
      }
    },
    isIncluded(guest) {
      return this.filter.included.includes(guest.tag)
    },
    isExcluded(guest) {
      return this.filter.excluded.includes(guest.tag)
    },
    filterVideos() {
      this.filteredVideos = this.videos.filter(v => {
        if(this.mode === 'exclusion') {
          return v.guestTags.every(t => this.filter.included.includes(t))
        } else {
          return v.guestTags.some(t => this.filter.included.includes(t))
        }
      }).filter(v => {
        return !v.guestTags.some(t => this.filter.excluded.includes(t))
      })
    },
    resetFilter() {
      this.filter = {
        included: [],
        excluded: [],
      }
      if(this.mode === 'exclusion') {
        this.guests.forEach(g => this.filter.included.push(g.tag))
      }
    },
    getExplanation() {
      this.explanation = {}
      let preText = ''
      let postText = ''
      let includedGuests, excludedGuests
      let formatGuests = (guests) => (guests || []).map(g => g.name).join(', ')
      if(this.mode === 'exclusion') {
        if(this.filter.included.length === this.guests.length) return preText
        preText = 'Showing episodes where these panelists are not included:'
        includedGuests = this.guests
          .filter(g => !this.filter.included.includes(g.tag))
      } else {
        if(!this.filter.included.length) return preText
        preText = 'Showing episodes where any of these panelists are included:'
        includedGuests = this.guests
          .filter(g => this.filter.included.includes(g.tag))
        if(this.filter.excluded.length) {
          postText = 'Except episodes which also include:'
          excludedGuests = this.guests
            .filter(g => this.filter.excluded.includes(g.tag))
        }
      }
      Object.assign(this.explanation, {
        preText: preText,
        postText: postText,
        includedGuests: formatGuests(includedGuests),
        excludedGuests: formatGuests(excludedGuests)
      })
    }
  }
}
