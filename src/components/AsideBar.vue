<template>
  <div class="aside-bar">
    <div class="logo">Chat-Room</div>
    <div class="aside-body" @scroll="touchBottom">
      <div class="chat-history">
        <ul>
          <li v-for="chat in chatList" :key="chat.chatId">
            <div
              class="chat-item"
              :class="{
                selected: chat.chatId === this.$store.state.chatId,
              }"
              :data-chatId="chat.chatId"
              @click="selectChatItem"
            >
              <div class="chat-item-title">
                {{ $emojiHandler.emojiDecode(chat.chatName)
                }}<span
                  >({{
                    chat.chatType === "single"
                      ? "个人"
                      : chat.chatType === "double"
                      ? "好友"
                      : "群聊"
                  }})</span
                >
              </div>
              <div class="second-line">
                <div class="chat-item-msg">
                  {{ $emojiHandler.emojiDecode(chat.latestMessageFromNickname) }}：{{
                    $emojiHandler.emojiDecode(chat.latestMessageContent)
                  }}
                </div>
                <div class="chat-item-time">
                  {{ timestampToTime(chat.latestMessageTime) }}
                </div>
              </div>
              <img
                src="@/assets/icons/delete.svg"
                class="chat-item-delete"
                @click="deleteChatItem"
              />
            </div>
          </li>
        </ul>
      </div>
      <img
        v-if="isLoading"
        class="list-loading"
        src="@/assets/icons/loading2.gif"
      />
    </div>
    <div class="operate">
      <button class="double" @click="doubleChat">找人聊天</button>
      <button class="group" @click="groupChat">发起群聊</button>
    </div>
  </div>
</template>
    
<script>
export default {
  name: "AsideBar",
  data() {
    return {
      userId: this.$store.state.userId,
      isLoading: false,
    };
  },
  computed: {
    chatList() {
      return this.$store.state.chatList;
    },
  },
  methods: {
    selectChatItem(event) {
      this.$router.push("/ChatView");
      this.$store.commit("setChatId", event.currentTarget.dataset.chatid);
    },
    timestampToTime(timestamp) {
      const date = new Date(timestamp);
      const Y = date.getFullYear() + "-";
      const M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      const D = date.getDate() + " ";
      const h = (date.getHours() < 10 ? "0" : "") + date.getHours() + ":";
      const m = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes() + ":";
      const s = (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
      return Y + M + D + h + m + s;
    },
    doubleChat() {
      this.$router.push("/FriendView");
    },
    groupChat() {},
  },
};
</script>
    
<style scoped>
.aside-bar {
  height: 100%;
  background-color: #8cc5ff;
  display: flex;
  flex-direction: column;
}

.aside-bar .el-text {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 5vh;
}

.aside-bar .logo {
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3.5vh;
  color: #303133;
}

.aside-bar .aside-body {
  position: relative;
  flex: 1;
  flex-grow: 1; /* 设置内容部分自动填充剩余空间 */
  overflow-y: auto;
}

.aside-bar .chat-history {
  overflow-y: auto;
  overflow-x: hidden;
}

.aside-bar .chat-history ul {
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  margin: 0;
}

.aside-bar .chat-history ul li {
  width: 92%;
  margin: 5px auto;
}

.aside-bar .chat-item {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 8px;
  background-color: #c1e6ff;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
}

.aside-bar .chat-item.selected {
  background: #b3d8ff;
  color: #303133;
  outline: #1ca9c6 solid 5px;
}

.aside-bar .chat-item:hover {
  cursor: pointer;
  background-color: #a3daff;
}

.aside-bar .chat-item:hover .chat-item-delete {
  display: block;
}

.aside-bar .chat-item-title {
  font-size: 20px;
  font-weight: bold;
  padding-left: 0;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 5px;
}

.aside-bar .chat-item-title span {
  font-size: 12px;
}

.aside-bar .second-line {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 0;
}

.aside-bar .chat-item-msg {
  align-self: center;
  font-size: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.aside-bar .chat-item-time {
  align-self: center;
  font-size: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.aside-bar .chat-item-delete {
  position: absolute;
  right: 5px;
  top: 5px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  opacity: 0.5;
  display: none;
}

.aside-bar .chat-item-delete:hover {
  opacity: 1;
}

.aside-bar .list-loading {
  width: 50px;
  height: 50px;
  margin: 0 auto;
}

.aside-bar .operate {
  width: 100%;
  height: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.aside-bar .operate button {
  width: 80%;
  height: 40px;
  margin: 10px;
  border-radius: 20px;
  border: none;
  background-color: #1d93ab;
  color: #fff;
  font-size: 16px;
}

.aside-bar .operate button:hover {
  cursor: pointer;
  background-color: #1ca9c6;
  box-shadow: 2px 2px 5px rgba(62, 62, 62, 0.2);
}

.aside-bar .operate button:active {
  cursor: default;
  background-color: #1d93ab;
}
</style>
  
<style scoped>
.leftfix {
  float: left;
}

.rightfix {
  float: right;
}

.clearfix::after {
  content: "";
  display: block;
  clear: both;
}

/* 滚动条整体样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.2);
  background-clip: padding-box;
  border: 2px solid transparent;
}

/* 滚动条滑块悬停样式 */
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

/* 滚动条轨道悬停样式 */
::-webkit-scrollbar-track:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

/* 滚动条滑块激活样式 */
::-webkit-scrollbar-thumb:active {
  background-color: rgba(0, 0, 0, 0.5);
}

/* 滚动条轨道激活样式 */
::-webkit-scrollbar-track:active {
  background-color: rgba(0, 0, 0, 0.1);
}

/* 滚动条角落 */
::-webkit-scrollbar-corner {
  background-color: transparent;
}

/* 滚动条的滑块的最小尺寸 */
::-webkit-scrollbar-thumb:horizontal {
  min-width: 20px;
}

::-webkit-scrollbar-thumb:vertical {
  min-height: 20px;
}

/* 滚动条的滑块的拖动状态 */
::-webkit-scrollbar-thumb:window-inactive {
  background-color: rgba(0, 0, 0, 0.4);
}

/* 滚动条的轨道的拖动状态 */
::-webkit-scrollbar-track:window-inactive {
  background-color: rgba(0, 0, 0, 0.1);
}

/* 滚动条的滑块的不透明度 */
::-webkit-scrollbar-thumb {
  -webkit-transition: opacity 0.3s ease-in-out;
}

::-webkit-scrollbar-thumb:hover {
  opacity: 0.8;
}

::-webkit-scrollbar-thumb:active {
  opacity: 0.6;
}
</style>