<template>
  <div class="chat-view">
    <div class="header"></div>
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
      websocket: null,
      inputText: "",
      chatText: "",
      waiting: false,
      curPage: 0,
      init: false,
      messages: [],
      participants: [],
    };
  },
  computed: {
    chatId() {
      return this.$store.state.chatId;
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
    this.openSocket();
  },
  beforeUnmount() {
    this.closeSocket();
  },
  methods: {
    openSocket() {
      this.waiting = true;
      this.websocket = new WebSocket(
        `ws://47.113.109.49:6002/${this.userId}/${this.$store.state.token}`
      );
      this.websocket.binaryType = "arraybuffer"; //传输的是 ArrayBuffer 类型的数据
      this.websocket.onopen = (event) => {
        console.log("WebSocket连接成功：", event);
        console.log("chatId: ", this.chatId);
        this.waiting = false;
        this.initChat();
      };

      this.websocket.onmessage = (msg) => {
        let data = JSON.parse(msg.data);
        console.log("路径：", data.operate);
        if (data.operate === "logout") {
          console.log(data.data);
          window.location.href = "/";
        } else if (data.operate === "error_1" || data.operate === "error_2") {
          this.$message.error(data.data);
        } else if (data.operate === "insert_message") {
          if (data.data.chatId === this.chatId) {
            this.messages.push(data.data);
            if (data.data.fromUserId === this.userId) {
              this.inputText = "";
            }
            this.scrollToBottom();
          }
        } else if (data.operate === "update_chat_record_last_updated") {
          let data = JSON.parse(msg.data);
          console.log(data);
        }
      };

      this.websocket.onerror = (err) => {
        console.log("WebSocket连接出错：", err);
      };

      this.websocket.onclose = (event) => {
        console.log("WebSocket连接关闭: ", event);
      };
    },
    closeSocket() {
      this.websocket.close();
    },
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
      this.$request
        .get(
          `http://47.113.109.49:6001/get_chat_record_by_chatId/${this.chatId}`
        )
        .then((res) => {
          console.log(res);
          this.messages = res.data.data;
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
        .get(
          `http://47.113.109.49:6001/get_participants_by_chatId/${this.chatId}`
        )
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
            participants: this.participants,
            chatId: this.chatId,
            fromUserId: this.userId,
            toUserId: null,
            content: this.inputText,
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
