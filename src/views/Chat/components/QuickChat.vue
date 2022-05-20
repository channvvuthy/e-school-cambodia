<template>
    <div class="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-black bg-opacity-95">
        <div class="max-w-sm rounded-xl e-shadow" :class="darkMode?`bg-secondary text-gray-400`:`bg-white`">
            <div class="flex items-center justify-between p-3">
                <div>
                    {{ $t('quick_reply') }}
                </div>
                <div class="cursor-pointer" @click="closeQuickReply">
                    <CloseIcon :width="24" :fill="darkMode?`#909090`:`#000`"></CloseIcon>
                </div>
            </div>
            <ul v-if="quickChat.data && quickChat.data.length" class="overflow-y-scroll max-h-96">
                <li v-for="(quickReply, index ) in quickChat.data" :key="index" class="p-3 cursor-pointer"
                    :class="darkMode?`border-t border-black`:`border-t`" @click="quickTextReply(quickReply.text)">
                    {{ quickReply.text }}
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import {mapState} from "vuex"
    import CloseIcon from "./../../../components/CloseIcon.vue"

    export default {
        computed: {
            ...mapState('chat', ['quickChat']),
            ...mapState('setting', ['darkMode'])
        },
        components: {
            CloseIcon
        },
        methods: {
            closeQuickReply() {
                this.$emit("closeQuickReply")
            },
            quickTextReply(quickTextReply) {
                this.$emit("quickTextReply", quickTextReply)
            }
        }
    }
</script>