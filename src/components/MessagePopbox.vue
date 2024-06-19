<template>
  <div>
    <!-- 弹窗组件 -->
    <el-dialog title="填写信息" v-model="dialogVisible" width="30%">
      <!-- 弹窗内的表单 -->
      <el-form :model="form">
        <el-form-item label="用户名">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <!-- 可以添加更多表单项 -->
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
  data() {
    return {
      dialogVisible: false, // 控制弹窗显示隐藏
      form: {
        username: "",
        email: "",
        // 表单其他数据
      },
    };
  },
  methods: {
    openDialog() {
      this.dialogVisible = true; // 打开弹窗
    },
    submitForm() {
      // 处理表单提交逻辑
      console.log("Form submitted:", this.form);
      this.dialogVisible = false; // 提交后关闭弹窗
    },
  },
};
</script>