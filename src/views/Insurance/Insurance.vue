<template>
  <div>
    <div class="h-screen flex"
         :class="darkMode?`text-gray-400 ${insuranceStatus === 0?`justify-center items-center flex-col`:``}`:
             `${insuranceStatus === 0?`justify-center items-center flex-col`:``}`">
      <div v-if="checkingInsurance" class="flex justify-center items-center h-screen relative -top-5">
        <h1 class="text-sm font-semibold font-khmer_siemreap relative -top-10">
          <loading/>
        </h1>
      </div>
      <template v-if="insuranceStatus === 0">
        <div>
          <Icon/>
        </div>
        <div class="max-w-sm mt-10 text-center">
          {{ $t('insurance_note') }}
          <div class="flex justify-between items-center mt-10">
            <button class="rounded-lg bg-primary py-3 w-full mr-3 text-white focus:outline-none"
                    @click="() => {this.$router.push('/video')}">
              {{ $t('2108') }}
            </button>
            <button class="rounded-lg bg-primary py-3 w-full ml-3 text-white focus:outline-none"
                    @click="() => {this.$router.push('/library')}">
              {{ $t('2202') }}
            </button>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="max-w-2xl rounded-xl p-10 m-5 h-screen overflow-y-scroll pb-40"
             :class="darkMode?`bg-secondary`:`bg-white shadow-md`">
          <div class="text-center">{{ $t('get_insurance_note') }}</div>
          <div class="h-7"></div>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div class="mb-3">{{ $t('2014') }}<span class="text-heart">*</span></div>
              <input type="text" class="border-b w-full focus:outline-none" name="last_name"
                     :class="darkMode?`bg-transparent border-button`:`border-gray-300`" v-model="stProfile.first_name">

            </div>
            <div>
              <div class="mb-3">{{ $t('2013') }}<span class="text-heart">*</span></div>
              <input type="text" class="border-b w-full focus:outline-none" name="first_name"
                     :class="darkMode?`bg-transparent border-button`:`border-gray-300`"
                     v-model="stProfile.last_name">
            </div>
          </div>
          <!-- Sex -->
          <div class="flex mt-6 items-center">
            <div class="mr-20 text-sm">{{ $t('gender') }}</div>
            <div class="mr-20">
              <label for="female">
                <div class="flex items-center">
                  <div class="w-4 h-4 rounded-full border flex items-center justify-center cursor-pointer"
                       :class="darkMode?``:`border-gray-300`">
                    <div class="h-2 w-2" :class="darkMode?``:`bg-primary`" style="border-radius:100%"></div>
                  </div>
                  <input type="radio" name="gender" id="female" class="hidden">
                  <span class="ml-5 font-extralight text-sm"> {{ $t('2016') }}</span>
                </div>
              </label>
            </div>
            <div>
              <label for="male">
                <div class="flex items-center">
                  <div class="w-4 h-4 rounded-full border flex items-center justify-center cursor-pointer"
                       :class="darkMode?``:`border-gray-300`">
                    <div class="h-2 w-2" :class="darkMode?``:`bg-primary`" style="border-radius:100%"></div>
                  </div>
                  <input type="radio" name="gender" id="male" class="hidden">
                  <span class="ml-5 font-extralight text-sm"> {{ $t('2015') }}</span>
                </div>
              </label>
            </div>

          </div>
          <div class="h-7"></div>
          <div class="text-sm">{{ $t('date_of_birth') }}</div>
          <div class="h-3"></div>

          <div class="grid">
            <div>
              <input type="date" class="w-full bg-transparent focus:outline-none border-b"
                     v-model="stProfile.date_of_birth"
                     :class="darkMode?`bg-transparent border-button`:`border-gray-300`">
            </div>
          </div>
          <div class="h-7"></div>
          <!-- Phone -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="mb-3 text-sm">{{ $t('2009') }}<span class="text-heart">*</span></div>
              <input type="text" class="border-b w-full focus:outline-none"
                     :class="darkMode?`bg-transparent border-button`:`border-gray-300`"
                     v-model="stProfile.phone">

            </div>
            <div class="relative">
              <div class="mb-3 text-sm">{{ $t('2124') }}<span class="text-heart">*</span></div>
              <select class="province w-full focus:outline-none relative z-50 bg-transparent text-sm"
                      :class="darkMode?`border-button`:`border-gray-300`"
                      @change="selectProvince"
                      v-model="selectedValue">
                <option v-for="(province,index) in provinces" :key="index" :value="province._id">
                  {{ province.name }}
                </option>

              </select>
              <div class="h-1 w-full border-b"
                   :class="darkMode?`border-button`:`border-gray-300 absolute left-0 bottom-0`"></div>
              <div class="absolute right-0 bottom-2 cursor-pointer z-10">
                <ChevronIcon/>
              </div>
            </div>
          </div>
          <div class="h-7"></div>
          <div class="grid">
            <div class="relative">
              <div class="mb-3 text-sm">{{ $t('2123') }}<span class="text-heart">*</span></div>
              <div class="absolute left-5 top-3 w-full flex justify-end  pr-20" v-if="loading">
                <div class="loader "></div>
              </div>
              <select class="province w-full text-sm focus:outline-none relative z-50 bg-transparent"
                      :class="darkMode?`border-button`:`border-gray-300`"
                      :disabled="loading">
                <option v-for="(school, index) in schools"
                        :key="index"
                        :value="school._id">
                  {{ school.name }}
                </option>
              </select>
              <div class="h-1 w-full border-b"
                   :class="darkMode?`border-button`:`border-gray-300 absolute left-0 bottom-0`"></div>
              <div class="absolute right-0 bottom-2 cursor-pointer z-10">
                <ChevronIcon/>
              </div>
            </div>
          </div>
          <div class="h-7"></div>
          <div :class="darkMode?`bg-button text-gray-300`:`bg-softGray`"
               class="h-12 rounded flex items-center px-3">
            <div class="text-sm">
              {{ $t('parent_info') }}
            </div>
          </div>
          <div class="h-7"></div>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div class="mb-3 text-sm">{{ $t('2009') }}<span class="text-heart">*</span></div>
              <input type="text" class="border-b w-full focus:outline-none"
                     :class="darkMode?`bg-transparent border-button`:`border-gray-300`"
                     v-model="yourGuardian.phone">

            </div>
            <div>
              <div class="mb-3 text-sm">{{ $t('as') }}<span class="text-heart">*</span></div>
              <input type="text" class="border-b w-full focus:outline-none"
                     :class="darkMode?`bg-transparent border-button`:`border-gray-300`"
                     v-model="yourGuardian.type">
            </div>
          </div>
          <div class="h-7"></div>
          <div class="text-sm">{{ $t('insurance_term') }}</div>
          <div class="h-7"></div>
          <div class="flex items-center justify-center">
            <button class="bg-primary text-white px-40 h-12 rounded-md focus:outline-none"
                    @click="confirm">
              {{ $t('submit') }}
            </button>
          </div>
          <div class="h-7"></div>

        </div>
      </template>
      <Message
          v-if="err"
          :message="message"
          @closeMessage="closeMessage"/>
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from "vuex"
import Message from "./../Auth/components/Message.vue"
import moment from "moment"
import Loading from "./../../components/Loading"
import Icon from "./components/Icon.vue"
import ChevronIcon from "./../../components/ChevronIcon.vue"

