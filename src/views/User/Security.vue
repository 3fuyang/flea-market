<template>
<div id="name">
  <el-main>
    <el-tabs type="border-card" style="margin:20px 10%;width: 80%;height: 470px;">
      <!--账号安全中心主页-->
      <el-tab-pane label="Security Center">
        Security Center
        <el-card v-if="activePwd===0" :body-style="{padding: '0px 0px 0px 0px', backgroundColor: '#F5F5F5',}" 
          style="margin: 20px 5px;height: 300px;">
          <div style="text-align: left;">
            <span style="display: inline-block;color: #191970;margin: 20px 0px 5px 20px;font-size: 18px;">
              您好，欢迎来到用户账号安全中心！您可以在此进行修改密码和修改绑定手机号两种操作：
            </span><br/>
            <span style="display: inline-block;color: #000000;margin: 20px 0px 5px 60px;font-size: 14px;">
              (1) 修改密码: 用户在使用账号绑定手机号接收短信验证码完成身份验证后，可修改账号密码(注：密码应长8-20位，并同时包含字母与数字)。
            </span><br/>    
            <span style="display: inline-block;color: #000000;margin: 20px 0px 8px 60px;font-size: 14px;">
              (2) 修改绑定手机号: 用户在使用新手机号码接收短信验证码完成身份验证后，可修改账号绑定手机号码(注：仅支持中国大陆地区(+86)手机号码，格式以实际为准)。
            </span>  
            <span style="display: inline-block;color: #191970;margin: 20px 0px 115px 60px;font-size: 18px;">
              请根据需要点击上方选项卡，切换到对应面板并进行相关流程。
            </span><br/>                                    
          </div>            
        </el-card>                    
      </el-tab-pane>        
      <!--修改密码-->
      <el-tab-pane label="Modify Password">
        Modify Password
        <el-steps :space="200" :active="activePwd" process-status="finish" finish-status="success" simple style="margin-top: 15px;">
          <el-step title="1. 身份验证" :icon="Message"></el-step>
          <el-step title="2. 设置新密码" :icon="Edit"></el-step>
          <el-step title="3. 完成修改" :icon="CircleCheck"></el-step>
        </el-steps>
        <el-card v-if="activePwd===0" :body-style="{padding: '0px 0px 0px 0px', backgroundColor: '#F5F5F5',}" 
          style="margin: 5px 5px;height: 300px;">
          <div style="text-align: left;">
            <span style="display: inline-block;color: #191970;margin: 20px 0px 5px 20px;font-size: 18px;">
              为了保护你的帐号安全，请验证身份，验证成功后进行下一步操作:
            </span>
          </div>
          <span style="display: inline-block;color: #000000;margin: 10px 0px;font-size: 14px;">
            使用手机 +86 {{telNum.substr(0,3)}} **** {{telNum.substr(9,12)}} 验证
          </span><br/>
          <div class="input">
            <el-input v-model="inputCAPTCHA" placeholder="输入6位短信验证码" maxlength="6" style="width: 150px;margin-left: 85px;"></el-input>
            <el-button type="text" size="small" @click="getCAPTCHA(telNum)">获取短信验证码</el-button>
          </div><br/>
          <span><el-button type="primary" plain size="small" @click="identify(inputCAPTCHA)" style="margin-bottom: 120px;">验证</el-button></span>
        </el-card>
        <el-card v-if="activePwd===1" :body-style="{padding: '0px 0px 0px 0px', backgroundColor: '#F5F5F5',}" 
          style="margin: 5px 5px;height: 300px;">
            <span style="display: inline-block;color: #191970;margin: 20px 0px 15px 20px;font-size: 15px;">
              验证成功，请为您的账号设置并确认新密码:
            </span>
          <div class="input">
            <span style="display: inline-block;font-size: 15px;margin: 10px 10px 0px 0px">新密码:</span>
            <el-input v-model="newPassWord" show-password placeholder="请输入新密码" maxlength="20" style="width: 150px;"></el-input>
          </div><br/>
          <div class="input">
            <span style="display: inline-block;font-size: 15px;margin: 10px 10px 0px 0px">确认密码:</span>
            <el-input v-model="confirm" show-password placeholder="重新输入以验证" maxlength="20" style="width: 150px;"></el-input>
          </div><br/>
          <span><el-button type="primary" plain size="small" @click="modifyPwd()" style="margin-bottom: 120px;">确认</el-button></span>
        </el-card>
        <el-card v-if="activePwd===2" :body-style="{padding: '0px 0px 0px 0px', backgroundColor: '#F5F5F5',}" 
          style="margin: 5px 5px;height: 300px;">
          <span style="display: inline-block;color: #191970;margin: 20px 0px 15px 20px;font-size: 15px;">
            修改成功，将在3秒后为您跳转到登录页面...
          </span><br/>
          <span style="display: inline-block;color: #32CD32;margin: 20px 0px 180px 20px;font-size: 40px;"><i class="el-icon-circle-check"></i></span>
        </el-card>                     
      </el-tab-pane>
      <!--修改手机-->
      <el-tab-pane label="Modify TEL">
        Modify TEL
        <el-steps :space="200" :active="activeTel" process-status="finish" finish-status="success" simple style="margin-top: 15px;">
          <el-step title="1. 设置新手机号码" :icon="Message"></el-step>
          <el-step title="2. 完成修改" :icon="CircleCheck"></el-step>
        </el-steps>
        <el-card v-if="activeTel === 0" :body-style="{padding: '0px 0px 0px 0px', backgroundColor: '#F5F5F5',}" 
          style="margin: 5px 5px;height: 300px;">
          <div style="text-align: left;">
            <span style="display: inline-block;color: #191970;margin: 20px 0px 5px 20px;font-size: 14px;">
              您的账号现在绑定的手机号码为: +86 {{telNum.substr(0,3)}} **** {{telNum.substr(9,12)}} ,请输入新的手机号码:
            </span>
          </div>
          <div class="input">
            <el-input v-model="newTel" placeholder="新的绑定号码" maxlength="11" style="width: 150px;margin-left: 0px;"></el-input>
          </div><br/>
          <div class="input">
            <el-input v-model="inputCAPTCHA_" placeholder="输入6位短信验证码" maxlength="6" style="width: 150px;margin-left: 85px;"></el-input>
            <el-button type="text" size="small" @click="getCAPTCHA(newTel)">获取短信验证码</el-button>
          </div><br/>
          <span><el-button type="primary" plain size="small" @click="identifyAndModify(inputCAPTCHA_)" style="margin-bottom: 120px;">验证</el-button></span>
        </el-card>
        <el-card v-if="activeTel===1" :body-style="{padding: '0px 0px 0px 0px', backgroundColor: '#F5F5F5',}" 
          style="margin: 5px 5px;height: 300px;">
          <span style="display: inline-block;color: #191970;margin: 20px 0px 15px 20px;font-size: 15px;">
            修改成功,您的账号现在绑定的手机号码为: +86 {{newTel.substr(0,3)}} **** {{newTel.substr(9,12)}} 
          </span><br/>
          <span style="display: inline-block;color: #32CD32;margin: 20px 0px 180px 20px;font-size: 40px;"><i class="el-icon-circle-check"></i></span>
          <span style="display: inline-block;color: #191970;margin: 30px 0px 15px 20px;font-size: 15px;">
            将为您跳转到账号中心主页...
          </span>            
        </el-card>  
      </el-tab-pane>
    </el-tabs>
  </el-main>
