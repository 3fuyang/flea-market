<script lang="ts" setup>
import SunsetCity from '@/components/CSSDoodle/SunsetCity.vue'
import { NEmpty, NButton, NInput, NTag, NDivider, NText, NAvatar, NCard, NIcon, useMessage, NScrollbar, NEllipsis } from 'naive-ui'
import { ChatboxEllipsesOutline, Home, LogoGithub, SearchOutline } from '@vicons/ionicons5'
import { BuildingSkyscraper20Regular, Building20Filled, BuildingMultiple20Filled, Emoji16Filled } from '@vicons/fluent'
import { useRouter, useRoute } from 'vue-router'
import { computed, ref, onBeforeMount, nextTick, onBeforeUnmount } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { VuemojiPicker, type EmojiClickEventDetail } from 'vuemoji-picker'
import { io } from 'socket.io-client'

const router = useRouter()
const route = useRoute()
const message = useMessage()
const userStore = useUserStore()
const { userID } = storeToRefs(userStore)

const socket = io('http://106.15.78.201:8082', {
  extraHeaders: {
    'userid': userID.value
  }
})

onBeforeUnmount(() => {
  // 卸载组件前，断开socket连接
  socket.disconnect()
})

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

// 消息输入框model对象
const textarea = ref('')

// emoji-picker 开关
const emojiPickerSwitch = ref(false)

// emoji-picker 点击事件
function handleEmojiClick(detail: EmojiClickEventDetail) {
  textarea.value += detail.unicode
  emojiPickerSwitch.value = false
}

// 对方类型
interface Oponent {
  uid: string
  uname: string
  avatar: string
  latest: string
}
// 全部聊天对象model
const oponentsList = ref<Oponent[]>([])

// 筛选对象输入框model对象
const filter = ref('')
// 聊天对象model对象
const oponentsView = computed(() => {
  if (filter.value.length > 0) {
    const newView = oponentsList.value.filter((item) => {
      return new RegExp(filter.value, 'img').test(item.uid.concat(item.uname))
    })
    return newView
  } else {
    return oponentsList.value
  }
})

// 挂载前，获取消息对象列表，并开启定时器
onBeforeMount(() => {
  let newOponent = route.query
  getChatList(newOponent.oponentID as string, newOponent.oponentName as string, newOponent.avatar as string)
})

// 当前聊天对象ID
const currOponent = ref('我的聊天')
// 当前聊天对象昵称
const currOponentName = ref('')

// 切换聊天对象
function changeOponent(oponentID: string, oponentName: string) {
  currOponent.value = oponentID
  currOponentName.value = oponentName
  textarea.value = ''
  getMessage(true)
}

// 关闭聊天窗口
function closeChat() {
  currOponent.value = '我的聊天'
  currOponentName.value = ''
  textarea.value = ''
}

// 获取聊天对象列表
function getChatList(newOponentID: string, newOponentName: string, newOponentAvatar: string, newLatest: string = '') {
  // 调用接口：传入（用户ID，聊天对象ID） 返回（聊天对象列表：ID，名称）
  const newList: Oponent[] = []
  axios.get(`/api/getChatOponent/${userID.value}`)
    .then(res => {
      res.data.forEach((item: any) => {
        newList.push({
          uid: item.user_id,
          uname: item.nickname,
          avatar: `http://106.15.78.201:8082/public/avatars/${item.avatar}`,
          latest: item.latest
        })
      })
    })
    .then(() => {
      if (newList.length !== oponentsList.value.length) {
        oponentsList.value.length = 0
        oponentsList.value.push(...newList)
      }
      if (newOponentID) {
        let index = oponentsList.value.findIndex(item => item.uid === newOponentID)
        if (index >= 0) {
          oponentsList.value.splice(index, 1)
        }
        oponentsList.value.unshift({
          uid: newOponentID,
          uname: newOponentName,
          avatar: newOponentAvatar,
          latest: newLatest
        })
        currOponent.value = newOponentID
        currOponentName.value = newOponentName
        getMessage(true)
      }
    })
}

