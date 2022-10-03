<template>
  <div>
    <div class="text-primary font-semibold text-sm" :class="darkMode?'text-white':''">
      {{ $t('1120') }}
    </div>
    <div class="px-3 mt-8">
      <div class="grid grid-cols-4 gap-x-11 gap-y-4">
        <div class="text-center flex flex-col justify-center items-center" @click="goTo('profile')">
          <div class="flex-col flex justify-center items-center cursor-pointer h-13 w-13 rounded-full"
               :class="activeClass('profile')">
            <div>
              <ProfileIcon fill="#FFFFFF" :size="24" v-if="$route.name === `profile`"/>
              <ProfileIcon :fill="darkMode?`#FFFFFF`:`#4A4A4A`" :size="24" v-else/>
            </div>

          </div>
          <div class="text-xs whitespace-nowrap mt-3">
            {{ $t('1121') }}
          </div>
        </div>
        <div class="text-center flex flex-col justify-center items-center" @click="goTo('change-password')">
          <div class="flex-col flex justify-center items-center cursor-pointer h-13 w-13 rounded-full"
               :class="activeClass('change-password')">
            <div>
              <LockIcon :fill="darkMode?`#FFFFFF`:`#4A4A4A`"/>
            </div>

          </div>
          <div class="text-xs whitespace-nowrap mt-3">
            {{ $t('1122') }}
          </div>
        </div>
        <div class="text-center flex flex-col justify-center items-center" @click="goTo('parent')">
          <div class="flex-col flex justify-center items-center cursor-pointer h-13 w-13 rounded-full"
               :class="activeClass('parent')">
            <div>
              <GuardianIcon fill="#FFFFFF" v-if="$route.name === `parent`"/>
              <GuardianIcon :fill="darkMode?`#FFFFFF`:`#4A4A4A`" v-else/>
            </div>

          </div>
          <div class="text-xs whitespace-nowrap mt-3">
            {{ $t('1123') }}
          </div>
        </div>
        <div class="text-center flex flex-col justify-center items-center" @click="goTo('insurance')">
          <div class="flex-col flex justify-center items-center cursor-pointer h-13 w-13 rounded-full"
               :class="activeClass('insurance')">
            <div>
              <InsuranceIcon fill="#FFFFFF" v-if="$route.name === `insurance`"/>
              <InsuranceIcon :fill="darkMode?`#FFFFFF`:`#4A4A4A`" v-else/>
            </div>

          </div>
          <div class="text-xs whitespace-nowrap mt-3">
            {{ $t('1124') }}
          </div>
        </div>
        <div class="text-center flex flex-col justify-center items-center" @click="goTo('invoice')">
          <div class="flex-col flex justify-center items-center cursor-pointer h-13 w-13 rounded-full"
               :class="activeClass('invoice')">
            <div>
              <InvoiceIcon fill="#FFFFFF" v-if="$route.name === `invoice`"/>
              <InvoiceIcon :fill="darkMode?`#FFFFFF`:`#4A4A4A`" v-else/>
            </div>

          </div>
          <div class="text-xs whitespace-nowrap mt-3">
            {{ $t('invoice') }}
          </div>
        </div>
        <div class="text-center flex flex-col justify-center items-center" @click="goTo('other')">
          <div class="flex-col flex justify-center items-center cursor-pointer h-13 w-13 rounded-full"
               :class="activeClass('other')">
            <div>
              <OtherIcon fill="#FFFFFF" v-if="$route.name === `other` || $route.name === `other-refresh`"/>
              <OtherIcon :fill="darkMode?`#FFFFFF`:`#4A4A4A`" v-else/>
            </div>

          </div>
          <div class="text-xs whitespace-nowrap mt-3">
            {{ $t('other') }}
          </div>
        </div>
        <div class="text-center flex flex-col justify-center items-center" @click="logoutUser">
          <div class="flex-col flex justify-center items-center cursor-pointer h-13 w-13 rounded-full"
               :class="activeClass('')">
            <div>
              <LogoutIcon :fill="darkMode?`#FFFFFF`:`#4A4A4A`"/>
            </div>

          </div>
          <div class="text-xs whitespace-nowrap mt-3">
            {{ $t('1126') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapActions, mapState} from "vuex"
import ProfileIcon from "./../../../components/ProfileIcon.vue"
import LockIcon from "./../../../components/LockIcon"
import GuardianIcon from "./../../../components/GuardianIcon"
import InsuranceIcon from "./../../../components/InsuranceIcon"
import InvoiceIcon from "./../../../components/BillInvoiceIcon.vue"
import LogoutIcon from "./../../../components/LogoutIcon"
import OtherIcon from "./../../../components/OtherIcon.vue"

export default {
  components: {
    ProfileIcon,
    LockIcon,
    GuardianIcon,
    InsuranceIcon,
    InvoiceIcon,
    LogoutIcon,
    OtherIcon
  },
  computed: {
    ...mapState('setting', ['darkMode'])
  },
  methods: {
    ...mapActions('auth', ['logout']),
    logoutUser() {
      this.logout().finally(() => {
        this.$store.commit("auth/receivingToken", null)
        this.$store.commit("auth/isMerchant", 0)
        this.$store.dispatch("auth/clearLogout")
        this.$router.push('/logout').catch(err => err)
        
      })
    },
    goTo(page) {
      this.$router.push({name: page}).catch((err) => {
        err
      });
    },
    activeClass(currentRoute) {
      if (this.$route.name === currentRoute) {
        if (this.darkMode) {
          return "bg-button"
        }
        return "bg-primary"
      }
      if (this.darkMode) {
        return "border border-roundBorder"
      }
      return "border border-roundBorder"
    }
  }
}
</script>