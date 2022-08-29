<template>
  <div :class="className">
    <div class="shadow rounded-xl w-96"
         :class="darkMode ? `bg-secondary`: `bg-white`">
      <div
          :class="darkMode ?`border-b border-facebook`: `border-b`"
          class="h-14 flex items-center justify-between px-5 text-lg">

        <div class="cursor-pointer" @click="()=>{this.$emit('closePhoto')}">
          <CloseIcon :fill="darkMode ? `#909090` : `#000000`"/>
        </div>
        <div class="w-full text-center">
          <div>
            {{ $t('2113') }}
          </div>
        </div>
        <button @click="post" :disabled="loading" class="outline-none bg-transparent flex items-center">

          <div v-if="loading" class="relative">
                        <span v-if="progress < 100">
                          {{ progress }}%
                        </span>
            <span v-else>
                            <LoadingWhite/>
                        </span>
          </div>
          <div class="cursor-pointer" :class="darkMode? `` : `text-primary`" v-else>
            {{ $t('post') }}
          </div>
        </button>
      </div>
      <div class="m-5 overflow-y-scroll" style="max-height: 34rem;">
        <textarea
            v-model="comment.text"
            :placeholder="$t('2113')"
            @input="resize($event)"
            class="w-full outline-none bg-transparent" style="resize: none"></textarea>
        <img :src="photo.photoUrl" alt="" class="rounded">
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";
import LoadingWhite from "@/components/LoadingWhite";
import CloseIcon from "@/components/CloseIcon";
import helper from "@/helper/helper";

export default {
  name: "PhotoView",
  components: {
    LoadingWhite,
    CloseIcon
  },
  props: {
    isReply: {
      default: () => false
    },
    id: {
      default: () => null,
    },
    postType: {
      default: () => null,
    },
    photo: {
      default: () => {
        return {
          photoUrl: null,
          file: null,
        }
      }
    },
  },
  computed: {
    ...mapState('setting', ['darkMode', 'className']),
    ...mapState('upload', ['progress'])
  },
  data() {
    return {
      loading: false,
      comment: {
        id: "",
        type: this.postType,
        text: '',
        photo: {},
      }
    }
  },
  created() {
    this.comment.id = this.id
  },
  methods: {
    ...mapActions('upload', ['multiUpload']),
    ...mapActions('social', ['addComment', 'replyComment']),
    resize(e) {
      e.target.style.height = 'auto'
      e.target.style.height = `${e.target.scrollHeight}px`
    },
    post() {
      const payload = new FormData()
      payload.append("photo", this.photo.file)
      this.loading = true
      this.multiUpload(payload).then(res => {
        if (res.status != undefined && res.status == 1) {
          helper.errorMessage(res.msg)
          this.loading = false
          return
        }
        this.comment.photo = res.data[0]
        this.loading = false
        if (this.isReply) {
          this.replyComment(this.comment).then(() => {
            this.$emit('closePhoto')
          })
        } else
          this.addComment(this.comment).then(() => {
            this.$emit('closePhoto')
          })
      })
    },
  }
}
</script>

<style scoped>

</style>