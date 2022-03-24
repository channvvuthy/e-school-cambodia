<template>
  <div>
    <Modal
        @dismiss="dismiss($event)"
        width="w-10/12"
        radius="none">
      <div class="flex justify-between overflow-y-scroll" style="height: 40rem;">
        <div class="w-3/5 p-5">
          <div v-for="(photo, index) in post.photo" v-if="index === currentSlide">
            <img :src="photo.url" class="object-cover">
          </div>
        </div>
        <div class="w-2/5 pt-5">
          <div class="border h-full border-b-0">
            <div class="flex space-x-5 px-5 pt-5">
              <Avatar :size="16" :avatar-url="post.user.url"></Avatar>
              <div>
                <div class="flex space-x-1 items-center font-PoppinsMedium">
                  {{ post.user.name }}
                </div>
                <div>
                  <div
                      class="flex items-center mt-1 text-sm py-1 justify-between cursor-pointer space-x-2">
                    <span class="capitalize">public</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- Content -->
            <div class="px-5">
              <div class="text-lg mt-4 font-light" v-if="post.caption">{{ post.caption }}</div>
              <!-- Tool -->
              <div class="flex items-center mt-2 justify-between"
                   :class="darkMode ? `text-textSecondary` : `text-primary`">
                <div class="flex items-center space-x-40">
                  <div class="flex items-center space-x-2">
                    <div class="cursor-pointer">
                      <div v-if="post.is_like" @click="disLikePost(post)">
                        <LikeFillIcon :size="22" :fill="darkMode ? `#909090`: `#055174`"></LikeFillIcon>
                      </div>
                      <div @click="likePost(post)" v-else>
                        <LikeIcon :size="22" :fill="darkMode ? `#909090`: `#4A4A4A`"></LikeIcon>
                      </div>

                    </div>
                    <div v-if="post.total && post.total.like">
                      {{ kFormatter(post.total.like) }}
                    </div>
                  </div>
                  <div class="flex items-center space-x-2" v-if="post.total && post.total.seen">
                    <div>
                      <Eye :size="30" :fill="darkMode ? `#909090`: `#4A4A4A`"></Eye>
                    </div>
                    <div>
                      {{ kFormatter(post.total.seen) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import Modal from "@/components/Modal";
import Avatar from "@/Avatar";
import ChevronDown from "@/views/MyCourse/components/Chevron";
import {mapState} from "vuex";
import helper from "@/helper/helper";
import Eye from "@/components/Eye";
import LikeIcon from "@/components/LikeIcon";
import LikeFillIcon from "@/components/LikeFillIcon";

export default {
  name: "PostDetail",
  props: {
    post: {
      default: () => {
        return {}
      }
    }
  },
  components: {
    LikeFillIcon,
    LikeIcon,
    Eye,
    Avatar,
    Modal,
    ChevronDown
  },
  computed: {
    ...mapState('setting', ['darkMode']),
  },
  data() {
    return {
      currentSlide: 0,
      payload: {}
    }
  },
  methods: {
    disLikePost(post) {
      let payload = {
        id: post._id,
        type: post.type
      }
      this.deleteLike(payload).then(() => {
        payload.liker = post.liker.filter(item => item._id != this.stProfile._id)
        this.$store.commit('social/removeLike', payload)
      })

    },
    likePost(post) {
      let payload = {
        id: post._id,
        type: post.type
      }
      this.like(payload)
    },
    kFormatter(num) {
      return helper.kFormatter(num)
    },
    dismiss() {
      this.$emit('dismiss', true)
    }
  }
}
</script>

<style scoped>

</style>