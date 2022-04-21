<template>
	<el-row justify="center" class="root-container">
		<el-col :span="10">
			<div class="good-container">
				<div class="left-flex-item">
					<div class="big-image-container">
						<el-image
							:src="currImageURL"
							:preview-src-list="imageCollection"
							class="big-image">
							<template #placeholder>
								<div class="loading-container">
									<div class="line"></div>
									<div class="line"></div>
									<div class="line"></div>
									<div class="line"></div>
								</div>								
							</template>								
							<template #error>
								<p class="placeholder">Error !</p>							
							</template>						
						</el-image>
					</div>
					<div class="sub-images-container">
						<img
							class="sub-image"
							v-for="(image, index) of imageCollection"
							:src="image"
							:id="index"/>
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
							<el-icon 
								class="star" 
								:size="'2em'" 
								color="orange"
								@click="changeLike">
								<star-filled v-if="liked"/>
								<star v-else />
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
								<button 
									class="buy-it-now"
									@click="goConfirm">
									立即购买
								</button>
							</el-col>
							<el-col :span="10">
								<button 
									class="add-to-cart"
									@click="addToCart">
									{{ inCart ? '已加入购物车' :'加入购物车' }}
								</button>							
							</el-col>							
						</el-row>
					</div>
				</div>				
			</div>
		</el-col>
		<el-col :span="4">
		  <div class="seller-container">
				<good-seller-panel v-if="goodInfo.sellerID" :sellerID="goodInfo.sellerID"/>
			</div>
		</el-col>
	</el-row>
	<div class="bottom-box">
		<div class="comment-container">
			<p class="seller-comment-title">
				<el-icon :size="20" color="#1C93F5" class="shop-icon">
					<shop/>
				</el-icon>
				卖家评论
			</p>
			<div class="comments">
				<comments v-if="goodInfo.sellerID"  :user-i-d="goodInfo.sellerID"/>
			</div>	
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import GoodSellerPanel from '../components/Goods/GoodSellerPanel.vue'
import Comments from '../components/Goods/Comments.vue'
import { StarFilled, Star, Shop } from "@element-plus/icons-vue"
import { ElMessage } from 'element-plus'
import axios from 'axios'

const goodID = ref('')	// 商品ID
let userID = ''	// 用户ID
const router = useRouter()
const goodInfo = ref({sellerID: ''})	// 商品详情

// 当前展示的大号图片序号
const currImageIndex = ref(0)

// 展示大图的URL
const currImageURL = computed(() => {
	return imageCollection.value[currImageIndex.value]
})

// 底部盒子中的缩略图
const imageCollection = ref([])

