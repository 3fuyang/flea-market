<script setup lang="ts">
import { NCard, NForm, NFormItem, NInput, NButton, useMessage } from 'naive-ui'
import type { FormRules, FormItemRule, FormInst } from 'naive-ui'
import { ref } from 'vue'
import axios from 'axios'
import { useCAPTCHA } from '@/composables/useCAPTCHA'

const message = useMessage()

// 定义事件
const emits = defineEmits<{
  (e: 'close-retrieve'): void
}>()

// 找回密码表单ref对象
const retrieveRef = ref<FormInst | null>(null)
// 找回密码表单model对象
const retrieveData = ref<{
  userID: string
  telNum: string
  CAPTCHA: string
}>({
  userID: '',
  telNum: '',
  CAPTCHA: ''
})

// 是否已获取验证码?
const hasCAPTCHA = ref(false)
// 正确的验证码
const ssrCAPTCHA = ref('')

// 获取验证码
function getCAPTCHA () {
  // 要应用的部分规则
  const keys = ['userID', 'telNum']
  retrieveRef.value?.validate((errors) => {
    if (!errors) {
      // 调用接口：传入（手机号） 返回（验证码）
      useCAPTCHA(retrieveData.value.telNum, 2)
        .then(code => { 
          if (code !== 'error' && code !== 'Wrong phone number') {
            ssrCAPTCHA.value = code 
            hasCAPTCHA.value = true
          } else {
            console.log('获取验证码失败:', code)
          }
        })
    } else {
      console.log(errors)
    }
  },
  (rule) => {
    return keys.includes(rule?.key as string)
  })
}

// 表单规则
const rules: FormRules = {
  userID: [{
    key: 'userID',
    required: true,
    validator (rule: FormItemRule, value: string) {
      if (!value) {
        return new Error('请输入学号')
      } else if (value.length !== 7) {
        return new Error('学号应长7位')
      } else {
        return true
      }
    }
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
// 修改密码窗口开关
const atModify = ref(false)
// 修改窗口model对象
const modifyData = ref({
  password: '',
  reenteredPassword: ''
})
// 修改窗口ref对象
const modifyRef = ref<FormInst | null>(null)
// 找回密码函数
function goModify (): void {
  // 对输入进行校验
  retrieveRef.value?.validate((errors) => {
    if (!errors) {
      const id_tel = {
        id: retrieveData.value.userID,
        telnum: retrieveData.value.telNum
      }
      // 调用接口： 传入（学号、手机号） 返回（学号或手机号是否已被注册）
      axios.post('/api/idcoupletel/',id_tel)
        .then((is_c) => {
          if (is_c.data) {
            atModify.value = true        
          } else {
            message.error('没有对应的账号！')
            return false
          }
        })
    } else {
      console.log(errors)
    }
  })
}
// 确认修改密码
function completeModify () {
  modifyRef.value?.validate(errors => {
    if (!errors) {
      const id_pwd = {
        id: retrieveData.value.userID,
        newpassword: modifyData.value.password,
      }
      // 调用接口：传入（用户ID、新密码） 返回（null）
      axios.post('/api/modifyPassword/', id_pwd)
        .then(() => {
          message.success('修改成功，请重新登录！')
          emits('close-retrieve')
        })      
    } else {
      console.log(errors)
    }
  })
}
// 修改窗口校验规则
const modifyRules: FormRules = {
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
      } else if (value !== modifyData.value.password) {
        return new Error('两次输入密码不一致')
      } else {
        return true
      }
    }
  }]
}
</script>

<template>
<!--身份验证窗口-->
<n-card
  v-show="!atModify"
  content-style="display: flex;flex-direction: column;align-items: center;padding-bottom: 0;"
  header-style="padding-bottom: 0;"
  footer-style="padding: 0 6em 1em 8em"
  class="retrieve-card">
  <template #header>
    <el-page-header
      title="返回登录"
      @back="$emit('close-retrieve')"/>
  </template>
  <p class="retrieve-title">用户找回密码</p>
  <n-form
    ref="retrieveRef"
    :model="retrieveData"
    :rules="rules"
    label-placement="left"
    label-width="auto">
    <n-form-item
      label="账号"
      path="userID">
      <n-input
        v-model:value="retrieveData.userID"
        :placeholder="''"
        class="input"
        />
    </n-form-item>
    <n-form-item
      label="手机号"
      path="telNum">
      <n-input
        v-model:value="retrieveData.telNum"
        :placeholder="''"
        class="input"
        />
    </n-form-item>
    <n-form-item
      label="验证码"
      path="CAPTCHA">
      <n-input
        v-model:value="retrieveData.CAPTCHA"
        :placeholder="''"
        class="input"
        />
    </n-form-item> 
  </n-form>
  <template #footer>
    <div class="btns-wrapper">
      <n-button
        type="info"
        @click="goModify">下一步</n-button>
      <n-button
        type="success"
        @click="getCAPTCHA">获取验证码</n-button>
    </div>
  </template>
</n-card>

<!--修改密码窗口-->
<n-card
  v-show="atModify"
  content-style="display: flex;flex-direction: column;align-items: center;padding-bottom: 0;"
  header-style="padding-bottom: 0;"
  footer-style="padding: 0 6em 1em 8em"
  class="retrieve-card">
  <template #header>
    <el-page-header
      title="返回登录"
      @back="$emit('close-retrieve')"/>
  </template>
  <p class="retrieve-title">用户修改密码</p>
  <n-form
    ref="modifyRef"
    :model="modifyData"
    :rules="modifyRules"
    label-placement="left"
    label-width="auto">
    <n-form-item
      label="新密码"
      path="password">
      <n-input
        v-model:value="modifyData.password"
        :placeholder="''"
        class="input"
        />
    </n-form-item>
    <n-form-item
      label="手机号"
      path="telNum">
      <n-input
        v-model:value="retrieveData.telNum"
        :placeholder="''"
        class="input"
        />
    </n-form-item>
    <n-form-item
      label="验证码"
      path="CAPTCHA">
      <n-input
        v-model:value="retrieveData.CAPTCHA"
        :placeholder="''"
        class="input"
        />
    </n-form-item> 
  </n-form>
  <template #footer>
    <div class="btns-wrapper">
      <n-button
        type="success"
        @click="completeModify">确认修改</n-button>
    </div>
  </template>
</n-card>
</template>

<style scoped>
.retrieve-card {
  width: 30em;
  font-size: 1rem;
  background-color: rgba(255, 255, 255, .6);
}
.retrieve-title {
  font-weight: bold;
  font-size: 1.6em;
  margin: 0;
  margin-bottom: .6em;
}
.radios-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}
.radio-btn {
  background-color: #fff;
}
.input {
  text-align: left;
}
.btns-wrapper {
  display: flex;
  justify-content: space-evenly;
}
</style>