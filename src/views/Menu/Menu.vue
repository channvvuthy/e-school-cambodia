<template>
  <div class="w-full text-xs" :class="darkMode ? 'bg-secondary' : 'bg-white'">
    <div class="pl-12 pr-5 flex justify-between items-center">
      <div class="grid grid-cols-5 gap-8">
        <div
            class="flex flex-col justify-center items-center cursor-pointer"
            @click="goTo('home')"
        >
          <div v-if="$route.name === 'home'">
            <HomeFillIcon :fill="darkMode ? `#ffffff` : `#055174`"/>
          </div>
          <div v-else>
            <HomeIcon :fill="darkMode ? `#909090` : `#055174`"/>
          </div>
          <p
              class="mt-2 pb-1"
              :class="darkActive(darkMode, $route.name === 'home')"
          >
            {{ $t("1101") }}
          </p>
          <template v-if="$route.name === 'home'">
            <BorderBottom :bg="darkMode ? `bg-white` : `bg-primary`"/>
          </template>
        </div>

        <div
            class="flex flex-col justify-center items-center cursor-pointer"
            @click="goTo('video')"
        >
          <div v-if="$route.name === 'video' || $route.name === 'video-detail'">
            <WatchVideoFillIcon :fill="darkMode ? `#ffffff` : `#055174`"/>
          </div>
          <div v-else>
            <WatchVideoIcon :fill="darkMode ? `#909090` : `#055174`"/>
          </div>
          <p
              class="mt-2 pb-1"
              :class="
              darkActive(
                darkMode,
                $route.name === 'video' || $route.name === 'video-detail'
              )
            "
          >
            {{ $t("2108") }}
          </p>
          <template v-if="$route.name === 'video'">
            <BorderBottom :bg="darkMode ? `bg-white` : `bg-primary`"/>
          </template>
        </div>
        <div
            class="flex flex-col justify-center items-center cursor-pointer"
            @click="goTo('library')"
        >
          <div v-if="$route.name === 'library'">
            <LibraryIcon :fill="darkMode ? `#ffffff` : `#055174`"/>
          </div>
          <div v-else>
            <LibraryThinIcon :fill="darkMode ? `#909090` : `#055174`"/>
          </div>
          <p
              class="mt-2 pb-1"
              :class="darkActive(darkMode, $route.name === 'library')"
          >
            {{ $t("2200") }}
          </p>
          <template v-if="$route.name === 'library'">
            <BorderBottom :bg="darkMode ? `bg-white` : `bg-primary`"/>
          </template>
        </div>
        <template>
          <div
              class="flex flex-col justify-center items-center cursor-pointer"
              @click="goTo('partner')"
          >
            <div v-if="$route.name === 'partner'">
              <PartnershipFillIcon
                  :fill="darkMode ? `#ffffff` : `#055174`"
                  :fillY="darkMode ? `#252527` : `#ffffff`"
              />
            </div>
            <div v-else>
              <PartnershipIcon :fill="darkMode ? `#909090` : `#055174`"/>
            </div>
            <p
                class="mt-2 pb-1"
                :class="darkActive(darkMode, $route.name === 'partner')"
            >
              {{ $t("1104") }}
            </p>
            <template v-if="$route.name === 'partner'">
              <BorderBottom :bg="darkMode ? `bg-white` : `bg-primary`"/>
            </template>
          </div>
          <div
              class="flex flex-col justify-center items-center cursor-pointer"
              @click="goTo('zoom')"
          >
            <div v-if="$route.name === 'zoom'">
              <ZoomIcon :fill="darkMode ? `#ffffff` : `#055174`" :size="24"/>
            </div>
            <div v-else>
              <ZoomIcon :fill="darkMode ? `#909090` : `#055174`" :size="24"/>
            </div>
            <p
                class="mt-2 pb-1"
                :class="darkActive(darkMode, $route.name === 'zoom')"
            >
              {{ $t("zoom") }}
            </p>
            <template v-if="$route.name === 'zoom'">
              <BorderBottom :bg="darkMode ? `bg-white` : `bg-primary`"/>
            </template>
          </div>
        </template>
      </div>
      <div class="flex justify-end" v-if="token">
        <div class="flex justify-between items-end flex-1">
          <div
              class="
              flex flex-col
              justify-center
              items-center
              cursor-pointer
              relative
            "
              @click="
              () => {
                this.$emit('showItemIncart');
              }
            "
              id="myCart"
          >
            <template>
              <div
                  class="
                  absolute
                  -top-3
                  left-4
                  h-5
                  w-5
                  rounded-full
                  flex
                  justify-center
                  items-center
                  text-center text-xs
                "
                  :class="
                  darkMode ? `bg-white text-youtube` : `bg-heart text-white`
                "
                  v-if="viewCart(notify)"
              >
                <div style="margin-top: 2px">
                  {{ viewCart(notify) }}
                </div>
              </div>
            </template>
            <div>
              <CartIcon :fill="darkMode ? `#909090` : `#181818`"></CartIcon>
            </div>
          </div>
          <div
              class="
              flex flex-col
              justify-center
              items-center
              cursor-pointer
              ml-10
              relative
            "
              @click="goTo('chat')"
          >
            <template>
              <div
                  class="
                  absolute
                  -top-3
                  left-4
                  h-5
                  w-5
                  rounded-full
                  flex
                  justify-center
                  items-center
                  text-center text-xs
                "
                  :class="
                  darkMode ? `bg-white text-youtube` : `bg-heart text-white`
                "
                  v-if="viewChart(notify)"
              >
                <div style="margin-top: 2px">
                  {{ viewChart(notify) }}
                </div>
              </div>
            </template>
            <div>
              <ChatIcon
                  :fill="darkMode ? `#FFF` : `#055174`"
                  v-if="$route.name === `chat`"
              ></ChatIcon>
              <ChatIcon
                  :fill="darkMode ? `#909090` : `#181818`"
                  v-else
              ></ChatIcon>
            </div>
          </div>
          <div
              class="
              flex flex-col
              justify-center
              items-center
              cursor-pointer
              ml-10
              relative
            "
              @click="
              () => {
                this.$emit('notification');
              }
            "
          >
            <template>
              <div
                  class="
                  absolute
                  -top-3
                  left-4
                  h-5
                  w-5
                  rounded-full
                  flex
                  justify-center
                  items-center
                  text-center text-xs
                "
                  :class="
                  darkMode ? `bg-white text-youtube` : `bg-heart text-white`
                "
                  v-if="viewNotification(notify)"
              >
                <div style="margin-top: 2px">
                  {{ viewNotification(notify) }}
                </div>
              </div>
            </template>
            <div>
              <NotificationIcon :fill="darkMode ? `#909090` : `#181818`"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState, mapActions} from "vuex";
