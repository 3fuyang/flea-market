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
        @click="goToDetail(item.goodID)">
        <el-tooltip
          :content="item.goodTitle" 
          :placement="getPlacement(index)" 
          effect="light" 
          :show-arrow="false"
          :show-after="500"
          :offset="0">
          <el-image class="img" :src="`/src/assets/${item.imgName}.png`"></el-image>          
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
defineProps({
  sellerID: String
})

const sellerInfo = ref({}) // 卖家信息
onBeforeMount(() => {
  // 调用接口：传入（卖家ID） 返回（卖家信息：卖家昵称、信誉、头像URL）
  sellerInfo.value = {
    sellerName: '卖家昵称，较短，一行',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    reputation: '良好/中等/较差',
    score: 4.7,
  }

  getTrends()
})

const router = useRouter()
// 联系买家
const concactSeller = () => {
  // 调用接口 将买家上升到用户消息列表的首位：传入（用户ID，买家ID）返回（无）
 
  // 在新窗口打开聊天页面。
  const routeUrl = router.resolve({
    path:'/chat'
  })
  window.open(routeUrl .href, '_blank')
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
  trendGoods.value = [
    {
      goodID: '1',
      goodTitle: '商品1',
      price: 100,
      imgName: 'physics'
    },
    {
      goodID: '2',
      goodTitle: '商品2',
      price: 200,
      imgName: 'pen'
    },
    {
      goodID: '3',
      goodTitle: '商品3',
      price: 300,
      imgName: 'tea'
    },
    {
      goodID: '4',
      goodTitle: '商品4',
      price: 400,
      imgName: 'philips'
    }    
  ]
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
  border: 1px solid #5E3F82;
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