// 获取消息列表
function getMessage(oponentChanged = false) {
  if (oponentChanged) {
    messageData.value.length = 0
  }
  if (currOponent.value === '我的聊天') {
    return false
  }
  let newMessage: Message[] = []
  // 调用接口：传入（用户ID，聊天对象ID） 返回（两人消息列表：时间、说话方、内容）
  let a_user_id = userID.value, b_user_id = currOponent.value
  if ((a_user_id as string) > b_user_id) {
    [a_user_id, b_user_id] = [b_user_id, a_user_id as string]
  }
  axios.get(`/api/getMessage/${a_user_id}/${b_user_id}`)
    .then((res) => {
      let isSelfA = a_user_id === userID.value
      res.data.forEach((item: any) => {
        newMessage.push({
          day_time: item.date_time.substr(0, 19).replace('T', ' '),
          // 0 表示对方，1 表示该用户
          speaker: isSelfA ? (item.speaker === 0 ? 1 : 0) : (item.speaker === 1 ? 1 : 0),
          details: item.details
        })
      })
    })
    .then(() => {
      if (oponentChanged || newMessage.length !== messageData.value.length) {
        messageData.value.length = 0
        messageData.value.push(...newMessage)
      }
      if (oponentChanged) {
        nextTick(() => {
          const scrollContainer = Array.from(document.getElementsByClassName('n-scrollbar-container'))[1]
          // 如果切换对象，则初始化时将滚动条置于底部
          scrollContainer.scrollTop = scrollContainer.scrollHeight
        })
      } else {
        const scrollContainer = Array.from(document.getElementsByClassName('n-scrollbar-container'))[1]
        // 判断滚动条是否在底部
        if (scrollContainer.scrollHeight > scrollContainer.clientHeight && scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight < 1) {
          nextTick(() => {
            scrollContainer.scrollTop = scrollContainer.scrollHeight
          })
        }
      }
    })
}

socket.on('deliver message', (msg) => {
  // 获取对话者 ID，将其移至对话者列表的顶端
  let oponentID: string = userID.value === msg.a_user_id ? msg.b_user_id : msg.a_user_id
  const index = oponentsList.value.findIndex((item) => item.uid === oponentID)
  if (index > 0) {
    // 对话者已在列表中且不是首位，将其移至首位
    const tmp = oponentsList.value.splice(index, 1)[0]
    tmp.latest = msg.details
    oponentsList.value.unshift(tmp)
  } else if (index < 0) {
    // 对话者不在列表中
    axios.get(`/api/getOponentInfo/${oponentID}`)
      .then((res: any) => {
        oponentsList.value.unshift({
          uid: oponentID,
          uname: res.data.nickname,
          avatar: `http://106.15.78.201:8082/public/avatars/${res.data.avatar}`,
          latest: msg.details
        })
      })
  } else {
    // 对话者已经处于首位
    oponentsList.value[0].latest = msg.details
  }
  // 如果目前的对话者正是发来消息的对话者，则更新消息列表
  if (currOponent.value === oponentID) {
    getMessage()
  }
})

