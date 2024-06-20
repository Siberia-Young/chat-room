<template>
  <div class="friend-view">
    <div class="friend-list">
      <div class="friend-search">
        <div class="search-operate">
          <input
            v-model="searchWord"
            class="input"
            type="text"
            placeholder="请输入用户昵称、用户名或ID"
          />
          <button class="search" @click="searchUsers">搜 索</button>
        </div>
        <div class="result-show">
          <div class="result-box">
            <!-- <div
              class="no-result"
              v-if="searchResultList.length === 0 && searchWord !== ''"
            >
              本次搜索没有结果！
            </div> -->
            <div
              class="result-item"
              v-for="searchResult in searchResultList"
              :key="searchResult.userId"
            >
              <div class="result-item-avatar">
                <img :src="searchResult.avatarUrl" alt="avatar" />
              </div>
              <div class="result-item-info">
                <div class="result-item-nickname">
                  {{ $emojiHandler.emojiDecode(searchResult.nickname)
                  }}<span>({{ searchResult.userId }})</span>
                </div>
                <div class="result-item-status">{{ searchResult.status }}</div>
              </div>
              <div class="result-item-operate">
                <span v-html="relationShow(searchResult.relation)"></span>
                <button
                  v-if="searchResult.relation === 'friend'"
                  @click="chatWithTA(searchResult.userId)"
                >
                  找TA聊天
                </button>
                <button
                  v-if="
                    searchResult.relation === 'stranger' ||
                    searchResult.relation === 'my_rejected' ||
                    searchResult.relation === 'his_cancelled'
                  "
                  @click="addFriend(searchResult.userId)"
                >
                  加为好友
                </button>
                <button
                  v-if="searchResult.relation === 'my_pending'"
                  @click="acceptRequest(searchResult.userId)"
                >
                  通过申请
                </button>
                <button
                  v-if="searchResult.relation === 'his_pending'"
                  @click="modifyRequest(searchResult.userId)"
                >
                  修改申请
                </button>
                <button
                  v-if="
                    searchResult.relation === 'his_rejected' ||
                    searchResult.relation === 'my_cancelled'
                  "
                  @click="addFriend(searchResult.userId)"
                >
                  再次申请
                </button>
              </div>
            </div>
          </div>
        </div>
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
                {{ $emojiHandler.emojiDecode(friend.nickname)
                }}<span>({{ friend.userId }})</span>
              </div>
              <div class="friend-item-status">
                {{ friend.status === "online" ? "🟢在线" : "🔴离线" }}
              </div>
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
                {{ $emojiHandler.emojiDecode(request.user.nickname)
                }}<span>({{ request.user.userId }})</span>
              </div>
              <div class="request-item-message">
                留言：{{ $emojiHandler.emojiDecode(request.message) }}
              </div>
            </div>
            <div class="request-operate">
              <button
                v-if="request.status === 'pending'"
                @click="modifyRequest(request.toUserId)"
              >
                修改
              </button>
              <button
                v-if="request.status === 'pending'"
                @click="cancelRequest(request.toUserId)"
              >
                取消
              </button>
              <span v-else v-html="requestStatusShow(request.status)"></span>
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
                {{ $emojiHandler.emojiDecode(request.user.nickname)
                }}<span>({{ request.user.userId }})</span>
              </div>
              <div class="request-item-message">
                留言：{{ $emojiHandler.emojiDecode(request.message) }}
              </div>
            </div>
            <div class="request-operate">
              <button
                v-if="request.status === 'pending'"
                @click="acceptRequest(request.user.userId)"
              >
                同意
              </button>
              <button
                v-if="request.status === 'pending'"
                @click="rejectRequest(request.user.userId)"
              >
                拒绝
              </button>
              <span v-else v-html="requestStatusShow(request.status)"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mask" v-if="infoDisplay">
      <UserInfo class="user-info" :user="user">
        <el-button type="danger" @click="this.infoDisplay = false">
          关闭
        </el-button>
      </UserInfo>
    </div>
  </div>
  <MessagePopbox
    ref="MessagePopbox"
    @add-friend="sendAddFriend"
    @modify-request="sendModifyRequest"
  />
