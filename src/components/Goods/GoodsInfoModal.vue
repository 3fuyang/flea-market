<template>
  <div class="modal-mask" v-if="show">
    <el-card class="contentCard" :body-style="{ padding: '20px' }">
      <el-alert v-if="status === 'soldOut'" title="注意：已经出售的商品无法再修改其信息。" type="warning" effect="light" close-text="了解"
        show-icon center>
      </el-alert>
      <span class="modal-title">
        商品详情
      </span>
      <span class="close-button" @click="$emit('close')">
        <Close class="close-icon" />
      </span>
      <el-steps class="steps" :space="200" :active="active" process-status="finish" finish-status="success"
        align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="简介和图片"></el-step>
        <el-step title="交易信息"></el-step>
        <el-step title="内容审核"></el-step>
      </el-steps>
      <div v-if="active == 0">
        <div>
          标题:
          <el-input v-model="goodInfo.title" placeholder="为你的商品起一个响亮的标题" class="titleInput"
            :readonly="status === 'soldOut'" />
        </div>
        <div>
          商品类型:
          <el-select v-model="goodInfo.type" placeholder="选择商品类型" size="large" class="typeSelect"
            :readonly="status === 'soldOut'">
            <el-option v-for="item in typeOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
        <div>
          商品名称:
          <el-input v-model="goodInfo.name" placeholder="你想出售的商品是什么" class="nameInput"
            :readonly="status === 'soldOut'" />
        </div>
        <div>
          关键词:
          <el-input v-model="goodInfo.keywords" placeholder="输入搜索关键词，用分号分隔" class="keywordsInput"
            :readonly="status === 'soldOut'" />
        </div>
        <div>
          校区:
          <el-select v-model="goodInfo.campus" placeholder="选择发布校区" size="large" class="campusSelect"
            :readonly="status === 'soldOut'">
            <el-option v-for="item in campusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
      </div>
      <div v-if="active === 1">
        <div>
          <span class="introTitle">简介:</span><br />
          <el-input v-model="goodInfo.intro" placeholder="快来简单介绍一下你的商品吧" :rows="3" type="textarea"
            class="introductionInput" :readonly="status === 'soldOut'" />
        </div>
        <div>
          <div class="imgTitle">商品实物图:</div>
          <!-- 图片上传组件 -->
          <el-upload ref="upload" class="uploadImg" :disabled="status === 'soldOut'" action="/api/uploadImage"
            :auto-upload="false" :before-upload="handleBeforeUpload" :on-success="handleOnSuccess"
            :on-error="handleOnError" :limit="3" :on-exceed="handleExceed">
            <span v-if="imgLocalUrl.length > 0" class="avatarWrapper">
              <img v-for="item in imgLocalUrl" :src="item" class="avatar" />
            </span>
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
            <el-button class="buttonGutter" type="success" @click="submitUpload">
              确定上传
            </el-button>
          </el-upload>
        </div>
      </div>
      <div v-if="active === 2">
        <span class="priceTitle">
          价格(CNY):
        </span><br />
        <el-input-number v-model="goodInfo.price" :min="0" class="priceInput" /><br />
        <span class="detailTitle">
          交易信息:
        </span>
        <el-input v-model="goodInfo.detail" placeholder="你期望的交易时间、地点以及其他细节。" :rows="4" class="detailInput"
          type="textarea"></el-input>
      </div>
      <div v-if="active === 3">
        <el-result icon="success" title="审核通过" sub-title="点击确定按钮即可完成修改！" />
      </div>
      <div v-if="active < 4" class="controlButton">
        <el-button @click="preStep" type="primary">上一条</el-button>
        <el-button @click="nextStep" type="primary">{{ buttonInfo }}</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUpdated, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { UploadFile, UploadInstance, UploadRawFile } from 'element-plus'
import { useMessage, useDialog } from 'naive-ui'
import { Close } from '@element-plus/icons-vue'
import { serverHost } from '@/data/host'
import axios from 'axios'

const message = useMessage()
const dialog = useDialog()

const router = useRouter()

