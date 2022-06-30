<template>
  <div>
    <template v-if="message.content.type">
      <div
        v-if="isAdmin"
        :class="
          isAdmin
            ? `${darkMode ? `chat-bubble-right-dark` : `chat-bubble--right`}`
            : `${darkMode ? `bubble bubble--left-dark` : `bubble--left`}`
        "
        class="relative chat-bubble"
      >
        <span
          v-if="message.content.type == 0"
          :class="darkMode ? `text-fb` : `text-primary`"
          class="cursor-pointer"
          @click="getUser(message.sender._id)"
        >
          {{ senderName(message) }}
        </span>
        <span v-html="linkify(mention(message.content.text))"></span>
      </div>
      <div
        v-else
        :class="
          isMind
            ? `${darkMode ? `chat-bubble-right-dark` : `chat-bubble--right`}`
            : `${darkMode ? `bubble bubble--left-dark` : `bubble--left`}`
        "
        class="relative chat-bubble"
      >
        <span
          v-if="message.content.type == 0"
          :class="darkMode ? `text-fb` : `text-primary`"
          class="cursor-pointer"
          @click="getUser(message.sender._id)"
        >
          {{ senderName(message) }}
        </span>
        <span v-html="linkify(mention(message.content.text))"></span>
      </div>
    </template>
    <template v-else>
      <div>
        <span
          v-if="message.content.type == 0"
          :class="darkMode ? `text-fb` : `text-primary`"
          class="cursor-pointer"
          @click="getUser(message.sender._id)"
        >
          {{ senderName(message) }}
        </span>
        <span v-html="linkify(mention(message.content.text))"></span>
        <span> {{ getDay(message.date) }}</span>
      </div>
    </template>
  </div>
</template>
<script>
import { mapState } from "vuex";
import moment from "moment";
import helper from "./../../../helper/helper";

export default {
  props: {
    isAdmin: {
      default: () => {
        return false;
      },
    },
    isMind: {
      default: () => {
        return false;
      },
    },
    message: {
      default: () => {
        return {};
      },
    },
  },
  computed: {
    ...mapState("setting", ["darkMode"]),
    ...mapState("auth", ["stProfile"]),
  },
  methods: {
    mention(str) {
      try {
        return str
          .replace(/[@]\[/g, "<span class='text-fb'>")
          .replace(/\]/g, "</span>");
      } catch (err) {
        return str;
      }
    },
    getDay(oldDate) {
      if (helper.numDay(oldDate, moment().format()) === 0) {
        return moment(oldDate).format("h:mm A");
      } else {
        if (moment(oldDate).format("YYYY") === moment().format("YYYY")) {
          if (moment(oldDate).format("MMM") == moment().format("MMM")) {
            return moment(oldDate).format("ddd h:mm A");
          }
          return moment(oldDate).format("MMM DD, h:mm A");
        } else {
          return moment(oldDate).format("MMM DD YYYY");
        }
      }
    },
    senderName(message) {
      if (this.stProfile._id == message.sender._id) {
        return this.$i18n.t("you");
      }
      return message.sender.name;
    },
    linkify(inputText) {
      if (inputText) {
        let replacedText, replacePattern1, replacePattern2, replacePattern3;

        //URLs starting with http://, https://, or ftp://
        replacePattern1 =
          /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        replacedText = inputText.replace(
          replacePattern1,
          '<a href="$1" target="_blank" class="text-fb">$1</a>'
        );

        //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
        replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        replacedText = replacedText.replace(
          replacePattern2,
          '$1<a href="http://$2" target="_blank" class="text-fb">$2</a>'
        );

        //Change email addresses to mailto:: links.
        replacePattern3 =
          /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
        replacedText = replacedText.replace(
          replacePattern3,
          '<a href="mailto:$1">$1</a>'
        );

        return replacedText;
      }
      return "";
    },
    getUser(user_id) {
      this.$router.push({ name: "user", params: { user_id } });
    },
  },
};
</script>
<style>
.chat-bubble:after {
  content: "";
  position: absolute;
  top: 50%;
  width: 0;
  height: 0;
  border: 20px solid transparent;
  border-bottom: 0;
  margin-top: -10px;
}

.chat-bubble--right:after {
  right: 0;
  border-left-color: #ffffff;
  border-right: 0;
  margin-right: -30px;
}

.chat-bubble-right-dark:after {
  right: 0;
  border-left-color: #383838;
  border-right: 0;
  margin-right: -30px;
}

.bubble--left-dark:after {
  left: 0;
  border-right-color: #383838;
  border-left: 0;
  margin-left: -30px;
}

.bubble--left:after {
  left: 0;
  border-right-color: #ffffff;
  border-left: 0;
  margin-left: -30px;
}
</style>