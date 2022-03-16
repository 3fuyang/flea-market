<template>
  <div class="info">
    <el-card class="baseInfo">
      <el-avatar :src="avatarPic" :size="100" />
      <div class="nickName" v-if="!changeInfoForm">
        {{ infoFormData.nickName }}
      </div>
      <div class="selfIntroduction" v-if="!changeInfoForm">
        {{ infoFormData.selfIntroduction }}
      </div>
      <el-divider />
      <el-form label-width="75px" class="infoForm" :model="infoFormData">
        <el-form-item v-if="changeInfoForm" prop="nickName">
          <template #label>昵称:</template>
          <el-input
            v-if="changeInfoForm"
            v-model="infoFormData.nickName"
          ></el-input>
          <div v-else>{{ academy }}</div>
        </el-form-item>
        <el-form-item v-if="changeInfoForm" prop="selfIntroduction">
          <template #label>个人简介:</template>
          <el-input
            v-if="changeInfoForm"
            v-model="infoFormData.selfIntroduction"
          ></el-input>
        </el-form-item>
        <el-form-item prop="academy">
          <template #label>学院:</template>
          <el-input
            v-if="changeInfoForm"
            v-model="infoFormData.academy"
          ></el-input>
          <div v-else>{{ infoFormData.academy }}</div>
        </el-form-item>
        <el-form-item prop="gender">
          <template #label>性别:</template>
          <el-input
            v-if="changeInfoForm"
            v-model="infoFormData.gender"
          ></el-input>
          <div v-else>{{ infoFormData.gender }}</div>
        </el-form-item>
        <el-form-item prop="birthday">
          <template #label>生日:</template>
          <el-input
            v-if="changeInfoForm"
            v-model="infoFormData.birthday"
          ></el-input>
          <div v-else>{{ infoFormData.birthday }}</div>
        </el-form-item>
        <el-button
          v-if="changeInfoForm"
          type="success"
          plain
          @click="saveChange"
          >保存更改</el-button
        >
        <el-button v-if="!changeInfoForm" plain @click="changeBaseInfo"
          >编辑个人信息</el-button
        >
      </el-form>
      <el-divider style="margin: 10px 0" />
      <el-form label-width="75px" class="infoForm">
        <el-form-item label="我的评分:">
          <el-rate
            v-model="sellerRate"
            disabled
            :show-score="sellerCommentList.length"
            text-color="#ff9900"
            style="margin-top: 10px"
          />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="commentInfo">
      <el-tabs v-model="commentSelect">
        <el-tab-pane label="历史评论" name="sellerComment">
          <CommentCardList :comments="sellerCommentList" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<style scoped>
.info {
  width: 1000px;
  margin: 0 auto;
}
.baseInfo {
  margin-top: 10px;
  margin-left: 10px;
  margin-bottom: 10px;
  width: 30%;
  text-align: center;
  padding: 20px 0;
  height: 600px;
  float: left;
}
.commentInfo {
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 30px;
  width: 60%;
  text-align: center;
  padding: 20px 0;
  height: 600px;
  float: left;
}
.nickName {
  margin: 15px 0 10px;
  font-size: 40px;
  font-weight: 800;
  color: #262626;
  font-family: "楷体";
}
.selfIntroduction {
  font-family: "FZHeiBJW";
  margin-top: 15px;
}
.infoForm {
  padding: 5px 20px;
  font-family: "FZHeiBJW";
}
.infoChange {
  padding: 5px 50px;
  font-family: "FZHeiBJW";
}
</style>

<script>
import "@/assets/fonts/font.css";
import CommentCardList from "@/components/CommentCardList.vue";

export default {
  components: {
    CommentCardList,
  },
  data() {
    return {
      avatarPic:
        "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
      infoFormData: {
        nickName: "催逝员",
        selfIntroduction: "这喝汤，多是一件美事啊。",
        academy: "软件学院",
        gender: "男",
        birthday: "2022-01-06",
      },
      commentSelect: "sellerComment",
      changeInfoForm: false,
      uploadAvatarUrl: "",
      nickNameInput: "",
      introductionInput: "",
      birthdayInput: "",
      buyerCommentList: [],
      sellerCommentList: [
        {
          time: "2022-01-07 09:55",
          name: "王大队长",
          rate: 4.6,
          avatar:
            "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
          text: "有人说，有人在饭里下了毒，我们都不敢吃。",
        },
        {
          time: "2022-01-07 09:55",
          rate: 3.6,
          name: "司令员",
          avatar:
            "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
          text: "我信，我非常相信。你要是没下毒，你就把这碗鸡汤喝了。你看你每天忙里忙完的，多辛苦呀，喝完鸡汤算什么呀，你要是不喝，就说明你真的下毒了。",
        },
        {
          time: "2022-01-07 09:55",
          name: "王大队长",
          rate: 3.8,
          avatar:
            "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
          text: "有人说，有人在饭里下了毒，我们都不敢吃。",
        },
        {
          time: "2022-01-07 09:55",
          rate: 3.6,
          name: "司令员",
          avatar:
            "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
          text: "我信，我非常相信。你要是没下毒，你就把这碗鸡汤喝了。你看你每天忙里忙完的，多辛苦呀，喝完鸡汤算什么呀，你要是不喝，就说明你真的下毒了。",
        },
        {
          time: "2022-01-07 09:55",
          name: "王大队长",
          rate: 3.8,
          avatar:
            "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
          text: "有人说，有人在饭里下了毒，我们都不敢吃。",
        },
      ],
    };
  },
  methods: {
    //更改基本信息
    changeBaseInfo() {
      this.changeInfoForm = true;
      console.log(this.changeInfoForm); /*
      this.uploadAvatarUrl = this.avatarPic;
      this.nickNameInput = this.nickName;
      this.introductionInput = this.selfIntroduction;
      this.birthdayInput = this.birthday;*/
    },
    //保存信息关闭
    saveChange() {
      this.changeInfoForm = false;
      console.log(this.changeInfoForm); /*
      this.$confirm("退出后信息不会保存，是否确认退出!", "提示").then(() => {
        this.changeInfoForm = false;
        this.$message({
          type: "info",
          message: "修改已取消!",
        });
      });*/
    },
    //保存更改的个人信息
    changeInfoConfirm() {
      this.$confirm("确认要修改个人信息吗?", "提示").then(() => {
        if (!this.nickNameInput.length) {
          this.$message({
            type: "error",
            message: "姓名不可为空!",
          });
          return;
        }
        this.changeInfoForm = false;
        this.avatarPic = this.uploadAvatarUrl;
        this.nickName = this.nickNameInput;
        this.selfIntroduction = this.introductionInput;
        this.birthday = this.birthdayInput;
        this.$message({
          type: "success",
          message: "个人信息已修改!",
        });
      });
    },
    uploadAvatar(file) {
      this.uploadAvatarUrl = URL.createObjectURL(file.raw);
    },
    reSelectAvatar() {
      this.uploadAvatarUrl = "";
    },
  },
  computed: {
    buyerRate: function () {
      var totalRate = 0;
      this.buyerCommentList.forEach((comment) => {
        totalRate += comment.rate;
      });
      return Number((totalRate / this.buyerCommentList.length).toFixed(1));
    },
    sellerRate: function () {
      var totalRate = 0;
      this.sellerCommentList.forEach((comment) => {
        totalRate += comment.rate;
      });
      return Number((totalRate / this.sellerCommentList.length).toFixed(1));
    },
  },
};
</script>