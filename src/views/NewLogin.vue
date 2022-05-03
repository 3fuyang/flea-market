<script setup lang="ts">
import LoginWidget from '../components/Login/LoginWidget.vue'
import RegisterWidget from '../components/Login/RegisterWidget.vue'
import RetrieveWidget from '../components/Login/RetrieveWidget.vue'
import { ref } from 'vue'

// 登录窗口开关
const showLogin = ref(true)
// 注册窗口开关
const showRegister = ref(false)
// 找回密码窗口开关
const showRetrieve = ref(false)

// 打开注册窗口
function handleShowRegister () {
  showLogin.value = false
  showRegister.value = true
}
// 关闭注册窗口
function handleOffRegister () {
  showRegister.value = false
  showLogin.value = true
}
// 打开找回密码窗口
function handleShowRetrieve () {
  showLogin.value = false
  showRetrieve.value = true
}
// 关闭找回密码窗口
function handleCloseRetrieve () {
  showRetrieve.value = false
  showLogin.value = true
}
</script>

<template>
<div class="root-wrapper">
  <LoginWidget 
    v-if="showLogin"
    @show-register="handleShowRegister"
    @show-retrieve="handleShowRetrieve"/>
  <RegisterWidget 
    v-else-if="showRegister"
    @off-register="handleOffRegister"/>
  <RetrieveWidget
    v-else-if="showRetrieve"
    @close-retrieve="handleCloseRetrieve"/>
</div>
</template>

<style scoped>
.root-wrapper {
  background-image: url('../assets/lib.jpg');
  background-image: no-repeat;
  background-size: 100% 100%;
  font-size: 1rem;
  height: 43.75em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: auto;
  border: 1px white solid;
}
</style>