<template>
  <photo-collage-wrapper
      @itemClick="itemClickHandler"
      v-bind="collage"/>
</template>

<script>
import {PhotoCollageWrapper} from "vue-photo-collage";

export default {
  name: "PhotoGrid",
  props: {
    photos: {
      default: () => {
        return []
      }
    },
    collage: {
      default: () => {
        return {
          gapSize: "4px",
          borderRadius: "0",
          width: "auto",
          height: [],
          layout: [2, 3],
          photos: [],
          showNumOfRemainingPhotos: true,
        }
      }
    },
  },
  components: {
    PhotoCollageWrapper
  },
  methods: {
    itemClickHandler(data, column) {
      const item = Object.assign({}, data);
      alert(`itemId=${item.id}, column=${column}`);
    },
  },
  created() {
    if (this.photos.length === 1 || this.photos.length === 2) {
      this.collage.height = ["calc(50vh - 2em)", "calc(0vh - 1em)"]
    } else {
      this.collage.height = ["calc(50vh - 2em)", "calc(50vh - 1em)"]
    }
    if (this.photos.length === 3) {
      this.collage.layout = [1, 2]
    }
    for (let i = 0; i < this.photos.length; i++) {
      this.collage.photos.push({
        source: this.photos[i].url
      })
    }
  }
}
</script>
