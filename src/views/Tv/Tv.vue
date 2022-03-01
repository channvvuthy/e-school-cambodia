<template>
  <div>
    <video
        id="my-player"
        class="video-js vjs-default-skin"
        preload="auto"
        data-setup="{&quot;html5&quot; : { &quot;nativeTextTracks&quot; : false }}"
    >
    </video>
  </div>
</template>
<script>
import videojs from "video.js";
import "video.js/dist/video-js.css";

export default {
  mounted() {
    const videoPlayer = videojs("my-player");//The id of the associated video
    videoPlayer.src({
      type: "rtmp",
      src: 'rtmp://stream.et-l.ink/live/Ap6UwsAjKFgZA8ueacC4mAm2ScSrZk'
    });
    videoPlayer.play();//Play
  }
}
</script>