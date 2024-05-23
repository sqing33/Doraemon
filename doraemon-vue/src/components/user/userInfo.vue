<template>
  <el-row :gutter="10">
    <el-col :span="24" class="head"></el-col>
    <el-col :sm="4" class="content hidden-sm-and-down"></el-col>
    <el-col :sm="4" :xs="24" class="content">
      <el-menu class="content" default-active="我的资料" @select="menuSelect">
        <h4
          style="
            height: 60px;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          个人信息
        </h4>
        <el-menu-item index="我的资料">我的资料</el-menu-item>
        <el-menu-item index="账号设置">账号设置</el-menu-item>
        <el-menu-item index="我的发帖">我的发帖</el-menu-item>
        <el-menu-item index="我的收藏">我的收藏</el-menu-item>
        <el-menu-item index="我的反馈">我的反馈</el-menu-item>
      </el-menu>
    </el-col>
    <el-col
      :sm="12"
      :xs="24"
      class="content"
      style="
        background-image: linear-gradient(
          120deg,
          rgba(161, 196, 253, 0.8) 0%,
          rgba(194, 233, 251, 0.8) 100%
        );
      "
    >
      <div
        v-if="menuIndex == '我的资料'"
        class="contentInfo"
        style="display: flex; align-items: center"
      >
        <div style="display: flex; align-items: center">
          <el-upload
            :action="InterfaceUrl + '/admin/upload'"
            :on-success="uploadSuccess"
            :show-file-list="false"
            class="avatar-uploader"
            style="padding: 0"
          >
            <img
              v-if="newUserInfo.avatarUrl"
              :src="newUserInfo.avatarUrl"
              alt=""
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>

          <div style="margin-left: 20px">
            <div>
              <span>昵称:</span>
              {{ newUserInfo.nickname }}

              <el-button
                style="
                  position: absolute;
                  top: 40px;
                  right: 40px;
                  font-size: 16px;
                  padding: 5px 10px;
                "
                @click="doUpdateUserInfo"
              >
                修改资料
              </el-button>
            </div>

            <div style="margin-top: 10px">
              <span>用户名:</span> {{ newUserInfo.username }}
            </div>

            <div style="margin-top: 10px">
              <span>性别:</span>
              {{ newUserInfo.gender ? userInfo.gender : "无" }}
            </div>

            <div style="margin-top: 10px">
              <span>生日:</span>
              {{
                newUserInfo.birthday
                  ? dateFunction(newUserInfo.birthday, "date")
                  : "无"
              }}
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="menuIndex == '账号设置'"
        class="contentInfo"
        style="padding-left: 10vw"
      >
        <div>
          <span>手机号:</span>
          {{ newUserInfo.phone }}
          <el-button
            style="position: absolute; right: 150px"
            type="text"
            @click="doChangeAccount('手机号')"
          >
            <span>修改手机号</span>
          </el-button>
        </div>
        <div>
          <span>邮箱:</span>
          {{ newUserInfo.email }}
          <el-button
            style="position: absolute; right: 150px"
            type="text"
            @click="doChangeAccount('邮箱')"
          >
            <span>修改邮箱</span>
          </el-button>
        </div>
        <div>
          <span>密码:</span>
          ******
          <el-button
            style="position: absolute; right: 150px"
            type="text"
            @click="doChangeAccount('密码')"
          >
            <span>修改密码</span>
          </el-button>
        </div>
      </div>

      <div v-if="menuIndex == '我的收藏'" class="contentInfo">
        <el-scrollbar height="68vh" style="width: 100%">
          <div
            v-for="collection in collectionList"
            :key="collection.id"
            style="
              display: flex;
              height: 120px;
              margin: 10px;
              padding: 10px;
              background: rgba(255, 255, 255, 0.5);
            "
            @click="doGoToBlogPage(collection.blog_id)"
          >
            <div style="width: 150px; text-align: center">
              <img
                :src="collection.coverUrl"
                alt=""
                style="max-width: 150px; height: 100px"
              />
            </div>

            <div style="margin-left: 20px; position: relative; flex: 1">
              <h4 style="">{{ collection.title }}</h4>
              <h6 style="position: absolute; right: 0; bottom: 0">
                收藏于&nbsp{{
                  dateFunction(collection.collection_time, "date")
                }}
              </h6>
            </div>
          </div>
        </el-scrollbar>
      </div>

      <div v-if="menuIndex == '我的反馈'" class="contentInfo">
        <el-scrollbar height="68vh" style="width: 100%">
          <div
            v-for="(item, index) in feedbackList"
            :key="index"
            style="
              display: flex;
              flex-direction: column;
              min-height: 120px;
              margin: 10px;
              padding: 10px;
              background: rgba(255, 255, 255, 0.5);
            "
          >
            <div style="display: flex; position: relative">
              <div>{{ index + 1 }}.</div>
              <div>{{ dateFunction(item.create_time, "date") }} 反馈</div>
              <el-button
                link
                type="danger"
                style="position: absolute; top: 5px; right: 20px"
                @click="doDeleteFeedback(item.id)"
              >
                删除
              </el-button>
            </div>
            <div v-html="item.content"></div>
          </div>
        </el-scrollbar>
      </div>
    </el-col>
    <el-col :sm="4" class="content hidden-sm-and-down"></el-col>
  </el-row>

  <el-dialog v-model="updateUserInfoDialogVisible" title="修改资料" width="500">
    <ElementForm
      v-model="form"
      style="width: 50%; margin: 0 auto"
      v-bind="formConfig"
    >
      <template #footer>
        <div style="display: flex; justify-content: center">
          <el-button
            size="large"
            style="width: 80px"
            type="primary"
            @click="submitNewUserInfo"
          >
            确定
          </el-button>

          <el-button
            size="large"
            style="width: 80px; margin-left: 5vw"
            @click="updateUserInfoDialogVisible = false"
            >取消</el-button
          >
        </div>
      </template>
    </ElementForm>
  </el-dialog>

  <el-dialog
    v-model="changeAccountDialogVisible"
    :title="accountSetting.title"
    width="500"
  >
    <div style="display: flex">
      <el-text style="width: 120px">新的{{ accountSetting.label }}：</el-text>
      <el-input
        v-model="accountSetting.value"
        :placeholder="accountSetting.placeholder"
      ></el-input>
    </div>

    <div style="display: flex; justify-content: center; margin-top: 20px">
      <el-button
        size="large"
        style="width: 80px"
        type="primary"
        @click="changeAccountSubmit(accountSetting.label)"
      >
        确定
      </el-button>
      <el-button
        size="large"
        style="width: 80px; margin-left: 5vw"
        @click="changeAccountDialogVisible = false"
      >
        取消
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { Plus } from "@element-plus/icons-vue";
import dateFunction from "@/utils/Date";
import { InterfaceUrl } from "@/api";
import _axios from "@/api";
import { ElMessage, ElMessageBox } from "element-plus";
import ElementForm from "@/utils/ElementForm.vue";
import CryptoJS from "crypto-js";
import { useRouter } from "vue-router";

