<template>
  <ul>
    <li
        @click="selectedAction(action)"
        v-for="(action, key) in actions"
        :key="key"
    >
      <div
          :class="key < actions.length - 1 ? `mb-4` : ``"
          class="px-7 h-10 flex items-center space-x-4 cursor-pointer"
          v-if="action.show"
      >
        <div
            style="background-color: rgba(5, 81, 116, 0.2)"
            class="rounded-full h-10 w-10 cursor-pointer"
        >
          <div class="rounded-full h-10 w-10 flex items-center justify-center">
            <Icons :component-as-prop="action.icon" fill="#055174" :size="20"/>
          </div>
        </div>
        <div>
          {{ $t(action.label) }}
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import Icons from "@/components/Icons";
import {mapState} from "vuex";

export default {
  name: "ActionList",
  components: {
    Icons,
  },
  props: {
    post: {
      type: Object,
      default: () => {
        return {
          user: {
            _id: null,
          },
        };
      },
    },
  },
  computed: {
    ...mapState("auth", ["stProfile"]),
  },
  data() {
    return {
      actions: [
        {
          icon: () => import("@/views/MyCourse/components/DeleteIcon"),
          label: "actions.delete",
          show: true,
        },
        {
          icon: () => import("@/components/EditIcon"),
          label: "actions.edit",
          show: true,
        },
        {
          icon: this.post.is_favorite
              ? () => import("@/components/FavoriteFill")
              : () => import("@/components/FavoriteIcon"),
          label: this.post.is_favorite
              ? `actions.remove_favorite`
              : "actions.add_to_favorite",
          show: true,
        },
        {
          icon: () => import("@/components/CopyIcon"),
          label: "actions.copy_link",
          show: true,
        },
        {
          icon: () => import("@/components/ReportIcon"),
          label: "actions.report",
          show: true,
        },
      ],
    };
  },
  methods: {
    selectedAction(action) {
      this.$emit("selectedAction", {
        action,
        post: this.post,
      });
    },
  },
  created() {
    if (this.post.user._id != this.stProfile._id) {
      this.actions[0].show = false;
      this.actions[1].show = false;
    } else {
      this.actions[4].show = false;
    }
  },
};
</script>

<style scoped>
</style>
