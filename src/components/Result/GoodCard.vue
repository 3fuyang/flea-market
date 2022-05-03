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
      :class="['sub-image', `g${props.goodID}`]"
      v-for="(image, index) of imageCollection"
      :src="image"
      :id="`g-${index}`"/>
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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  goodID: string
  title: string
  price: string
  images: string[]
}>()

// 商品标题
const goodTitle = ref(props.title)
// 商品价格
const goodPrice = ref(props.price)
// 当前展示的大号图片序号
const currImageIndex = ref(0)
// 图片集合
const imageCollection = ref<string[]>([])
imageCollection.value = props.images.map(item => `http://127.0.0.1:8082/public/images/${item}`)
// 展示大图的URL
const currImageURL = computed(() => {
	return imageCollection.value[currImageIndex.value]
})

// 由于要监听多个元素的同一事件，需手写一个含有全局计时器的防抖函数
let globalTimer: number | null | undefined
const debounce = (fn: (...args: any[]) => void, delay: number) => {
	return (...args: any[]) => {
		globalTimer = setTimeout(() => {
			fn(...args)
			clearTimeout(globalTimer as number)
			globalTimer = null
		}, delay)
	}
}

// 鼠标悬浮到小图时，显示大图
const showBigImg = (id: number) => {
	currImageIndex.value = id
}

const debounceShowBigImg = debounce(showBigImg, 500)

onMounted(() => {
	// 为缩略图添加鼠标事件监听器
	const subImages = document.getElementsByClassName(`g${props.goodID}`)
	Array.from(subImages).forEach((subImg) => {
		subImg.addEventListener('mouseenter', (e) => {
			// 加上防抖
			debounceShowBigImg(Number.parseInt((e.target as HTMLElement).id.substring(2)))
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
  height: 100%;
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