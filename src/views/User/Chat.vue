<template>
<div id="name">
<el-scrollbar>
  <el-row>
    <el-col :span="5"></el-col>
    <el-col :span="14">
      <el-card style="width: 100%;margin: 5px 0px;" body-style="background-color: #fff;height:500px;padding:0px">
        <el-row>
          <el-col :span="6">
            <div style="background: #EDEAE8;height: 500px;">
              <span><el-icon :size="20"><promotion/></el-icon></span>
              <span style="display: inline-block;font-size: 14px;margin: 14px 0px;">&nbsp;消息列表</span>
              <el-divider style="padding: 0px;margin: 0px;"/>
              <div class="oponentBlockList">
                <div class="point" v-for="(item) in oponentList" :key="item.uid" style="margin-top: 5px;" @click="changeOponent(item.uid,item.uname)">
                  <el-row>
                    <el-col :span="1"></el-col>
                    <el-col :span="7">
                      <el-avatar shape="square" :src="squareUrl" :size="51" style="background-color: aliceblue;color: #336699;margin-top: 2px;">
                      </el-avatar>
                    </el-col>
                    <el-col :span="14">
                      <div style="text-align: left;">
                        <span style="display: inline-block;font-size: 14px;margin-top: 17px;margin-left: 5px;">{{item.uid}}&nbsp;&nbsp;{{item.uname}}</span>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="18">
            <div style="text-align: left;background: #F5F5F5;">
              <span style="display: inline-block;font-size: 24px;font-weight: bold;margin-top: 5px;margin-bottom: 5px;margin-left: 30px;">
                {{currOponent}}&nbsp;&nbsp;&nbsp;{{currOponengName}}
              </span>
              <el-icon v-show="currOponent!='我的聊天'" class="point" style="font-size: 18px;float: right;margin-top: 12px;margin-right: 5px;" @click="closeChat()">
                <close/>
              </el-icon>
              <el-divider style="padding: 0px;margin: 0px;"/>
            </div>
            <div v-show="currOponent==='我的聊天'" style="background: #F5F5F5;border: 1px solid #fff;width: 100%;height: 455px;">
              <el-icon style="display: inline-block;color: #EBEBEB;font-size: 100px;font-weight: bold;margin-top: 140px;">
                <chat-dot-round/>
              </el-icon>
            </div> 
            <div v-show="currOponent!='我的聊天'">           
              <div style="background: #F5F5F5;border: 1px solid #fff;width: 100%;height: 340px;">
                <div v-for="(item) in messageData" :key="item.day_time">
                    <el-tag size="small" style="margin: 15px 0px;">
                      {{item.day_time}}
                    </el-tag>
                    <div v-if="item.speaker==0">
                      <el-row>
                        <div class="contentOponent">
                          <span style="line-height: 23px;text-align: left;margin-left: 6px;">{{item.details}}</span>
                        </div>
                      </el-row>
                    </div>
                    <div v-else>
                      <el-row>
                        <el-col :span="12"></el-col>
                        <el-col :span="12">
                          <el-row justify="end">
                            <div class="contentSelf">
                              <span style="line-height: 23px;text-align: left;margin-left: 60px;">{{item.details}}</span>                            
                            </div>
                          </el-row>
                        </el-col>
                      </el-row>
                    </div>
                </div>
              </div>
              <div style="background: #fff;border: 1px solid #F5F5F5;width: 100%;height: 120px;">
                <el-input
                  type="textarea"
                  placeholder="Please input and send message with enter."
                  style="width: 660px;"
                  rows="5"
                  resize="none"
                  v-model="textarea"
                  maxlength="200"
                  show-word-limit
                  @keydown.enter="handleSendMessage" />
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>      
    </el-col>
  </el-row>
</el-scrollbar>
</div>
</template>

<script>
import { Promotion, Close, ChatDotRound } from "@element-plus/icons-vue";
export default {
  components:{
      Promotion, Close, ChatDotRound
  },

  created(){
    this.getChatList();
    // 设置定时器
    this.chatListTimer = setInterval(this.getChatList, 1000);
    this.chatTimer = setInterval(this.getMessage, 1000);
  },

  beforeRouteLeave(){
    // 清除定时器
    clearInterval(this.chatListTimer);
    this.chatListTimer = null;
    clearInterval(this.chatTimer);
    this.chatTimer = null;
  },

  data(){
    return{
      userID: window.sessionStorage.getItem('uid'), // 用户ID
      oponentList: [], // 聊天对象列表
      currOponent: '我的聊天',  // 当前聊天对象ID
      currOponengName: '',  // 当前聊天对象名称
      messageData: [],  // 当前聊天消息列表
      chatListTimer: '',  // 聊天对象列表定时器
      chatTimer: '',  // 聊天消息定时器
      textarea: '', // 输入框文本
      squareUrl: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',  // 头像图片 url
    }
  },

  methods:{
    // 切换聊天对象
    changeOponent(oponentID,oponentName){
      this.currOponent = oponentID;
      this.currOponengName = oponentName;
      this.getMessage();
    },
    // 关闭聊天窗口
    closeChat(){
      this.currOponent='我的聊天';
      this.currOponengName='';
    },
    // 获取聊天对象列表
    getChatList(){
      // 调用接口：传入（用户ID，聊天对象ID） 返回（聊天对象列表：ID，名称）
      if(!this.oponentList.length){
        this.oponentList=[{
          uid: '1953193',
          uname: 'Fwio',
          },{
          uid: '1852185',
          uname: 'Hegel',
          },{
          uid: '1703682',
          uname: 'Joe',
          },];
      }
    },
    // 获取消息列表
    getMessage(){
      // 调用接口：传入（用户ID，聊天对象ID） 返回（两人消息列表：时间、说话方、内容）
      if(!this.messageData.length){
        this.messageData=[{
          day_time: '2022/1/3 上午8:01:15',
          speaker: '0',
          details:'Hello World',
          },{
          day_time: '2022/1/3 上午8:04:52',
          speaker: '1',
          details:'Test Reply',
          },]
      }
    },
    // 发送消息
    handleSendMessage(){
      var date = new Date();
      // 调用接口：传入（用户ID，对方ID，说话方，时间，内容） 返回（null）
      this.messageData.push({
        day_time: date.toLocaleString(),
        speaker: '1',
        details: this.textarea,
      })
      this.textarea='';
    },
  },
}
</script>

<style scoped>
.oponentBlockList :hover{
  background-color: #D9D8D8;
}
.point{
  cursor: pointer;
}
.contentOponent :hover{
  background-color: #FAFAFA;
}
.contentOponent span{
  background-color: #ecf5ff;
  padding: 5px 8px;
  display: inline-block;
  border-radius: 10px;
  margin: 0px 0px 0px 5px;
  position: relative;
  border: 1px solid #E3E3E3;
  max-width: 290px;  
}
.contentSelf {
  float: right;
}

.contentSelf :hover {
  background-color: #0a61cc;
}

.contentSelf span {
  background-color: #2683f5;
  padding: 5px 8px;
  display: inline-block;
  border-radius: 10px;
  margin: 0px 5px 0px 0px;
  position: relative;
  border: 1px solid #E3E3E3;
  max-width: 290px;
  color: #fff;
}
</style>