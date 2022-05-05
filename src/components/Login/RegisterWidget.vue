<script setup lang="ts">
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { NCard, NForm, NFormItem, NInput, NButton, NDatePicker, NSelect } from 'naive-ui'
import type { FormInst, FormRules, FormItemRule } from 'naive-ui'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { colleges } from './colleges'
import { useUserStore } from '@/stores/user'
import { memberRoutes, loginRoutes, endRoutes } from "@/router"

const router = useRouter()

// store
const userStore = useUserStore()

defineEmits<{
  (e: 'off-register'): void
}>()

// 注册表单的model数据
const registerData = ref({
  userID: '',
  password: '',
  reenteredPassword: '',
  name: '',
  telNum: '',
  CAPTCHA: '',
})
// 注册表单的ref对象
const registerRef = ref<FormInst | null>(null)

// 是否已获取验证码?
const hasCAPTCHA = ref(false)
// 正确的验证码
const ssrCAPTCHA = ref('')

// 获取验证码
function getCAPTCHA () {
  // 要应用的部分规则
  const keys = ['userID', 'name', 'password', 'reenteredPassword', 'telNum']
  registerRef.value?.validate((errors) => {
    if (!errors) {
      // 调用接口：传入（手机号） 返回（验证码）
      hasCAPTCHA.value = true
      ssrCAPTCHA.value = '123456'
    } else {
      console.log(errors)
    }
  },
  (rule) => {
    return keys.includes(rule?.key as string)
  })
}

// 信息表单开关
const atInfo = ref(false)
// 信息表单model对象
const infoData = ref<{
  gender: string
  college: string
  birthday: number | null
}>({
  gender: '',
  college: '',
  birthday: null
})
// 信息表单ref对象
const infoRef = ref<FormInst | null>(null)
// 性别选项
const genderOptions = ['男', '女'].map(item => ({
  label: item,
  value: item
}))
// 学院选项
const collegeOptions = colleges.map(item => ({
  label: item,
  value: item
}))
// 前往填写信息表单
function goFillInfo () {
  registerRef.value?.validate((errors) => {
    if (!errors) {
      const id_tel = {
        id: registerData.value.userID,
        telnum: registerData.value.telNum
      }
      axios.post('/api/isRepeated/',id_tel)
        .then((is_r) => {
          if (!is_r.data) {
            atInfo.value = true       
          } else {
            ElMessage.error('账号或手机号已被注册！')
            return false
          }
        })
    } else {
      console.log(errors)
    }
  })
}
// 确认注册
function completeInfo () {
  infoRef.value?.validate((errors) => {
    if (!errors) {
      const reg_info = {
        user_id: registerData.value.userID,
        mypassword: registerData.value.password,
        myname: registerData.value.name,
        telnum: registerData.value.telNum,
        gender: infoData.value.gender,
        college: infoData.value.college,
        birthday: new Date(infoData.value.birthday as number).toISOString().slice(0, 10), 
      }
      console.log(reg_info)
      axios.post('/api/register',reg_info)
        .then(() => {
          ElMessage.success('注册成功,1秒后将为您自动登录...')
          userStore.logIn(registerData.value.userID)
          // 删除登录路由
          loginRoutes.forEach((route) => {
            router.removeRoute(route.name)
          })
          // 添加普通会员路由
          memberRoutes.forEach((route) => {
            router.addRoute(route)
          })
          // 将endRoutes移至尾部
          endRoutes.forEach((route) => {
            router.addRoute(route)
          })          
          setTimeout(() => {
            router.push('/home')
          }, 1000)          
        })
    }
  })
}

// 注册表单校验规则
const registerRules: FormRules = {
  userID: [{
    key: 'userID',
    required: true,
    validator (rule: FormItemRule, value: string) {
      if (!value) {
        return new Error('请输入学工号')
      } else if (value.length !== 7) {
        return new Error('学工号应长7位')
      } else {
        return true
      }
    }
  }],
  password: [{
    key: 'password',
    required: true,
    validator (rule: FormItemRule, value: string) {
      if (!value) {
        return new Error('请输入密码')
      } else if (value.length < 8 || value.length > 20) {
        return new Error('密码长度应在8位~20位。')
      } else if ( !(/\d+/.test(value) && /[a-zA-Z]+/.test(value)) ) {
        return new Error('密码应同时包含数字和英文字母')
      } else {
        return true
      }
    }
  }],
  reenteredPassword: [{
    key: 'reenteredPassword',
    required: true,
    validator (rule: FormItemRule, value: string) {
      if (!value) {
        return new Error('请再次输入密码')
      } else if (value !== registerData.value.password) {
        return new Error('两次输入密码不一致')
      } else {
        return true
      }
    }    
  }],
  name: [{
    key: 'name',
    required: true,
    message: '请输入您的姓名'
  }],
  telNum: [{
    key: 'telNum',
    required: true,
    validator (rule: FormItemRule, value: string) {
      if (!/\d{11}/.test(value)) {
        return new Error('手机号码格式错误')
      } else {
        return true
      }
    }
  }],
  CAPTCHA: [{
    required: true,
    validator (rule: FormItemRule, value: string) {
      if (!hasCAPTCHA.value) {
        return new Error('请先点击下方按钮，获取验证码')
      } else if (value !== ssrCAPTCHA.value) {
        return new Error('验证码错误')
      } else {
        return true
      }
    }
  }]
}
// 信息表单校验规则
const infoRules: FormRules = {
  gender: {
    required: true,
    message: '请选择性别'
  },
  college: {
    required: true,
    message: '请选择学院'
  },
  birthday: {
    required: true,
    message: '请选择生日'
  }
}

