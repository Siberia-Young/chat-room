<template>
  <div>
    <!-- 弹窗组件 -->
    <el-dialog title="好友申请备注" v-model="dialogVisible" width="30%">
      <!-- 弹窗内的表单 -->
      <el-form :model="form">
        <el-form-item label="留言">
          <el-input v-model="form.requestText"></el-input>
        </el-form-item>
      </el-form>
      <!-- 弹窗底部的操作按钮，使用 v-slot 替代 slot -->
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
  
<script>
export default {
  name: "MessagePopbox",
  data() {
    return {
      dialogVisible: false, // 控制弹窗显示隐藏
      operate: "", // 弹窗类型
      form: {
        userId: "",
        requestText: "",
      },
    };
  },
  methods: {
    openDialog(userId, requestText, operate) {
      this.dialogVisible = true; // 打开弹窗
      this.operate = operate; // 设置弹窗类型
      this.form.userId = userId; // 设置表单的 userId
      this.form.requestText = requestText; // 设置表单的 requestText
    },
    submitForm() {
      this.dialogVisible = false; // 提交后关闭弹窗
      if (this.operate === "addFriend") this.$emit("add-friend", this.form);
      else if (this.operate === "modifyRequest") this.$emit("modify-request", this.form);
    },
  },
};
</script>