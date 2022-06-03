<template>
  <div>
    <input
      class="hidden"
      type="file"
      ref="avatar"
      accept="image/*"
      @change="onSelectFile"
    />
    <div
      :class="`w-${size} h-${size}`"
      class="rounded-full bg-gray-100 bg-cover bg-center cursor-pointer"
      :style="{
        backgroundImage: `url(${
          avatarUrl.includes('?')
            ? avatarUrl + '&' + Math.random()
            : avatarUrl + '?' + Math.random()
        })`,
      }"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    avatarUrl: {
      default: () => {
        return "/profile.png";
      },
    },
    size: {
      default: () => 20,
    },
  },
  data() {
    return {
      defaultAvatarUrl: null,
    };
  },
  methods: {
    onSelectFile(event) {
      const file = event.target.files[0];
      this.defaultAvatarUrl = URL.createObjectURL(file);
      this.$emit("onSelectFile", file);
    },
  },
};
</script>