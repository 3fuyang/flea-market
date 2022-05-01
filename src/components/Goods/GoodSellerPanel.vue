<template>
  <div class="float-wrapper">
    <p class="seller-title">卖家信息</p>
  </div>
  <hr class="divider"/>
  <el-row>
    <el-col :span="14">
      <p class="seller-name">
        {{sellerInfo.sellerName}}
      </p>
      <p class="reputation">
        信誉: &nbsp;&nbsp;{{sellerInfo.reputation}}
      </p>
      <p class="concact-label">
      联系：
      <el-button
        type="primary"
        plain
        size="small"
        @click="concactSeller">
        <el-icon>
          <chat-dot-round/>
        </el-icon>
        和我联系
      </el-button>
      </p>
    </el-col>
    <el-col 
      :span="10" 
      class="avatar-container">
      <el-avatar class="avatar" :src="sellerInfo.avatarUrl" :size="75" alt="Seller Avatar"/>
    </el-col>
  </el-row>
  <div class="score-row">
    <div class="vertical-center-wrapper">
      <p class="score-label">评分: &nbsp;&nbsp;</p>
    </div>
    <el-rate v-model="sellerInfo.score" disabled show-score/>
  </div>
  <hr class="divider"/>
  <div class="trend-container">
    <span class="trend-label">为您推荐</span>
    <el-icon 
      class="refresh-btn" 
      :size="18"
      @click="getTrends">
      <refresh-left/>
    </el-icon>
    <div class="trend-img-box">
      <div 
        class="trend-card" 
        v-for="(item, index) of trendGoods"
        :key="index"
        @click="goToDetail(item.goodID)">
        <el-tooltip
          :content="item.goodTitle" 
          :placement="getPlacement(index)" 
          effect="light" 
          :show-arrow="false"
          :show-after="500"
          :offset="0">
          <el-image class="img" :src="item.imgUrl"></el-image>          
        </el-tooltip>
        <p class="good-price">￥{{item.price}}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { ChatDotRound, RefreshLeft } from "@element-plus/icons-vue"
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'
const props = defineProps({
  sellerID: String
})

const sellerInfo = ref({}) // 卖家信息
const userID = window.sessionStorage.getItem('uid')
onBeforeMount(() => {
  // 调用接口：传入（卖家ID） 返回（卖家信息：卖家昵称、信誉、头像URL）
  axios.get(`/api/getSellerInfo/${props.sellerID}`)
    .then((res) => {     
      sellerInfo.value = {
        sellerName: res.data.nickname,
        avatarUrl: `http://127.0.0.1:8082/public/avatars/${res.data.avatar}`,
        reputation: res.data.reputation,
        score: Number.parseFloat(res.data.score).toFixed(1)
      }
    })

  getTrends()
})

const router = useRouter()
// 联系买家
const concactSeller = () => {
  if (userID.length === 7) {
    // 在新窗口打开聊天页面。
    const routeUrl = router.resolve({
      path:'/chat',
      query: {
        oponentID: props.sellerID,
        oponentName: sellerInfo.value.sellerName,
        avatar: sellerInfo.value.avatarUrl
      }
    })
    window.open(routeUrl .href, '_blank')
  } else if (userID.length === 4) {
    ElMessage.warning(`请使用普通账号执行该操作。`)
  } else {
    router.push(`/login`)
  }
}

// 前往趋势商品详情页
const goToDetail= (id) => {
  router.push({
    path: '/details',
    query: {
      gid: id
    }
  })
}

// 趋势商品
const trendGoods = ref([])
// 计算tip位置
const getPlacement = index => {
  switch(index){
    case 0:
      return 'left-start'
    case 1:
      return 'right-start'
    case 2:
      return 'left-end'
    case 3:
      return 'right-end'
  }
}
// 获取趋势商品
const getTrends = () => {
  // 调用接口： 传入（null） 返回（随机四个商品的简要信息：ID、名称、价格、图片URL）
  trendGoods.value = []
  axios.get(`/api/getTrends`)
    .then(res => {
      res.data.forEach(item => {
        trendGoods.value.push({
          goodID: item.good_id,
          goodTitle: item.title,
          price: Number.parseFloat(item.price).toFixed(2),
          imgUrl: `http://127.0.0.1:8082/public/images/${item.images.split(';')[0]}`          
        })
      })
    })
}
</script>

<style scoped>
.seller-title{
	margin: 0;
	float: left;
	font-size: .9em;
	font-weight: 600;
	color: #666;
}
.float-wrapper::after{
  content: '';
  clear: left;
  display: block;
}
.divider{
	clear: both;
	border: none;
	height: 1px;
  background-color: #e5e5e5;
}
.seller-name{
	margin: .5em 0 0 0;
	font-size: .8em;
	font-weight: 600;
	color: #666;
  float: left;
}
.reputation{
  float: left;
	font-size: .7em;
	color: #888;
  margin: .8em 0;
  clear: left;
}
.concact-label{
	margin: 0 0 .8em;
	font-size: .7em;
	color: #888;
  clear: left;
  float: left;
}
.avatar-container{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.avatar{
  cursor: pointer;
}
.avatar:hover{
  box-shadow: .1em 0em .2em #8ACEFF;
}
.score-row{
  display: flex;
  margin-top: -.5em;
}
.vertical-center-wrapper{
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.score-label{
	font-size: .7em;
	color: #888;
  margin: 0;
}
.trend-container{
  overflow: auto;
}
.trend-label{
  float: left;
	font-size: .9em;
  font-weight: 600;
	color: #666;
  margin: 0;
}
.refresh-btn{
  float: right;
  cursor: pointer;
  color: #888;
}
.trend-img-box{
  clear: left;
  display: flex;
  padding: .5em;
  flex-wrap: wrap;
}
.trend-card{
  flex: 0 0 50%;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.img{
  height: 4.5em;
  width: 4.5em;
  border: 1px solid #AAA;
  display: block;
}
.img:hover{
  border: 1px solid red;
}
.good-price{
  margin: 0;
  font-size: .8em;
  color: #FF9900;
  font-weight: bold;
}
</style>