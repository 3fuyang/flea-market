<template>
<div class="root-wrapper">
	<el-steps 
    :space="200" 
    :active="active" 
    process-status="finish" 
    finish-status="success" 
    align-center>
    <el-step title="基本信息"></el-step>
    <el-step title="简介和图片"></el-step>
    <el-step title="交易信息"></el-step>
    <el-step title="内容审核"></el-step>
  </el-steps>  
  <el-card class="contentCard">
    <div v-if="active==0">
      <div>
        标题:
        <el-input 
          v-model="goodInfo.title" 
          placeholder="为你的商品起一个响亮的标题" 
          class="titleInput"/>
      </div>
      <div>
        商品类型:     
        <el-select 
          v-model="goodInfo.type" 
          placeholder="选择商品类型" 
          size="large" 
          class="typeSelect">
          <el-option 
            v-for="item in typeOptions" 
            :key="item" 
            :label="item" 
            :value="item"/>
        </el-select>
      </div>
      <div>
        商品名称:
        <el-input 
          v-model="goodInfo.name" 
          placeholder="你想出售的商品是什么" 
          class="nameInput"/>
      </div>
      <div>
        关键词:     
        <el-input 
          v-model="goodInfo.keywords" 
          placeholder="输入搜索关键词，用分号分隔" 
          class="keywordsInput"/>
      </div>
      <div>
        校区:     
        <el-select 
          v-model="goodInfo.campus" 
          placeholder="选择发布校区" 
          size="large" 
          class="campusSelect">
          <el-option 
            v-for="item in campusOptions" 
            :key="item" 
            :label="item" 
            :value="item"/>
        </el-select>
      </div>
    </div>
    <div v-if="active === 1">
      <div>
        <span class="introTitle">简介:</span><br/>
        <el-input 
          v-model="goodInfo.intro" 
          placeholder="快来简单介绍一下你的商品吧" 
          :rows="3" 
          type="textarea" 
          class="introductionInput"/>
      </div>
      <div>
        <div class="imgTitle">
          商品实物图:
        </div>
        <!-- 图片上传组件 -->
        <el-upload
          ref="upload"
          class="uploadImg" 
          action="/api/uploadImage"
          :auto-upload="false"
          :before-upload="handleBeforeUpload"
          :on-success="handleOnSuccess"
          :on-error="handleOnError"
          :limit="3"
          :on-exceed="handleExceed">
          <div v-if="imgLocalUrl.length > 0" class="avatarWrapper">
            <img v-for="item in imgLocalUrl" :src="item" class="avatar"/>
          </div>
            <template #tip>
              <div class="el-upload__tip">
                limit less than 3 jpg/png files with a size of 220*190.
              </div>
            </template>          
            <template #trigger>
              <el-button type="primary">
                选择文件
              </el-button>
            </template>
            <el-button 
              class="buttonGutter" 
              type="success"
              @click="submitUpload">
                确定上传
            </el-button>
        </el-upload>
      </div>
    </div>
    <div v-if="active === 2">
      <span class="priceTitle">
        价格(CNY):
      </span><br/>
      <el-input-number 
        v-model="goodInfo.price" 
        :min="0" 
        class="priceInput"/>
      <br/>
      <span class="detailTitle">
        交易信息:
      </span>
      <el-input 
        v-model="goodInfo.detail" 
        placeholder="你期望的交易时间、地点以及其他细节。" 
        :rows="4" 
        class="detailInput" 
        type="textarea"></el-input>
    </div>
    <div v-if="active === 3">
      <el-result
        icon="success"
        title="审核成功"
        sub-title="点击发布按钮就可以完成上架了！"
      />
    </div>
  </el-card>  
  <div v-if="active < 4" class="controlButton">
    <el-button 
      @click="preStep" 
      type="primary">上一步</el-button>
    <el-button @click="nextStep" type="primary">{{buttonInfo}}</el-button>
  </div>  
</div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'
const props = defineProps({
  userId: String, // 用户ID
})

// 商品信息
const goodInfo = ref({
  title: '', // 标题
  type: '',  // 类型
  name: '',  // 名称
  keywords: '',  // 关键词
  campus: '',  // 校区
  intro: '', // 简介(包含交易要求)
  price: '',  // 价格
  detail: '',  // 交易细节
})
const typeOptions = ["图书音像", "电子产品", "美妆个护", "运动户外", "生活电器", "其他"]
const campusOptions = ["四平路校区", "嘉定校区", "沪西校区", "沪北校区"]