const router = useRouter();

const menuIndex = ref("我的资料");

const menuSelect = (index: string) => {
  if (index === "我的发帖") {
    router.push("/myBlogs");
  } else if (index === "我的收藏") {
    getCollectionList();
  } else if (index === "我的反馈") {
    getFeedbackList();
  } else {
    menuIndex.value = index;
  }
};

onMounted(() => {});

const store = useStore();

const userInfo = store.getters.getUserInfo;

const newUserInfo = ref(userInfo);

const getNewUserInfo = () => {
  _axios.post("/user/getUserInfo", { id: userInfo.id }).then((res) => {
    newUserInfo.value = res.data;
    store.dispatch("setUserInfoFromAxios", res.data);
  });
};

const avatarUrl = ref();

const uploadSuccess = (res) => {
  avatarUrl.value = res.data.url;
  _axios
    .post("/user/updateAvatar", {
      id: userInfo.id,
      avatarUrl: avatarUrl.value,
    })
    .then((res) => {
      getNewUserInfo();
      ElMessage({
        type: "success",
        message: "修改头像成功!",
      });
    });
};

const updateUserInfoDialogVisible = ref(false);

const doUpdateUserInfo = () => {
  updateUserInfoDialogVisible.value = true;
};

const formItems = reactive([
  {
    label: "昵称",
    type: "input",
    placeholder: "请输入昵称",
    prop: "nickname",
    style: ["width: 45vw"],
  },
  {
    label: "性别",
    type: "select",
    placeholder: "请选择性别",
    prop: "gender",
    style: ["width: 45vw"],
    options: [
      { label: "男", value: "男" },
      { label: "女", value: "女" },
      { label: "无", value: "无" },
    ],
  },
  {
    label: "生日",
    type: "date",
    placeholder: "生日",
    prop: "birthday",
    style: ["width: 45vw"],
  },
]);

