<template>
  <div class="friend-view">
    <div class="friend-list">
      <div class="friend-search">
        <input
          class="input"
          type="text"
          placeholder="请输入用户昵称、用户名或ID"
        />
        <button class="search">搜索</button>
      </div>
      <div class="friend-show">
        <div class="friend-list-title">好友列表</div>
        <div class="friend-box">
          <div
            class="friend-item"
            v-for="friend in friendList"
            :key="friend.userId"
          >
            <div class="friend-item-avatar">
              <img :src="friend.avatarUrl" alt="avatar" />
            </div>
            <div class="friend-item-info">
              <div
                class="friend-item-nickname"
                @click="showFriendInfo(friend.userId)"
              >
                {{ friend.nickname }}<span>({{ friend.userId }})</span>
              </div>
              <div class="mask" v-if="infoDisplay">
                <UserInfo class="user-info" :user="user">
                  <el-button type="danger" @click="this.infoDisplay = false">
                    关闭
                  </el-button>
                </UserInfo>
              </div>
              <div class="friend-item-status">{{ friend.status }}</div>
            </div>
            <div class="friend-item-operate">
              <button @click="chatWithTA(friend.userId)">找TA聊天</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="friend-request">
      <div class="my-request">
        <div class="request-list-title">我的好友请求</div>
        <div class="request-box">
          <div
            class="request-item"
            v-for="request in friendRequestList.filter(
              (item) => item.fromUserId === this.$store.state.userId
            )"
            :key="request.requestId"
          >
            <div class="request-item-avatar">
              <img :src="request.user.avatarUrl" alt="avatar" />
            </div>
            <div class="request-item-info">
              <div class="request-item-nickname">
                {{ request.user.nickname
                }}<span>({{ request.user.userId }})</span>
              </div>
              <div class="request-item-message">
                留言：{{ request.message }}
              </div>
            </div>
            <div class="request-operate">
              {{ request.status === "pending" ? "待处理" : "已处理" }}
              {{ request.status }}
            </div>
          </div>
        </div>
      </div>
      <div class="his-request">
        <div class="request-list-title">TA的好友请求</div>
        <div class="request-box">
          <div
            class="request-item"
            v-for="request in friendRequestList.filter(
              (item) => item.toUserId === this.$store.state.userId
            )"
            :key="request.requestId"
          >
            <div class="request-item-avatar">
              <img :src="request.user.avatarUrl" alt="avatar" />
            </div>
            <div class="request-item-info">
              <div class="request-item-nickname">
                {{ request.user.nickname
                }}<span>({{ request.user.userId }})</span>
              </div>
              <div class="request-item-message">
                留言：{{ request.message }}
              </div>
            </div>
            <div class="request-operate">
              {{ request.status === "pending" ? "待处理" : "已处理" }}
              {{ request.status }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserInfo from "@/components/UserInfo.vue";
export default {
  name: "FriendView",
  components: {
    UserInfo,
  },
  data() {
    return {
      userId: this.$store.state.userId,
      user: {
        userId: "",
        username: "",
        nickname: "",
        avatarUrl: "",
        signature: "",
        status: "",
        createAt: "",
      },
      infoDisplay: false,
    };
  },
  computed: {
    friendList() {
      return this.$store.state.friendList;
    },
    friendRequestList() {
      return this.$store.state.friendRequestList;
    },
  },
  methods: {
    showFriendInfo(userId) {
      this.user = this.$store.state.friendList.find(
        (item) => item.userId === userId
      );
      this.infoDisplay = true;
    },
    chatWithTA(userId) {
      let chatId = this.$store.state.chatList.find(
        (item) => item.friendId === userId
      ).chatId;
      this.$store.commit("setChatId", chatId);
      this.$router.push("/ChatView");
    },
  },
};
</script>

<style scoped>
.friend-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.friend-view .friend-list {
  width: calc(70% - 2px);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-right: 2px solid #f0f0f0;
}

.friend-view .friend-search {
  width: 100%;
  height: 10%;
  background-color: #f0f0f0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.friend-view .friend-search .input {
  width: 50%;
  height: 60%;
  border-radius: 8px;
  border: none;
  outline: none;
  padding: 0 1vh;
  font-size: 2.5vh;
}

.friend-view .friend-search .input:focus {
  outline: 2px solid #8cc5ff;
}

.friend-view .friend-search .search {
  width: 10%;
  height: 60%;
  border-radius: 8px;
  border: none;
  outline: none;
  background-color: #53a8ff;
  color: #fff;
  font-size: 3vh;
  margin-left: 2%;
}

.friend-view .friend-show {
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
}

.friend-view .friend-list-title {
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 4vh;
}

.friend-view .friend-box {
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.friend-view .friend-item {
  width: 95%;
  height: 10vh;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 2px solid #f0f0f0;
  cursor: default;
}

.friend-view .friend-item:first-child {
  border-top: 2px solid #f0f0f0;
}

.friend-view .friend-item:hover {
  background-color: #f0f0f0;
}

.friend-view .friend-item-avatar {
  height: 100%;
  aspect-ratio: 1;
  margin-right: 2%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.friend-view .friend-item-avatar img {
  width: 80%;
  height: 80%;
  border-radius: 50%;
}

.friend-view .friend-item-info {
  flex-grow: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.friend-view .friend-item-operate {
  height: 100%;
  aspect-ratio: 2;
  font-size: 1.5vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.friend-view .friend-item-nickname {
  font-size: 3vh;
}

.friend-view .friend-item-nickname:hover {
  cursor: pointer;
  color: #53a8ff;
}

.friend-view .friend-item-nickname span {
  font-size: 2vh;
}

.friend-view .mask {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.5);
}

.friend-view .user-info {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 50%;
  width: 50%;
  z-index: 2;
}

.friend-view .user-info .el-button {
  margin-bottom: 5vh;
}

.friend-view .friend-item-status {
  font-size: 2vh;
}

.friend-view .friend-request {
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.friend-view .my-request,
.friend-view .his-request {
  width: 100%;
  height: calc(50% - 1px);
  display: flex;
  flex-direction: column;
}

.friend-view .my-request {
  border-bottom: 2px solid #f0f0f0;
}

.friend-view .request-list-title {
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5vh;
}

.friend-view .request-box {
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
}

.friend-view .request-item {
  height: 7vh;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 2px solid #f0f0f0;
  cursor: default;
}

.friend-view .request-item:first-child {
  border-top: 2px solid #f0f0f0;
}

.friend-view .request-item:hover {
  background-color: #f0f0f0;
}

.friend-view .request-item-avatar {
  height: 100%;
  aspect-ratio: 1;
  margin-right: 2%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.friend-view .request-item-avatar img {
  width: 80%;
  height: 80%;
  border-radius: 50%;
}

.friend-view .request-item-info {
  flex-grow: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.friend-view .request-item-nickname {
  font-size: 2vh;
}

.friend-view .request-item-nickname span {
  font-size: 1.2vh;
}

.friend-view .request-item-message {
  font-size: 1.5vh;
  text-align: left;
}

.friend-view .request-operate {
  height: 100%;
  aspect-ratio: 1;
  font-size: 1.2vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>