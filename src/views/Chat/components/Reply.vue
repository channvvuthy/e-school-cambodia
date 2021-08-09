<template>
    <div class="w-44 rounded-lg" :class="darkMode?`bg-button text-white`:`bg-white e-shadow`">
        <div class="h-12 flex items-center cursor-pointer px-3 border-b" :class="darkMode?`border-youtube`:``" @click="reply()">Reply</div>
        <div class="h-12 flex items-center cursor-pointer px-3" :class="darkMode?``:``" @click="copy">Copy Text</div>
    </div>
</template>
<script>
import {mapState} from "vuex"
export default {
    computed:{
        ...mapState('setting', ['darkMode'])
    },
    methods:{
        reply(){
            this.$emit("reply")
        },
        copy(){
            this.$emit("copy")
        }
    }
}
</script>