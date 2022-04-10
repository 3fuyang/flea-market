<template>
<div class="recommend-wrapper">
  <p class="recommend-label">
    商品精选
  </p>
  <div class="recommend-card" v-for="item in recommendList">
    <div class="big-image-container">
      <el-image
        :src="item.imageURL"
        class="big-image"
        @click="navigateDetails(item.goodID)">
      </el-image>
    </div>
    <p class="price-label">
      ￥{{item.goodPrice}}
    </p>
    <p class="good-title" @click="navigateDetails(item.goodID)">
      {{item.goodTitle}}
    </p>
  </div>
</div>
</template>

<script setup>
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'

const recommendList = []
onBeforeMount(() => {
  // 调用接口：传入（null） 返回（8个商品的简要信息：商品ID，商品价格，商品图片(任意一张)，商品标题）
  for(let i = 0 ; i < 8 ; ++i){
    recommendList.push({
      goodID: '000001',
      imageURL: '/src/assets/tea.png',
      goodPrice: 11.22,
      goodTitle: '商品标题，最多两行，商品标题，最多两行,商品标题，最多两行，商品标题，最多两行，商品标题，最多两行超过以...隐藏'
    })
  }
})

// 导航至详情页函数
const router = useRouter()
function navigateDetails(id) {
  router.push({
    path: '/details',
    query: {
      gid: id
    }
  })
}
</script>

<style scoped>
.recommend-wrapper{
  border: 1px solid #eee;
  border-right: none;
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
.recommend-label{
  font-size: .875rem;
  margin: 0;
  margin-left: .5em;
  align-self: flex-start;
  font-weight: 600;
  color: #666;
}
.recommend-card{
 display: flex;
 flex-direction: column;
 margin: 1em 0;
}
.big-image{
  object-fit: scale-down;
	border: 1px solid #EEE;
  cursor: pointer;  
}
.price-label{
  padding-left: .5rem;  
  font-size: .9em;
  font-weight: 500;
  color: #FF9933;
	margin: .5em 0;
  align-self: flex-start;
}
.good-title{
  padding-left: .5rem;
  box-sizing: border-box;
  text-align: left;
  align-self: flex-start;
  font-size: .75rem;
  line-height: 1.6em;
  height: 3.2em;
  width: 100%;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  margin: 0;
  color: #666;
  cursor: pointer;
}
.good-title:hover{
  color: #3399CC;
}
</style>