</script>

<template>
<!--注册窗口-->
<n-card
  v-show="!atInfo"
  content-style="display: flex;flex-direction: column;align-items: center;padding-bottom: 0;"
  header-style="padding-bottom: 0;"
  footer-style="padding: 0 6em 1em 8em"
  class="register-card">
  <template #header>
    <el-page-header
      title="取消注册"
      @back="$emit('off-register')"/>
  </template>
  <p class="register-title">用户注册</p>
  <n-form
    ref="registerRef"
    :model="registerData"
    :rules="registerRules"
    label-placement="left"
    label-width="auto">
    <n-form-item
      label="学号"
      path="userID">
      <n-input
        v-model:value="registerData.userID"
        :placeholder="''"
        class="input"
        />
    </n-form-item>
    <n-form-item
      label="姓名"
      path="name">
      <n-input
        v-model:value="registerData.name"
        :placeholder="''"
        class="input"
        />
    </n-form-item>    
    <n-form-item
      label="密码"
      path="password">
      <n-input
        v-model:value="registerData.password"
        :placeholder="''"
        class="input"
        type="password"
        show-password-on="click"        
        />
    </n-form-item>
    <n-form-item
      label="确认密码"
      path="reenteredPassword">
      <n-input
        v-model:value="registerData.reenteredPassword"
        :placeholder="''"
        class="input"
        type="password"
        show-password-on="click"         
        />
    </n-form-item>
    <n-form-item
      label="手机号"
      path="telNum">
      <n-input
        v-model:value="registerData.telNum"
        :placeholder="''"
        class="input"
        />
    </n-form-item>
    <n-form-item
      label="验证码"
      path="CAPTCHA">
      <n-input
        v-model:value="registerData.CAPTCHA"
        :placeholder="''"
        class="input"
        />
    </n-form-item>         
  </n-form>
  <template #footer>
    <div class="btns-wrapper">
      <n-button
        type="info"
        @click="goFillInfo">下一步</n-button>
      <n-button
        type="success"
        @click="getCAPTCHA">获取验证码</n-button>
    </div>
  </template>
</n-card>

<!--填写信息窗口-->
<n-card
  v-show="atInfo"
  content-style="display: flex;flex-direction: column;align-items: center;padding-bottom: 0;"
  header-style="padding-bottom: 0;"
  footer-style="padding: 0 6em 1em 8em"
  class="register-card">
  <template #header>
    <el-page-header
      title="取消注册"
      @back="$emit('off-register')"/>
  </template>
  <p class="register-title">完善用户信息</p>
  <n-form
    ref="infoRef"
    :model="infoData"
    :rules="infoRules"
    label-placement="left"
    label-width="auto">
    <n-form-item
      label="性别"
      path="gender">
      <n-select
        v-model:value="infoData.gender"
        placeholder="Select"
        :options="genderOptions"
      />      
    </n-form-item>
    <n-form-item
      label="学院"
      path="college">
      <n-select
        v-model:value="infoData.college"
        placeholder="Select"
        :options="collegeOptions"
      />
    </n-form-item>    
    <n-form-item
      label="生日"
      path="birthday">
      <n-date-picker v-model:value="infoData.birthday" type="date" clearable />
    </n-form-item>        
  </n-form>
  <template #footer>
    <div class="btns-wrapper">
      <n-button
        type="success"
        @click="completeInfo">完成注册</n-button>
    </div>
  </template>
</n-card>
</template>

<style scoped>
.register-card {
  width: 30em;
  font-size: 1rem;
  background-color: rgba(255, 255, 255, .6);
}
.register-title {
  font-weight: bold;
  font-size: 1.6em;
  margin: 0;
  margin-bottom: .6em;
}
.input {
  text-align: left;
}
.btns-wrapper {
  display: flex;
  justify-content: space-evenly;
}
</style>