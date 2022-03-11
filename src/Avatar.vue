<template>
  <div>
    <input class="hidden" type="file" ref="avatar"
           accept="image/*"
           @change="onSelectFile">
    <div :class="`w-${size} h-${size}`"
         @click="()=>{this.$refs.avatar.click()}"
         class="rounded-full bg-gray-50 bg-cover bg-center cursor-pointer"
         :style="{backgroundImage:`url(${defaultAvatarUrl})`}"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    avatarUrl: {
      default: () => {
        return '/profile.png'
      }
    },
    size: {
      default: () => 20
    }
  },
  data() {
    return {
      defaultAvatarUrl: null
    }
  },
  methods: {
    onSelectFile(event) {
      const file = event.target.files[0]
      this.defaultAvatarUrl = URL.createObjectURL(file)
      this.$emit('onSelectFile', file)
    }
  },
  created() {
    this.defaultAvatarUrl = this.avatarUrl
  }
}
</script>¬