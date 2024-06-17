<template>
  <div class="container">
    <el-aside class="aside">
      <AsideBar />
    </el-aside>
    <el-container class="content">
      <router-view />
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
  