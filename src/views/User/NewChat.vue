<script lang="ts" setup>
import SunsetCity from '@/components/CSSDoodle/SunsetCity.vue'
import { NButton, NInput, NTag, NDivider, NText, NAvatar, NCard, NIcon, useMessage, NScrollbar, NEllipsis } from 'naive-ui'
import { Image, ChatboxEllipsesOutline, Home, LogoGithub, SearchOutline } from '@vicons/ionicons5'
import { Emoji16Filled } from '@vicons/fluent'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const router = useRouter()
const message = useMessage()
const userStore = useUserStore()
const { userID } = storeToRefs(userStore)
 
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

// 消息类型
interface Message {
  day_time: string
  speaker: number
  details: string
}

// 消息数据
const messageData = ref<Message[]>([])
axios.get(`/api/getMessage/${userID.value}/1951002`)
  .then((res) => {
    let isSelfA = true
    res.data.forEach((item: any) => {
      messageData.value.push({
        day_time: item.date_time.substr(0, 19).replace('T', ' '),
        // 0 表示对方，1 表示该用户
        speaker: isSelfA ? (item.speaker === 0 ? 1 : 0) : (item.speaker === 1 ? 1: 0),
        details: item.details
      })
    })
  })

// 消息输入框model对象
const textarea = ref('')
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
      <!--消息列表-->
      <n-scrollbar
        style="max-height: 29.2em;"
        class="message-list">
        <div
          v-for="item in messageData"
          class="message-item">
          <n-tag
            class="time-tag"
            round
            size="small"
            :color="{ color: '#E39BB6', textColor: '#FFF'}">
            {{item.day_time}}
          </n-tag>          
          <div class="message-row">
            <div
              v-if="item.speaker !== 0"
              class="polyfill"/>
            <div
              :class="item.speaker === 0 ? 'oponent-bubble' : 'self-bubble'">
              {{item.details}}
            </div>
            <div
              v-if="item.speaker === 0"
              class="polyfill"/>
          </div>
        </div>
      </n-scrollbar>

      <n-divider class="divider"/>
      <!--输入框-->
      <n-input
        class="message-input"
        type="textarea"
        placeholder="Type your message."
        :autosize="{ minRows: 4, maxRows: 4 }"
        clearable
        maxlength="200" 
        show-count
        v-model:value="textarea"/>
      <!--聊天工具栏-->
      <div class="tool-bar">
        <n-icon
          class="emoji-icon"
          depth="4"
          size="24">
          <emoji16-filled/>
        </n-icon>
        <n-icon
          class="emoji-icon"
          depth="4"
          size="24">
          <Image/>
        </n-icon>        
        <div class="polyfill"/>
        <n-button
          size="small"
          round
          class="btn">
          关闭
        </n-button>        
        <n-button
          size="small"
          round
          color="#7BC4EF"
          class="btn">
          发送
        </n-button>
      </div> 
    </div>
  </n-card>
</template>

<style scoped lang="scss">
$pink: #E39BB6;
$shallow: #F7E3EA;
$smoke: #F3F3F3;
$grey: #aaa;
$purple: #B062A9;
$green: #55D2CA;
$deep-green: hsl(176,50%,50%);
$blue: #7BC4EF;

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

.message-list {
  display: flex;
  flex-direction: column;
}

.message-item {
  display: flex;
  flex-direction: column;
}

.time-tag {
  align-self: center;
  margin-bottom: .8em;
}


.message-row {
  display: flex;
}

.oponent-bubble {
  max-width: 16em;
  align-self: flex-start;
  border-radius: .6em;  
  margin-left: 1em;
  font-size: 1em;
  background-color: $green;
  text-align: left;
  word-wrap: break-word;
  padding: .5em;
  color: white;
  transition: box-shadow .4s ease-in-out;
  position: relative;
  &:not(:last-child) {
    margin-bottom: .4em;
  }
  &:hover {
    box-shadow: 0 7px 5px -5px $grey;
  }
  &::before {
    content: "";
    position: absolute;
    left: -.6em;
    bottom: 0;
    border: .8em solid $green;
    border-top-color: transparent;
    border-left-color: transparent;
    border-right-color: transparent;
  }
}

.self-bubble {
  max-width: 16em;
  align-self: flex-end;
  border-radius: .6em;  
  margin-right: 1em;
  font-size: 1em;
  background-color: $blue;
  text-align: left;
  word-wrap: break-word;
  padding: .5em;
  color: white;
  transition: box-shadow .4s ease-in-out;
  position: relative;
  &:not(:last-child) {
    margin-bottom: .4em;
  }
  &:hover {
    box-shadow: 0 7px 5px -5px $grey;
  }
  &::before {
    content: "";
    position: absolute;
    right: -.6em;
    bottom: 0;
    border: .8em solid $blue;
    border-top-color: transparent;
    border-left-color: transparent;
    border-right-color: transparent;
  }
}

.polyfill {
  flex-grow: 1;
}

.message-input {
  text-align: left;
  margin-top: .3em;
}

.tool-bar {
  display: flex;
  gap: 1em;
  height: 2em;
  margin-top: .6em;
  align-items: center;
  width: 100%;
  justify-content: flex-start;
}

.btn {
  align-self: flex-end;
}

.emoji-icon {
  align-self: flex-start;
  cursor: pointer;
  transition: box-shadow .2s ease-out;
  &:hover, &:active {
    box-shadow: 0 0 2px $grey;
  }
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