const props = defineProps({
  goodId: String, // 商品ID
  show: Boolean,  // 组件渲染条件
  status: String, // 当前商品的状态: 'onShelf' 或 'soldOut'
})
const emits = defineEmits([
  'close',
])
// 商品信息类型
interface goodInfo {
  [index: string]: string | number
  title: string
  type: string
  name: string
  keywords: string
  campus: string
  intro: string
  price: number
  detail: string
}
// 商品信息
const goodInfo = ref<goodInfo>({
  title: '', // 标题
  type: '',  // 类型
  name: '',  // 名称
  keywords: '',  // 关键词
  campus: '',  // 校区
  intro: '', // 简介(包含交易要求)
  price: 0,  // 价格
  detail: '',  // 交易细节
})
// 商品原信息副本
interface PreInfo extends goodInfo {
  [index: string]: string | number
  images: string
}
const goodPreInfo = ref<PreInfo>({
  title: '',
  type: '',
  name: '',
  keywords: '',
  campus: '',
  intro: '',
  price: 0,
  detail: '',
  images: ''
})  // 商品原信息副本

// 商品类型选项
const typeOptions = ["图书音像", "电子产品", "美妆个护", "运动户外", "生活电器", "其他"]
// 校区选项
const campusOptions = ["四平路校区", "嘉定校区", "沪西校区", "沪北校区"]

// 从后端获取商品信息
function getGoodInfo() {
  // 调用接口：传入（商品ID）返回（商品详细信息）
  axios.get(`/api/getGoods/${props.goodId}`)
    .then((res) => {
      let data = res.data
      goodPreInfo.value.title = data.title
      goodPreInfo.value.type = data.category
      goodPreInfo.value.name = data.name
      goodPreInfo.value.keywords = data.keywords
      goodPreInfo.value.campus = data.campus
      goodPreInfo.value.intro = data.intro
      goodPreInfo.value.price = Number.parseFloat(data.price)
      goodPreInfo.value.detail = data.detail
      goodPreInfo.value.images = data.images

      imgLocalUrl.value.length = 0
      imgLocalUrl.value.push(...data.images.split(';').map((name: string) => `http://${serverHost}:8082/public/images/${name}`))
      imgServerName.value.length = 0
      imgServerName.value.push(...data.images.split(';'))
      for (let property in goodPreInfo.value) {
        goodInfo.value[property] = goodPreInfo.value[property]
      }
    })
}

getGoodInfo()

onUpdated(getGoodInfo)

const edited = ref(false)  // 信息编辑标志

// 检查商品信息是否有修改
watch(goodInfo, () => {
  for (const property in goodInfo.value) {
    if (goodPreInfo.value && goodInfo.value[property] !== goodPreInfo.value[property]) {
      edited.value = true
      break
    } else {
      continue
    }
  }
}, { deep: true })

const active = ref(0)  // 步骤条激活标号
const buttonInfo = computed(() => {
  switch (active.value) {
    case 0:
    case 1:
      return '下一条'
    case 2:
      return '提交审核'
    default:
      return '提交修改'
  }
}) // 'nextStep'按钮的显示文本
// 上一步
function preStep() {
  if (active.value > 0) {
    --active.value
    return
  }
}
// 下一步
function nextStep() {
  switch (active.value) {
    case 0:
      if (goodInfo.value.title == "") {
        message.error('标题不可为空!')
        break
      } else if (goodInfo.value.type == "") {
        message.error('商品类型不可为空!')
        break
      } else if (goodInfo.value.name == "") {
        message.error('商品名称不可为空')
        break
      } else if (goodInfo.value.keywords == "") {
        message.error('关键词不可为空!')
        break
      } else if (goodInfo.value.campus == "") {
        message.error('校区不可为空!')
        break
      } else {
        ++active.value
        break
      }
    case 1:
      if (goodInfo.value.intro == "") {
        message.error('商品简介不可为空!')
        break
      } else if (imgServerName.value.length === 0) {
        message.error('请为商品上传实物图!')
        break
      } else {
        goodInfo.value.images = imgServerName.value.join(';')
        ++active.value
        break
      }
    case 2:
      if (goodInfo.value.price === 0) {
        message.error('商品价格不能为零!')
        break
      } else if (goodInfo.value.detail === '') {
        message.error('请指定商品交易细节!')
        break
      } else {
        if (edited.value) {
          ++active.value
          break
        } else {
          message.warning('没有需要提交的修改！')
          break
        }
      }
    case 3:
      dialog.info({
        title: '提示',
        content: '确认要修改商品信息吗？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
          // 调用接口-修改商品信息：传入（商品信息） 返回（商品ID）
          const modifiedGood = {
            price: goodInfo.value.price,
            category: goodInfo.value.type,
            good_name: goodInfo.value.name,
            title: goodInfo.value.title,
            keywords: goodInfo.value.keywords,
            campus: goodInfo.value.campus,
            intro: goodInfo.value.intro,
            images: imgServerName.value.join(';'),
            goodID: props.goodId
          }
          axios.post('/api/modifyGood', modifiedGood)
            .then(() => {
              emits('close')
              message.success('修改成功')
              // 刷新当前页面
              router.go(0)
            })
        },
        onNegativeClick: () => {
          message.info('取消修改!')
          edited.value = false
        }
      })
      break
  }
}

