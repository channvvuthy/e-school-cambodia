<template>
  <div id="app">
    <webview src="https://www.adobe.com/software/flash/about/" plugins>
      <rtmp-player
          :type="'rtmp/flv'"
          :width="900" :height="500" :autoplay="true" :controls="true" ref="myPlayer" :source="src"/>
    </webview>

  </div>
</template>

<script>
import 'rtmp-player/dist/rtmp-player.css'
import rtmpPlayer from 'rtmp-player'

export default {
  name: 'App',
  components: {
    rtmpPlayer,
  },
  data() {
    return {
      src:"rtmp://stream.et-l.ink/live/Ap6UwsAjKFgZA8ueacC4mAm2ScSrZk"
    };
  }
};
</script>