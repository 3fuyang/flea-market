<script setup lang="ts">
import { NCard, NForm, NFormItem, NInput, NRadioGroup, NButton, NRadioButton, NIcon } from 'naive-ui'
import type { FormInst, FormRules, FormItemRule } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'
import axios from 'axios'
import { useRouter, type RouteRecordName } from 'vue-router'
import { LockOpenOutline } from '@vicons/ionicons5'
import { useUserStore } from '../../stores/user'
import { memberRoutes, adminRoutes, loginRoutes, endRoutes } from "@/router"

// 获取store
const userStore = useUserStore()

const message = useMessage()

// 定义事件
defineEmits<{
  (e: 'show-register'): void
  (e: 'show-retrieve'): void
}>()

// 登录表单ref对象
const loginRef = ref<FormInst | null>(null)
// 登录表单model对象
const loginData = ref<{
  type: string
  userID: string
  password: string
}>({
  type: 'member',
  userID: '',
  password: ''
})

// 表单规则
const rules: FormRules = {
  userID: [{
    required: true,
    validator (rule: FormItemRule, value: string) {
      if (!value) {
        return new Error('请输入账号')
      } else if (loginData.value.type === 'member' && value.length !== 7) {
        return new Error('普通用户账号应长7位')
      } else if (loginData.value.type === 'admin' && value.length !== 4) {
        return new Error('管理员账号应长4位')
      } else {
        return true
      }
    }
  }],
  password: [{
    required: true,
    message: '请输入密码'
  }]
}

const router = useRouter()
// 登录函数
function logIn (): void {
  // 对输入进行校验
  loginRef.value?.validate((errors) => {
    if (!errors) {
      const id_pwd = {
        id: loginData.value.userID,
        password: loginData.value.password
      }
      switch (loginData.value.type) {
        case 'member':
          axios.post('/api/userlogin',id_pwd)
            .then((is_e) => {
              if (is_e.data) {
                message.success('用户登录成功！')
                userStore.logIn(loginData.value.userID)
                // 删除登录路由
                loginRoutes.forEach((route) => {
                  router.removeRoute(route.name as RouteRecordName)
                })
                // 添加普通会员路由
                memberRoutes.forEach((route) => {
                  router.addRoute(route)
                })
                // 将endRoutes移至尾部
                endRoutes.forEach((route) => {
                  router.addRoute(route)
                })                
                router.push('/home')          
              } else {
                message.error('账号或密码错误！')
              }
            })
          break
        case 'admin':
          axios.post('/api/adminlogin', id_pwd).then((is_e)=>{
            if (is_e.data) {
              message.success('管理员登录成功！')
              userStore.logIn(loginData.value.userID)
              // 删除登录路由，添加管理员路由
              loginRoutes.forEach((route) => {
                router.removeRoute(route.name as RouteRecordName)
              })
              adminRoutes.forEach((route) => {
                router.addRoute(route)
              })
              // 将endRoutes移至尾部
              endRoutes.forEach((route) => {
                router.addRoute(route)
              })          
              router.push('/admin/report')
            } else {
              message.error('账号或密码错误！')
            }
          })
          break      
      }
    } else {
      console.log(errors)
    }
  })
}
</script>

<template>
<n-card
  content-style="display: flex;flex-direction: column;align-items: center;padding-bottom: 0;"
  header-style="padding-bottom: 0;"
  footer-style="padding: 0 6em 1em 8em"
  class="login-card">
  <template #header>
    <el-page-header
      title="返回首页"
      @back="$router.push('/home')"/>
  </template>
  <template #header-extra>
    <n-button
      text
      size="tiny"
      color="#2080F0"
      :disabled="loginData.type === 'admin'"
      @click="$emit('show-retrieve')">
      <template #icon>
        <n-icon>
          <lock-open-outline />
        </n-icon>
      </template>      
      忘记密码
    </n-button>
  </template>
  <p class="login-title">用户登录</p>
  <n-form
    ref="loginRef"
    :model="loginData"
    :rules="rules"
    label-placement="left"
    label-width="auto">
    <n-form-item
      label="类型"
      path="type"
      :show-feedback="false"
      style="margin-bottom: .6em;">
      <div class="radios-wrapper">
        <n-radio-group
          v-model:value="loginData.type">
            <n-radio-button
              class="radio-btn"
              value="member">
              用户
            </n-radio-button>
            <n-radio-button
              class="radio-btn"
              value="admin">
              管理员
            </n-radio-button>
        </n-radio-group>
      </div>
    </n-form-item>
    <n-form-item
      label="账号"
      path="userID">
      <n-input
        v-model:value="loginData.userID"
        :placeholder="''"
        class="input"
        />
    </n-form-item>
    <n-form-item
      label="密码"
      path="password">
      <n-input
        v-model:value="loginData.password"
        :placeholder="''"
        class="input"
        type="password"
        show-password-on="click"         
        @keyup.enter="logIn"
        />
    </n-form-item>
  </n-form>
  <template #footer>
    <div class="btns-wrapper">
      <n-button
        type="info"
        @click="$emit('show-register')">注册</n-button>
      <n-button
        type="success"
        @click="logIn">登录</n-button>
    </div>
  </template>
</n-card>
</template>

<style scoped>
.login-card {
  width: 30em;
  font-size: 1rem;
  background-color: rgba(255, 255, 255, .6);
}
.login-title {
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