</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Message, Edit, CircleCheck } from '@element-plus/icons-vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { userID } = storeToRefs(userStore)

const router = useRouter()

const activePwd = ref(0)  // 修改密码步骤条当前激活步骤
const telNum = ref('')  // 用户绑定手机
const inputCAPTCHA = ref('')  // 输入验证码1
const inputCAPTCHA_ = ref('') // 输入验证码2
const CAPTCHA = ref('') // 正确验证码
const newPassWord = ref('')  // 新密码
const confirm = ref('') // 确认新密码
const activeTel = ref(0) // 修改手机号步骤条当前激活步骤
const newTel = ref('')  // 新的手机号码

//调用接口: 传入（用户id） 返回（绑定手机号）
axios.get(`/api/usertel/${userID.value}`)
  .then((response) => {
    telNum.value = response.data.toString()  
  })

//获取验证码
function getCAPTCHA (tel: string) {
  //调用接口：传入（手机号码）  返回（验证码）
  //console.log(tel);
  CAPTCHA.value = '123456'
}
//验证
function identify (input: string) {
  if (input.length === 6) {
    if (input === CAPTCHA.value){
      activePwd.value++;
    }
  } else {
    ElMessage.error('请输入6位验证码')
  }
}

function identifyAndModify (input: string) {
  if (newTel.value ===' ') {
    ElMessage.error('请输入新的手机号码')
  } else if (newTel.value.length !== 11) {
    ElMessage.error('手机号码应为11位')
  } else if (input.length === 6) {
    if (input === CAPTCHA.value) {
      activeTel.value++
      //调用接口：传入（用户ID，新手机号码) 返回(success)
      let id_tel = {
        id: userID.value,
        newtel: newTel.value,
      }
      axios.post('/api/modifyTel/', id_tel)
        .then(() => {
          setTimeout(() => {
            router.go(0)                    
          }, 3000)
        })
    }
  }else{
    ElMessage.error('请输入6位验证码')
  }        
}
//修改密码
function modifyPwd () {
  const regNumber = /\d+/ //验证0-9的任意数字最少出现1次。
  const regString = /[a-zA-Z]+/ //验证大小写26个字母任意字母最少出现1次。
  if (newPassWord.value === '') {
    ElMessage.error('请输入新密码')
  } else if (newPassWord.value.length < 8) {
    ElMessage.error('密码应大于7位')
  } else if (newPassWord.value.length > 20) {
    ElMessage.error('密码应小于20位')
  } else if (!regNumber.test(newPassWord.value) || !regString.test(newPassWord.value)) {
    ElMessage.error('密码应包含至少包含一位数字与一位字母')
  } else if (confirm.value === '') {
    ElMessage.error('请确认新密码')
  } else if (confirm.value !== newPassWord.value) {
    ElMessage.error('密码两次输入不一致!')
  } else {
    const id_pwd = {
      id: userID.value,
      newpassword: newPassWord.value,
    }
    // 调用接口：传入（用户ID、新密码） 返回（null）
    axios.post('/api/modifyPassword/',id_pwd)
      .then(() => {
        activePwd.value++
        setTimeout(() => {
          // 修改store state
          userStore.logOut()
          router.push('/login')
        }, 1000)
      })       
  }
}
</script>

<style scoped>
.input :deep() .el-input__inner {
    width: 150px;
    border-top-width: 0px;
    border-left-width: 0px;
    border-right-width: 0px;
    border-bottom-width: 2px;
    background-color: #F5F5F5;
    /*outline: medium;*/
}
</style>