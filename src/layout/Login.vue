<template>
  <div class="login">
    <div class="box">
      <el-text class="title">登录</el-text>
      <div class="space">欢迎使用IECS！</div>
      <div class="username">
        <el-text>用户名</el-text>
        <el-input v-model="username" placeholder="请输入用户名"></el-input>
      </div>
      <div class="password">
        <el-text>密码</el-text>
        <el-input
          v-model="password"
          type="password"
          placeholder="请输入密码"
        ></el-input>
      </div>
      <div class="btn">
        <el-button round size="large" type="primary" @click="login"
          >登录</el-button
        >
      </div>
    </div>
  </div>
</template>
    
<script>
export default {
  name: "VueLogin",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    login() {
      this.$request
        .post("login", {
          username: this.username,
          password: this.password,
        })
        .then((res) => {
          if (res.status === 200) {
            this.$message.success("登录成功");
            sessionStorage.setItem("token", res.data.token);
            sessionStorage.setItem("userId", res.data.user.userId);
            this.$store.commit("setToken", res.data.token);
            this.$store.commit("setUserId", res.data.user.userId);
            this.$store.commit("setChatId", res.data.chatId);
            this.$store.commit("setUser", res.data.user);
            this.$router.push("/");
          } else {
            this.$message.error("登录失败");
          }
        });
    },
  },
};
</script>
    
<style scoped>
.login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login .box {
  height: 60%;
  aspect-ratio: 5/6;
  background-image: linear-gradient(0deg, #a0cfff 0%, #d9ecff 100%);
  padding: 3vh;
  display: flex;
  flex-direction: column;
  border-radius: 3vh;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.login .title {
  height: 25%;
  font-size: 6vh;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login .space {
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  font-size: 3vh;
  color: #909399;
}

.login .username,
.login .password {
  height: 12%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 5vh;
}

.login .username .el-text,
.login .password .el-text {
  width: 25%;
  height: 80%;
  font-size: 3vh;
}

.login .username .el-input,
.login .password .el-input {
  width: 75%;
  height: 80%;
  font-size: 3vh;
}

.login .btn {
  height: 21%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login .btn .el-button {
  width: 40%;
  box-shadow: 0 0 50px rgba(255, 255, 255, 0.5);
}
</style>