const formConfig = {
  formItems,
  labelWidth: "75px",
};

const formValues: any = {};

formConfig.formItems.map((item) => {
  formValues[item.prop] = "";
});

const form = reactive(userInfo);

const submitNewUserInfo = () => {
  updateUserInfo();
  updateUserInfoDialogVisible.value = false;
};

const updateUserInfo = () => {
  _axios.post("/user/updateUserInfo", form).then((res) => {
    getNewUserInfo();
    ElMessage({
      type: "success",
      message: "资料修改成功!",
    });
  });
};

const changeAccountDialogVisible = ref(false);

const accountSetting = reactive({
  title: "",
  label: "",
  value: "",
  placeholder: "",
});

const account = reactive({
  id: userInfo.id,
  phone: userInfo.phone,
  email: userInfo.email,
  password: "",
});

const doChangeAccount = (type: string) => {
  if (type === "手机号") {
    accountSetting.title = "修改手机号";
    accountSetting.label = "手机号";
    accountSetting.value = account.phone;
    accountSetting.placeholder = "请输入新的手机号";
  } else if (type === "邮箱") {
    accountSetting.title = "修改邮箱";
    accountSetting.label = "邮箱";
    accountSetting.value = account.email;
    accountSetting.placeholder = "请输入新的邮箱";
  } else if (type === "密码") {
    accountSetting.title = "修改密码";
    accountSetting.label = "密码";
    accountSetting.value = account.password;
    accountSetting.placeholder = "请输入新的密码";
  }
  changeAccountDialogVisible.value = true;
};

const changeAccountSubmit = (label: string) => {
  if (label === "手机号") {
    account.phone = accountSetting.value;
  } else if (label === "邮箱") {
    account.email = accountSetting.value;
  } else if (label === "密码") {
    account.password = CryptoJS.SHA256(accountSetting.value).toString();
  }

  _axios.post("/user/updateAccount", account).then((res) => {
    getNewUserInfo();
    newUserInfo.value = res.data;
    store.dispatch("setUserInfoFromAxios", res.data);
    ElMessage({
      type: "success",
      message: "修改成功!",
    });
  });

  changeAccountDialogVisible.value = false;
};

let collectionList = reactive([]);

const getCollectionList = () => {
  _axios
    .post("/user/getCollectionList", { user_id: userInfo.id })
    .then((res) => {
      collectionList = res.data.sort(function (a, b) {
        return b.collection_time - a.collection_time;
      });

      menuIndex.value = "我的收藏";
    });
};

const doGoToBlogPage = (id: number) => {
  router.push({ name: "blogPage", params: { id } });
};

let feedbackList = reactive([]);

const getFeedbackList = () => {
  _axios.post("/user/getFeedbackList", { user_id: userInfo.id }).then((res) => {
    feedbackList = res.data.sort(function (a, b) {
      return b.create_time - a.create_time;
    });

    menuIndex.value = "我的反馈";
  });
};

const doDeleteFeedback = (id: number) => {
  ElMessageBox.confirm("是否确定要删除此条反馈?", "确认删除", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    _axios.post("/user/deleteFeedback", { id }).then((res) => {
      getFeedbackList();
      ElMessage({
        type: "success",
        message: "删除成功!",
      });
    });
  });
};
</script>

<style lang="scss" scoped>
* {
  padding: 0;
}

.avatar-uploader,
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

:deep(.el-upload) {
  display: flex;
  border-radius: 10px;

  &:hover {
    border-color: var(--el-color-primary);
    background-color: rgba(135, 206, 250, 0.7);
    border-radius: 10px;
  }
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  border: 1px dashed #808080;
  border-radius: 10px;
}

.head {
  height: 10vh;
  padding: 0;

  @media (max-width: 768px) {
    height: 5vh;
  }
}

.content {
  border-radius: 10px;

  &:nth-child(1) {
    height: 70vh;
    @media screen and (max-width: 768px) {
      width: 100vw;
      height: 100px;
      display: flex;

      .el-menu-item {
        margin-left: 5px;
      }
    }
  }
}

.contentInfo {
  position: relative;
  height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;

  div {
    margin: 0;

    span {
      display: inline-block;
      width: 60px;
    }
  }

  @media screen and (max-width: 768px) {
    .el-button {
      span {
        transform: translateX(50px);
      }
    }
  }
}

li {
  padding: 0;
  display: flex;
  justify-content: center;
  --el-menu-level: none;
}
</style>
