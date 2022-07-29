<template>
  <Modal width="w-2/5">
    <div>
      <div class="flex justify-between items-center px-5 pt-5 pb-2">
        <div class="flex items-center space-x-4">
          <div class="text-lg font-PoppinsMedium">
            {{ $t('liker') }}
          </div>
        </div>
        <div>
          <div class="cursor-pointer" @click="()=>{this.$emit('closeLiker')}">
            <CloseIcon :fill="darkMode ? `#9ca3af`: `#000000`"/>
          </div>
        </div>
      </div>
      <!-- Body -->
      <div class="px-5">
        <div v-if="loading" class="mt-2">
          <Loading :grid="true" :number-of-columns="1"/>
        </div>
        <div v-else class="py-5">
          <ul style="max-height:28rem;"
              @scroll="onScroll"
              class="overflow-y-scroll">
            <li
                @click="getUser(user._id)"
                :class="darkMode ? `border-button`: ``"
                class="border-b mb-3 pb-3 flex items-center cursor-pointer font-PoppinsMedium"
                :key="index"
                v-for="(user, index) in likes.liker">
              <Avatar
                  :avatar-url="user.photo"
                  :size="14"/>
              <div class="ml-3">
                {{ user.name }}
              </div>
            </li>
            <li class="mt-2" v-if="loadingMore">
              <Loading :grid="true" :number-of-columns="1"/>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from "../../../components/Modal";
import CloseIcon from "@/components/CloseIcon";
import {mapState, mapActions} from "vuex";
import Loading from "@/components/Loading";
import Avatar from "@/Avatar";

export default {
  name: "Liker",
  props: {
    social: {
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      payload: {
        id: this.social._id,
        type: this.social.type,
        p: 1
      },
      loading: false,
      enableScroll: true,
      loadingMore: false,
    }
  },
  components: {
    Modal,
    CloseIcon,
    Loading,
    Avatar
  },
  computed: {
    ...mapState('setting', ['darkMode']),
    ...mapState('social', ['likes'])
  },
  methods: {
    ...mapActions('social', ['getLiker', 'geMoretLiker']),
    getUser(user_id) {
      this.$router.push({name: 'user', params: {user_id}})
    },
    onScroll: function ({target: {scrollTop, clientHeight, scrollHeight}}) {
      this.loadingMore = true;

      if (scrollTop > 300) {
        this.showScrollTop = true
      }

      if (scrollTop + clientHeight >= scrollHeight) {
        this.payload.p++
        if (this.enableScroll) {
          this.geMoretLiker(this.payload).then(res => {
            this.loadingMore = false;
            if (res.data && res.data.liker <= 0) {
              this.enableScroll = false
            }
          })
        }else{
          this.loadingMore = false
        }

      }
    }

  },
  created() {
    this.loading = true
    this.getLiker(this.payload).then(() => {
      this.loading = false
    })
  }
}
</script>

<style scoped>

</style>