<template>
    <div class="flex items-center justify-center items-center fixed left-0 top-0 h-full w-full z-50 bg-black bg-opacity-90">
        <div class="w-1/3" :class="darkMode?`bg-secondary rounded-lg`:`bg-white e-shadow rounded-lg`">
            <div class="flex items-center justify-between h-14 relative px-5 border-b"
                 :class="darkMode?`border-button text-gray-300`:``">
                <div class="flex items-center">
                    <div class="text-base cursor-pointer w-20 text-center h-14 flex items-center justify-center"
                         @click="() => {this.active = 1}"
                         :class="active === 1?`border-b-4 ${darkMode?`border-fb`:`border-primary`}`:``">{{$t('all')}}
                    </div>
                    <div class="text-base cursor-pointer w-20 text-center h-14 flex items-center justify-center"
                         @click="() => {this.active = 2}"
                         :class="active === 2?`border-b-4 ${darkMode?`border-fb`:`border-primary`}`:``">{{$t('admin')}}
                    </div>
                </div>
                <div class="cursor-pointer" @click="closeMember()">
                    <CloseIcon :fill="darkMode?`#909090`:`#000000`"/>
                </div>
            </div>
            <div class="p-5 overflow-y-scroll" style="height:32rem;" @scroll="onScroll">
                <!-- Meber -->
                <div v-if="active === 1">
                    <div v-for="(member, index) in members" :key="index">
                        <div class="flex items-center py-3 justify-between" v-if="contact.create_by !== member._id">
                            <div class="flex items-center">
                                <div>
                                    <div class="h-13 w-13 rounded-full shadow bg-cover bg-gray-300 mr-3"
                                         :style="{backgroundImage:`url(${member.photo})`}"></div>
                                </div>
                                <div :class="darkMode?`text-gray-300`:``">
                                    {{member.name}}
                                </div>
                            </div>
                            <div class="flex cursor-pointer relative" @click="handleClick(member)" v-if="isAdmin()">
                                <div class="w-1 h-1 rounded-full" :class="darkMode?`bg-gray-500`:`bg-primary`"></div>
                                <div class="w-1 h-1 mx-1 rounded-full"
                                     :class="darkMode?`bg-gray-500`:`bg-primary`"></div>
                                <div class="w-1 h-1 rounded-full" :class="darkMode?`bg-gray-500`:`bg-primary`"></div>
                                <div class="absolute right-0 w-56 rounded-lg top-6 z-50 box-active"
                                     :class="darkMode?`box-active bg-secondary text-gray-300 border border-button`
                                     :`box-active-white bg-white border border-gray-200`"
                                     v-if="event === member._id">
                                    <div class="py-3 mx-3"
                                         :class="darkMode?`border-b border-button`:`border-b border-gray-200`"
                                         @click="confirm(member)">
                                        {{$t('remove')}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Admin -->
                <div v-if="active === 2">
                    <div v-for="(member, index) in members" :key="index">
                        <div class="flex items-center py-3 justify-between" v-if="contact.create_by === member._id">
                            <div class="flex items-center">
                                <div>
                                    <div class="h-13 w-13 rounded-full shadow bg-cover bg-gray-300 mr-3"
                                         :style="{backgroundImage:`url(${member.photo})`}"></div>
                                </div>
                                <div :class="darkMode?`text-gray-300`:``">
                                    <div>
                                        {{member.name}}
                                    </div>
                                    <div :class="darkMode?`text-gray-500`:`text-gray-400`" class="text-xs mt-1">
                                        {{$t('group_creator')}}
                                    </div>
                                </div>
                            </div>
                            <div class="flex cursor-pointer relative" @click="handleClick(member)"
                                 v-if="isAdmin(member)">
                                <div class="w-1 h-1 rounded-full" :class="darkMode?`bg-gray-500`:`bg-primary`"></div>
                                <div class="w-1 h-1 mx-1 rounded-full"
                                     :class="darkMode?`bg-gray-500`:`bg-primary`"></div>
                                <div class="w-1 h-1 rounded-full" :class="darkMode?`bg-gray-500`:`bg-primary`"></div>
                                <div class="absolute right-0 w-56 rounded-lg top-6 z-50"
                                     :class="darkMode?`box-active bg-secondary text-gray-300 border border-button`
                                     :`box-active-white bg-white border border-gray-200`"
                                     v-if="event === member._id">
                                    <div class="py-3 mx-3"
                                         :class="darkMode?`border-b border-button`:`border-b border-gray-200`"
                                         @click="leftGroupConfrim(member)">
                                        {{$t('leave')}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <BuyMsg
                v-if="isConfirm"
                :msg="msg" @cancelModal="() => {this.isConfirm = false;}"
                @yes="yes"/>
    </div>
</template>
<script>
    import {mapState, mapActions} from "vuex"
    import CloseIcon from "./../../../components/CloseIcon.vue"
    import BuyMsg from "./../../Component/BuyMsg.vue"
    import helper from "./../../../helper/helper"

    export default {

        props: {
            contact: {
                default: () => {
                    return {}
                }
            }
        },
        components: {
            CloseIcon,
            BuyMsg
        },
        data() {
            return {
                loading: false,
                active: 1,
                page: 1,
                event: "",
                enableScroll: true,
                isConfirm: false,
                member: {},
                msg: "delete_contact",
                action: 1
            }
        },
        computed: {
            ...mapState('setting', ['darkMode']),
            ...mapState('etalk', ['members']),
            ...mapState('auth', ['stProfile'])
        },
        methods: {
            ...mapActions('etalk', ['getMember', 'deleteMember']),
            closeMember() {
                this.$emit("closeMember")
            },
            confirm(member) {
                this.member = member
                this.isConfirm = true
                this.msg = "delete_contact"
                this.action = 1

            },
            leftGroupConfrim(member) {
                this.member = member
                this.isConfirm = true
                this.msg = 'left_group'
                this.action = 2

            },
            yes() {
                let payload = {
                    user_id: this.member._id,
                    id: this.contact._id
                }
                this.deleteMember(payload).then((response) => {
                    if (response.data.msg !== undefined) {
                        helper.errorMessage(response.data.msg)
                    } else {
                        this.isConfirm = false
                        helper.success('delete_member')

                        if (this.action === 2) {
                            let payload = {}
                            payload.id = this.contact._id
                            this.getMember(payload).then(() => {
                                this.$emit("adminLeft")
                            })
                        }
                    }
                })

            },
            onScroll({target: {scrollTop, clientHeight, scrollHeight}}) {
                if (scrollTop + clientHeight >= (scrollHeight - 1)) {
                    this.page++
                    let payload = {}
                    payload.id = this.contact._id
                    payload.p = this.page

                    if (this.enableScroll) {
                        this.getMember(payload).then(res => {
                            if (res.data.data.length <= 0) {
                                this.enableScroll = false
                            }
                        })
                    }
                }
            },
            isAdmin() {
                if (this.contact.create_by === this.stProfile._id) {
                    return true
                }
                return false
            },
            handleClick(member) {
                if (this.event) {
                    this.event = ""
                } else {
                    this.event = member._id
                }
            }
        },
        created() {
            this.getMember({
                id: this.contact._id
            })
        }
    }
</script>
<style>
    .box-active::after {
        content: "";
        position: absolute;
        width: 20px;
        height: 20px;
        background: #212121;
        top: 0;
        margin-top: -11px;
        right: 0;
        margin-right: 15px;
        border-top: 1px solid #383838;
        border-right: 1px solid #383838;
        transform: rotate(-45deg);
    }

    .box-active-white::after {
        content: "";
        position: absolute;
        width: 20px;
        height: 20px;
        background: white;
        top: 0;
        margin-top: -11px;
        right: 0;
        margin-right: 15px;
        border-top: 1px solid #E5E7EB;
        border-right: 1px solid #E5E7EB;
        transform: rotate(-45deg);
    }
</style>