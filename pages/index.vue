<template lang="pug">
.host
  .left
    header
      .player#player(ref="player")
    footer
      section(v-if="ready")
        .filters
          .toggles
            .toggle(v-for="m in modes")
              input(
                :id="m",
                name="mode",
                type="radio",
                :checked="mode === m",
                v-on:click="setMode(m)"
              )
              label(:for="m") {{ m }}
          .btn(thin, v-on:click="initGuests()") Clear Filter
        .explanation
          section
            span.text {{ explanation.preText }}
            span.guests.included(:class="mode") {{ explanation.includedGuests }}
          section
            span.text {{ explanation.postText }}
            span.guests.excluded(:class="mode") {{ explanation.excludedGuests }}
        .guests
          .guest(
            v-for="guest in guests",
            v-on:click="toggleGuest(guest)",
            :class="guestClass(guest)"
          )
            img(
              draggable="false",
              :src="guest.image",
            )
            .name
              b {{ guest.name }} 
              span {{ counts[guest.tag] + ' videos' }}
  .right
    .list(v-if="videos && videos.length")
      .btns
        .btn(v-on:click="playAll()") Play All
        .btn(v-on:click="playRandom()") Play Random
      .counts
        span Episodes:
        b {{ filteredVideos.length }}
        span Filtered:
        b {{ videos.length - filteredVideos.length }}
      div(v-if="filteredVideos && filteredVideos.length")
        .video(v-for="video in filteredVideos")
          span(v-on:click="playVideo(video.url)")
            | {{ video.title || 'https://www.youtube.com/watch?v=' + video.url }}
</template>
<script lang="babel" src="./index.js"></script>
<style scoped lang="stylus" src="./index.styl"></style>
