<template>
  <css-doodle
    class="sunset-avenue"
    @click="updateDoodle">
    :doodle { @grid: 1x35 / 100% 94vh; } 
    :container { 
        background: #ffcabb; 
        background: linear-gradient(to top, #ffcabb 50%, #de93b6 100%); 
        background-repeat: no-repeat; 
    } 
    
    position: relative; 
    align-self: end;
    height: @rand(10%, 75%);
    background: linear-gradient(to
    top, #725392 0%, #b764ac 100%);
    margin-left: @rand(0.1, 1)vw;
    z-index: 1;
    transform: scaleX(@rand(.8, 1.9));
    
    ::before { 
        content: ""; 
        position: absolute; 
        bottom: 0; 
        left: @rand(-20, 12)px; 
        right: @rand(-20, 12)px; 
        top: @rand(15, 55)%; 
        background: linear-gradient(to
        top, #352864 0%, #4d4280 100%); 
        z-index: 3; 
    } 
    
    ::after { 
        content: "";
        position: absolute;
        width: .1vw;
        height: .12vw;
        top: @rand(15, 20)%;
        left: @rand(10, 20)%;
        z-index: 5;
        box-shadow: 
            @rand(0.1, 2.1)vw @rand(0, 10)vh .5px rgba(246, 212, 0, .7),
            @rand(0.1, 2.1)vw @rand(10, 15)vh .5px rgba(246, 212, 0, .6), 
            @rand(0.1, 2.1)vw @rand(15, 22)vh .5px rgba(246, 212, 0, .7), 
            @rand(0.1, 2.1)vw @rand(22, 30)vh .5px rgba(246, 212, 0, .6), 
            @rand(0.1, 2.1)vw @rand(30, 40)vh .5px rgba(246, 212, 0, .8);
    }
  </css-doodle>
<div class="root">
  <div class="chat-wrapper">
    <div class="left-sider">
      <n-scrollbar max-height="48em">
        <p class="message-title">
          <NIcon :size="18">
            <Promotion/>
          </NIcon>
          消息列表
        </p>
        <div 
          class="oponent-card"
          :class="item.uid === currOponent ? 'oponent-card-selected' : null"
          v-for="(item) in oponentList"
          :key="item.uid"
          @click="changeOponent(item.uid, item.uname)">
          <n-avatar
            round
            :size="58"
            :src="item.avatar"
            fallback-src="http://106.15.78.201:8082/public/avatars/default.png"/>
          <div class="oponent-info">
            <p class="uname">{{item.uid}}&nbsp;{{item.uname}}</p>
          </div>
        </div>
      </n-scrollbar>
    </div>
    <div v-if="currOponentName !== ''" class="right-sider">
      <div class="right-bar">
        <p class="oponent-name">
          {{currOponent}} {{currOponentName}}
        </p>
        <NIcon 
          class="close-tag"
          :size="24"
          @click="closeChat">
          <close/>
        </NIcon>
      </div>
      <div class="message-wrapper">
        <n-scrollbar class="message-box" max-height="33em">
          <div
            class="message-template" 
            v-for="item in messageData"
            :key="item.day_time">
            <n-tag
              class="time-tag" 
              size="small"
              type="info">
              {{item.day_time}}
            </n-tag>
            <div
              :class="item.speaker === 0 ? 'oponentBubble' : 'selfBubble'">
              {{item.details}}
            </div>
          </div>
        </n-scrollbar>
      </div>
      <div class="input-textarea">
        <n-input
          v-model:value="textarea"
          type="textarea"
          maxlength="200" 
          show-count
          rows="4"
          autofocus/>
      </div>
      <NButton
        class="button"
        type="info"
        size="small"
        @click="handleSendMessage">
        发送
      </NButton>
    </div>
    <div v-else class="right-sider">
      <div class="right-bar">
        <p class="oponent-name">
          {{currOponent}} {{currOponentName}}
        </p>
      </div>
      <div class="empty-wrapper">
        <img src="http://106.15.78.201:8082/public/images/quin.jpg"/>
        <p class="dog">幸福往往是摸得透彻，而敬业的心却常常隐藏。</p>
      </div>
    </div> 
  </div>
</div>
</template>

<script setup lang="ts">
import { NScrollbar, NIcon, NAvatar, NTag, NInput, NButton } from "naive-ui"
import { Promotion, Close } from "@element-plus/icons-vue"
import { ref, onBeforeMount, onUnmounted, nextTick } from "vue"
import { useRoute } from 'vue-router'
import axios from "axios"
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import 'css-doodle'

// store
const userStore = useUserStore()
const { userID } = storeToRefs(userStore)

const route = useRoute()
let chatTimer: number | null | undefined
onBeforeMount(() => {
  let newOponent = route.query
  getChatList(newOponent.oponentID as string, newOponent.oponentName as string, newOponent.avatar as string)
  // 设置定时器
  //chatListTimer = setInterval(getChatList, 2000)
  chatTimer = window.setInterval(getMessage, 2000)
})

onUnmounted(() => {
  // 清除定时器
  clearInterval(chatTimer as number)
  chatTimer = null
})

// 对方信息类型
interface Oponent {
  uid: string
  uname: string
  avatar: string
}
const oponentList = ref<Oponent[]>([])
const currOponent = ref('我的聊天')
const currOponentName = ref('')
// 消息类型
interface Message {
  day_time: string
  speaker: number
  details: string
}
const messageData = ref<Message[]>([])
const textarea = ref('')

// 切换聊天对象
function changeOponent (oponentID: string, oponentName: string) {
  currOponent.value = oponentID
  currOponentName.value = oponentName
  getMessage(true)
}
// 关闭聊天窗口
function closeChat () {
  currOponent.value = '我的聊天'
  currOponentName.value = ''
}
// 获取聊天对象列表
function getChatList(newOponentID: string, newOponentName: string, newOponentAvatar: string){
  // 调用接口：传入（用户ID，聊天对象ID） 返回（聊天对象列表：ID，名称）
  const newList: Oponent[] = []
  axios.get(`/api/getChatOponent/${userID.value}`)
    .then(res => {
      res.data.forEach((item: any) => {
        newList.push({
          uid: item.user_id,
          uname: item.nickname,
          avatar: `http://106.15.78.201:8082/public/avatars/${item.avatar}`
        })
      })
    })
    .then(() => {
      if (newList.length !== oponentList.value.length) {
        oponentList.value.length = 0
        oponentList.value.push(...newList)
      }
      if (newOponentID) {
        let index = oponentList.value.findIndex(item => item.uid === newOponentID)
        if (index >= 0) {
          oponentList.value.splice(index, 1)
        }
        oponentList.value.unshift({
          uid: newOponentID,
          uname: newOponentName,
          avatar: newOponentAvatar          
        })
        currOponent.value = newOponentID
        currOponentName.value = newOponentName 
      }          
    })
}
// 获取消息列表
function getMessage (oponentChanged = false) {
  if (oponentChanged) {
    messageData.value.length = 0
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
          speaker: isSelfA ? (item.speaker === 0 ? 1 : 0) : (item.speaker === 1 ? 1: 0),
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
        // 如果切换对象，则初始化时将滚动条置于底部
        nextTick(() => {
          const scrollContainer = Array.from(document.getElementsByClassName('n-scrollbar-container'))[1]
          const scrollContent = Array.from(document.getElementsByClassName('n-scrollbar-content'))[1]
          scrollContainer.scrollTop = scrollContent.scrollHeight
        })
      }
    })
}
// 发送消息
function handleSendMessage () {
  let a_user_id = userID.value, b_user_id = currOponent.value
  if(a_user_id as string > b_user_id){
    [a_user_id, b_user_id] = [b_user_id, a_user_id as string]
  }
  const date = new Date(+ new Date() + 8 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ')
  let message = {
    a_user_id, b_user_id, 
    speaker: userID.value < currOponent.value ? '0' : '1',
    date_time: date,
    details: textarea.value        
  }
  // 调用接口：传入（用户ID，对方ID，说话方，时间，内容） 返回（null）
  axios.post('/api/sendMessage', message)

  textarea.value = ''
}

function updateDoodle (e: Event) {
  (e.target as any).update()
}
</script>

<style scoped>
.sunset-avenue {
  cursor: pointer;
}
.root {
  position: absolute;
  top: 80px;
  z-index: 6;
  display: flex;
  justify-content: center;
  --blue: #4790DC;
}
.chat-wrapper {
  font-size: .8rem;
  width: calc(60em + .6em);
  height: calc(48em + .6em);
  background-color: #FCFCFC;
  display: flex;
  box-sizing: border-box;
  overflow: auto;
  border-radius: .3em;
  box-shadow: 0 0 .3em rgba(0,0,0,0.2);
}
.left-sider {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  width: 17em;
  font-size: .8rem;
  border: 1px solid #91ABCD;
}
.message-title {
  margin: 0;
  background-color: var(--blue);
  padding: .4em 0 .2em 0;
  font-weight: 500;
  color: white;
  font-size: .9rem;
  letter-spacing: .2em;
}
.oponent-card {
  display: flex;
  background-color: #FCFCFC;
  box-sizing: border-box;
  padding: .5em;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  color: #666;
  font-weight: 600;
}
.oponent-card:hover {
  background-color: #E1E9F3;
}
.oponent-card-selected {
  background-color: #91ABCD;
  color: white;
}
.oponent-card-selected:hover {
  background-color: #91ABCD;
  color: white;
}
.oponent-info {
  display: flex;
  flex-direction: column;
  padding-left: 1em;
}
.uname {
  margin: .5em 0 .2em 0;
}
.right-sider {
  flex: 1 1 0;
  box-sizing: border-box;
  border: 1px solid #91ABCD;
  border-left: none;
  display: flex;
  flex-direction: column;
}
.right-bar {
  background-color: #F3F4F6;
  display: flex;
  border-bottom: 1px solid white;  
}
.oponent-name {
  flex-grow: 1;
  text-align: left;
  color: #666;
  margin: 0;
  padding: .2em 0 .1em 1em;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: .1em;
}
.close-tag {
  flex-grow: 0;
  cursor: pointer;
  padding-top: .2em;
}
.message-wrapper {
  box-sizing: border-box;
  border: 1px solid #91ABCD;
  margin: .6em;
  background-color: #fff;
  height: 33em;
}
.message-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.message-template {
  display: flex;
  flex-direction: column;
}
.time-tag {
  align-self: center;
  margin: .6em 0;
}
.oponentBubble {
  max-width: 18em;
  align-self: flex-start;
  padding: .3em .5em;
  margin-left: .6em;
  font-size: .9rem;
  background-color: #4793DA;
  color: white;
  border-radius: .5em;
  text-align: left;
  word-wrap: break-word;
  margin-bottom: .2em;
}
.selfBubble {
  max-width: 18em;   
  align-self: flex-end;
  padding: .3em .5em;
  margin-right: .6em;
  font-size: .9rem;
  background-color: #BDDEFD;
  color: black;
  border-radius: .5em;
  text-align: left;
  word-wrap: break-word; 
  margin-bottom: .2em; 
}
.input-textarea {
  padding: 0 .6em;
  text-align: left;
}
.button {
  align-self: flex-end;
  margin-top: .5em;
  margin-right: .6em;
}
.empty-wrapper {
  padding-top: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
}
.dog {
  margin: 1em 0;
  font-size: 1.5rem;
  letter-spacing: .2em;
}
</style>