<template lang="pug">
.host
  //- adsbygoogle(ad-slot=" ")
  header
    .left
      youtube(
        ref="player",
        :video-id="currentVideoId",
        @ready="ready",
        @playing="playing",
        :player-vars="{autoplay: !isFirstLoad}",
      )
    .right
      .btns
        .btn(v-on:click="playAll()") Play All
        .btn(v-on:click="playRandom()") Play Random
      .counts
        span Episodes:
        b {{ filteredVideos.length }}
        span Filtered:
        b {{ videos.length - filteredVideos.length }}
      .list(
        ref="list",
        v-if="videos && videos.length"
      )
        div(v-if="filteredVideos && filteredVideos.length")
          .video(
            :class="{current: currentVideoId === video.url}",
            v-for="video in filteredVideos"
          )
            span(v-on:click="playVideo(video.url)")
              b {{ video.title }}
              p {{ guestsFromTags(video) }}
        .no-videos(v-else)
          span All episodes filtered out.
  footer
    section(v-if="hasLoaded")
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
          span.included(:class="mode") {{ explanation.includedGuests }}
        section
          span.text {{ explanation.postText }}
          span.excluded(:class="mode") {{ explanation.excludedGuests }}
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
  .copy
    a(href="mailto:steelskysoftware@gmail.com") Ⓒ 2018 Steel Sky Software
</template>
<script lang="babel" src="./index.js"></script>
<style scoped lang="stylus" src="./index.styl"></style>
