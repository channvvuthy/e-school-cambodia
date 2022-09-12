<template>
  <div>
    <div class="px-5 relative py-5 h-screen overflow-y-scroll pb-40"
         :class="darkMode?`bg-youtube text-gray-300`:``">
      <div v-if="loadingGuardian" class="flex justify-center items-center h-screen relative -top-5">
        <h1 class="text-sm font-semibold font-khmer_os relative -top-10">
          <loading/>
        </h1>
      </div>
      <div v-else>
        <button
            class="z-50 cursor-pointer bg-primary w-10 h-10 rounded-full text-white flex justify-center
                        items-center focus:outline-none fixed right-10 bottom-10 "
            @click="showAddingGuardian">
          <AddIcon/>
        </button>
        <div class="font-khmer_os h-screen flex justify-center items-center relative"
             v-if="guardians && guardians.length <= 0">
          <div class="text-center relative -top-20">
            <Empty/>
          </div>
        </div>
        <div v-if="guardians && guardians.length">
          <div class="grid gap-4"
               :class="isHide?`md:grid-cols-3  2xl:grid-cols-4`:`md:grid-cols-2  2xl:grid-cols-3`">
            <div v-for="(guardian, key) in guardians" :key="key">
              <div class="flex items-center font-khmer_siemreap text-14px rounded-xl shadow-md px-7 py-7 relative"
                   :class="darkMode?`bg-secondary text-gray-300 border border-button`:`bg-white`">
                <div class="w-20 h-20 rounded-full mr-5"
                     :style="{backgroundImage:`url(${guardian.photo})`,backgroundSize:`cover`}"></div>
                <div>
                  <div class="mb-3 flex ">
                    <div class="w-24">{{ $t('name') }}</div>
                    <span class="px-2">:</span>
                    <div> {{ guardian.first_name + " " + guardian.last_name }}</div>
                  </div>
                  <div class="mb-3 flex ">
                    <div class="w-24">{{ $t('2009') }}</div>
                    <span class="px-2">:</span>
                    <div> {{ guardian.phone }}</div>
                  </div>
                  <div class="mb-3 flex ">
                    <div class="w-24">{{ $t('as') }}</div>
                    <span class="px-2">:</span>
                    <div>{{ guardian.type }}</div>
                  </div>
                </div>
                <div class="cursor-pointer flex-1 flex justify-end"
                     @click="confirmDelete(guardian._id)">
                  <DeleteIcon :fill="darkMode?`#909090`:`#e74c3c`"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddGuardian
          v-if="showGuardian"
          @closeAdd="closeAdd"
          @GuardianAdded="GuardianAdded"/>
      <Message
          v-if="err"
          :message="message"
          @close="close"
          @deleteFavorite="deleteGuardian"/>
    </div>
  </div>
</template>
<script>
import {mapState, mapActions} from "vuex"
import AddIcon from "./../../components/AddIcon"
import AddGuardian from "./components/AddGuardian.vue"
import DeleteIcon from "./../MyCourse/components/DeleteIcon.vue"
import Message from "./../Favorite/components/Message.vue"
import Loading from "./../../components/Loading"
import Empty from "./../Component/Empty.vue"

export default {
  name: "Guardian",
  components: {
    AddIcon,
    AddGuardian,
    DeleteIcon,
    Message,
    Loading,
    Empty
  },
  data() {
    return {
      showGuardian: false,
      guardianId: "",
      err: false,
      message: ""
    }
  },
  computed: {
    ...mapState('guardian', ['guardians', 'loadingGuardian']),
    ...mapState('setting', ['darkMode', 'isHide'])
  },
  methods: {
    ...mapActions('guardian', ['getGuardian', 'addingGuardian', 'removeGuardian']),
    showAddingGuardian() {
      this.showGuardian = true
    },
    closeAdd() {
      this.showGuardian = false
    },
    GuardianAdded() {
      this.showGuardian = false
      this.getGuardian()
    },
    confirmDelete(id) {
      this.guardianId = id
      this.err = true
      this.message = "តើអ្នកចង់លុបអាណាព្យាបាលនេះមែនទេ?"
    },
    close() {
      this.err = false
    },
    deleteGuardian() {
      this.removeGuardian(this.guardianId).then(() => {
        this.err = false
      })
    }
  },
  created() {
    this.getGuardian()
  }
}
</script>