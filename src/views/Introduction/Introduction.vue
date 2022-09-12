<template>
  <div class="flex items-center flex-col justify-center h-screen bg-white text-center font-PoppinsMedium">
    <div class="h-full flex flex-col items-center justify-center">
      <div class="text-center w-1/3">
        <div v-for="(i,k) in intro" :key="k">
          <div :class="k == index ? `` : `hidden`">
            <img :src="intro[index].url" class="ml-auto">
            <div v-html="intro[index].text" class="text-sm"></div>
          </div>
        </div>
        <div class="flex items-center justify-center mt-5">
          <div v-for="(i,k) in intro" :key="k">
            <div class="w-3 h-3 rounded-full mr-2 cursor-pointer" :class="index == k ? `bg-primary`: `bg-button`"
                 @click="showIntro(k)"></div>
          </div>
        </div>
        <button class="bg-primary text-center text-white rounded-xl w-full mt-5 py-3" v-if="index == 4"
                @click="start()">ចាប់ផ្តើម
        </button>
      </div>
    </div>
    <div class="flex justify-end  w-full">
      <img src="e-footer.png" class="w-full">
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      index: 0,
      intro: [{
        url: "1-Social.png",
        text: "បណ្តាញសង្គមដែលថ្មី និងដំបូងបំផុត នៅក្នុងប្រទេសកម្ពុជា ដែលផ្តោតសំខាន់តែលើការសិក្សាអប់រំ ចែករំលែកចំនេះដឹង និងបទពិសោធន៍ ដ៏សំបូរបែប",
      },
        {
          url: "2-Video.png",
          text: "សិក្សាបន្ថែម គ្រប់ពេលវេលា គ្រប់ទីកន្លែង រួមបញ្ចូល ទាំងឯកសារ វេទិការសំនួរចម្លើយ និងការធ្វើតេស្តសាកល្បង តាមមេរៀននីមួយៗ",
        },
        {
          url: "3-read_book.png",
          text: "សៀវភៅជាច្រើនក្បាល ស្ថិតនៅក្នុងដៃអ្នកជាមួយនិងមុខងាដ៏សំបូរបែប អ្នកអាចអានក៏បាន ស្តាប់ក៏បាន ឬក៏មើលជាវីដេអូរសង្ខេបក៏បាន",
        },
        {
          url: "4-chat.png",
          text: "ភ្ជាប់ទំនាក់ទំនង ចែករំលែកចំនេះដឹង និងពង្រីកនូវ ការសិក្សាជាក្រុម កាន់តែងាយស្រួល ជាមួយមិត្តភ័ក្រ និង លោកគ្រូ អ្នកគ្រូ តាមរយៈមុខងា E-talk និង Story",
        },
        {
          url: "5-certificate.png",
          text: "ទទួលបានសញ្ញាប័ត្រ ការធានារ៉ាប់រងអាយុជីវិត របាយការណ៍ការសិក្សារប្រចាំខែ និងមុខងារពិសេសៗ ជាច្រើនទៀត សូមចុចលើពាក្យ “ចាប់ផ្តើម” ដើម្បីចូលទៅកាន់ពិភព សិក្សាដ៏សំបូរបែប",
        }],
    }
  },
  methods: {
    showIntro(i) {
      this.index = i;
    },
    start() {
      localStorage.setItem("started", 1);
      this.$emit("started")
    }
  },
  created() {

  }
}
</script>