<template>
	<el-row justify="center" class="root-container">
		<el-col :span="17">
			<div class="good-container">
				<div class="left-flex-item">
					<div class="big-image-container">
						<el-image :src="currImageURL" :preview-src-list="imageCollection" lazy class="big-image">
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
						<img class="sub-image" v-for="(image, index) of imageCollection" :src="image" :id="index.toString()" />
					</div>
					<p class="declaration">商品类型：{{ goodInfo.type }}</p>
				</div>
				<div class="right-flex-item">
					<el-row>
						<el-col :span="21">
							<p class="good-title">
								{{ goodInfo.goodTitle }}
							</p>
						</el-col>
						<el-col :span="3">
							<el-icon class="star" :size="'2em'" color="orange" @click="changeLike">
								<star-filled v-if="liked" />
								<star v-else />
							</el-icon><br />
							<p class="likes">({{ goodInfo.likes }})</p>
						</el-col>
					</el-row>
					<div class="price-container">
						<el-row>
							<el-col :span="6">
								<p class="price-label">价格</p>
							</el-col>
							<el-col :span="18">
								<span class="price">￥{{ goodInfo.price }}</span>
								<span class="onshelf-date">（上架于 {{ goodInfo.onshelfTime }}）</span>
							</el-col>
						</el-row>
					</div>
					<div class="brief-info-container">
						<el-row>
							<el-col :span="6">
								<p class="campus-label">校区</p>
							</el-col>
							<el-col :span="6">
								<p class="campus">{{ goodInfo.campus }}</p>
							</el-col>
							<el-col :span="6">
								<p class="campus-label">配送</p>
							</el-col>
							<el-col :span="6">
								<p class="campus">线下/其他</p>
							</el-col>
						</el-row>
						<p class="intro-label">商品简介</p><br />
						<div class="intro-container">
							<p class="intro-text">{{ goodInfo.intro }}</p>
						</div>
					</div>
					<div class="button-container">
						<el-row justify="space-around">
							<el-col :span="10">
								<n-button type="warning" :disabled="userID === goodInfo.sellerID" class="buy-it-now" @click="goConfirm">
									立即购买
								</n-button>
							</el-col>
							<el-col :span="10">
								<n-button color="#FF4400" :disabled="userID === goodInfo.sellerID" class="add-to-cart"
									@click="addToCart">
									{{ inCart ? '已加入购物车' : '加入购物车' }}
								</n-button>
							</el-col>
						</el-row>
					</div>
				</div>
			</div>
		</el-col>
		<el-col :span="7">
			<n-message-provider :max="1">
				<div class="seller-container">
					<suspense>
						<good-seller-panel v-if="goodInfo.sellerID" :sellerID="goodInfo.sellerID" />
					</suspense>
				</div>
			</n-message-provider>
		</el-col>
	</el-row>
	<div class="bottom-box">
		<div class="comment-container">
			<p class="seller-comment-title">
				<el-icon :size="20" color="#1C93F5" class="shop-icon">
					<shop />
				</el-icon>
				卖家评论
			</p>
			<div class="comments">
				<comments v-if="goodInfo.sellerID" :user-i-d="goodInfo.sellerID" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUpdated, ref } from 'vue'
import { useRouter, onBeforeRouteUpdate } from 'vue-router'
import GoodSellerPanel from '../components/Goods/GoodSellerPanel.vue'
import Comments from '../components/Goods/Comments.vue'
import { StarFilled, Star, Shop } from "@element-plus/icons-vue"
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { NMessageProvider, NButton, useMessage } from 'naive-ui'

const message = useMessage()

// store
const userStore = useUserStore()
const { userID, identity } = storeToRefs(userStore)

const goodID = ref('')	// 商品ID
const router = useRouter()

// 商品详情类型
interface GoodInfo {
	goodTitle: string
	onshelfTime: string
	sellerID: string
	likes: number
	type: string
	campus: string
	images: string[]
	price: string
	intro: string
}
// 商品信息ref对象
const goodInfo = ref<GoodInfo>(
	{
		goodTitle: '',
		onshelfTime: '',
		sellerID: '',
		likes: 0,
		type: '',
		campus: '',
		images: [],
		price: '',
		intro: ''
	}
)

// 当前展示的大号图片序号
const currImageIndex = ref(0)

// 展示大图的URL
const currImageURL = computed(() => {
	return imageCollection.value[currImageIndex.value]
})

// 底部盒子中的缩略图
const imageCollection = ref<string[]>([])

// 从queryString获取商品ID
goodID.value = router.resolve(router.currentRoute.value).query.gid as string

getGoodInfo()

