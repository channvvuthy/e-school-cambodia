<template>
    <!-- This example requires Tailwind CSS v2.0+ -->
<div class="fixed z-10 inset-0 overflow-y-auto">
  <div class="flex items-end justify-center min-h-screen text-center sm:block sm:p-0">
    <!--
      Background overlay, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100"
        To: "opacity-0"
    -->
    <div class="fixed inset-0 transition-opacity" aria-hidden="true">
      <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
    </div>

    <!-- This element is to trick the browser into centering the modal contents. -->
    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
    <div class="inline-block align-bottom bg-white rounded text-left overflow-hidden shadow-xl transform transition-all  sm:align-middle" :class="`w-${size}`" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
      <div class="bg-white">
        <div class="flex justify-center items-center">
          <div class="text-center">
            <div class="py-5">
              <p class="text-sm text-gray-500 text-sm font-khmer_os px-3">
                  {{ message }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <hr>
      <div class="flex justify-center items-center font-khmer_os py-3">
        <button type="button" @click="closeMessage" class="w-full inline-flex justify-center  px-4   text-base font-medium text-blue-700  focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
          បាទ/ចាស់
        </button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
    export default{
        name:"ForgotPassword",
        props:{
            message:{
                type:String,
                default:() =>{
                    return null
                }
            },
            size:{
                type:Number,
                default:()=>{
                    return 60;
                }
            }
        },
        data(){
          return{
            phone:null
          }
        },
        methods:{
            closeMessage($event){
                this.$emit("closeMessage",$event);
            }
        }
    }
</script>