<template>
  <div class="container">
    <el-aside class="aside">
      <AsideBar ref="AsideBar" />
    </el-aside>
    <el-container class="content">
      <router-view v-slot="{ Component }">
        <component ref="rv" :is="Component" />
      </router-view>
    </el-container>
  </div>
</template>
  
<script>
import AsideBar from "@/components/AsideBar";

export default {
  name: "VueLayout",
  components: {
    AsideBar,
  },
  data() {
    return {};
  },
  methods: {
    openSocket() {
      this.websocket = new WebSocket(
        `ws://47.113.109.49:6002/${this.$store.state.userId}/${this.$store.state.token}`
      );
      this.websocket.binaryType = "arraybuffer"; //传输的是 ArrayBuffer 类型的数据
      this.websocket.onopen = (event) => {
        console.log("WebSocket连接成功：", event);
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
          if (data.data.message.chatId === this.$store.state.chatId) {
            this.$refs.rv.messages.push(data.data.message);
            if (data.data.message.fromUserId === this.$store.state.userId) {
              this.$refs.rv.inputText = "";
            }
            this.$refs.rv.scrollToBottom();
          }
          let chatIndex = this.$store.state.chatList.findIndex(
            (item) => item.chatId === data.data.message.chatId
          );
          let chatList = this.$store.state.chatList;
          let chatName = chatList[chatIndex].chatName;
          let friendId = chatList[chatIndex].friendId;
          chatList[chatIndex] = data.data.chat;
          if (chatList[chatIndex].chatType !== "group") {
            chatList[chatIndex].chatName = chatName;
          }
          chatList[chatIndex].friendId = friendId;
          this.$store.commit("setChatList", this.$store.state.chatList);
        } else if (data.operate === "update_user_status") {
          let friendIndex = this.$store.state.friendList.findIndex(
            (item) => item.userId === data.data.userId
          );
          let friendList = this.$store.state.friendList;
          friendList[friendIndex].status = data.data.status;
          this.$store.commit("setFriendList", friendList);
        }
      };

      this.websocket.onerror = (err) => {
        console.log("WebSocket连接出错：", err);
      };

      this.websocket.onclose = (event) => {
        console.log("WebSocket连接关闭: ", event);
      };
      this.$store.commit("setWebsocket", this.websocket);
    },
    closeSocket() {
      this.websocket.close();
    },
    getChatList() {
      this.$refs.AsideBar.isLoading = true;
      this.$request
        .get(`get_chat_list_by_userId/${this.$store.state.userId}`)
        .then((res) => {
          console.log(res.data.data);
          this.$store.commit("setChatList", res.data.data);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          this.$refs.AsideBar.isLoading = false;
        });
    },
    getFriendList() {
      this.$request
        .get(`get_friends_by_userId/${this.$store.state.userId}`)
        .then((res) => {
          console.log(res.data.data);
          this.$store.commit("setFriendList", res.data.data);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    getFriendRequestList() {
      this.$request
        .get(`get_friend_requests_by_userId/${this.$store.state.userId}`)
        .then((res) => {
          console.log(res.data.data);
          this.$store.commit("setFriendRequestList", res.data.data);
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
  mounted() {
    this.openSocket();
    this.getChatList();
    this.getFriendList();
    this.getFriendRequestList();
  },
  beforeUnmount() {
    this.closeSocket();
  },
};
</script>
  
<style scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

.aside {
  width: 20%;
  background-color: #e7f8ff;
}

.content {
  width: 80%;
  background-color: #fff;
}
</style>
  