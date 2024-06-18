<template>
  <div class="user-info">
    <div class="user-info-avatar">
      <img :src="user.avatarUrl" alt="avatar" />
    </div>
    <div class="user-info-info">
      <div class="user-info-nickname">
        {{ user.nickname }}<span>({{ user.userId }})</span>
      </div>
      <div class="user-info-signature">个性签名：{{ user.signature }}</div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "UserInfo",
  data() {
    return {
      userId: this.$store.state.userId,
    };
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.user-info {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #66b1ff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  border-radius: 2vh;
}

.user-info-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
}

.user-info-avatar img {
  width: 100%;
  height: 100%;
}

.user-info-info {
  margin-left: 10px;
}

.user-info-nickname {
  font-size: 16px;
}

.user-info-nickname span {
  font-size: 12px;
  color: #909399;
}

.user-info-signature {
  font-size: 14px;
  color: #606266;
}

.user-info-signature span {
  font-size: 12px;
  color: #909399;
}
</style>