const active = ref(0)  // 步骤条激活标号
const buttonInfo = computed(()=>{
  return active.value < 3 ? "下一步" : "发布"
}) // 'nextStep'按钮的显示文本
// 上一步
function preStep(){
  if(active.value > 0){
    --active.value
    return
  }
}
// 下一步
function nextStep(){
  switch(active.value){
    case 0:
      if(goodInfo.value.title == ""){
        ElMessage.error('标题不可为空!')
      }else if(goodInfo.value.type == ""){
        ElMessage.error('商品类型不可为空!')
      }else if(goodInfo.value.name == ""){
        ElMessage.error('商品名称不可为空')
      }else if(goodInfo.value.keywords == ""){
        ElMessage.error('关键词不可为空!')
      }else if(goodInfo.value.campus == ""){
        ElMessage.error('校区不可为空!')
      }else{
        ++active.value
      }
      break
    case 1:
      if(goodInfo.value.intro == ""){
        ElMessage.error('商品简介不可为空!')
      }else if(imgServerName.value.length === 0){
        ElMessage.error('请为商品上传实物图!')
      }else{
        ++active.value
      }
      break
    case 2:
      if(goodInfo.value.price === 0){
        ElMessage.error('商品价格不能为零!')
      }else if(goodInfo.value.detail === ''){
        ElMessage.error('请指定商品交易细节!')
      }else{
        ++active.value
      }
      break
    case 3:
      ElMessageBox.confirm('确认要上架商品吗？','提示')
      .then(() => {
        // 调用接口-添加商品：传入（商品信息） 返回（商品ID）
        let date = new Date()
        date.setHours(date.getHours() + 8)
        let newGood = [
          props.userId,
          goodInfo.value.price,
          goodInfo.value.type,
          goodInfo.value.name,
          goodInfo.value.title,
          goodInfo.value.keywords,
          goodInfo.value.campus,
          goodInfo.value.intro,
          goodInfo.value.detail,
          imgServerName.value.join(';'),
          date.toISOString().slice(0, 19).replace('T', ' ')         
        ]
        axios.post('/api/addGood', newGood)
          .then(() => {
            ElMessage({
                type: 'success',
                message: '上架成功'
            })
            // 刷新当前页面
            const router = useRouter()
            router.go(0)
          })
      })
      .catch(() => {})
      break
  }
}

// 使用ref获取el-upload元素
const upload = ref(null) 
// 注意：不需要额外添加头部声明content-type, 否则会引发后端报错: 
// Error: Multipart: Boundary not found
//const headers = {'content-type': 'multipart/form-data'} // 请求头, 固定数据类型
const imgLocalUrl = ref([]) // 上传图片后返回的本地 url
const imgServerName = ref([]) // 上传图片后返回的服务端名称
const limitMax = 2200*1900 // 允许上传的最大尺寸
// on-exceed hook
function handleExceed(){
  ElMessage.warning('只能为商品上传最多三张图片!')
  return false
}
// before-upload hook
function handleBeforeUpload(file){
  if(file.size > limitMax){
    ElMessage.error('大小超出限制')
    return false
  }
}
// 手动上传文件
function submitUpload(){
  upload.value.submit()
}
// on-success hook
function handleOnSuccess(res, file){
  imgLocalUrl.value.push(URL.createObjectURL(file.raw))
  // 后端的文件信息逐个以数组的形式返回
  imgServerName.value.push(res[0].path.split('/')[3])
  // 前端访问图片时，使用node.js配置公共资源
  // 注意：图片统一存储在服务器 ./pulic/images 目录下，用名称区分
}
// on-error hook
function handleOnError(err){
  console.log(err)
}
</script>

<style scoped>
.root-wrapper{
  width: 500px;
  min-height: 400px;
  margin: 0 auto;
  position: relative;
}
.contentCard{
  background-color: #f5f5f5;
  margin-top: 20px;
  margin-bottom: 10px;
}
.titleInput{
  width: 300px;
  margin-left:10px;
  margin-top: 16px;
}
.nameInput{
  width: 200px;
  margin-left:10px;
  margin-top: 16px;
  margin-right:132px;
}
.typeSelect{
  width:150px;
  margin-left:10px;
  margin-right:182px;
  margin-top: 20px;
}
.keywordsInput{
  width:300px;
  margin-left:10px;
  margin-right:16px;
  margin-top: 20px;
}
.campusSelect{
  width:150px;
  margin-left:10px;
  margin-right:150px;
  margin-top: 20px;
}
.introTitle{
  float: left;
  font-weight: bold;
}
.introductionInput {
  margin: 10px 28px 0px 0px;
}
.imgTitle{
  font-weight: bold;
  float: left;
  margin-top: 10px;
}
.uploadImg{
  clear: both;
}
.avatarWrapper{
  display: block;
  margin: 5px auto;
}
.avatar{
  width: 220px;
  height: 190px;
  padding: 1px;
  border: 1px solid #f5f5f5;
}
.el-upload__tip{
  color: red;
}
.buttonGutter{
  margin-left: 10px;
}
.priceTitle{
  font-weight: bold;
  float: left;
}
.priceInput{
  clear: both;
  margin-right: 70px;
}
.detailTitle{
  line-height: 32px;
  font-weight: bold;
  float: left;
}
.detailInput{
  width: 440px;
  margin: 0px 0px 0px 1px;
}
</style>