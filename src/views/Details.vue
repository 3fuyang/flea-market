<template>
	<el-row justify="center" class="root-container">
		<el-col :span="10">
			<div class="good-container">
				<div class="left-flex-item">
					<div class="big-image-container">
						<el-image
							:src="currImageURL"
							alt="Big Big Image"
							:preview-src-list="imageCollection"
							class="big-image">
							<template #error>
							<el-image 
								:src="polyfillImageURL"/>
							</template>						
						</el-image>
					</div>
					<div class="sub-images-container">
						<el-image
							class="sub-image"
							v-for="image of imageCollection"
							:src="image"/>
					</div>
						<p class="declaration">商品类型：{{goodInfo.type}}</p>
				</div>
				<div class="right-flex-item">
					<el-row>
						<el-col :span="21">
							<p class="good-title">
								{{goodInfo.goodTitle}}
							</p>
						</el-col>
						<el-col :span="3">
							<el-icon class="star" :size="'2em'" color="orange">
								<star-filled/>
							</el-icon><br/>
							<p class="likes">({{goodInfo.likes}})</p>
						</el-col>					
					</el-row>
					<div class="price-container">
						<el-row>
							<el-col :span="6">
								<p class="price-label">价格</p>
							</el-col>
							<el-col :span="18">
								<span class="price">￥{{goodInfo.price}}</span>
								<span class="onshelf-date">（上架于 {{goodInfo.onshelfTime}}）</span>
							</el-col>
						</el-row>
					</div>
					<div class="brief-info-container">
						<el-row>
							<el-col :span="6">
								<p class="campus-label">校区</p>
							</el-col>
							<el-col :span="6">
								<p class="campus">{{goodInfo.campus}}</p>
							</el-col>
							<el-col :span="6">
								<p class="campus-label">配送</p>
							</el-col>
							<el-col :span="6">
								<p class="campus">线下/其他</p>
							</el-col>							
						</el-row>
						<p class="intro-label">商品简介</p><br/>
						<div class="intro-container">
							<p class="intro-text">{{goodInfo.intro}}</p>
						</div>
					</div>
					<div class="button-container">
						<el-row justify="space-around">
							<el-col :span="10">
								<button class="buy-it-now">
									立即购买
								</button>
							</el-col>
							<el-col :span="10">
								<button class="add-to-cart">
									加入购物车
								</button>							
							</el-col>							
						</el-row>
					</div>
				</div>				
			</div>
		</el-col>
		<el-col :span="4">
		  <div class="seller-container">
				<good-seller-panel :sellerID="goodInfo.sellerID"/>
			</div>
		</el-col>
	</el-row>
</template>

