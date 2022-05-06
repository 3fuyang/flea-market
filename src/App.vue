<script setup lang="ts">
import TopBar from './components/NewTopBar.vue'
import { NNotificationProvider } from 'naive-ui'
</script>

<template>
	<div 
    id="app" 
    style="background-color: #F5F5F5;">
    <el-container style="overflow-x: hidden;">
      <el-header 
        v-if="$route.path != '/login'" 
        style="padding: 0;">
        <top-bar />
      </el-header>      
      <el-main class="main">
        <n-notification-provider>
          <router-view/>
        </n-notification-provider>
      </el-main>
      <el-footer 
        v-if="$route.path!='/login'" 
        class="footer">
        <p>
          Copyright ©2022 同济大学校内二手交易平台
        </p>
      </el-footer>
    </el-container>
    <el-backtop 
      v-if="$route.path!='/login'" 
      :bottom="100" 
      :right="40">
    </el-backtop>
  </div>
</template>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	text-align: center;
	color: #2c3e50;
  min-width: 1500px;  /* 设置页面最小宽度，防止布局被浏览器的尺寸打乱。 */
}
::-webkit-scrollbar {
  width: 0 !important;
}
::-webkit-scrollbar {
  width: 0 !important;
  height: 0;
}
</style>

<style scoped>
.main {
  padding: 0;
  overflow-y: hidden;
  min-height: 78vh;
  width: 100%;
}
.footer {
  background-color: #F0F8FF;
  height: 100%;
}
.footer p {
  margin: 0;
  padding: 30px 0 40px;
}
</style>