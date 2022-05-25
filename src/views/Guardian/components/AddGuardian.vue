<template>
    <div>
        <div class="fixed z-50 bg-black bg-opacity-90 inset-0 overflow-y-auto flex items-center justify-center w-full h-full left-0 top-0 "
             v-if="!err">
                <div class="">
                    <div class="bg-opacity-0">
                        <div class="flex-cols justify-center items-center overflow-y-scroll font-siemreab text-14px rounded-xl"
                             :class="darkMode?`bg-secondary`:`bg-white`">
                            <div class="p-5">
                                <div class="header flex justify-between items-center mb-3 relative">
                                    <div class="font-semibold text-base text-center w-full pt-10 pb-2">
                                        <div>{{$t('fill_info')}}</div>
                                    </div>
                                    <div @click="closeAdd" class="cursor-pointer absolute top-0 -right-2">
                                        <CloseIcon :width="20" :height="20" :fill="darkMode?`#909090`:`#000000`"/>
                                    </div>¬
                                </div>

                            </div>
                            <div class="body px-7 text-sm">
                                <div class="flex justify-start items-center">
                                    <div class="w-24 mr-3 whitespace-nowrap">{{$t('2009')}}</div>
                                    <input type="text"
                                           class="border py-3 focus:outline-none flex-1 pl-3 rounded-md"
                                           :class="darkMode?`bg-black border-button`:`border-gray-300`"
                                           :placeholder="$t(`2009`)" v-model="phone" @keypress="isNumber($event)"/>
                                </div>
                                <div class="flex justify-start items-center my-5 w-96">
                                    <div class="w-24 mr-3">{{$t('as')}}</div>
                                    <input type="text"
                                             :class="darkMode?`bg-black border-button`:`border-gray-300`"
                                           class="border py-3 focus:outline-none flex-1 pl-3 rounded-md"
                                           :placeholder="$t('as')" v-model="asTo"/>
                                </div>
                                <button class="bg-primary text-center rounded-md py-2 w-full text-white text-lg focus:outline-none my-5"
                                        :disabled="loadingAdd"
                                        @click="addGuardian">
                                    <span>{{$t('1008')}}</span>
                                    <Loader :size="14" v-if="loadingAdd"/>
                                </button>
                                <div class="h-3"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        <Message
                v-if="err"
                :message="message"
                @closeMessage="closeMessage"/>
    </div>
</template>

<script>

    import {mapActions, mapState} from "vuex"

    import CloseIcon from "./../../../components/CloseIcon"
    import Message from "./../../Profile/components/Message.vue"
    import helper from "./../../../helper/helper"
    import Loader from "./../../../components/Loader"

    export default{
        name: "AddGuardian",
        components: {
            CloseIcon,
            Message,
            Loader
        },
        data(){
            return {
                phone: "",
                asTo: "",
                err: false,
                message: ""
            }
        },
        computed: {
            ...mapState('guardian', ['loadingAdd']),
            ...mapState('setting', ['darkMode']),
        },
        methods: {
            ...mapActions('guardian', ['addingGuardian']),
            closeAdd(){
                this.$emit("closeAdd")
            },
            isNumber(evt){
                return helper.isNumber(evt)
            },
            closeMessage(){
                this.err = false
            },
            addGuardian(){
                if (this.phone.trim() === "") {
                    this.err = true
                    this.message = "please_enter_phone_number"
                    return
                }
                if (this.asTo.trim() === "") {
                    this.err = true
                    this.message = "4124"
                    return
                }
                this.addingGuardian({
                    phone: this.phone,
                    type: this.asTo
                }).then(response => {
                    if (response.data.status === 1) {
                        this.err = true
                        this.message = response.data.msg
                    }else{
                        this.$emit("GuardianAdded")
                    }
                })
            }

        },
        created(){

        },

    }
</script>