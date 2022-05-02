<template>
  <div :class="darkMode?`bg-youtube`:`bg-white`">
    <div v-if="loading" class="w-full flex justify-center items-center h-screen pb-40">
      <div class="loader" :class="darkMode?`text-gray-300`:`text-youtube`"></div>
    </div>
    <div v-else>
      <pdf :src="pdfFile" :key="i" v-for="i in numPages" :page="i" style="width: 100%"></pdf>
    </div>
  </div>
</template>

<script>
import pdf from 'vue-pdf'

export default {
  components: {
    pdf
  },
  props: {
    pdfUrl: {
      default: () => {
        return ""
      }
    },
    darkMode: {
      default: () => {
        return false
      }
    }
  },

  data() {
    return {
      loading: false,
      currentPage: 0,
      pageCount: 0,
      pdfFile: "",
      numPages: undefined,
    }
  },

  methods: {
    progress() {
    }
  },
  created() {
    this.loading = true
    if (this.pdfUrl) {
      this.pdfFile = pdf.createLoadingTask(this.pdfUrl);
      this.pdfFile.promise.then(pdf => {
        this.numPages = pdf.numPages;
        this.loading = false
      })
    }

  }
}
</script>
<style lang="scss">
@keyframes load7 {
  0%, 80%, 100% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2.5em 0 0;
  }
}

.loader {
  border-radius: 50%;
  width: 1em;
  height: 1em;
  animation: load7 1s infinite ease-in-out;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  transform: translateZ(0);
  animation-delay: -0.16s;

  &:before {
    border-radius: 50%;
    width: 1em;
    height: 1em;
    animation: load7 1s infinite ease-in-out;
    content: '';
    position: absolute;
    top: 0;
    left: -2.5em;
    animation-delay: -0.32s;
  }

  &:after {
    border-radius: 50%;
    width: 1em;
    height: 1em;
    animation: load7 1s infinite ease-in-out;
    content: '';
    position: absolute;
    top: 0;
    left: 2.5em;
  }
}
</style>