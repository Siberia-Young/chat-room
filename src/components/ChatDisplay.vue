<template>
  <el-scrollbar class="chat-display" ref="scrollContainer" @scroll="touchTop">
    <div ref="innerRef">
      <img
        v-if="isLoading"
        class="chat-loading"
        src="@/assets/icons/loading2.gif"
      />
      <div v-for="message in messages" :key="message.messageId">
        <div
          :class="{
            'message-right': message.fromUserId === userId,
            'message-left': !(message.fromUserId === userId),
          }"
        >
          <div class="avatar">
            <img :src="avatarMap[message.fromUserId]" alt="Avatar" />
          </div>
          <div
            :class="{
              'text-right': message.fromUserId === userId,
              'text-left': !(message.fromUserId === userId),
            }"
          >
            {{ $emojiHandler.emojiDecode(message.content) }}
          </div>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
export default {
  name: "ChatDisplay",
  props: {
    init: {
      type: Boolean,
      default: false,
    },
    participants: {
      type: Array,
      default: () => [],
    },
    messages: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      userId: this.$store.state.userId,
      isLoading: false,
      totalHeight: 0,
      throttleGetMoreChatContent: this.throttle(this.getMoreChatContent, 500),
    };
  },
  computed: {
    avatarMap() {
      const map = {};
      this.participants.forEach((participant) => {
        map[participant.userId] = participant.avatarUrl;
      });
      return map;
    },
  },
  mounted() {},
  created() {},
  updated() {
    console.log("update");
    this.scrollToBottom();
  },
  watch: {
    totalHeight: {
      handler(newVal, oldVal) {
        if (newVal === 0) return;
        this.$refs.scrollContainer.setScrollTop(newVal - oldVal);
      },
    },
    init: {
      handler() {
        this.totalHeight = 0;
      },
    },
  },
  methods: {
    changeState(state) {
      this.isLoading = state;
      if (!state) {
        this.$nextTick(() => {
          this.totalHeight = this.$refs.innerRef.clientHeight;
        });
      }
    },
    scrollToBottom() {
      this.$refs.scrollContainer.setScrollTop(this.$refs.innerRef.clientHeight);
    },
    touchTop() {
      if (
        this.$refs.scrollContainer.$refs.wrapRef.scrollTop === 0 &&
        !this.isLoading
      ) {
        this.throttleGetMoreChatContent();
      }
    },
    getMoreChatContent() {
      this.$emit("get-more-chat-content");
    },
    debounce(fn, delay) {
      let timer = null;
      return function () {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          fn.apply(this, arguments);
        }, delay);
      };
    },
    throttle(fn, delay) {
      let flag = true;
      return function () {
        if (flag) {
          flag = false;
          fn.apply(this, arguments);
          setTimeout(() => {
            flag = true;
          }, delay);
        }
      };
    },
  },
};
</script>

<style scoped>
.chat-display {
  position: relative;
  padding: 10px;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-height: calc(100% - 20px);
  overflow-y: auto;
}

.chat-display .chat-loading {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 50px;
}

.chat-display .message-left {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 10px;
  padding: 10px;
}

.chat-display .message-right {
  display: flex;
  flex-direction: row-reverse;
  align-items: flex-start;
  margin-bottom: 10px;
  padding: 10px;
}

.chat-display .avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.chat-display .text-left {
  background-color: #fff;
  padding: 10px;
  border-radius: 12px;
  margin-left: 10px;
  max-width: 80%;
  word-wrap: break-word; /* 添加自动换行属性 */
  white-space: pre-wrap; /* 添加自动换行属性 */
  overflow-wrap: break-word; /* 超出容器的文本自动换行 */
  text-align: left;
}

.chat-display .text-right {
  background-color: #b8c7f3;
  padding: 10px;
  border-radius: 12px;
  margin-right: 10px;
  max-width: 80%;
  word-wrap: break-word; /* 添加自动换行属性 */
  white-space: pre-wrap; /* 添加自动换行属性 */
  overflow-wrap: break-word; /* 超出容器的文本自动换行 */
  text-align: left;
}

.chat-display .message-buttons {
  padding: 5px;
  display: flex;
  flex-direction: row;
  gap: 6px;
  margin-top: 4px;
  font-size: 0.875rem;
}

.chat-display .message-button {
  background: #efeffc;
  color: #5d5cde;
  fill: #5d5cde;
  display: flex;
  flex-direction: row;
  border: none;
  gap: 6px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 450;
  font-size: inherit;
  text-align: center;
  padding: 0.6em 16px;
  border-radius: 1.5em;
}
</style>
