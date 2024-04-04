<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">用户注册</h2>
      <el-form
        ref="formRef"
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
        <el-form-item label="邮箱验证码:" prop="code">
          <el-input
            v-model="form.code"
            placeholder="请输入邮箱验证码"
          ></el-input>
          <el-button type="text" style="margin-left: 10px" @click="postCode">
            获取验证码
          </el-button>
        </el-form-item>
        <el-form-item style="transform: translateX(-18px)">
          <el-button type="primary" @click="regist(formRef)">注册</el-button>
          <el-button type="warning" @click="this.$router.push('/login')"
            >登录</el-button
          >
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
import CryptoJS from "crypto-js";
import type { FormInstance } from "element-plus";

const formRef = ref<FormInstance>();

interface FormType {
  username: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  phone: string;
  email: string;
  code: string;
}

const form: FormType = ref({
  username: "",
  password: "",
  confirmPassword: "",
  nickname: "",
  phone: "",
  email: "",
  code: "",
});

const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9_-]{4,16}$/,
      message: "用户名长度为4-16位且不能包含特殊字符",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      min: 6,
      max: 16,
      message: "密码长度为6-16位",
      trigger: "blur",
    },
  ],
  confirmPassword: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请再次输入密码"));
        } else if (value !== form.value.password) {
          callback(new Error("两次输入密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  nickname: [
    { required: true, message: "请输入昵称", trigger: "blur" },
    {
      min: 2,
      max: 10,
      message: "昵称长度为2-10位",
      trigger: "blur",
    },
  ],
  phone: [
    {
      required: true,
      message: "请输入手机号",
      trigger: "blur",
    },
    { pattern: /^1\d{10}$/, message: "手机号格式不正确", trigger: "blur" },
  ],
  email: [
    {
      required: true,
      type: "email",
      message: "请输入正确的邮箱",
      trigger: "blur",
    },
  ],
  code: [{ required: true, message: "请输入邮箱验证码", trigger: "blur" }],
};

const postCode = async () => {
  console.log(form.value);
  await axios
    .post(InterfaceUrl + "/user/emailCode", null, {
      params: {
        email: form.value.email,
      },
    })
    .then((res) => {
      console.log(res);
      ElMessage.success("验证码发送成功!");
    })
    .catch((error) => {
      console.error(error);
      ElMessage.error("验证码发送失败，请检查邮箱格式是否正确。");
    });
};

const regist = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      // 密码加密
      const hash = CryptoJS.SHA256(form.value.password).toString();
      form.value.password = hash;

      try {
        axios
          .post(InterfaceUrl + "/user/regist", null, {
            params: form,
          })
          .then((res) => {
            ElMessage.success("注册成功!");
            router.push("/login");
          })
          .catch((error) => {
            console.error(error);
            ElMessage.error("请求失败，请联系管理员。");
          });
      } catch (error) {
        console.error(error);
        ElMessage.error("请求失败，请联系管理员。");
      }
    } else {
      ElMessage.error("请检查输入是否正确!");
    }
  });
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