// 发送消息
function handleSendMessage() {
  let a_user_id = userID.value, b_user_id = currOponent.value
  if (a_user_id as string > b_user_id) {
    [a_user_id, b_user_id] = [b_user_id, a_user_id as string]
  }
  const date = new Date(+ new Date() + 8 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ')
  let message = {
    a_user_id, b_user_id,
    speaker: userID.value < currOponent.value ? '0' : '1',
    date_time: date,
    details: textarea.value
  }
  // 向 socket 连接传递"发送消息"事件
  new Promise(() => {
    socket.emit('send message', message)
  }).then(() => {
    getMessage()
    nextTick(() => {
      const scrollContainer = Array.from(document.getElementsByClassName('n-scrollbar-container'))[1]
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    })
  })

  textarea.value = ''
}
</script>

<template>
  <!--css-doodle背景-->
  <sunset-city />

  <!--聊天窗口-->
  <n-card :content-style="cardContentStyle" hoverable :bordered="false" class="chat-frame">

    <!--左端导航栏-->
    <div class="nav">
      <n-icon v-for="item in menuItems" class="nav-icon" size="24" @click="item.onClick">
        <chatbox-ellipses-outline v-if="item.title === 'chat'" />
        <home v-else-if="item.title === 'home'" />
        <logo-github v-else />
      </n-icon>
    </div>

    <!--中间栏-->
    <div class="friends-nav">

      <!--搜索框-->
      <n-input v-if="oponentsList.length > 0" class="search-input" round placeholder="Search" size="small" clearable
        v-model:value="filter">
        <template #suffix>
          <n-icon>
            <SearchOutline />
          </n-icon>
        </template>
      </n-input>

      <!--聊天对象列表-->
      <n-scrollbar class="oponent-list" style="max-height: 40em">
        <n-empty description="No Data" v-if="oponentsView.length === 0" />
        <n-card v-for="item in oponentsView" class="oponent-card" :content-style="oponentCardStyle" hoverable
          @click="changeOponent(item.uid, item.uname)">
          <!--头像-->
          <n-avatar round fallback-src="https://www.naiveui.com/assets/naivelogo.93278402.svg" :src="item.avatar" />
          <!--昵称-->
          <div class="nickname">
            <n-ellipsis class="ellipsis">
              {{ `${item.uid} ${item.uname}` }}
            </n-ellipsis>
            <span class="native-ellipsis">
              {{ item.latest }}
            </span>
          </div>
        </n-card>
      </n-scrollbar>
    </div>

    <!--聊天区-->
    <div class="message-box">
      <!--窗口标题-->
      <n-text class="oponent-title" strong>
        {{ `${currOponent} ${currOponentName}` }}
        <span v-if="currOponent !== '我的聊天'" class="dash">_</span>
      </n-text>

      <n-divider class="divider" />
      <!--未选中对象时-->
      <div class="empty-wrapper" v-if="currOponent === '我的聊天'">
        <n-empty description="Can anybody find me somebody to TALK ~">
          <template #icon>
            <div style="display: flex;justify-content: center;">
              <n-icon>
                <Building20Filled />
              </n-icon>
              <n-icon>
                <BuildingMultiple20Filled />
              </n-icon>
              <n-icon>
                <BuildingSkyscraper20Regular />
              </n-icon>
            </div>
          </template>
        </n-empty>
      </div>
      <!--消息列表-->
      <div class="chat-wrapper" v-if="currOponent !== '我的聊天'">
        <n-scrollbar style="max-height: 29.2em;" class="message-list">
          <div v-for="item in messageData" class="message-item">
            <n-tag class="time-tag" round size="small" :color="{ color: '#E39BB6', textColor: '#FFF' }">
              {{ item.day_time }}
            </n-tag>
            <div class="message-row">
              <div v-if="item.speaker !== 0" class="polyfill" />
              <div :class="item.speaker === 0 ? 'oponent-bubble' : 'self-bubble'">
                {{ item.details }}
              </div>
              <div v-if="item.speaker === 0" class="polyfill" />
            </div>
          </div>
        </n-scrollbar>

        <n-divider class="divider" />
        <!--输入框-->
        <n-input class="message-input" type="textarea" placeholder="Type your message."
          :autosize="{ minRows: 4, maxRows: 4 }" clearable maxlength="200" show-count v-model:value="textarea" />
        <!--聊天工具栏-->
        <div class="tool-bar">
          <vuemoji-picker v-if="emojiPickerSwitch" class="emoji-picker" @emoji-click="handleEmojiClick" />
          <n-icon class="emoji-icon" depth="4" size="24" @click="emojiPickerSwitch = !emojiPickerSwitch">
            <emoji16-filled />
          </n-icon>
          <div class="polyfill" />
          <n-button size="small" round class="btn" @click="closeChat">
            关闭
          </n-button>
          <n-button size="small" round color="#7BC4EF" class="btn" @click="handleSendMessage">
            发送
          </n-button>
        </div>
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
$deep-green: hsl(176, 50%, 50%);
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
  animation: blink 1.5s steps(2, end) infinite;
}

.divider {
  margin: .15em 0;
  margin-bottom: .5em;
}

.empty-wrapper {
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
}

.chat-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.message-list {
  display: flex;
  flex-direction: column;
}

.message-item {
  display: flex;
  flex-direction: column;

  &:not(:last-child) {
    margin-bottom: .6em;
  }
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
  position: relative;
}

.emoji-picker {
  position: absolute;
  bottom: 2em;
  left: 0;
}

.btn {
  align-self: flex-end;
}

.emoji-icon {
  align-self: flex-start;
  cursor: pointer;
  transition: box-shadow .2s ease-out;

  &:hover,
  &:active {
    box-shadow: 0 0 2px $grey;
  }
}

.image-icon {
  align-self: flex-start;
  cursor: pointer;
  transition: box-shadow .2s ease-out;

  &:hover,
  &:active {
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