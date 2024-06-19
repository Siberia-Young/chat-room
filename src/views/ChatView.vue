<template>
  <div class="chat-view">
    <div class="header">
      {{ headerContent.chatName }}({{ headerContent.chatType }})-{{
        headerContent.status
      }}
    </div>
    <ChatDisplay
      class="chat-display"
      :init="init"
      :participants="participants"
      :messages="messages"
      ref="chatDisplay"
      @get-more-chat-content="getMoreChatContent"
    />
    <div class="input">
      <div class="input-panel">
        <textarea
          v-model="inputText"
          class="input-area"
          @keydown.ctrl.enter="sendMessage"
          placeholder="Ctrl + Enter 发送"
          rows="3"
        ></textarea>
        <el-button class="btn" v-if="!waiting" @click="sendMessage">
          <div class="btn-text">发送</div>
        </el-button>
        <img class="loading" src="@/assets/icons/loading.gif" v-if="waiting" />
      </div>
    </div>
  </div>
</template>

<script>
import ChatDisplay from "@/components/ChatDisplay";
export default {
  name: "ChatView",
  components: { ChatDisplay },
  data() {
    return {
      userId: this.$store.state.userId,
      inputText: "",
      chatText: "",
      waiting: false,
      curPage: 0,
      init: false,
      messages: [],
      participants: [],
      timestamp: "",
    };
  },
  computed: {
    headerContent() {
      let temp1 = this.chatList.filter((chat) => chat.chatId === this.chatId);
      if (temp1.length === 0) return { chatName: "", chatType: "", status: "" };
      temp1 = temp1[0];
      let temp2 = this.friendList.filter(
        (friend) => friend.userId === temp1.friendId
      );
      if (temp2.length === 0)
        return {
          chatName: temp1.chatName,
          chatType:
            temp1.chatType === "single"
              ? "个人"
              : temp1.chatType === "double"
              ? "好友"
              : "群聊",
          status: "",
        };
      temp2 = temp2[0];
      let res = {
        chatName: temp1.chatName,
        chatType:
          temp1.chatType === "single"
            ? "个人"
            : temp1.chatType === "double"
            ? "好友"
            : "群聊",
        status: temp1.chatType === "double" ? temp2.status : "",
      };
      return res;
    },
    websocket() {
      return this.$store.state.websocket;
    },
    chatId() {
      return this.$store.state.chatId;
    },
    chatList() {
      return this.$store.state.chatList;
    },
    friendList() {
      return this.$store.state.friendList;
    },
  },
  watch: {
    chatId: {
      handler(newVal) {
        if (newVal === "0") {
          this.participants = [];
          this.messages = [];
        } else {
          this.initChat();
        }
      },
    },
  },
  created() {},
  updated() {},
  mounted() {
    this.initChat();
  },
  methods: {
    initChat() {
      this.participants = [];
      this.messages = [];
      this.curPage = 0;
      this.init = false;
      this.getParticipants();
      this.getMoreChatContent();
    },
    getMoreChatContent() {
      this.$refs.chatDisplay.changeState(true);
      if (this.messages.length > 0) {
        this.timestamp = this.messages[0].timestamp;
      } else {
        this.timestamp = new Date(
          new Date().getTime() + 8 * 60 * 60 * 1000
        ).toISOString();
      }
      this.$request
        .get(
          `get_messages_by_chatId/${this.userId}?chatId=${this.chatId}&timestamp=${this.timestamp}`
        )
        .then((res) => {
          if (res.data.data.length === 0) {
            this.$message({
              message: "没有更多消息了",
              type: "warning",
            });
            return;
          }
          this.messages.unshift(...res.data.data);
          if (!this.init) {
            this.scrollToBottom();
            this.init = true;
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          this.$refs.chatDisplay.changeState(false);
        });
    },
    getParticipants() {
      this.$request
        .get(`get_participants_by_chatId/${this.chatId}`)
        .then((res) => {
          console.log(res);
          this.participants = res.data.data;
        });
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.chatDisplay.scrollToBottom();
      });
    },
    sendMessage() {
      if (this.inputText.trim() !== "") {
        let data = JSON.stringify({
          operate: "insert_message",
          token: this.$store.state.token,
          data: {
            userId: this.userId,
            participants: this.participants,
            chatId: this.chatId,
            fromUserId: this.userId,
            toUserId: null,
            content: this.$emojiHandler.emojiEncode(this.inputText),
          },
        });
        this.websocket.send(data);
      }
    },
  },
};
</script>

<style scoped>
.chat-view {
  height: 100%;
  width: 80%;
  margin: 0 10%;
  background-color: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background-color: #eeeeee;
}

.chat-display {
  flex-grow: 1;
}

.input {
  position: relative;
  width: 100%;
  padding: 10px 20px 20px;
  box-sizing: border-box;
  flex-direction: column;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-top: 1px solid #dedede;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
}

.input-panel {
  display: flex;
  flex: 1;
}

.input-area {
  height: 100%;
  width: 100%;
  border-radius: 10px;
  border: 1px solid #dedede;
  box-shadow: 0 -2px 5px rgb(0 0 0/3%);
  background-color: #fff;
  color: #000;
  font-family: inherit;
  padding: 10px 90px 10px 14px;
  resize: none;
  outline: none;
}

.btn {
  background-color: #1d93ab;
  color: #fff;
  position: absolute;
  right: 30px;
  bottom: 32px;
}

.btn-icon {
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-text {
  margin-left: 5px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.loading {
  position: absolute;
  right: 30px;
  bottom: 30px;
  width: 30px;
  height: 30px;
}
</style>