const upload = ref<UploadInstance | null>(null) // 使用ref获取el-upload元素
// 注意：不需要额外添加头部声明content-type, 否则会引发后端报错: 
// Error: Multipart: Boundary not found
//const headers = {'content-type': 'multipart/form-data'} // 请求头, 固定数据类型
const imgLocalUrl = ref<string[]>([]) // 上传图片后返回的本地 url
const imgServerName = ref<string[]>([]) // 上传图片后返回的服务端 url(只取名称)
const limitMax = 2200 * 1900 // 允许上传的最大尺寸
// on-exceed hook
function handleExceed() {
  message.warning('只能为商品上传最多三张图片!')
  return false
}
// before-upload hook
function handleBeforeUpload(file: UploadRawFile) {
  if (file.size > limitMax) {
    message.error('大小超出限制')
    return false
  } else {
    imgLocalUrl.value = []
  }
}
// 手动上传文件
function submitUpload() {
  upload.value && upload.value.submit()
}
// on-success hook
function handleOnSuccess(res: any, file: UploadFile) {
  // 生成预览图
  imgLocalUrl.value.push(URL.createObjectURL(file.raw as UploadRawFile))
  // 获取服务端返回的文件名
  imgServerName.value.push(res[0].path.split('/')[3])
}
// on-error hook
function handleOnError(err: Error) {
  console.log(err)
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(204, 199, 199, 0.5);
  transition: opacity 0.3s ease;
}

.modal-title {
  display: inline-box;
  margin-bottom: 5px;
  float: left;
  font-size: 20px;
  font-weight: bold;
}

.steps {
  clear: both;
}

.contentCard {
  background-color: #f5f5f5;
  width: 40%;
  position: absolute;
  top: 15%;
  left: 30%;
}

.close-button {
  cursor: pointer;
  float: right;
  color: #c0c0c0;
}

.close-icon {
  width: 25px;
  height: 25px;
}

.titleInput {
  width: 300px;
  margin-left: 10px;
  margin-top: 16px;
}

.nameInput {
  width: 200px;
  margin-left: 10px;
  margin-top: 16px;
  margin-right: 132px;
}

.typeSelect {
  width: 150px;
  margin-left: 10px;
  margin-right: 182px;
  margin-top: 20px;
}

.keywordsInput {
  width: 300px;
  margin-left: 10px;
  margin-right: 16px;
  margin-top: 20px;
}

.campusSelect {
  width: 150px;
  margin-left: 10px;
  margin-right: 150px;
  margin-top: 20px;
}

.introTitle {
  float: left;
  font-weight: bold;
}

.introductionInput {
  margin: 10px 28px 0px 0px;
}

.imgTitle {
  font-weight: bold;
  float: left;
  margin-top: 10px;
}

.uploadImg {
  clear: both;
}

.avatarWrapper {
  display: block;
  margin: 5px auto;
}

.avatar {
  width: 160x;
  height: 140px;
  padding: 1px;
  border: 1px solid #f5f5f5;
}

.el-upload__tip {
  color: red;
}

.buttonGutter {
  margin-left: 10px;
}

.priceTitle {
  font-weight: bold;
  float: left;
}

.priceInput {
  clear: both;
  margin-right: 70px;
}

.detailTitle {
  font-weight: bold;
  margin-bottom: 5px;
  float: left;
  padding-right: 100px;
}

.detailInput {
  clear: both;
  width: 90%;
  margin: 0px 0px 0px 1px;
}

.controlButton {
  margin-top: 10px;
}
</style>