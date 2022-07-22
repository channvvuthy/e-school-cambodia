<template>
  <div class="flex h-screen m-5 text-sm">
    <div class="w-80 h-full overflow-y-scroll pb-40" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
      <div class="flex px-4 py-2 items-center justify-between relative"
           :class="darkMode?`text-gray-300`:`bg-white`">
        <div class="py-3 font-bold" :class="darkMode?``:`text-primary`">E-TALK</div>
        <div class="cursor-pointer" @click="() => {this.eTalkOption = true;}">
          <div class="w-1 h-1 rounded-full mb-1" :class="darkMode?`bg-gray-400`:`bg-primary`"></div>
          <div class="w-1 h-1 rounded-full mb-1" :class="darkMode?`bg-gray-400`:`bg-primary`"></div>
          <div class="w-1 h-1 rounded-full" :class="darkMode?`bg-gray-400`:`bg-primary`"></div>

        </div>
        <!-- eTalk option -->
        <div :class="darkMode?`bg-button`:`bg-white`"
             class="rounded-md overflow-hidden e-shadow absolute right-5 top-14 cursor-pointer"
             v-if="eTalkOption" style="z-index:55">
          <div class="px-8 h-12 flex items-center justify-center border-b"
               :class="darkMode?`border-youtube`:`border-gray-200`">
            {{ $t('connect_friend') }}
          </div>
          <div class="px-8 h-12 flex items-center justify-center border-b"
               :class="darkMode?`border-youtube`:`border-gray-200`" @click="goTo(`create-group`)" id="group">
            {{ $t('create_group') }}
          </div>
          <div class="px-8 h-12 flex items-center justify-center border-b"
               :class="darkMode?`border-youtube`:`border-gray-200`">
            {{ $t('need_support') }}
          </div>
          <div class="px-8 h-12 flex items-center justify-center"
               :class="darkMode?`border-youtube`:`border-gray-400`">
            {{ $t('mute_all') }}
          </div>

        </div>
        <!-- Overlay -->
        <div class="fixed w-full h-full left-0 top-0 z-50" v-if="eTalkOption || chatOption"
             @click="() => {this.eTalkOption = false; this.chatOption = false}"></div>

      </div>
      <!-- Search -->
      <div class="relative mb-4 px-3">
        <input type="text" v-model="searchQuery" class="w-full rounded-md h-10 focus:outline-none pl-3"
               :class="darkMode?`bg-youtube text-gray-300`:`bg-softGray`" :placeholder="$t('1001')">
        <div class="absolute right-6 top-2">
          <SearchIcon :fill="darkMode?`#909090`:`#000`"/>
        </div>
      </div>
      <!-- List -->
      <div class="flex flex-col">
        <div class="h-full flex items-center justify-center" :class="darkMode?`text-white`:``" v-if="loading">
          <div class="loader"></div>
        </div>
        <div v-else>
          <!-- Contact List -->
          <div
              class="flex py-3 px-4 cursor-pointer"
              v-for="(contact, index) in contacts"
              :key="index"
              @click="selectedContact(contact, index)"
              :class="
              darkMode
                ? `border-b border-black ${getActiveClass(contact) ? `bg-button` : ``}`
                : `border-b ${getActiveClass(contact) ? `bg-blue-100` : ``}`
            "
          >
            <div>
              <div
                  class="
                  h-13
                  w-13
                  rounded-full
                  border
                  bg-cover bg-gray-300
                  mr-3
                  bg-center
                "
                  :style="{ backgroundImage: `url(${contactProfile(contact)})` }"
              ></div>
            </div>

            <div
                class="flex justify-between flex-1 items-center"
                :class="darkMode ? `text-gray-300` : ``"
            >
              <div>
                <div class="font-PoppinsMedium flex space-x-1">
                  <div>
                    {{ cutString(contactName(contact), 20) }}
                  </div>
                  <span
                      v-if="contact.type == 'ads'"
                      class="
                      text-xs
                      font-black
                      text-center
                      h-4
                      w-6
                      rounded
                      font-khmer_os
                    "
                      :class="darkMode ? `bg-iconColor` : `bg-forum`"
                  >
                    <span>AD</span>
                  </span>
                </div>
                <div class="pt-1">
                  <div v-if="contact.type == 'ads'">
                    {{ cutString(contact.ads.text, 20) }}
                  </div>
                  <div v-else-if="contact.type == 'exam'">
                    {{ getStatus(contact.exam.exam_status) }}
                  </div>
                  <div v-else>
                    {{ lastChat(contact) }}
                  </div>
                </div>
              </div>
              <div v-if="contact.type == 'ads'">
                <img :src="contact.ads.photo.url" alt="" class="w-20"/>
              </div>
              <div v-if="contact.type == 'exam'">
                <div
                    class="
                    bg-gradient-to-r
                    from-indigo-500
                    via-purple-500
                    to-pink-500
                    h-10
                    flex
                    items-center
                    justify-center
                    text-white
                    rounded-full
                    w-24
                    cursor-pointer
                    tracking-wide
                  "
                >
                  <div v-if="loadingExam">
                    <div class="loading"></div>
                  </div>
                  <div class="font-PoppinsMedium" v-else>
                    <span v-if="contact.exam.exam_status == 2">
                      {{ $t('ended') }}
                    </span>
                    <span v-else>{{ countDownTime(milliseconds) }}</span>
                  </div>
                </div>
              </div>
              <div v-else-if="contact.type == 'chat'">
                <div class="flex flex-col justify-end items-end">
                  <div
                      class="flex justify-center"
                      v-if="contact.chat && contact.chat.unread"
                  >
                    <div
                        class="
                        notification
                        h-4
                        w-4
                        rounded-full
                        flex
                        items-center
                        justify-center
                        text-xs
                      "
                        :class="
                        darkMode ? `bg-white text-black` : `bg-heart text-white`
                      "
                    >
                      {{ contact.chat.unread }}
                    </div>
                  </div>
                  <div
                      class="text-xs mt-1 whitespace-nowrap"
                      :class="darkMode ? `text-gray-500` : `text-gray-400`"
                  >
                    {{ lastDate(contact) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Contact List -->
        </div>

        <!-- Contact List -->
      </div>
    </div>
    <div class="flex-1 w-full ml-2 h-screen flex flex-col"
         :class="darkMode?`bg-youtube text-gray-300`:`${isNext?``:`bg-white`}`">
      <div :class="darkMode?`bg-secondary text-gray-300`:`bg-white`"
           class="px-4 py-3 flex text-sm items-center shadow relative">
        <div class="h-12 flex items-center">
          <div class="shadow-md px-2 py-1 rounded cursor-pointer" :class="darkMode?`bg-button`:`bg-white`"
               @click="backTo()">
            <div class="transform rotate-90">
              <ChevronIcon :fill="darkMode?`#909090`:`#555`" :size="18"/>
            </div>
          </div>
          <div class="ml-3">
            {{ $route.params.contact.name }}
          </div>
        </div>
        <div class="flex-1 w-full text-center text-base">
          {{ $t('add_member') }}
        </div>
        <div class="flex flex-col items-end cursor-pointer" @click="nextPage">
          <span :class="darkMode?``:`text-primary`">
              <div v-if="addingMember" class="flex items-center justify-center relative h-full">
                  <div class="loader absolute -top-6 right-5"></div>
              </div>
              <span v-else>{{ $t('done') }}</span>
          </span>
        </div>
      </div>
      <div class="m-5">
        <template>
          <div class="w-11/12 relative">
            <input type="text" class="focus:outline-none h-11 w-full rounded-md pl-4"
                   :placeholder="$t('add_member')"
                   :class="darkMode?`bg-button text-gray-300`:`bg-softGray`" v-model="search"
                   @keyup.enter="searchMember" @keyup="isEmpty">
            <div class="absolute right-4 top-2 cursor-pointer" style="margin-top:1px;" v-if="search"
                 @click="clearSearch">
              <CloseIcon :width="22" :fill="darkMode?`#909090`:`#000000`"/>
            </div>
            <div class="absolute right-4 top-2" style="margin-top:1px;" v-else>
              <SearchIcon :fill="darkMode?`#909090`:`#000000`"/>
            </div>

            <div class="absolute -top-2 flex items-center right-20" v-if="loadingFriend">
              <div class="loader"></div>
            </div>
            <template v-else>
              <div class="absolute w-full left-0 top-14 rounded h-96 overflow-y-scroll py-5"
                   :class="darkMode?`bg-button`:`bg-softGray`" v-if="showFriend">
                <div v-if="friends.list && friends.list.length">
                  <div v-for="(friend, index) in friends.list" :key="index">
                    <div class="py-3 px-5  border-b flex items-center justify-between"
                         :class="darkMode?`border-secondary`:`border-gray-300`">
                      <div class="flex items-center">
                        <div class="h-14 w-14 rounded-full bg-cover mr-3 bg-gray-300"
                             :style="{backgroundImage:`url(${friend.photo})`}"></div>
                        <div>
                          <div>{{ friend.name }}</div>
                          <div class="text-xs font-normal"
                               :class="darkMode?`text-gray-500`:`text-gray-400`">
                            {{ $t('online') }}
                          </div>
                        </div>
                      </div>
                      <div class="h-4 w-4 rounded-full flex items-center justify-center relative"
                           :class="darkMode?`bg-pass`:`bg-primary`" @click="addUser(friend)">
                        <div class="absolute cursor-pointer w-full h-full items-center justify-center flex flex-col">
                          <input type="checkbox" class="hidden">
                          <div>
                            <CheckIcon
                                :fill="darkMode?`#383838`:`#eaeaea`"
                                v-if="isMember(friend._id)"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
                <div v-else class="px-5">{{ $t('there_is_no_friend_to_add') }}</div>
              </div>
            </template>
          </div>

          <div v-if="selectedMember.length" class="mt-5">
            <div>
              You recently member add : {{ selectedMember.length }} Members
            </div>
          </div>
        </template>
        <div v-if="loadingMember" class="flex items-center justify-center"
             :class="darkMode?`text-gray-300`:`text-black`">
          <div class="loader"></div>
        </div>
        <!-- Group Member -->
        <template v-else>
          <div class="mt-2 pb-5 h-screen">
            <div class="pt-5">
              {{ $t('group_member') }}
            </div>
            <div class="contact-list">
              <ul class="h-screen overflow-y-scroll pb-96" @scroll="onScroll">
                <!-- {{users}} -->
                <li v-for="(member, index) in members" :key="index"
                    class="py-3 border-b flex items-center justify-between" :id="member._id"
                    :class="darkMode?`border-button ${member._id}`:`border-gray-200 ${member._id}`">
                  <div class="flex items-center">
                    <div class="h-14 w-14 rounded-full bg-cover mr-3 bg-gray-300"
                         :style="{backgroundImage:`url(${member.photo})`}"></div>
                    <div>
                      <div>{{ member.name }}</div>
                      <div class="text-xs font-normal"
                           :class="darkMode?`text-gray-500`:`text-gray-400`">{{ $t('online') }}
                      </div>
                    </div>
                  </div>
                  <div></div>
                  <div class="rounded-full flex items-center justify-center relative text-xs"
                       :class="darkMode?`text-gray-500`:`text-gray-400`" v-if="isAdmin(member)">
                    <span> {{ $t('admin') }}</span>
                  </div>
                  <div v-else class="flex items-end justify-end text-xs relative"
                       :class="darkMode?`text-gray-500`:``">
                    <div :title="$t('remove_member')" @click="confirm(member)"
                         class="cursor-pointer opacity-80" v-if="isHasPermission()">
                      <CloseIcon
                          :fill="darkMode?`#909090`:`#181818`"
                          :width="20"/>
                    </div>
                  </div>

                </li>
              </ul>
            </div>
          </div>
        </template>
      </div>
    </div>
    <Add
        v-if="showAdd"
        @cancelRename="() => {this.showAdd = false}"/>
    <BuyMsg
        v-if="isConfirm"
        @cancelModal="() => {this.isConfirm = false}"
        :msg="msg" @yes="yes"/>

  </div>
</template>
<script>
import {mapState, mapActions} from "vuex"
import SearchIcon from "./../../components/SearchIcon.vue"
import helper from "./../../helper/helper"
import moment from "moment"
import CheckIcon from "./../../components/CheckIcon.vue"
import ChevronIcon from "./../../components/ChevronIcon.vue"
import Add from "./components/Add.vue"
import CloseIcon from "./../../components/CloseIcon.vue"
import BuyMsg from "./../Component/BuyMsg.vue"

export default {
  components: {
    SearchIcon,
    ChevronIcon,
    CheckIcon,
    Add,
    CloseIcon,
    BuyMsg,
  },
  data() {
    return {
      active: null,
      contact: {},
      searchQuery: "",
      eTalkOption: false,
      chatOption: false,
      page: 1,
      enableScroll: true,
      selectedMember: [],
      showAdd: false,
      search: "",
      loadingFriend: false,
      isNext: false,
      defaultBackground: "e-school-logo.png",
      groupName: "",
      photo: "",
      creatingGroup: false,
      loadingMember: false,
      showFriend: false,
      user: {},
      isConfirm: false,
      msg: "delete_contact",
      type: 1,
      addingMember: false,
      loadingExam: false,
      milliseconds: 0,
      examMilliseconds: 0,
      startCounting: 1000,
      startingExam: null,
      counting: null,
      isCanExam: false,
      isTypeExam: false,
      isExpired: true,
    }
  },
  computed: {
    ...mapState('setting', ['darkMode']),
    ...mapState('auth', ['stProfile']),
    ...mapState('etalk', ['loading', 'contacts', 'members']),
    ...mapState('network', ['friends']),
    // search
    resultQuery() {
      if (this.searchQuery) {
        return this.contacts.filter((item) => {
          return this.searchQuery.toLowerCase().split(' ').every(v => item.name.toLowerCase().includes(v))
        })
      } else {
        return this.contacts;
      }
    },
  },
  methods: {
    ...mapActions('etalk', ['getContact', 'getMember', 'addMember', 'deleteMember', 'blockUser']),
    ...mapActions('network', ['getFriend']),
    getActiveClass(contact) {
      try {
        if (contact.type == "chat") {
          return this.contact._id == contact.chat._id
        }
        if (contact.type == "exam") {
          return this.contact._id == contact.exam._id
        }
        if (contact.type == "ads") {
          return this.contact._id == contact.ads._id
        }
      } catch (e) {
        return false;
      }

    },
    countDownTime(milliseconds, text = "join") {
      const seconds = Math.floor((milliseconds / 1000) % 60);
      const minutes = Math.floor((milliseconds / 1000 / 60) % 60);
      const hours = Math.floor(milliseconds / 1000 / 60 / 60);
      if (minutes <= 0 && hours <= 0 && seconds <= 1) {
        return this.$i18n.t(text);
      }
      return [
        hours.toString().padStart(2, "0"),
        minutes.toString().padStart(2, "0"),
        seconds.toString().padStart(2, "0"),
      ].join(":");
    },
    lastDate(contact) {
      try {
        if (contact.chat.last == undefined) {
          return this.$i18n.t("unread") + " " + contact.chat.unread;
        } else {
          return this.getDay(contact.chat.last.date);
        }
      } catch (e) {
        return "";
      }
    },
    getDay(oldDate) {
      if (helper.numDay(oldDate, moment().format()) === 0) {
        return moment(oldDate).format("h:mm A");
      } else {
        if (moment(oldDate).format("YYYY") === moment().format("YYYY")) {
          if (moment(oldDate).format("MMM") == moment().format("MMM")) {
            return moment(oldDate).format("ddd h:mm A");
          }
          return moment(oldDate).format("MMM DD, h:mm A");
        } else {
          return moment(oldDate).format("MMM DD YYYY");
        }
      }
    },
    getStatus(status) {
      if (status == 0) {
        return this.$i18n.t('exam_start_yet')
      }
      if (status == 1) {
        return this.$i18n.t('exam_has_started')
      }
      if (status == 2) {
        return this.$i18n.t('exam_has_ended')
      }
    },
    contactProfile(contact) {
      if (contact.type == "ads") {
        return contact.ads.user.photo;
      }
      if (contact.type == "exam") {
        return contact.exam.photo;
      }
      return contact.chat.photo;
    },
    contactName(contact) {
      if (contact.type == "ads") {
        return contact.ads.user.name;
      }
      if (contact.type == "exam") {
        // this.milliseconds = contact.exam.remaining_time;
        return contact.exam.name;
      }
      return contact.chat.name;
    },
    lastChat(contact) {
      try {
        if (contact.chat.last == undefined) {
          return this.$i18n.t("ticket") + " " + contact.chat.ticket;
        } else {
          return this.cutString(contact.chat.last.message, 20);
        }
      } catch (e) {
        return e;
      }
    },
    formatTime(date) {
      moment.locale('en');
      return moment(date).format('h:mm A');
    },
    cutString(text, limit) {
      return helper.cutString(text, limit)
    },
    isEmpty() {
      if (!this.search) {
        this.showFriend = false
      }
    },
    isHasPermission() {
      if (this.contact.create_by == this.stProfile._id) {
        return true
      }
      return false

    },
    isMember(contact_id) {
      if (!this.members.length) {
        return false
      }
      for (let i = 0; i < this.members.length; i++) {
        if (contact_id === this.members[i]._id) {
          return true
        }
      }
      return false
    },

    isAdmin(member) {
      if (member._id == this.contact.create_by) {
        return true;
      }
    },
    confirm(member, type = 1) {
      this.type = type

      if (this.isAdmin(member)) {
        return
      }
      this.member = member
      this.isConfirm = true
      if (type === 2) {
        this.msg = "block_contact"
      }
    },
    yes() {
      if (this.type === 1) {
        this.addUser(this.member)
      } else {
        this.blockContact()
      }
      this.isConfirm = false
    },
    blockContact() {
      this.blockUser({
        id: this.member._id
      })
    },
    addUser(member) {

      let payload = {
        user_id: member._id,
        id: this.contact._id
      }
      if (this.isMember(member._id)) {
        if (this.contact.create_by !== this.stProfile._id) {
          helper.errorMessage("you_are_not_admin_in_this_group")
          return;
        }
        this.deleteMember(payload).then((response) => {
          if (response.data.msg !== undefined) {
            this.$store.commit("etalk/removeSelectedMember", member)
            this.selectedMember = this.selectedMember.filter(item => item != member._id)
          }
        })
      } else {
        this.selectedMember.push(member._id)
        this.$store.commit("etalk/addMember", member)
      }
    },
    selectedContact(contact, index) {
      this.active = index
      this.contact = contact
      this.$store.commit("etalk/setActive", contact._id)
      this.$router.push({name: "chat"})
    },
    goTo(page) {
      this.$router.push({
        name: page,
      }).catch(err => {
        return err
      })
    },

    selectMember(event, friend) {
      let member = {
        id: friend._id,
        name: friend.name,
        photo: friend.photo
      }
      if (event.target.checked) {
        this.selectedMember.push(member)
      } else {
        this.selectedMember = this.selectedMember.filter(item => item.id !== friend._id)
      }
    },
    isSelected(id) {
      for (let i = 0; i < this.selectedMember.length; i++) {
        if (id == this.selectedMember[i].id) {
          return true;
        }
      }
      return false
    },
    searchMember() {
      if (!this.search) {
        this.$store.commit("network/gettingFriend", [])
        return
      }
      this.loadingFriend = true
      this.getFriend({
        id: this.stProfile._id,
        s: this.search
      }).then(() => {
        this.loadingFriend = false
        this.showFriend = true
      })
    },
    clearSearch() {
      this.search = ""
      this.showFriend = false
      this.$store.commit("network/gettingFriend", [])
    },
    onSelectedPhoto(event) {
      const file = event.target.files[0];
      this.photo = file
      this.defaultBackground = URL.createObjectURL(file);
    },
    backTo() {
      this.$router.push({name: "chat"})
    },
    nextPage() {
      if(!this.selectedMember.length){
        this.$router.push({name: "chat"})
        return;
      }
      this.addingMember = true
      let payload = {
        id: this.contact._id,
        user_id: JSON.stringify(this.selectedMember)
      }
      this.addMember(payload).then(() => {
        this.addingMember = false
        this.$store.commit("etalk/setActive", this.contact._id)
        this.$router.push({name: "chat"})
      })
    },
    locale() {
      return this.$i18n.locale
    },
    onScroll({target: {scrollTop, clientHeight, scrollHeight}}) {
      if (scrollTop + clientHeight >= (scrollHeight - 1)) {
        this.page++
        let payload = {}
        payload.p = this.page
        payload.id = this.contact._id

        if (this.enableScroll) {
          this.getMember(payload).then(res => {
            if (res.data.data.length <= 0) {
              this.enableScroll = false
            }
          })
        }
      }
    },

  },
  mounted() {
    clearInterval(this.counting);
    this.loadingExam = true;
    setTimeout(() => {
      this.loadingExam = false;
      if (this.contacts[0].type == "exam") {
        if (this.contacts[0].exam.remaining_time <= 0) {
          this.isCanExam = true;
          return;
        }
        this.milliseconds = this.contacts[0].exam.remaining_time;
        this.counting = setInterval(() => {
          this.milliseconds = this.milliseconds - this.startCounting;
          if (this.milliseconds <= 0) {
            this.isCanExam = true;
            clearInterval(this.counting);
          }
        }, 1000);
      }
    }, 1000);
  },
  created() {
    this.contact = this.$route.params.contact
    this.getContact({});
    this.loadingMember = true
    this.getMember({
      id: this.$route.params.contact._id
    }).then(() => {
      this.loadingMember = false
    })
    this.$store.commit("network/gettingFriend", [])

  }
}
</script>