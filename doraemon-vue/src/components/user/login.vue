<template>
  <div style="height:90vh;width:100%;">
    <div class="login-container">
      <div class="div-description">
        <img alt="" src="../../assets/regist.gif">
      </div>
      <div :style="{ transform: isChange ? 'rotateY(180deg)' : '' }" class="div-form">
        <el-form ref="formRef" :class="{ disappear: isChange }" :model="loginForm" :rules="loginRules" class="form-login">
          <h1>登录</h1>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名、手机号或邮箱"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginForm.password" placeholder="请输入密码" style="margin-left: 15px" type="password"></el-input>
          </el-form-item>

          <el-button style="margin-top: 50px" @click="login">登录</el-button>
          <div class="control">
            <span>没有帐号？<a href="#" @click="change">注册</a></span>
          </div>
        </el-form>

        <el-form ref="formRef" :class="{ disappear: !isChange }" :model="registForm" :rules="registRules"
                 action="" class="form-register">
          <h1>注册</h1>
          <el-form-item label="用户名:" prop="username">
            <el-input
                v-model="registForm.username"
                placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码:" prop="password">
            <el-input
                v-model="registForm.password"
                placeholder="请输入密码"
                type="password"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码:" prop="confirmPassword">
            <el-input
                v-model="registForm.confirmPassword"
                placeholder="请再次输入密码"
                type="password"
            ></el-input>
          </el-form-item>
          <el-form-item label="昵称:" prop="nickname">
            <el-input v-model="registForm.nickname" placeholder="请输入昵称"></el-input>
          </el-form-item>
          <el-form-item label="邮箱:" prop="email">
            <el-input v-model="registForm.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item class="code-item" label="验证码:" prop="code">
            <el-input
                v-model="registForm.code"
                placeholder="请输入验证码"
            >
              <template #append>
                <el-text @click="postCode">
                  获取验证码
                </el-text>
              </template>
            </el-input>
          </el-form-item>
          <el-button @click="regist">注册</el-button>
          <div class="control">
            <span>已有帐号？<a href="#" @click="change">登录</a></span>
          </div>
        </el-form>
      </div>
      <div class="div-description">
        <img alt="" src="../../assets/login.gif">
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import axios from "axios";
import {ElMessage, FormInstance} from "element-plus";
import {useRouter} from "vue-router";
import {InterfaceUrl} from "@/api";
import CryptoJS from "crypto-js";
import {useStore} from "vuex";

const form = ref<FormInstance>();

const store = useStore();

const router = useRouter();

const isChange = ref(false);

const change = () => {
  isChange.value = !isChange.value;
}

const loginForm = ref({
  username: "",
  password: "",
});

const loginRules = {
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
  password: [{required: true, message: "请输入密码", trigger: "blur"}],
};

const login = () => {
// 密码加密 (前端SHA256 后端bcrypt)
  const hash = CryptoJS.SHA256(loginForm.value.password).toString();
  loginForm.value.password = hash;
  axios
      .post(InterfaceUrl + "/user/login", null, {
        params: loginForm,
      })
      .then((res) => {
        if (res.data.state === 1) {
          ElMessage.error("用户名或密码错误");
        } else {
          ElMessage.success("登录成功!");
          store.dispatch("setUserInfoFromAxios", res.data.data);
          // 保存token到localStorage
          localStorage.setItem("token", res.data.token);
          router.push("/");
        }
      })
      .catch((error) => {
        console.error(error);
        ElMessage.error("请求失败，请联系管理员。");
      });
};

const postCode = async () => {
  await axios
      .post(InterfaceUrl + "/user/emailCode", null, {
        params: {
          email: registForm.value.email,
        },
      })
      .then((res) => {
        ElMessage.success("验证码发送成功!");
      })
      .catch((error) => {
        console.error(error);
        ElMessage.error("验证码发送失败，请检查邮箱格式是否正确。");
      });
};

const registForm = ref({
  username: "",
  password: "",
  confirmPassword: "",
  nickname: "",
  email: "",
  code: "",
});

const registRules = {
  username: [
    {required: true, message: "请输入用户名", trigger: "blur"},
    {
      pattern: /^[a-zA-Z0-9_-]{4,16}$/,
      message: "用户名长度为4-16位且不能包含特殊字符",
      trigger: "blur",
    },
  ],
  password: [
    {required: true, message: "请输入密码", trigger: "blur"},
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
    {required: true, message: "请输入昵称", trigger: "blur"},
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
    {pattern: /^1\d{10}$/, message: "手机号格式不正确", trigger: "blur"},
  ],
  email: [
    {
      required: true,
      type: "email",
      message: "请输入正确的邮箱",
      trigger: "blur",
    },
  ],
  code: [{required: true, message: "请输入邮箱验证码", trigger: "blur"}],
};


const regist = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      // 密码加密
      const hash = CryptoJS.SHA256(registForm.value.password).toString();
      registForm.value.password = hash;

      try {
        axios
            .post(InterfaceUrl + "/user/regist", null, {
              params: registForm,
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
  width: 800px;
  position: relative;
  display: flex;
  perspective: 1200px;
  transform-style: preserve-3d;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.div-description {
  width: 400px;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #fff;
  border-radius: 5px 0 0 5px;
  transform: translateZ(-1px);
}

.div-description:nth-last-child(1) {
  border-radius: 0 5px 5px 0;
}

.div-description img {
  width: 75%;
  margin-bottom: 15px;
}

.div-description span {
  font-size: 12px;
  color: #555;
}

.div-form {
  width: 400px;
  height: 500px;
  position: absolute;
  left: 0;
  transition: 0.8s;
  transform-origin: right;
}

:deep(.el-input__wrapper) {
  width: 220px;
  margin-right: 30px;
}

.div-form .form-login {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-image: linear-gradient(to right, #48c6ef 0%, #6f86d6 200%);
  border-radius: 5px 0 0 5px;
}

.div-form .form-register {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-image: linear-gradient(to right, #48c6ef -100%, #6f86d6 100%);
  border-radius: 0 5px 5px 0;
  transform: rotateY(180deg);

  .el-form-item {
    margin: 10px;
  }

  :deep(.el-form-item__label) {
    width: 85px;
    text-align: center;
    display: block;
    padding-right: 0;
    transform: translateX(5px);
  }

  .code-item {
    :deep(.el-input__wrapper) {
      width: 170px;
      margin-right: 0;
    }
  }

  .el-text {
    width: 40px;
    transform: translateX(-15px);

    &:hover {
      color: rgb(102, 180, 253);
      cursor: pointer;
    }
  }

  :deep(.el-input-group__append) {
    transform: translateX(-30px);
  }
}

.div-form form.disappear {
  display: none;
}

.div-form h1 {
  margin: 20px 0 20px 0;
  color: #fff;
  letter-spacing: 5px;
}

.div-form .el-button {
  width: 70%;
  height: 32px;
  margin: 20px 10px 10px 10px;
  font-size: 14px;
  color: #fff;
  border: none;
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.2);
  transition: 0.4s;

  &:hover {
    background-color: #fff;
    color: #000;
  }
}

.div-form .control {
  color: #fff;
  margin: 5px;
  font-size: 13px;
}

.div-form .control a {
  color: #fff;
  margin: 0 5px;
  letter-spacing: 1px;
}

.div-form .control a:hover {
  color: #000;
}
</style>
