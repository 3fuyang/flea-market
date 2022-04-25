<template>
    <el-card class="baseInfo">
      <el-avatar :src="userInfo?.avatar" alt="User Avatar" :size="100" />
      <div class="nickName" v-if="!changingInfo">
        {{ userInfo?.nickName }}
      </div>
      <div class="selfIntroduction" v-if="!changingInfo">
        {{ userInfo?.selfIntro }}
      </div>
      <el-divider />
      <el-form label-width="75px" class="infoForm" :model="userInfo">
        <el-form-item v-if="changingInfo" prop="nickName">
          <template #label>昵称:</template>
          <el-input
            v-if="changingInfo"
            v-model="newInfo.nickName"
          ></el-input>
          <div v-else>{{ userInfo?.college }}</div>
        </el-form-item>
        <el-form-item v-if="changingInfo" prop="selfIntroduction">
          <template #label>个人简介:</template>
          <el-input
            v-if="changingInfo"
            v-model="newInfo.selfIntro"
            type="textarea"
            :max-length="25"
            :autosize="{ minRows: 2, maxRows: 4}"
          ></el-input>
        </el-form-item>
        <el-form-item prop="college">
          <template #label>学院:</template>
          <el-select
            v-if="changingInfo"
            v-model="newInfo.college"
          >
            <el-option
              v-for="item in collegeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div v-else>{{ userInfo?.college }}</div>
        </el-form-item>
        <el-form-item prop="gender">
          <template #label>性别:</template>
          <el-select
            v-if="changingInfo"
            v-model="newInfo.gender"
          >
            <el-option
              v-for="item in genderOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div v-else>{{ userInfo?.gender }}</div>
        </el-form-item>
        <el-form-item prop="birthday">
          <template #label>生日:</template>
          <el-date-picker
            v-if="changingInfo"
            v-model="newInfo.birthday"
            type="date"
            size="small"
            :editable="false"
            placeholder="选择您的生日"
            format="YYYY 年 MM 月 DD 日"
            value-format="YYYY-MM-DD">
          </el-date-picker>          
          <div v-else>{{ userInfo?.birthday }}</div>
        </el-form-item>
        <el-button
          v-if="changingInfo"
          type="success"
          plain
          @click="changeInfoConfirm"
          >保存更改</el-button
        >
        <el-button
          v-if="changingInfo" 
          type="info"
          plain 
          @click="cancelEdit"
          >取消编辑</el-button>        
        <el-button 
          v-if="!changingInfo" 
          plain 
          color="#3399CC"
          @click="changeBaseInfo"
          >编辑个人信息</el-button>          
      </el-form>
      <el-divider style="margin: 10px 0" />
      <el-form label-width="75px" class="infoForm">
        <el-form-item label="卖家评分:">
          <el-rate
            v-if="userInfo?.sellerRate"
            v-model="userInfo.sellerRate"
            disabled
            text-color="#ff9900"
            style="margin-top: 7px"
          />
        </el-form-item>
      </el-form>
    </el-card>
</template>

<script setup>
import { onBeforeMount, ref, watch } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import "@/assets/fonts/font.css"
import axios from 'axios'
const props = defineProps({
  userID: String  // 用户ID
})

const userInfo = ref(null)
const newInfo = ref({})
onBeforeMount(() => {
  // 调用接口：传入（用户ID） 返回（用户信息：头像URL、昵称、签名、学院、性别、生日）
  axios.get(`/api/getUserInfo/${props.userID}`)
    .then((res) => {
      const data = res.data[0]
      userInfo.value = {
        userID: props.userID,
        nickName: data.nickname,
        selfIntro: data.biography,
        college: data.college,
        gender: data.gender,
        birthday: data.birthday,
        avatar: `http://127.0.0.1:8082/public/avatars/${data.avatar}`,
        sellerRate: 4
      }
    })
    .then(() => {
      for(let property in userInfo.value){
        newInfo.value[property] = userInfo.value[property]
      }  
    })
})

const collegeOptions = [
  {
    value: '软件学院',
    label: '软件学院',
  },
  {
    value: '汽车学院',
    label: '汽车学院',
  },
  {
    value: '艺术与传媒学院',
    label: '艺术与传媒学院',
  },
  {
    value: '材料学院',
    label: '材料学院',
  },
  {
    value: '机械与能源工程学院',
    label: '机械与能源工程学院',
  },
]
const genderOptions = [
  {
    value: '男',
    label: '男',
  },
  {
    value: '女',
    label: '女',
  },  
]
// 编辑表单显示开关
const changingInfo = ref(false)
// 修改与否标志
const edited = ref(false)
// 检验是否存在修改
watch(newInfo, () => {
  for(let property in newInfo.value){
    if(newInfo.value[property] !== userInfo.value[property]){
      edited.value = true
      break
    }
  }
}, { deep: true })
// 开始修改个人信息
const changeBaseInfo = () => {
  changingInfo.value = true
}
// 取消修改
const resetEdit = () => {
  ElMessage.info('取消编辑个人信息。')
  changingInfo.value = false
  edited.value = false
  // 恢复修改后的用户信息
  for(let property in userInfo.value){
    newInfo.value[property] = userInfo.value[property]
  }  
}
const cancelEdit= () => {
  if(edited.value){
    ElMessageBox.confirm(
      '不会保存已做的修改，是否确定取消编辑？',
      '提示'
    ).then(() => {
      resetEdit()
    })
  }else{
    resetEdit()
  }
}
// 保存修改
const changeInfoConfirm = () => {
  if(edited.value){
    ElMessageBox.confirm(
      "确认要修改个人信息吗?",
      "提示"
    ).then(() => {
      // 校验表单
      if (!newInfo.value.nickName.length) {
        ElMessage({
          type: "error",
          message: "昵称不可为空!"
        })
        return false
      }
      else if (!newInfo.value.birthday.length) {
        ElMessage({
          type: "error",
          message: "生日不可为空!"
        })
        return false        
      }
      else if (!newInfo.value.selfIntro.length) {
        ElMessage({
          type: "error",
          message: "个性签名不可为空!"
        })
        return false        
      }      
      // 调用接口：传入（用户ID，新用户信息） 返回（修改结果）
      axios.post(`api/modifyUserInfo`, newInfo.value)
        .then(() => {
          // 修改视图
          for(let property in newInfo.value){
            userInfo.value[property] = newInfo.value[property]
          }
          changingInfo.value = false
          edited.value = false
          ElMessage({
            type: "success",
            message: "个人信息已修改!",
          }) 
        })
    })
  }else{
    console.log(userInfo.value, newInfo.value)
    ElMessage.warning('您没有要保存的修改。')
  }
}
</script>

<style scoped>
.baseInfo {
  margin-top: 10px;
  margin-left: 10px;
  margin-bottom: 10px;
  width: 30%;
  text-align: center;
  padding: 15px 0;
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