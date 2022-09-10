<script setup lang="ts">
import LoginWidget from '../components/Login/LoginWidget.vue'
import RegisterWidget from '../components/Login/RegisterWidget.vue'
import RetrieveWidget from '../components/Login/RetrieveWidget.vue'
import { useNotification, NButton, NSpace, useMessage } from 'naive-ui'
import { ref, h } from 'vue'
import { memberRoutes, adminRoutes, loginRoutes, endRoutes } from "@/router"
import { useUserStore } from '@/stores/user'
import { useRouter, type RouteRecordName } from 'vue-router'

const message = useMessage()

const router = useRouter()

const userStore = useUserStore()

const date = new Date()
date.setHours(date.getHours() + 8)
const notification = useNotification()
notification.create({
  title: "Welcome!",
  description: 'From the Tongji Flea',
  content: `普通用户测试账号: 1951001 qwe12345,
管理员测试账号: 0001 qwe12345`,
  duration: 10000,
  action: () => h(
    NSpace,
    {
      justify: 'center'
    },
    [
      h(
        NButton,
        {
          type: 'success',
          size: 'tiny',
          secondary: true,
          onClick: () => {
            message.success('用户登录成功！')
            userStore.logIn('1951001')
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
            notification.destroyAll()
          }
        },
        {
          default: () => '用户快捷登录'
        }
      ),
      h(
        NButton,
        {
          type: 'info',
          size: 'tiny',
          secondary: true,
          onClick: () => {
            message.success('管理员登录成功！')
            userStore.logIn('0001')
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
            notification.destroyAll()
          }
        },
        {
          default: () => '管理员快捷登录'
        }
      )
    ]
  ),
  meta: date.toISOString().slice(0, 19).replace('T', ' ')
})

// 登录窗口开关
const showLogin = ref(true)
// 注册窗口开关
const showRegister = ref(false)
// 找回密码窗口开关
const showRetrieve = ref(false)

// 打开注册窗口
function handleShowRegister() {
  showLogin.value = false
  showRegister.value = true
}
// 关闭注册窗口
function handleOffRegister() {
  showRegister.value = false
  showLogin.value = true
}
// 打开找回密码窗口
function handleShowRetrieve() {
  showLogin.value = false
  showRetrieve.value = true
}
// 关闭找回密码窗口
function handleCloseRetrieve() {
  showRetrieve.value = false
  showLogin.value = true
}
</script>

<template>
  <n-notification-provider class="full-width">
    <div class="root-wrapper">
      <LoginWidget v-if="showLogin" @show-register="handleShowRegister" @show-retrieve="handleShowRetrieve" />
      <RegisterWidget v-else-if="showRegister" @off-register="handleOffRegister" />
      <RetrieveWidget v-else-if="showRetrieve" @close-retrieve="handleCloseRetrieve" />
    </div>
  </n-notification-provider>
</template>

<style scoped>
.full-width {
  width: 100%;
}

.root-wrapper {
  background-image: url('/images/lib.jpg');
  background-image: no-repeat;
  background-size: 100% 100%;
  font-size: 1rem;
  height: 45em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: auto;
  border: 1px white solid;
}
</style>