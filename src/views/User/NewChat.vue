<script lang="ts" setup>
import SunsetCity from '@/components/CSSDoodle/SunsetCity.vue'
import { NDivider, NText, NAvatar, NCard, NIcon, useMessage, NInput, NScrollbar, NEllipsis } from 'naive-ui'
import { ChatboxEllipsesOutline, Home, LogoGithub, SearchOutline } from '@vicons/ionicons5'
import { useRouter } from 'vue-router'

const router = useRouter()
const message = useMessage()

// NavBar 中按钮
const menuItems = [
  {
    title: 'chat',
    onClick: () => {
      message.info(`...... nothing happens.`)
    }
  }, 
  {
    title: 'home',
    onClick: () => {
      router.push('/home')
    }
  }, 
  {
    title: 'github',
    onClick: () => {
      const url = 'https://github.com/3fuyang/flea-market'
      window.open(url, '_blank')
    }
  }
]

// 聊天卡片content样式
const cardContentStyle = {
  display: 'flex',
  padding: 0
}

// 聊天对象卡片content样式
const oponentCardStyle = {
  padding: '.5em',
  display: 'flex',
  alignItems: 'center',
  gap: '.5em'
}
</script>

<template>
  <!--css-doodle背景-->
  <sunset-city/>

  <!--聊天窗口-->
  <n-card
    :content-style="cardContentStyle"
    hoverable
    :bordered="false"
    class="chat-frame">

    <!--左端导航栏-->
    <div class="nav">
      <n-icon
        v-for="item in menuItems"
        class="nav-icon"
        size="24"
        @click="item.onClick">
        <chatbox-ellipses-outline v-if="item.title === 'chat'"/>
        <home v-else-if="item.title === 'home'" />
        <logo-github v-else />
      </n-icon>
    </div>

    <!--中间栏-->
    <div class="friends-nav">

      <!--搜索框-->
      <n-input
        class="search-input"
        round
        placeholder="Search"
        size="small">
        <template #suffix>
          <n-icon>
            <SearchOutline />
          </n-icon>
        </template>
      </n-input>

      <!--聊天对象列表-->
      <n-scrollbar 
        class="oponent-list"
        style="max-height: 40em">
        <n-card
          v-for="n in 12"
          class="oponent-card"
          :content-style="oponentCardStyle"
          hoverable>
          <!--头像-->
          <n-avatar
            round
            fallback-src="https://www.naiveui.com/assets/naivelogo.93278402.svg"
            src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"/>
          <!--昵称-->
          <div class="nickname">
            <n-ellipsis class="ellipsis">
              1951001 布裸斯·韦天
            </n-ellipsis>
            <span class="native-ellipsis">
              最新消息最新消息最新消息最新消息最新消息最新消息最新消息
            </span>
          </div>
        </n-card>
      </n-scrollbar>
    </div>

    <!--聊天窗口-->
    <div class="message-box">
      <!--窗口标题-->
      <n-text
        class="oponent-title"
        strong>
        1951001 布裸斯·韦天
        <span class="dash">_</span>
      </n-text>

      <n-divider class="divider"/>
      <!--消息窗口-->
      <n-scrollbar style="max-height: 48em;">

      </n-scrollbar>
    </div>
  </n-card>
</template>

<style scoped lang="scss">
$pink: #E39BB6;
$shallow: #F7E3EA;
$smoke: #F3F3F3;
$grey: #aaa;
$purple: #B062A9;

.chat-frame {
  box-sizing: border-box;
  font-size: .8rem;
  position: absolute;
  top: 2em;
  z-index: 6;
  width: 60em;
  height: 49em;
}

.nav {
  background-color: $pink;
  width: 3.2em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2em;
  align-items: center;
}

.nav-icon {
  transition: color .6s ease-out;
  cursor: pointer;
  color: $shallow;
  &:hover {
    color: white;
  }
}

.friends-nav {
  background-color: $smoke;
  width: 16em;
  padding: 1em;
}

.search-input {
  text-align: left;
  padding-left: 1em;
  margin-bottom: .8em;  
}

.oponent-list {
  display: flex;
  flex-direction: column;
}

.oponent-card {
  border-radius: 1em;
  height: 4em;
  cursor: pointer;
  &:not(:first-child) {
    margin-top: .5em;
  }
}

.nickname {
  text-align: left;
  font-size: .6rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.ellipsis {
  max-width: 12em;
}

.native-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: .5rem;
  max-width: 14em;
  color: $grey;
}

.message-box {
  box-sizing: border-box;
  flex-grow: 1;
  display: flex;
  padding: 1em;
  flex-direction: column;
  align-items: center;
}

.oponent-title {
  letter-spacing: .04em;
  font-size: 1.1em;
}

.dash {
  font-weight: bold;
  animation: blink 1.5s steps(2, end)  infinite;
}

.divider {
  margin: .15em 0;
  margin-bottom: .5em;
}

@keyframes blink {
  from {
    color: white;
  }
  to {
    color: $purple;
  }
}
</style>