<template>
  <div class="friend-view">
    <div class="friend-list"></div>
    <div class="friend-request"></div>
  </div>
</template>

<script>
export default {
  name: "FriendView",
  data() {
    return {
      userId: this.$store.state.userId,
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
  width: 70%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.friend-view .friend-request {
  width: 30%;
  height: 100%;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>