<script setup>
import { computed, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import GoodSellerPanel from '../components/Goods/GoodSellerPanel.vue'
import { StarFilled } from "@element-plus/icons-vue"
const goodID = ref('')	// 商品ID
const router = useRouter()
const goodInfo = ref(null)	// 商品详情
// 加载失败时的图片
const polyfillImageURL = '/src/assets/physics.png'
// 当前展示的大号图片序号
const currImageIndex = ref(0)
// 展示大图的URL
const currImageURL = computed(() => {
	return imageCollection.value[currImageIndex.value]
})
// 底部盒子中的缩略图
const imageCollection = ref([])
onBeforeMount(() => {
	// 从queryString获取商品ID
	goodID.value = router.resolve(router.currentRoute.value).query.gid
	// 调用接口：传入（商品ID）返回（商品详情：卖家ID、卖家昵称、商品标题、商品类型、上架时间、收藏数、商品图片URL、价格、地址、简介）
	goodInfo.value = {
		goodTitle: '商品标题，粗体，顶部，一般较长，自动换行，最大行数2',
		onshelfTime: '2020-12-32',
		sellerID: '1952525',
		likes: 1000,
		type: '电子产品',
		campus: '嘉定校区',
		images: [
			// 一件商品允许最少一张、最多三张图片
			// 后端只返回图片名称，URL在前端编码
			'philips',
			'pen',
			'tea',
		],
		price: 99999.99,
		intro: '一段关于该商品的文字，一般是对交易所做的限定，或者对商品优点的介绍。'
	}
	// 获取图片数组
	imageCollection.value = goodInfo.value.images.map((name) => {
		return `/src/assets/${name}.png`
	})
	// 初始化当前展示大图为第一张图片
	currImageIndex.value = 0
})
</script>

<style scoped>
.root-container{
	margin: .8em 0;
	overflow: auto;
}
.good-container{
	background-color: #fff;
	border: .08em solid #e8e8e8;
	border-right: none;
	height: 51vh;
	display: flex;
	padding: 2vh;
}
.seller-container{
	background-color: #fff;
	border: .08em solid hsl(212, 95%, 77%);
	padding: 2vh;
	height: 51vh;
}
.left-flex-item{
	margin-top: 1em;
	width: 15em;
}
.big-image-container{
	max-height: 20em;
	max-width: 15em;
}
.big-image{
	object-fit: scale-down;
	border: 1px solid #E0E0E0;
}
.sub-images-container{
	white-space: nowrap;
	width: calc(100% - 1em);
	margin: .2em .5em;
	height: 3.5em;
	display: flex;
	flex-direction: row;
	overflow-x: auto;
	animation: switch 5s ease-out infinite;
}
.sub-image{
	flex-shrink: 0;
	margin: 0 .4em 0 0;
	height: calc(100% - 2px);
	width: auto;
	object-fit: scale-down;
	cursor: pointer;
	border: 1px solid white;
}
.sub-image:hover{
	border: 1px solid red;
}
.declaration{
	margin: 0;
	margin-top: 1.2em;
	font-size: .8em;
	color: #888;
}
.right-flex-item{
	margin-top: 1em;
	width: 22.6em;
}
.good-title{
	margin: 0;
	font-weight: 600;
	font-size: 1.2em;
	color: #666666;
}
.star{
	cursor: pointer;
}
.likes{
	font-size: .6em;
	color: #6c6c6c;
	margin: 0;
}
.price-container{
	margin: .8em 0 0 0;
	background-color: #F0F8FF;
	padding: .8em .6em;
}
.price-label{
	color: #6c6c6c;
	font-size: .8em;
	font-weight: 500;
	margin: .6em 0 0 0;
}
.price{
	float: left;
  font-size: 1.4em;
  font-weight: bold;
  color: #FF9900;
	margin: 0;
}
.onshelf-date{
	display: inline-block;
	margin: 1em 0 0 0;
	font-size: .6em;
	color: #6c6c6c;
}
.brief-info-container{
	padding: .8em .6em .4em;
}
.campus-label{
	color: #6c6c6c;
	font-size: .8em;
	font-weight: 500;	
	margin: 0;
}
.campus{
	font-size: .6em;
	margin: 0;
	text-decoration: underline;
}
.intro-label{
	margin: .8em 0 .8em 2.2em;
	font-size: .8em;
	color: #6c6c6c;
	font-weight: 600;
	float: left;
}
.intro-container{
	margin: .8em 0 .8em 2.1em;	
	clear: left;
	text-align: left;
	max-height: 4em;
	min-height: 2em;
	overflow: auto;
}
.intro-text{
	margin: 0;
	color: #6c6c6c;
	padding: .5em;
	font-size: .8em;
	border: 1px dashed hsl(212, 95%, 77%);	
}
.button-container{
	padding: 0 .6em;
}
.buy-it-now{
	cursor: pointer;	
	color: #E5511D;
	border-color: #F0CAB6;
	background: #FFE4D0;
	text-align: center;	
	padding: .4em .8em;
}
.buy-it-now:hover{
	border-color: #fbcab0;
	background: #fbcab0;	
}
.add-to-cart{
	cursor: pointer;
	border-color: #FF9900;
	background: #FF9900;
	color: #fff;
	text-align: center;	
	padding: .4em .8em;	
}
.add-to-cart:hover{
	border-color: #ff6f00;
	background: #ff6f00;
}

</style>