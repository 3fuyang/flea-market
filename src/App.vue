<script setup lang="ts">
import TopBar from './components/NewTopBar.vue'
import BlossomDoodle from './components/Doodles/BlossomDoodle.vue'
import ShiveringDoodle from './components/Doodles/ShiveringDoodle.vue'
import { NNotificationProvider, NLoadingBarProvider, NMessageProvider, NDialogProvider } from 'naive-ui'

const barStyle = {
  loading: {
    backgroundColor: '#93E5EB'
  }
}
</script>

<template>
	<div
    id="app" 
    class="app">
    <n-message-provider :max="1">
      <n-dialog-provider>
        <n-notification-provider>
          <el-container style="overflow-x: hidden;">
            <el-header 
              v-if="$route.path != '/login'" 
              style="padding: 0;height: auto;">
              <n-loading-bar-provider :loading-bar-style="barStyle">
                <top-bar />
              </n-loading-bar-provider>
            </el-header>      
            <el-main class="main provider">
              <div
                v-show="$route.path !== '/login'"
                class="doodle-wrapper-r">
                <blossom-doodle/>            
              </div>
              <div
                v-show="$route.path !== '/login'"
                class="doodle-wrapper-l">
                <shivering-doodle/>            
              </div>          
              <router-view/>
            </el-main>
            <el-footer 
              v-if="!['/login', '/newchat'].includes($route.path)" 
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
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </div>
</template>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	text-align: center;
	color: #2c3e50;
  min-width: 1500px;  /* 设置页面最小宽度，防止布局被浏览器的尺寸打乱。 */
  background-color: #F5F5F5;
  position: relative;
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
  overflow: hidden;
  min-height: 49em;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.provider {
  position: relative;
}
.doodle-wrapper-r {
  position: absolute;
  top: 10%;
  left: 0;
  z-index: .1;
}
.doodle-wrapper-l {
  position: absolute;
  bottom: 10%;
  right: -2em;
  z-index: .1;
}
.footer {
  background-color: #F0F8FF;
  height: 5em;
  display: flex;
  justify-content: center;
  align-items: center;
}
.footer p {
  margin: 0;
  padding-top: 1.1em;
}
</style>