</template>

<script>
import UserInfo from "@/components/UserInfo";
import MessagePopbox from "@/components/MessagePopbox";
export default {
  name: "FriendView",
  components: {
    UserInfo,
    MessagePopbox,
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
      searchResults: [],
      infoDisplay: false,
      searchWord: "",
      requestText: "你好，我想加你为好友",
      throttleSearchUsers: this.throttle(this.searchUsers, 1000),
    };
  },
  computed: {
    websocket() {
      return this.$store.state.websocket;
    },
    friendList() {
      return this.$store.state.friendList;
    },
    friendRequestList() {
      return this.$store.state.friendRequestList;
    },
    searchResultList() {
      return this.searchResults.map((item) => {
        let relation = this.relationship(item.userId);
        return {
          ...item,
          relation,
        };
      });
    },
  },
  watch: {
    searchWord() {
      if (this.searchWord === "") {
        this.searchResults = [];
      }
    },
  },
  methods: {
    relationShow(relation) {
      if (relation === "own") return `<span style="color: blue;">本人</span>`;
      else if (relation === "friend")
        return `<span style="color: green;">好友</span>`;
      else if (relation === "stranger")
        return `<span style="color: grey;">陌生人</span>`;
      else if (relation === "my_pending")
        return `<span style="color: orange;">待我处理</span>`;
      else if (relation === "his_pending")
        return `<span style="color: orange;">待TA处理</span>`;
      else if (relation === "my_rejected")
        return `<span style="color: red;">已拒绝</span>`;
      else if (relation === "his_rejected")
        return `<span style="color: red;">被拒绝</span>`;
      else if (relation === "my_cancelled")
        return `<span style="color: pink;">已取消</span>`;
      else if (relation === "his_cancelled")
        return `<span style="color: pink;">被取消</span>`;
      else return "未知";
    },
    requestStatusShow(status) {
      if (status === "pending")
        return `<span style="color: orange;">待处理</span>`;
      else if (status === "accepted")
        return `<span style="color: green;">已接受</span>`;
      else if (status === "rejected")
        return `<span style="color: red;">已拒绝</span>`;
      else if (status === "cancelled")
        return `<span style="color: pink;">已取消</span>`;
      else return "未知";
    },
    relationship(userId) {
      if (userId === this.$store.state.userId) return "own";
      else {
        let s_request = this.friendRequestList.filter(
          (item) =>
            item.fromUserId === this.$store.state.userId &&
            item.toUserId === userId
        );
        let r_request = this.friendRequestList.filter(
          (item) =>
            item.fromUserId === userId &&
            item.toUserId === this.$store.state.userId
        );
        if (s_request.length === 0 && r_request.length === 0) return "stranger";
        else {
          let request = s_request.concat(r_request);
          request.sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          request = request[0];
          if (request.fromUserId === userId) {
            if (request.status === "pending") return "my_pending";
            else if (request.status === "accepted") return "friend";
            else if (request.status === "rejected") return "my_rejected";
            else if (request.status === "cancelled") return "his_cancelled";
            else return "unknown";
          } else {
            if (request.status === "pending") return "his_pending";
            else if (request.status === "accepted") return "friend";
            else if (request.status === "rejected") return "his_rejected";
            else if (request.status === "cancelled") return "my_cancelled";
            else return "unknown";
          }
        }
      }
    },
    showFriendInfo(userId) {
      this.user = this.$store.state.friendList.find(
        (item) => item.userId === userId
      );
      this.infoDisplay = true;
    },
    addFriend(userId) {
      this.$refs.MessagePopbox.openDialog(
        userId,
        this.$emojiHandler.emojiDecode(this.requestText),
        "addFriend"
      );
    },
    sendAddFriend(form) {
      let data = JSON.stringify({
        operate: "send_friend_request",
        token: this.$store.state.token,
        data: {
          userId: this.$store.state.userId,
          toUserId: form.userId,
          message: this.$emojiHandler.emojiEncode(
            form.requestText === "" ? this.requestText : form.requestText
          ),
        },
      });
      this.websocket.send(data);
    },
    chatWithTA(userId) {
      let chatId = this.$store.state.chatList.find(
        (item) => item.friendId === userId
      ).chatId;
      this.$store.commit("setChatId", chatId);
      this.$router.push("/ChatView");
    },
    acceptRequest(userId) {
      let data = JSON.stringify({
        operate: "accept_friend_request",
        token: this.$store.state.token,
        data: {
          userId: this.$store.state.userId,
          fromUserId: userId,
        },
      });
      this.websocket.send(data);
    },
    cancelRequest(userId) {
      this.sendCancelRequest(userId);
    },
    sendCancelRequest(userId) {
      let data = JSON.stringify({
        operate: "cancel_friend_request",
        token: this.$store.state.token,
        data: {
          userId: this.$store.state.userId,
          toUserId: userId,
        },
      });
      this.websocket.send(data);
    },
    modifyRequest(userId) {
      this.$refs.MessagePopbox.openDialog(
        userId,
        this.$emojiHandler.emojiDecode(
          this.friendRequestList.find(
            (item) =>
              item.fromUserId === this.$store.state.userId &&
              item.toUserId === userId &&
              item.status === "pending"
          ).message
        ),
        "modifyRequest"
      );
    },
    sendModifyRequest(form) {
      let data = JSON.stringify({
        operate: "modify_friend_request",
        token: this.$store.state.token,
        data: {
          userId: this.$store.state.userId,
          toUserId: form.userId,
          message: this.$emojiHandler.emojiEncode(
            form.requestText === "" ? this.requestText : form.requestText
          ),
        },
      });
      this.websocket.send(data);
    },
    rejectRequest(userId) {
      this.sendRejectRequest(userId);
    },
    sendRejectRequest(userId) {
      let data = JSON.stringify({
        operate: "reject_friend_request",
        token: this.$store.state.token,
        data: {
          userId: this.$store.state.userId,
          fromUserId: userId,
        },
      });
      this.websocket.send(data);
    },
    searchUsers() {
      if (this.searchWord === "") return;
      this.$request
        .get(
          `search_users/${this.$store.state.userId}?keyword=${this.searchWord}`
        )
        .then((res) => {
          this.searchResults = res.data.data;
        })
        .catch((err) => {
          console.error(err);
        });
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
  width: 75%;
  height: 10%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.05);
}

