<template>
  <div class="grid gap-1" :class="grid()">
    <div
        @click="itemClick"
        class="relative cursor-pointer"
        v-if="key < 4"
        :class="column(key)"
        v-for="(photo, key) in photos" :key="key">
      <img :src="photo.url"
           :class="matchHeight(photos.length, key)"
           class="object-cover w-full">
      <div v-if="key === 3 && photos.length > 4"
           class="absolute z-50 top-0 left-0 h-full w-full flex justify-center items-center bg-black bg-opacity-60 hover:bg-opacity-70 text-white">
              <span class="font-PoppinsMedium text-3xl">
                +{{ photos.length - 4 }}
              </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PhotoGrid",
  props: {
    post: {
      default: () => {
        return {}
      }
    },
    photos: {
      default: () => {
        return []
      }
    }
  },
  methods: {
    matchHeight(length, index) {
      if (length > 1 && index > 0) {
        return 'h-full'
      } else if (length == 2) {
        return 'h-full'
      }
    },
    itemClick() {
      this.$emit("itemClick", this.post)
    },
    column(index) {
      if (this.photos.length === 1) {
        return 'col-span-2'
      }
      if (this.photos.length === 3) {
        if (index === 0) {
          return 'col-span-2'
        }
      }
      if (this.photos.length >= 4) {
        if (index === 0) {
          return 'col-span-3'
        }
      }
    },
    grid() {
      if (this.photos.length > 3) {
        return 'grid-cols-3'
      }
      return 'grid-cols-2'
    },
  }
}
</script>