export default {
  name: "Insurance",
  components: {
    Message,
    Loading,
    Icon,
    ChevronIcon
  },

  data() {
    return {
      showProvince: false,
      showSchool: false,
      loading: false,
      err: false,
      selectedValue: "",
      message: "",
      yourGuardian: {
        phone: "",
        type: ""
      }
    }
  },
  computed: {
    ...mapState('insurance', ['insuranceStatus', 'checkingInsurance', 'loadingConfirm', 'userInsurance']),
    ...mapState('auth', ['stProfile']),
    ...mapState('guardian', ['guardians', 'loadingGuardian']),
    ...mapState('setting', ['provinces', 'schools', 'loadingProvince', 'loadingSchool', 'darkMode']),

  },
  methods: {
    ...mapActions('insurance', ['checkInsurance', 'confirmInsurance']),
    ...mapActions('auth', ['getStudentProfile']),
    ...mapActions('guardian', ['getGuardian']),
    ...mapActions('setting', ['getProvinces', 'getSchool']),
    closeMessage() {
      this.err = false
    },
    showAllProvince() {
      this.stProfile.school.name = null
      this.showProvince = true
    },

    selectProvince() {
      this.loading = true
      this.$store.commit("setting/getAllSchool", [])
      this.getSchool(this.selectedValue).then(() => {
        this.showProvince = false
        this.loading = false
      })

    },
    formatDate(date) {
      moment.locale('km');
      return moment(date).format('ll');
    },
    showAllSchool() {
      if (!this.schools.length || this.loadingSchool) {
        return false
      }
      this.showSchool = true
    },
    closeProvince() {
      this.showProvince = false
    },
    closeSchool() {
      this.showSchool = false
    },
    selectSchool(school) {

      this.showSchool = false
      this.stProfile.school = school

    },
    confirm() {
      if (this.stProfile.first_name === "") {
        this.err = true
        this.message = "please_enter_first_name"
        return

      }
      if (this.stProfile.last_name === "") {
        this.err = true
        this.message = "please_enter_last_name"
        return
      }
      if (this.stProfile.phone === "") {
        this.err = true
        this.message = "please_enter_phone_number"
        return
      }
      if (this.stProfile.date_of_birth === "") {
        this.err = true
        this.message = "please_enter_date_of_birth"
        return
      }
      if (this.stProfile.province._id === "") {
        this.err = true
        this.message = "សូមជ្រើសរើសខេត្ត"
        return
      }
      if (this.stProfile.school._id === "") {
        this.err = true
        this.message = "សូមជ្រើសរើសសាលា"
        return
      }
      if (this.yourGuardian.phone === "") {
        this.err = true
        this.message = "សូមបញ្ចូលលេខទូរស័ព្ទអាណាព្យាបាល"
        return
      } else {
        this.stProfile.guardian_phone = this.yourGuardian.phone
      }
      if (this.yourGuardian.type === "") {
        this.err = true
        this.message = "សូមបញ្ជាក់ពីតួនាទីអាណាព្យាបាល"
        return
      } else {
        this.stProfile.type = this.yourGuardian.type
      }
      this.confirmInsurance(this.stProfile).then(response => {
        if (response.data.status === 1) {
          this.err = true
          this.message = response.data.msg
        } else {
          this.checkInsurance()
        }
      })
    }
  },
  created() {
    this.checkInsurance()
    this.getProvinces()
    this.getGuardian().then(response => {
      if (response.data.data && response.data.data.length) {
        let theGuardian = response.data.data.map(item => item)[0]
        this.yourGuardian.phone = theGuardian.phone
        this.yourGuardian.type = theGuardian.type
      }
    })
  }
}
</script>
<style>
input[type="date"]::-webkit-inner-spin-button {
  display: none;
  -webkit-appearance: none;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  background-color: transparent;
}

.province {
  -moz-appearance: none; /* Firefox */
  -webkit-appearance: none; /* Safari and Chrome */
  appearance: none;
}
</style>