// 获取商品信息
function getGoodInfo() {
	axios.get(`/api/checkAvailable/${goodID.value}`)
		.then(res => {
			console.log(typeof res.data)
			if (res.data !== true) {
				message.error('该商品已下架！')
				router.back()
			}
		})
		.then(() => {
			// 调用接口：传入（商品ID）返回（商品详情：卖家ID、卖家昵称、商品标题、商品类型、上架时间、收藏数、商品图片URL、价格、地址、简介）
			axios.get(`/api/getGoods/${goodID.value}`)
				.then(response => {
					goodInfo.value.goodTitle = response.data.title
					goodInfo.value.onshelfTime = response.data.onshelfTime.substr(0, 19).replace('T', ' '),
						goodInfo.value.sellerID = response.data.sellerId,
						goodInfo.value.likes = response.data.likes
					goodInfo.value.type = response.data.category
					goodInfo.value.campus = response.data.campus
					goodInfo.value.images = response.data.images.split(';')
					goodInfo.value.price = Number.parseFloat(response.data.price).toFixed(2)
					goodInfo.value.intro = response.data.intro
					// 清空图片数组
					imageCollection.value.length = 0
					// 获取新的图片数组
					imageCollection.value.push(...goodInfo.value.images.map((name) => `http://106.15.78.201:8082/public/images/${name}`))
					//console.log(imageCollection.value)
					// 初始化当前展示大图为第一张图片
					currImageIndex.value = 0
				})
		})
}

