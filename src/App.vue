<script setup lang="ts">
import TopBar from './components/NewTopBar.vue'
import BlossomDoodle from './components/Doodles/BlossomDoodle.vue'
import ShiveringDoodle from './components/Doodles/ShiveringDoodle.vue'
import { NScrollbar, NNotificationProvider, NLoadingBarProvider, NMessageProvider, NDialogProvider } from 'naive-ui'

const barStyle = {
  loading: {
    backgroundColor: '#93E5EB'
  }
}
</script>

<template>
  <div id="app">
    <n-message-provider :max="1">
      <n-dialog-provider>
        <n-notification-provider>

          <!--文档主体-->
          <article class="container">
            <!--顶部导航栏-->
            <nav v-if="$route.path !== '/login'" class="nav-bar">
              <n-loading-bar-provider :loading-bar-style="barStyle">
                <top-bar />
              </n-loading-bar-provider>
            </nav>

            <!--中心内容-->
            <main class="main">
              <!--左侧花瓣-->
              <div v-show="$route.path !== '/login'" class="doodle-wrapper-r">
                <blossom-doodle />
              </div>

              <!--右侧叶片-->
              <div v-show="$route.path !== '/login'" class="doodle-wrapper-l">
                <shivering-doodle />
              </div>

              <!--RouterView-->
              <suspense>
                <router-view />
              </suspense>
            </main>

            <!--弹性区域-->
            <div style="flex: 1;" />

            <!--脚注-->
            <footer v-if="!['/login', '/newchat'].includes($route.path)" class="footer">
              <p>
                Copyright ©2022 同济大学校内二手交易平台
              </p>
            </footer>
          </article>

          <!--回到顶部-->
          <el-backtop v-if="$route.path != '/login'" :bottom="100" :right="40">
          </el-backtop>
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-align: center;
  color: #2c3e50;
  min-width: 1500px;
  /* 设置页面最小宽度，防止布局被浏览器的尺寸打乱。 */
  background-color: #F5F5F5;
  position: relative;
  overflow: auto;
}

/* 滚动条整体 */
::-webkit-scrollbar {
  width: 8px !important;
  height: 8px !important;
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background-color: none;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: #BFBFBF;

  &:hover {
    background-color: #999;
  }
}
</style>

<style scoped lang="scss">
.container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.nav-bar {
  padding: 0;
  /* auto 根据内容高度自动调整 */
  height: auto;
}

.main {
  padding: 0;
  overflow: hidden;
  min-height: 49em;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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

  & p {
    margin: 0;
    padding-top: 1.1em;
  }
}
</style>