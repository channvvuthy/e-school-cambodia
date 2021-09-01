<template>
    <div class="w-full h-28 flex items-end pb-3 shadow"
        :class="darkMode?'bg-secondary border-secondary text-gray-300':'bg-white border-gray-300'">
        <div class="flex px-10 items-center">
            <div class="shadow rounded-md flex justify-center items-center h-8 px-3 mr-4 cursor-pointer"
            :class="isHide?`ml-7`:`ml-3`"
             @click="back()">
                <BackIcon :width="20" :height="20" :fill="darkMode?`#D1D5DB`:`#000000`"></BackIcon>
            </div>
            <div class="w-9 h-9 rounded-full mr-5 bg-cover bg-center" :style="{backgroundImage:`url(${user.photo})`}"></div>
            <div class="text-sm font-mediums">
                {{user.name}}
            </div>
        </div>
    </div>
</template>
<script>
    import {mapState} from "vuex"
    import BackIcon from "./../../../components/BackIcon.vue"
    export default{
        name:"VideoHeader",
       
        components:{
            BackIcon
        },
        computed:{
            ...mapState('setting', ['isHide','darkMode']),
        },
        props:{
            user:{
                type: Object,
                default: () => {
                    return{
                        name:"",
                        photo: ""
                    }
                }
            },
            isExam:{
                default:()=>{
                    return false
                }
            },
            title:{
                default:() =>{
                    return '2126'
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