.friend-view .friend-search .search-operate {
  width: 100%;
  height: 100%;
  display: flex;
  background-color: #e9e9eb;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.friend-view .friend-search .input {
  width: 75%;
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
  width: 15%;
  height: 60%;
  border-radius: 8px;
  border: none;
  outline: none;
  background-color: #53a8ff;
  color: #fff;
  font-size: 3vh;
  margin-left: 2%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.friend-view .friend-search .search:hover {
  background-color: #3a8cff;
  cursor: pointer;
}

.friend-view .friend-search .search:active {
  background-color: #53a8ff;
  cursor: default;
}

.friend-view .friend-search .result-show {
  position: relative;
  width: 100%;
}

.friend-view .friend-search .result-box {
  width: 100%;
  max-height: 50vh;
  position: absolute;
  display: flex;
  flex-direction: column;
  background-color: #e9e9eb;
  overflow-y: auto;
  overflow-x: hidden;
}

.friend-view .friend-search .result-item {
  width: 95%;
  height: 10vh;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 2px solid #f0f0f0;
  cursor: default;
}

.friend-view .friend-search .result-item:first-child {
  border-top: 2px solid #f0f0f0;
}

.friend-view .friend-search .result-item:hover {
  background-color: #f0f0f0;
}

.friend-view .friend-search .result-item-avatar {
  height: 100%;
  aspect-ratio: 1;
  margin-right: 2%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.friend-view .friend-search .result-item-avatar img {
  width: 80%;
  height: 80%;
  border-radius: 50%;
}

.friend-view .friend-search .result-item-info {
  flex-grow: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.friend-view .friend-search .result-item-operate {
  height: 100%;
  aspect-ratio: 2;
  font-size: 1.5vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.friend-view .friend-search .result-item-nickname {
  font-size: 3vh;
}

.friend-view .friend-search .result-item-nickname span {
  font-size: 2vh;
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
  overflow-x: hidden;
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