<template>
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
            fallback-src="http://127.0.0.1:8082/public/avatars/default.png"/>
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
        <img src="http://127.0.0.1:8082/public/images/quin.jpg"/>
        <p class="dog">幸福往往是摸得透彻，而敬业的心却常常隐藏。</p>
      </div>
    </div> 
  </div>
</div>
</template>

<script setup>
import { NScrollbar, NIcon, NAvatar, NTag, NInput, NButton } from "naive-ui"
import { Promotion, Close } from "@element-plus/icons-vue"
import { ref, onBeforeMount, onUnmounted } from "vue"
import { useRoute } from 'vue-router'
import axios from "axios"

const route = useRoute()
let chatTimer
onBeforeMount(() => {
  let newOponent = route.query
  console.log(newOponent)
  getChatList(newOponent.oponentID, newOponent.oponentName, newOponent.avatar)
  // 设置定时器
  //chatListTimer = setInterval(getChatList, 2000)
  chatTimer = setInterval(getMessage, 2000)
})

onUnmounted(() => {
  // 清除定时器
  clearInterval(chatTimer)
  chatTimer = null
})

const userID = window.sessionStorage.getItem('uid')
const oponentList = ref([])
const currOponent = ref('我的聊天')
const currOponentName = ref('')
const messageData = ref([])
const textarea = ref('')

// 切换聊天对象
function changeOponent(oponentID,oponentName){
  currOponent.value = oponentID
  currOponentName.value = oponentName
  getMessage(true)
}
// 关闭聊天窗口
function closeChat(){
  currOponent.value = '我的聊天'
  currOponentName.value = ''
}
// 获取聊天对象列表
function getChatList(newOponentID = null, newOponentName = null, newOponentAvatar = null){
  // 调用接口：传入（用户ID，聊天对象ID） 返回（聊天对象列表：ID，名称）
  const newList = []
  axios.get(`/api/getChatOponent/${userID}`)
    .then(res => {
      res.data.forEach((item) => {
        newList.push({
          uid: item.user_id,
          uname: item.nickname,
          avatar: `http://127.0.0.1:8082/public/avatars/${item.avatar}`
        })
      })
    })
    .then(() => {
      if(newList.length !== oponentList.value.length){
        oponentList.value = newList
      }
      if(newOponentID){
        let index = oponentList.value.findIndex(item => item.uid === newOponentID)
        if(index >= 0){
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
function getMessage(oponentChanged = false){
  if(oponentChanged){
    messageData.value = []
  }
  let newMessage = []
  // 调用接口：传入（用户ID，聊天对象ID） 返回（两人消息列表：时间、说话方、内容）
  let a_user_id = userID, b_user_id = currOponent.value
  if(a_user_id > b_user_id){
    [a_user_id, b_user_id] = [b_user_id, a_user_id]
  }
  axios.get(`/api/getMessage/${a_user_id}/${b_user_id}`)
    .then((res) => {
      let isSelfA = a_user_id === userID
      res.data.forEach((item) => {
        newMessage.push({
          day_time: item.date_time.substr(0, 19).replace('T', ' '),
          // 0 表示对方，1 表示该用户
          speaker: isSelfA ? (item.speaker === 0 ? 1 : 0) : (item.speaker === 1 ? 1: 0),
          details: item.details
        })
      })
    })
    .then(() => {
      if(oponentChanged || newMessage.length !== messageData.value.length){
        messageData.value = newMessage
      }
    })
}
// 发送消息
function handleSendMessage(){
  let a_user_id = userID, b_user_id = currOponent.value
  if(a_user_id > b_user_id){
    [a_user_id, b_user_id] = [b_user_id, a_user_id]
  }
  const date = new Date(+ new Date() + 8 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ')
  let message = {
    a_user_id, b_user_id, 
    speaker: userID < currOponent.value ? '0' : '1',
    date_time: date,
    details: textarea.value        
  }
  // 调用接口：传入（用户ID，对方ID，说话方，时间，内容） 返回（null）
  axios.post('/api/sendMessage', message)

  textarea.value = ''
}
</script>

<style scoped>
.root {
  display: flex;
  margin: 20px 0;
  justify-content: center;
  --blue: #4790DC;
  background: linear-gradient(90deg, rgba(200, 200, 200, 0.1) 3%, transparent 0),
  linear-gradient(rgba(200, 200, 200, 0.1) 3%, transparent 0);
  background-size: 20px 20px;
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