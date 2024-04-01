<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">用户注册</h2>
      <el-form
        ref="loginForm"
        :model="form"
        :rules="rules"
        class="login-form"
        label-width="100px"
      >
        <el-form-item label="用户名:" prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input
            v-model="form.password"
            placeholder="请输入密码"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码:" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            placeholder="请再次输入密码"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item label="昵称:" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>

        <el-form-item style="transform: translateX(-18px)">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="warning" @click="this.$router.push('/user/regist')"
            >注册</el-button
          >
          <el-button @click="this.$router.push('/')">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import router from "@/router/index";
import { InterfaceUrl } from "@/api";

interface FormType {
  username: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  phone: string;
  email: string;
}

const form: FormType = ref({
  username: "",
  password: "",
  confirmPassword: "",
  nickname: "",
  phone: "",
  email: "",
});

const rules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  confirmPassword: [
    {
      required: true,
      message: "请再次输入密码",
      trigger: "blur",
    },
    /* {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请再次输入密码"));
        } else if (value !== this.form.password) {
          callback(new Error("两次输入密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur", 
    },*/
  ],
  nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
  phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
  email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
};

const login = async () => {
  console.log(form.value);

  try {
    axios
      .post(InterfaceUrl + "/user/regist", null, {
        params: form,
      })
      .then((res) => {
        ElMessage.success("注册成功!");
      })
      .catch((error) => {
        console.error(error);
        ElMessage.error("请求失败，请联系管理员。");
      });
  } catch (error) {
    console.error(error);
    ElMessage.error("注册失败，请联系管理员");
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}

.login-card {
  width: 400px;
  padding: 20px;
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
}

.login-form {
  margin-top: 20px;
}
</style>