import HomeIcon from "./../../components/HomeIcon";
import BorderBottom from "./../../components/BorderBottom.vue";
import HomeFillIcon from "./../../components/HomeFillIcon";
import WatchVideoIcon from "./../../components/WatchVideoIcon.vue";
import WatchVideoFillIcon from "./../../components/WatchVideoFillIcon";
import LibraryIcon from "./../../components/LibraryIcon";
import LibraryThinIcon from "./../../components/LibraryThinIcon";
import PartnershipIcon from "./../../components/PartnershipIcon";
import PartnershipFillIcon from "./../../components/PartnershipFillIcon";
import NotificationIcon from "./../../components/NotificationIcon.vue";
import ChatIcon from "./components/ChatIcon.vue";
import CartIcon from "./../../components/CartIcon.vue";
import ZoomIcon from "@/components/ZoomIcon";

export default {
  components: {
    HomeIcon,
    HomeFillIcon,
    WatchVideoIcon,
    WatchVideoFillIcon,
    LibraryIcon,
    PartnershipIcon,
    LibraryThinIcon,
    PartnershipFillIcon,
    NotificationIcon,
    ChatIcon,
    CartIcon,
    BorderBottom,
    ZoomIcon,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("setting", ["localize", "darkMode"]),
    ...mapState("cart", ["carts"]),
    ...mapState("auth", ["token", "notify"]),
  },

  methods: {
    ...mapActions("cart", ["getCart"]),
    ...mapActions("auth", ["getNotify"]),
    viewCart(notify) {
      try {
        return notify.carts;
      } catch (e) {
        return 0;
      }
    },
    viewChart(notify) {
      try {
        return notify.chats;
      } catch (e) {
        return 0;
      }
    },
    viewNotification(notify) {
      try {
        return notify.notifications;
      } catch (e) {
        return 0;
      }
    },
    goTo(page) {
      this.$store.commit("etalk/setActive", 0);
      this.$router.push({name: page}).catch(() => {
        if (this.$route.name == "home") {
          this.$router.push({name: "refr"});
        }
      });
    },
    darkActive(darkMode, active) {
      if (darkMode && active) {
        return "text-white";
      }
      if (!darkMode && active) {
        return "text-primary";
      }
    },
  },
  created() {
    if (this.token) {
      this.getNotify();
    }
  },
  watch: {
    carts: function () {
      this.getNotify();
    },
  },
};
</script>