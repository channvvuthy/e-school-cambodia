<template>
  <div>
    <ModalVue @dismiss="dismiss">
      <div class="p-5 overflow-y-scroll" style="max-height: 80%">
        <div class="flex pb-5 justify-between">
          <div class="font-black">{{ $t(title) }}</div>
          <div class="cursor-pointer" @click="dismiss">
            <CloseIcon :fill="darkMode ? `#909090` : `#000000`"></CloseIcon>
          </div>
        </div>
        <vue-cropper
            :autoCropArea="1"
            ref="cropper"
            :src="imgSrc"
            alt="Source Image"
            :img-style="{ 'max-height': '600px' }"
            @cropend="cropend"
        >
        </vue-cropper>
        <div class="flex justify-end">
          <button
              @click="cropped"
              class="
              text-white
              outline-none
              bg-primary
              py-3
              px-4
              rounded
              mt-5
              font-black
            "
          >
            {{ $t(buttonText) }}
          </button>
        </div>
      </div>
    </ModalVue>
  </div>
</template>

<script>
import ModalVue from "../../../components/Modal.vue";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import CloseIcon from "../../../components/CloseIcon.vue";
import {mapState} from "vuex";

export default {
  components: {
    ModalVue,
    VueCropper,
    CloseIcon,
  },
  props: {
    imgSrc: {
      default: () => null,
    },
    title: {
      default: () => {
        return "0014";
      },
    },
    buttonText: {
      default: () => {
        return "update";
      },
    },
  },
  data() {
    return {
      cropImg: null,
    };
  },
  computed: {
    ...mapState("setting", ["darkMode"]),
  },
  methods: {
    cropped() {
      this.$emit("cropped", this.cropImg);
    },
    cropend() {
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
    },
    dismiss() {
      this.$emit("dismiss", true);
    },
  },
};
</script>
