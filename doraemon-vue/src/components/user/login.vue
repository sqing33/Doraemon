<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">用户登录</h2>
      <el-form
        ref="loginForm"
        :model="form"
        :rules="rules"
        class="login-form"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名、手机号或邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            placeholder="请输入密码"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item style="transform: translateX(-18px)">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="warning" @click="this.$router.push('/regist')"
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
import { useRouter } from "vue-router";
import { InterfaceUrl } from "@/api";
import CryptoJS from "crypto-js";

const router = useRouter();

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
  phone: "",
  email: "",
  password: "",
});

const rules = {
  username: [
    {
      required: true,
      validator: (rule, value, callback) => {
        const usernameRegex = /^[a-zA-Z0-9_]{1,16}$/;
        const phoneRegex = /^\d{11}$/;
        const emailRegex = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if (
          value &&
          (usernameRegex.test(value) ||
            phoneRegex.test(value) ||
            emailRegex.test(value))
        ) {
          callback();
        } else {
          callback(new Error("请输入正确的用户名、手机号或邮箱"));
        }
      },
      trigger: "blur",
    },
  ],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

const login = async () => {
  // 密码加密 (前端SHA256 后端bcrypt)
  const hash = await CryptoJS.SHA256(form.value.password).toString();
  form.value.password = hash;

  try {
    axios
      .post(InterfaceUrl + "/user/login", null, {
        params: form,
      })
      .then((res) => {
        ElMessage.success("登录成功!");
        router.push("/");
        // 保存token到localStorage
        localStorage.setItem("token", res.data.token);
      })
      .catch((error) => {
        console.error(error);
        ElMessage.error("请求失败，请联系管理员。");
      });
  } catch (error) {
    console.error(error);
    ElMessage.error("请求失败，请联系管理员。");
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
