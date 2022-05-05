<script lang="ts" setup>
import { NTabs, NTabPane, NCard, NSteps, NStep, NForm, NFormItem, NInput, NButton, NGradientText, NIcon,
  type FormItemInst, type FormInst, type FormItemRule } from 'naive-ui'
import { ref } from 'vue'
import { CheckmarkCircle } from '@vicons/ionicons5'
import { useRouter } from 'vue-router'
import ModifyTelCard from '@/components/Security/ModifyTelCard.vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const router = useRouter()

const { userID } = storeToRefs(useUserStore())

// 当前激活Tab名
const currTab = ref('Security Center')

// 修改密码当前激活步骤
const passwordStep = ref(1)

// 旧手机号码
const telNum = ref('')
axios.get(`/api/usertel/${userID.value}`)
  .then((response) => {
    telNum.value = response.data.toString()  
  })

// 修改密码填写验证码
const passwordCaptcha = ref('')

// 修改密码验证码获取标志
const passwordHasCaptcha = ref(false)
// 修改验证码实际验证码
const passwordRealCaptcha = ref('')

// 获取修改密码验证码
function getPasswordCaptcha () {
  passwordHasCaptcha.value = true
  passwordRealCaptcha.value = '123456'
}

// 修改密码验证码ref对象
const passwordCaptchaRef = ref<null | FormItemInst>(null)

// 修改密码验证码校验规则
const passwordCaptchaRule = {
  validator () {
    if (!passwordHasCaptcha.value) {
      return new Error('请先获取验证码')
    } else if (passwordCaptcha.value !== passwordRealCaptcha.value) {
      return new Error('验证码错误')
    } else {
      return true
    }
  }
}

/* (options: {
   trigger?: string, 
   callback?: (errors?: Array<FormValidationError>) => void, 
   shouldRuleBeApplied?: FormItemRule => boolean, 
   options?: AsyncValidatorOptions }) => Promise<void> */
// 前往修改密码步骤
function goModifyPassword () {
  passwordCaptchaRef.value?.validate({
    callback: (errors) => {
      if (!errors) {
        passwordStep.value++
      } else {
        console.log(errors)
      }
    }
  })
}

// 新密码Model对象
const newPasswordModel = ref({
  password: '',
  reenteredPassword: ''
})

// 新密码表单ref对象
const newPasswordRef = ref<null | FormInst>(null)
// 新密码表单校验规则
const newPasswordRules = {
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
      } else if (value !== newPasswordModel.value.password) {
        return new Error('两次输入密码不一致')
      } else {
        return true
      }
    }
  }]
}

// 修改密码
function modifyPassword () {
  newPasswordRef.value?.validate((errors) => {
    if (!errors) {
      const id_pwd = {
        id: userID.value,
        newpassword: newPasswordModel.value.password,
      }
      // 调用接口：传入（用户ID、新密码） 返回（null）
      axios.post('/api/modifyPassword/', id_pwd)
        .then(() => {
          passwordStep.value++
          window.setTimeout(() => router.push('/home'), 3000)
        })
    } else {
      console.log(errors)
    }
  })
}
</script>

<template>
  <div class="root-wrapper">
    <n-tabs
      class="tab"
      pane-class="pane"
      v-model:value="currTab"
      type="card"
      :animated="true"
      tab-style="min-width: 80px;">
      <n-tab-pane
        name="Security Center">
        <n-card
          class="card"
          hoverable
          content-style="display: flex; flex-direction: column; align-items: flex-start; justify-content: space-evenly;">
          <p class="caption" style="align-self: center;">Security Center</p>
          <p class="caption">您好，欢迎来到用户账号安全中心！您可以在此进行修改密码和修改绑定手机号两种操作：</p>
          <p class="little">(1) 修改密码: 用户在使用账号绑定手机号接收短信验证码完成身份验证后，可修改账号密码(注：密码应长8-20位，并同时包含字母与数字)。</p>
          <p class="little">(2) 修改绑定手机号: 用户在使用新手机号码接收短信验证码完成身份验证后，可修改账号绑定手机号码(注：仅支持中国大陆地区(+86)手机号码，格式以实际为准)。</p>
          <p class="caption">请根据需要点击上方选项卡，切换到对应面板并进行相关流程。</p>
        </n-card>
      </n-tab-pane>
      <n-tab-pane
        name="Modify Password">
        <n-card
          class="card"
          hoverable
          content-style="display: flex; flex-direction: column; align-items: center; justify-content: flex-start;">
          <p class="caption" style="align-self: center;">Modify Password</p>
          <n-steps
            class="steps"
            :current="passwordStep">
            <n-step
              title="短信验证"
            />
            <n-step
              title="设置密码"
            />
            <n-step
              title="修改成功"
            />
          </n-steps>
          <div 
            class="input-box" 
            v-if="passwordStep === 1">
            <p class="little">为了保护你的帐号安全，请验证身份，验证成功后进行下一步操作，</p>
            <p class="little">{{`使用手机 +86 ${telNum.substring(0,3)} **** ${telNum.substring(9,12)} 验证:`}}</p>
            <n-form-item ref="passwordCaptchaRef" :rule="passwordCaptchaRule">
              <n-input
                class="input"
                placeholder="请输入6位短信验证码。"
                v-model:value="passwordCaptcha"/>
              <n-button
                text
                style="margin-left: 1em;"
                type="info"
                :disabled="passwordHasCaptcha"
                @click="getPasswordCaptcha">
                {{passwordHasCaptcha ? '已发送验证码' : '获取验证码'}}
              </n-button>
            </n-form-item>
            <n-button
              type="info"
              size="small"
              @click="goModifyPassword">
              确认验证
            </n-button>
          </div>
          <div 
            class="input-box" 
            v-else-if="passwordStep === 2">
            <p class="little">验证成功，请输入新密码:</p>
            <n-form
              ref="newPasswordRef"
              :model="newPasswordModel"
              :rules="newPasswordRules"
              label-placement="left"
              label-width="auto"
              require-mark-placement="right-hanging">
              <n-form-item
                label="新密码"
                path="password">
                <n-input
                  class="input"
                  v-model:value="newPasswordModel.password"
                  type="password"
                  show-password-on="click"
                  />
              </n-form-item>
              <n-form-item
                label="确认密码"
                path="reenteredPassword">
                <n-input
                  class="input"
                  v-model:value="newPasswordModel.reenteredPassword"
                  type="password"
                  show-password-on="click"/>
              </n-form-item>          
            </n-form>
            <n-button
              type="success"
              @click="modifyPassword">
              确认修改
            </n-button>
          </div>
         <div 
            class="input-box"
            v-else-if="passwordStep === 3">
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
      </n-tab-pane>
      <n-tab-pane
        name="Modify Tel">
        <modify-tel-card
          :tel-num="telNum"/>
      </n-tab-pane>       
    </n-tabs>
  </div>  
</template>

<style scoped>
.root-wrapper {
  box-sizing: border-box;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.tab {
  width: 65em;
}
.pane {
  box-sizing: border-box;
  padding: 1rem;
  height: 32em;
  width: 100%;
}
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
  margin-left: 8em;
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