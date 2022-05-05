<script lang="ts" setup>
import { ref } from 'vue'
import {  type FormInst, type FormRules, type FormItemRule, NIcon, NButton, NForm, NFormItem, NSteps, NStep, NGradientText, NCard, NInput } from 'naive-ui'
import { CheckmarkCircle } from '@vicons/ionicons5'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const router = useRouter()

const { userID } = storeToRefs(useUserStore())

const props = defineProps({
  telNum: String
})

// 当前步骤
const telStep = ref(1)

// model对象
const telFormModel = ref({
  newTel: '',
  CAPTCHA: ''
})

// ref对象
const telFormRef = ref<FormInst | null>(null)

// 验证码标志
const hasCAPTCHA = ref(false)

// 服务端验证码
const ssrCAPTCHA = ref('')

// 获取验证码
function getCAPTCHA () {
  telFormRef.value?.validate((errors) => {
    if (!errors) {
      ssrCAPTCHA.value = '123456'
      hasCAPTCHA.value = true
    } else {
      console.log(errors)
    }
  },
  (rule) => {
    return rule?.key === 'newTel'
  })
}

// 校验规则
const telFormRules: FormRules = {
  newTel: [{
    key: 'newTel',
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

// 确认修改
function modifyTel () {
  telFormRef.value?.validate((errors) => {
    if (!errors) {
      // 调用接口
      //调用接口：传入（用户ID，新手机号码) 返回(success)
      let id_tel = {
        id: userID.value,
        newtel: telFormModel.value.newTel,
      }
      axios.post('/api/modifyTel/', id_tel)
        .then(() => {
          telStep.value++
          window.setTimeout(() => router.push('/home'), 3000)
        })      
    }
  })
}
</script>

<template>
  <n-card
    class="card"
    hoverable
    content-style="display: flex; flex-direction: column; align-items: center; justify-content: flex-start;">
    <p class="caption" style="align-self: center;">Modify Password</p>
    <n-steps
      class="steps"
      :current="telStep">
      <n-step
        title="验证新手机号"
      />
      <n-step
        title="修改成功"
      />
    </n-steps>
    <div 
      class="input-box" 
      v-if="telStep === 1">
      <p class="little">{{`您的账号现在绑定的手机号码为: +86 ${props.telNum.substring(0,3)} **** ${props.telNum.substring(9,12)} ,请输入新的手机号码:`}}</p>
      <n-form
        ref="telFormRef"
        :model="telFormModel"
        :rules="telFormRules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging">
        <n-form-item
          label="新手机号"
          path="newTel">
          <n-input
            class="input"
            v-model:value="telFormModel.newTel"
            />
        </n-form-item>
        <n-form-item
          label="验证码"
          path="CAPTCHA">
          <n-input
            class="input"
            v-model:value="telFormModel.CAPTCHA"/>
        </n-form-item>          
      </n-form>
      <div style="display: flex;justify-content: center;">
        <n-button
          type="success"
          :disabled="!hasCAPTCHA"
          @click="modifyTel"
          style="margin-right: 2em;">
          确认验证
        </n-button>        
        <n-button
          type="info"
          :disabled="hasCAPTCHA"
          @click="getCAPTCHA">
          接收验证码
        </n-button>
      </div>
    </div>
    <div 
      class="input-box"
      v-else-if="telStep === 2">
      <n-icon
        size="60"
        color="#0e7a0d">
        <checkmark-circle/>
      </n-icon>
      <n-gradient-text type="success">
        修改成功，即将为您跳转到主页...
      </n-gradient-text>
    </div>          
  </n-card>
</template>

<style scoped>
.card {
  box-sizing: border-box;
  height: 100%;
}
.caption {
  color: #191970;
  margin: 0;
  font-size: 1.15rem;
  align-self: flex-start;
}
.little {
  font-size: 1rem;
  margin: 0;
  margin-left: 2em;
  max-width: 45em;
  align-self: flex-start;
}
.steps {
  margin: 1em 0;
  margin-left: 20em;
}
.input-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.input {
  width: 12em;
  text-align: left;
}
</style>