// 挂载前，初始化数据
// 从queryString获取商品ID
goodID.value = router.resolve(router.currentRoute.value).query.gid
// 调用接口：传入（商品ID）返回（商品详情：卖家ID、卖家昵称、商品标题、商品类型、上架时间、收藏数、商品图片URL、价格、地址、简介）
axios.get(`/api/getGoods/${goodID.value}`)
	.then(response => {
		goodInfo.value = {
			goodTitle: response.data[0].title,
			onshelfTime: response.data[0].onshelf_time.substr(0, 19).replace('T', ' '),
			sellerID: response.data[0].seller_id,
			likes: 1000,	// 对接收藏夹接口后，需要重写接口适配收藏数
			type: response.data[0].category,
			campus: response.data[0].campus,
			images: 
				// 一件商品允许最少一张、最多三张图片
				// 后端只返回图片名称，URL在前端编码
				response.data[0].images.split(';')
			,
			price: Number.parseFloat(response.data[0].price).toFixed(2),
			intro: response.data[0].intro
		}
		// 获取图片数组
		imageCollection.value = goodInfo.value.images.map((name) => `http://127.0.0.1:8082/public/images/${name}.png`)
		//console.log(imageCollection.value)
		// 初始化当前展示大图为第一张图片
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
// 是否已收藏
const liked = ref(false)
// 是否加入购物车
const inCart = ref(false)
// 挂载后，为DOM添加事件监听
onMounted(() => {
	// 从SessionStorage获取用户ID
	userID = window.sessionStorage.getItem('uid')
	// 对于用户账号
	if(userID.length === 7){
		// 调用接口，加入浏览记录：传入（用户ID，商品ID，当前时间） 返回（null）
		axios.post('/api/addTrack', {
			userID,
			goodID: goodID.value,
			time: new Date().toISOString().slice(0, 19).replace('T', ' ')
		})
		// 调用接口：传入（用户ID）	返回（用户是否将该商品收藏、加入购物车)
		axios.post(`/api/checkCollected`, {userID: userID, goodID: goodID.value})
			.then(res => {
				liked.value = res.data
			})
		liked.value = false
		inCart.value = false
	}
	// 对于管理员账号
	else{
		ElMessage.warning('请使用普通账号收藏商品。')
	}

	// 为缩略图添加鼠标事件监听器
	const subImages = document.getElementsByClassName('sub-image')
	// 注意：由于Vue的mounted钩子不会承诺所有的子组件一起被挂载
	// setTimeout生成一个宏任务，保证获取完整的DOM结构
	window.setTimeout(() => {
		Array.from(subImages).forEach((subImg) => {
			subImg.addEventListener('mouseenter', (e) => {
				// 加上防抖
				debounceShowBigImg(Number.parseInt(e.target.id))
			})
		})
	}, 0)
})

// 收藏或取消收藏
const changeLike = () => {
	if(userID.length !== 4 && userID.length !== 7){
		// 未登录，跳转到登录页面
		router.push('/login')
	}else{
		const data = {
			userID,
			goodID: goodID.value,
			time: new Date().toISOString().slice(0, 19).replace('T', ' ')
		}
		// 调用接口：传入（用户ID，商品ID） 返回（收藏结果）
		if(!liked.value){
			axios.post('/api/collectGood', data)
				.then(() => {
					liked.value = !liked.value
				})
		}else{
			axios.post('/api/cancelCollection', {userID: data.userID, goodID: data.goodID})
				.then(() => {
					liked.value = !liked.value
				})			
		}
	}
}

// 跳转到付款页面
const goConfirm = () => {
	router.push({
		path: '/confirm',
		query:{
			gid: goodID.value,
		},		
	})
}

// 加入购物车
const addToCart = () => {
	// 用户未登录
	if(userID === '0'){
		// 跳转到登录页面
		router.push('/login')
	}
	// 管理员账号
	else if(userID.length === 4){
		ElMessage.warning('请登录普通用户账号进行该操作！')
	}
	// 普通用户
	else if(userID.length === 7){
		if(!inCart.value){
			// 调用接口-加入购物车：传入（用户ID，商品ID） 返回（添加结果）

			inCart.value = true
		}else{
			// 已在购物车中，跳转到购物车页面
			router.push('/shoppingcart')
		}
	}
}
</script>

<style scoped>
.root-container{
	margin: .8em 0 .4em 0;
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
	flex-grow: 0;
	overflow: auto;
}
.big-image-container{
	padding: 0 .5em;
	padding-top: .1em;
	height: 12.2em;
	width: 13.5em;
	display: flex;
	justify-content: center;
	align-items: center;
}
.big-image{
	width: 100%;
	height: 100%;
	object-fit: scale-down;
	border: 1px solid #E0E0E0;
}
.loading-container{
	position: relative;
	display: inline-block;
	box-sizing: border-box;
	padding: 30px;
	width: 25%;
	height: 140px;
}
.line{
  position: absolute;
  top: 50%;
  margin-left: 10px;
  width: 60px;
  height: 4px;
  background: #FFF;
  animation: spin 1.5s infinite ease;
}
.line:nth-of-type(2) { 
	animation-delay: 0.1s; 
}  
.line:nth-of-type(3) { 
	animation-delay: 0.2s; 
}
.line:nth-of-type(4) { 
	animation-delay: 0.3s; 
}
@keyframes spin { 
  100% { 
    transform: rotate(360deg); 
  } 
} 
.placeholder{
	color: #08C;
	font-size: 1.5em;
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
.bottom-box{
	display: flex;
	justify-content: center;
}
.seller-comment-title{
	margin: 0;
	float: left;
	padding-left: 1em;
	color: #6c6c6c;
	font-size: 1.2em;
	font-weight: 600;
	display: flex;
	align-items: center;
}
.shop-icon{
	padding: .1em;
}
.comment-container{
	flex: 0 0 55.5rem;
	background-color: #FFF;
	border: .08em solid #e8e8e8;
	padding: .8em;
	box-sizing: border-box;
}
.comments{
	padding: 0 10em;
}
</style>