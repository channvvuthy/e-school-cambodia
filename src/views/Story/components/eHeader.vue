<template>
    <div class="w-full h-28 flex items-end pb-3 shadow"
        :class="darkMode?'bg-secondary border-secondary text-gray-300':'bg-white border-gray-300'">
        <div class="flex px-10 items-center">
            <div class="shadow rounded-md flex justify-center items-center h-8 px-3 cursor-pointer"
            :class="isHide?`ml-7`:`ml-3`"
             @click="back()">
                <BackIcon :width="20" :height="20" :fill="darkMode?`#D1D5DB`:`#000000`"></BackIcon>
            </div>
            <div :class="`text-sm font-mediums ml-${ml}`">{{$t(title)}}</div>
        </div>
        <div class="flex-1 w-full flex justify-end px-5 items-center cursor-pointer" @click="() => {this.$router.push({name:'network'})}">
                <AddUserIcon :fill="darkMode?`#909090`:`#0f3c7a`"></AddUserIcon>
        </div>
    </div>
</template>
<script>
    import {mapState} from "vuex"
    import BackIcon from "./../../../components/BackIcon.vue"
    import AddUserIcon from "./../../../components/AddUserIcon.vue"
    export default{
        name:"VideoHeader",
       
        components:{
            BackIcon,
            AddUserIcon
        },
        computed:{
            ...mapState('setting', ['isHide','darkMode'])
        },
        props:{
            isExam:{
                default:()=>{
                    return false
                }
            },
            title:{
                default:() =>{
                    return '2126'
                }
            },
            ml:{
                default:() =>{
                    return 0
                }
            }
        },
        methods:{
            back(){
                
                if(!this.isExam){
                    if(this.$route.name === 'video-detail'){
                        this.$router.push({name:'video'})
                        return;
                    }
                    this.$router.go(-1)
                }else{
                    this.$emit("exit")
                }
            }
        }

    }
</script>
