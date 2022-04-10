<template>
<div class="gl-item-card">
  <div class="big-image-container">
    <el-image
      :src="currImageURL"
      class="big-image"
      @click="navigateDetails">
    </el-image>
  </div>
  <div class="sub-images-container">
    <img
      class="sub-image"
      v-for="(image, index) of imageCollection"
      :src="image"
      :id="index"/>
  </div>
  <p class="price-tag">
    ￥{{goodPrice}}
  </p>
  <p 
    class="good-title"
    @click="navigateDetails">
    {{goodTitle}}
  </p>
</div>
</template>

<script setup>
import { onBeforeMount, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router';

const props = defineProps({
  goodID: String
})

// 商品标题
const goodTitle = ref('')
// 商品价格
const goodPrice = ref(0)
// 当前展示的大号图片序号
const currImageIndex = ref(0)
// 图片集合
const imageCollection = ref([])
// 展示大图的URL
const currImageURL = computed(() => {
	return imageCollection.value[currImageIndex.value]
})

onBeforeMount(() => {
  // 调用接口-获取商品信息：传入（商品ID） 返回（商品图片URL，商品标题，价格）
  goodTitle.value = '商品标题，最多两行，商品标题，最多两行,商品标题，最多两行，商品标题，最多两行，商品标题，最多两行超过以...隐藏'
  goodPrice.value = 1234.56
  let images =  [
			// 一件商品允许最少一张、最多三张图片
			// 后端只返回图片名称，URL在前端编码
			'philips',
			'pen',
			'tea',
		]
	// 获取图片数组
	imageCollection.value = images.map((name) => `/src/assets/${name}.png`)
  currImageIndex.value = 0
})

// 由于要监听多个元素的同一事件，需手写一个含有全局计时器的防抖函数
let globalTimer = { timer: null }
const debounce = (fn, delay) => {
	return (...args) => {
		globalTimer.timer = setTimeout(() => {
			fn(...args)
			clearTimeout(globalTimer.timer)
			globalTimer.timer = null
		}, delay)
	}
}

// 鼠标悬浮到小图时，显示大图
const showBigImg = (id) => {
	currImageIndex.value = id
}

const debounceShowBigImg = debounce(showBigImg, 500)

onMounted(() => {
	// 为缩略图添加鼠标事件监听器
	const subImages = document.getElementsByClassName('sub-image')
	Array.from(subImages).forEach((subImg) => {
		subImg.addEventListener('mouseenter', (e) => {
			// 加上防抖
			debounceShowBigImg(Number.parseInt(e.target.id))
		})
	})
})

// 点击卡片，导航到商品详情页面
const router = useRouter()
function navigateDetails() {
  router.push({
    path: '/details',
    query: {
      gid: props.goodID
    }
  })
}
</script>

<style scoped>
.gl-item-card{
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  box-sizing: border-box;
  border: 1px solid transparent;
  width: 15em;
  margin-right: .8em;
  margin-bottom: 1.5em;
}
.gl-item-card:nth-child(4n){
  margin-right: 0;
}
.gl-item-card:nth-child(4n+1){
  margin-left: .3em;
}
.gl-item-card:hover{
  border: 1px solid #E9E9E9;
  box-shadow: 0 0 .6em #EEE;
}
.big-image-container{
	height: 12.2em;
	display: flex;
	justify-content: center;
	align-items: center;	
}
.big-image{
	object-fit: scale-down;
	border: 1px solid #EEE;
  cursor: pointer;
}
.sub-images-container{
  box-sizing: border-box;
	white-space: nowrap;
	width: calc(100% - 1em);
	margin: .2em .5em;
  margin-bottom: 0;
  padding: .25em;
  padding-bottom: 0;
	height: 2em;
	display: flex;
	flex-direction: row;
	overflow-x: auto;
}
.sub-image{
	flex-shrink: 0;
	margin: 0 .4em 0 0;
	height: calc(100% - 2px);
	width: auto;
	object-fit: scale-down;
	cursor: pointer;
	border: 1px solid #eee;
}
.sub-image:hover{
	border: 1px solid red;
}
.price-tag{
  font-size: 1.3em;
  font-weight: 500;
  color: #FF9933;
	margin: 0;
  align-self: flex-start;
  padding-left: .5em;
}
.good-title{
  box-sizing: border-box;
  padding-left: 1em;
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
  margin-bottom: .2em;
  color: #666;
  cursor: pointer;
}
.good-title:hover{
  color: #3399CC;
}
</style>