// 由于要监听多个元素的同一事件，需手写一个含有全局计时器的防抖函数
let globalTimer: number | null | undefined
const debounce = (fn: (...args: any[]) => void, delay: number) => {
	return (...args: any[]) => {
		globalTimer = window.setTimeout(() => {
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
// 是否已收藏
const liked = ref(false)
// 是否加入购物车
const inCart = ref(false)
// 挂载后，为DOM添加事件监听
const initialize = () => {
	// 对于用户账号
	if (identity.value === 'member') {
		// 调用接口：传入（用户ID）	返回（用户是否将该商品收藏、加入购物车)
		axios.post(`/api/checkCollected`, { userID: userID.value, goodID: goodID.value })
			.then(res => {
				liked.value = res.data
			})
		axios.post(`/api/checkInCart`, { userID: userID.value, goodID: goodID.value })
			.then(res => {
				inCart.value = res.data
			})
	}
	// 对于管理员账号
	else if (identity.value === 'admin') {
		liked.value = false
		inCart.value = false
	}
}

function addImgEvent() {
	// 为缩略图添加鼠标事件监听器
	const subImages = document.getElementsByClassName('sub-image')
	// 注意：由于Vue的mounted钩子不会承诺所有的子组件一起被挂载
	// setTimeout生成一个宏任务，保证获取完整的DOM结构
	window.setTimeout(() => {
		Array.from(subImages).forEach((subImg) => {
			subImg.addEventListener('mouseenter', (e) => {
				// 加上防抖
				debounceShowBigImg(Number.parseInt((e.target as HTMLElement).id))
			})
		})
	}, 500)
}

if (identity.value === 'member') {
	let date = new Date()
	date.setHours(date.getHours() + 8)
	// 调用接口，加入浏览记录：传入（用户ID，商品ID，当前时间） 返回（null）
	axios.post('/api/addTrack', {
		userID: userID.value,
		goodID: goodID.value,
		time: date.toISOString().slice(0, 19).replace('T', ' ')
	})
}

initialize()

onMounted(addImgEvent)

onUpdated(addImgEvent)

onBeforeRouteUpdate((to) => {
	//console.log(`调用beforeRouteUpdate守卫, to.query.gid为: ${to.query.gid}`)
	goodID.value = to.query.gid as string
	getGoodInfo()
	initialize()
})

// 收藏或取消收藏
const changeLike = () => {
	if (identity.value === 'visitor') {
		// 未登录，跳转到登录页面
		router.push('/login')
	} else {
		let date = new Date()
		date.setHours(date.getHours() + 8)
		const data = {
			userID: userID.value,
			goodID: goodID.value,
			time: date.toISOString().slice(0, 19).replace('T', ' ')
		}
		// 调用接口：传入（用户ID，商品ID） 返回（收藏结果）
		if (!liked.value) {
			axios.post('/api/collectGood', data)
				.then(() => {
					liked.value = !liked.value
					goodInfo.value.likes++
				})
		} else {
			axios.post('/api/cancelCollection', { userID: data.userID, goodID: data.goodID })
				.then(() => {
					liked.value = !liked.value
					goodInfo.value.likes--
				})
		}
	}
}

// 跳转到付款页面
const goConfirm = () => {
	if (identity.value === 'member') {
		router.push({
			path: '/confirm',
			query: {
				gid: goodID.value,
			}
		})
	} else if (identity.value === 'admin') {
		message.warning(`请使用普通账号执行该操作。`)
	} else {
		router.push(`/login`)
	}
}

// 加入购物车
const addToCart = () => {
	// 用户未登录
	if (identity.value === 'visitor') {
		// 跳转到登录页面
		router.push('/login')
	}
	// 管理员账号
	else if (identity.value === 'admin') {
		message.warning('请登录普通用户账号进行该操作！')
	}
	// 普通用户
	else if (identity.value === 'member') {
		if (!inCart.value) {
			let date = new Date()
			date.setHours(date.getHours() + 8)
			// 调用接口-加入购物车：传入（用户ID，商品ID） 返回（添加结果）
			const data = {
				userID: userID.value,
				goodID: goodID.value,
				time: date.toISOString().slice(0, 19).replace('T', ' ')
			}
			axios.post('/api/addToCart', data)
				.then(() => {
					inCart.value = true
				})
		} else {
			// 已在购物车中，跳转到购物车页面
			router.push('/shoppingcart')
		}
	}
}
</script>

<style scoped>
.root-container {
	box-sizing: border-box;
	width: 55.375rem;
	margin: .8em 0 .4em 0;
	overflow: auto;
	z-index: 1;
	display: flex;
}

.good-container {
	background-color: #fff;
	border: .08em solid #e8e8e8;
	border-right: none;
	height: 22rem;
	display: flex;
	padding: 1.25rem;
}

.seller-container {
	background-color: #fff;
	border: .08em solid #EFEFEF;
	padding: 1.25rem;
	height: 22rem;
}

.left-flex-item {
	margin-top: 1em;
	width: 15em;
	flex-grow: 0;
	overflow: auto;
}

.big-image-container {
	padding: 0 .5em;
	padding-top: .1em;
	height: 12.2em;
	width: 13.5em;
	display: flex;
	justify-content: center;
	align-items: center;
}

.big-image {
	width: 100%;
	height: 100%;
	object-fit: scale-down;
	border: 1px solid #E0E0E0;
}

.loading-container {
	position: relative;
	display: inline-block;
	box-sizing: border-box;
	padding: 30px;
	width: 25%;
	height: 140px;
}

.line {
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

.placeholder {
	color: #08C;
	font-size: 1.5em;
}

.sub-images-container {
	white-space: nowrap;
	width: calc(100% - 1em);
	margin: .2em .5em;
	height: 3.5em;
	display: flex;
	flex-direction: row;
	overflow-x: auto;
	animation: switch 5s ease-out infinite;
}

.sub-image {
	flex-shrink: 0;
	margin: 0 .4em 0 0;
	height: calc(100% - 2px);
	width: auto;
	object-fit: scale-down;
	cursor: pointer;
	border: 1px solid white;
}

.sub-image:hover {
	border: 1px solid red;
}

.declaration {
	margin: 0;
	margin-top: 1.2em;
	font-size: .8em;
	color: #888;
}

.right-flex-item {
	margin-top: 1em;
	flex: 1;
}

.good-title {
	margin: 0;
	font-weight: 600;
	font-size: 1.2em;
	color: #666666;
}

.star {
	cursor: pointer;
}

.likes {
	font-size: .6em;
	color: #6c6c6c;
	margin: 0;
}

.price-container {
	margin: .8em 0 0 0;
	background-color: #F0F8FF;
	padding: .8em .6em;
}

.price-label {
	color: #6c6c6c;
	font-size: .8em;
	font-weight: 500;
	margin: .6em 0 0 0;
}

.price {
	float: left;
	font-size: 1.4em;
	font-weight: bold;
	color: #FF9900;
	margin: 0;
}

.onshelf-date {
	display: inline-block;
	margin: 1em 0 0 0;
	font-size: .6em;
	color: #6c6c6c;
}

.brief-info-container {
	padding: .8em .6em .4em;
}

.campus-label {
	color: #6c6c6c;
	font-size: .8em;
	font-weight: 500;
	margin: 0;
}

.campus {
	font-size: .6em;
	margin: 0;
	text-decoration: underline;
}

.intro-label {
	margin: .8em 0 .8em 2.2em;
	font-size: .8em;
	color: #6c6c6c;
	font-weight: 600;
	float: left;
}

.intro-container {
	margin: .8em 0 .8em 2.1em;
	clear: left;
	text-align: left;
	max-height: 4em;
	min-height: 2em;
	overflow: auto;
}

.intro-text {
	margin: 0;
	color: #6c6c6c;
	padding: .5em;
	font-size: .8em;
	border: 1px dashed hsl(212, 95%, 77%);
}

.button-container {
	padding: 0 .6em;
}

.buy-it-now {
	padding: .4em .8em;
}

.add-to-cart {
	padding: .4em .8em;
}

.bottom-box {
	display: flex;
	justify-content: center;
	z-index: 1;
	margin-bottom: 1rem;
}

.seller-comment-title {
	margin: 0;
	float: left;
	padding-left: 1em;
	color: #6c6c6c;
	font-size: 1.2em;
	font-weight: 600;
	display: flex;
	align-items: center;
}

.shop-icon {
	padding: .1em;
}

.comment-container {
	flex: 0 0 55.5rem;
	background-color: #FFF;
	border: .08em solid #e8e8e8;
	padding: .8em;
	box-sizing: border-box;
}

.comments {
	padding: 0 10em;
}
</style>