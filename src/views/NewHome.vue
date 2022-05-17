<script setup lang="ts">
import { computed, ref } from 'vue'
import { NButton, NIcon, NInput, useMessage } from 'naive-ui'
import { Search, Reading, Monitor, MagicStick, Bicycle, Odometer, Position, Food, OfficeBuilding, FirstAidKit, Suitcase, Star, Clock, Lock, PieChart, Files, Message, Help } from '@element-plus/icons-vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { storeToRefs } from 'pinia'

// router实例
const router = useRouter()

const message = useMessage()

// user仓库
const userStore = useUserStore()
const { userID, identity } = storeToRefs(userStore)

// 流行关键词
const popularKeywords = [
  '高数第七版',
  '大红袍茶叶',
  '四六级收音机',
  '羽毛球拍',
  '空气净化器',
  '雷蛇鼠标',
  '机械键盘'
]

// 商品分类
const categories = [
  '图书音像',
  '电子产品',
  '美妆个护',
  '运动户外',
  '生活电器'
]

// 图片列表
const imageList = [
  { no:'1', path: "http://106.15.78.201:8082/public/home/1.jpg"},
  { no:'2', path: "http://106.15.78.201:8082/public/home/2.png"},
  { no:'3', path: "http://106.15.78.201:8082/public/home/3.jpg"},
  { no:'4', path: "http://106.15.78.201:8082/public/home/4.png"}
]

const campusList = [
  '校区分布',
  '四平路校区',
  '嘉定校区',
  '沪西校区',
  '沪北校区'
]

// 点击菜单，跳转到结果页
function jumpMenu(item: string): void {
  let tail = item.slice(item.length - 2)
  if (tail === '校区') {
    router.push({
      path: '/result',
      query: {
        filters: JSON.stringify({
          campus: [item]
        })
      }
    })
  } else if (tail === '分布') {
    return
  } else {
    router.push({
      path: '/result',
      query: {
        filters: JSON.stringify({
          category: [item]
        })
      }
    })
  }
}

// 搜索关键词
const keyWord = ref('')

// 根据关键词搜索，跳转到结果页
function searchKeyWord(): void {
  if(keyWord.value !== ''){
    router.push({
      path:'/result',
      query:{
        keywords: keyWord.value,
      },
    })
  }else{
    message.warning('亲,请输入关键字哦')
  }
}

// 点击流行关键字，跳转到结果
function jumpKeyWord(kwd: string): void {
  router.push({
    path: '/result',
    query: {
      keywords: kwd
    }
  })
}

// 商品类型
interface ServerSideGood {
  good_id: string,
  title: string,
  price: string,
  images: string
}
interface GoodInfo {
  id: string,
  name: string,
  price: string,
  path: string
}
// 商品信息列表
const goodsList = ref<GoodInfo[]>([])
// 获取随机商品
axios.get(`/api/getRecommendList`)
  .then(response => {
    response.data.forEach((item: ServerSideGood) => {
      goodsList.value.push({
        id: item.good_id.toString(),
        name: item.title,
        price: Number.parseFloat(item.price).toFixed(2),
        path: `http://106.15.78.201:8082/public/images/${item.images.split(';')[0]}`        
      })
    })
  })

// 点击商品卡片，跳转到详情
function jumpCard(gid: string): void {
  router.push({
    path: '/details',
    query: {
      gid: gid
    }
  })
}

// 头像Url
const avatarUrl = computed(() => {
  let name: string
  if (identity.value === 'visitor') {
    name = 'grey_avatar'
  } else {
    name = 'avatar'
  }
  return `http://106.15.78.201:8082/public/images/${name}.png`
})
// 点击头像
function clickAvatar(): void {
  if (identity.value === 'member') {
    router.push('/info')
  } else if (identity.value === 'visitor') {
    router.push('/login')
  } else {
    router.push('/admin/report')
  }
}

// 交易数据类型
interface ProfileData {
  label: string
  value: string | number
  onClick: (v: string | number) => void
}
// 交易相关数据
const profileData = ref<ProfileData[]>([
  {
    label: '购物车',
    value: '--',
    onClick: (v) => {
      if (v !== '--') {
        router.push('/shoppingcart')
      }
    }
  },
  {
    label: '待付款',
    value: '--',
    onClick: (v) => {
      if (v !== '--') {
        router.push('/order')
      }
    }    
  },
  {
    label: '待评价',
    value: '--',
    onClick: (v) => {
      if (v !== '--') {
        router.push('/order')
      }
    }    
  }
])

// 若为普通会员，获取购物相关数据
if (identity.value === 'member') {
  axios.get(`/api/homeinfo/${userID}`)
    .then((response) => {
      const d = response.data
      profileData.value[0].value = d.shoppingCartNum
      profileData.value[1].value = d.notPaidNum
      profileData.value[2].value = d.notEvaluateNum
    })
}

// 浏览相关数据
const browseData = ref([
  {
    label: '收藏的宝贝',
    value: 'star'
  },
  {
    label: '用户足迹',
    value: 'clock'
  }
])

// 图标颜色
const iconColor = (value: string) => {
  if (identity.value === 'member') {
    return value === 'star' ? '#FF9900' : '#3399CC'
  } else {
    return '#808080'
  }
}

// 普通用户面板按钮
const memberButtons = [
  {
    label: '安全中心',
    action: () => {
      router.push('/security')
    }
  },
  {
    label: '卖出商品',
    action: () => {
      router.push('/trade')
    }
  },
  {
    label: '我的闲置',
    action: () => {
      router.push('/goods')
    }
  },
  {
    label: '我的聊天',
    action: () => {
      router.push('/chat')
    }
  }
]

// 管理员面板按钮
const adminButtons = [
  {
    label: '受理举报',
    action: () => {
      router.push('/admin/report')
    }
  }
]
</script>

<template>
<!--搜索框-->
<el-container class="search-wrapper">
  <n-input
    class="search-input"
    v-model.trim="keyWord"
    placeholder="Type to Search."
    @keyup.enter="searchKeyWord">
    <template #prefix>
      <n-icon>
        <Search/>
      </n-icon>
    </template>
    <template #suffix>
      <n-button 
        secondary
        type="info" 
        size="small" 
        round
        @click="searchKeyWord"
        >搜索</n-button>
    </template>      
  </n-input>
</el-container>

<!--流行关键词-->
<el-container class="popular-wrapper">
  <el-button
    v-for="item in popularKeywords"
    type="text"
    size="small"
    class="keywords"
    @click="jumpKeyWord(item)">
    {{item}}
  </el-button>
</el-container>

<el-container class="menu-wrapper">
  <el-row>
    <!--类型菜单-->
    <el-menu class="el-menu-vertical category-menu">
      <el-menu-item
        v-for="(item, index) in categories"
        :index="index.toString()"
        @click="jumpMenu(item)">
        <el-icon :size="20">
          <reading v-if="item === '图书音像'"/>
          <monitor v-else-if="item === '电子产品'"/>
          <magic-stick v-else-if="item === '美妆个护'"/>
          <bicycle v-else-if="item === '运动户外'"/>
          <odometer v-else-if="item === '生活电器'"/>                                        
        </el-icon>
        <span>
          {{item}}
        </span>
      </el-menu-item>
    </el-menu>
    
    <!--大图走马灯-->
    <el-carousel
      height="280px"
      class="top-carousel">
      <el-carousel-item
        v-for="item in imageList"
        :key="item.no">
        <el-image
          :src="item.path"
          fit="scale-down"/>
      </el-carousel-item>
    </el-carousel>
    
    <!--校区菜单-->
    <el-menu
      class="el-menu-vertical campus-menu">
      <el-menu-item
        v-for="(item, index) in campusList"
        :index="index.toString()"
        @click="jumpMenu(item)">
        <el-icon
          :size="20">
          <position v-if="item === '校区分布'"/>
          <food v-else-if="item === '四平路校区'"/>
          <office-building v-else-if="item === '嘉定校区'"/>
          <first-aid-kit v-else-if="item === '沪西校区'"/>
          <suitcase v-else-if="item === '沪北校区'"/>
        </el-icon>
        <span>
          {{item}}
        </span>
      </el-menu-item>
    </el-menu>
  </el-row>
</el-container>

<el-container class="mid-wrapper">
  <el-row>
    <!--冬季特价-->
    <div class="winter-wrapper">
      <p class="winter-text-one">冬季特价</p>
      <p class="winter-text-two">FOR SALE</p>
      <n-button 
        text-color="#fff"
        color="#C0ECFB"
        ghost
        class="winter-btn">
        前往
      </n-button>
    </div>

    <!--商品走马灯-->
    <el-carousel
      v-if="goodsList.length > 0"
      type="card"
      indicator-position="none"
      height="240px"
      class="good-carousel">
      <el-carousel-item
        v-for="item in goodsList"
        :key="item.id"
        class="good-carousel-item">
        <el-card
          :body-style="{ padding: 0 }"
          class="good-card"
          @click="jumpCard(item.id)">
          <el-image
            :src="item.path"
            class="good-img"
            fit="scale-down"/>
          <p class="good-title">
            {{item.name}}
          </p>
          <p class="price">
            ￥{{item.price}}  
          </p>
        </el-card>
      </el-carousel-item>
    </el-carousel>

    <!--简要数据展示板-->
    <div class="dash-board-wrapper">
      <el-avatar
        class="avatar"
        shape="circle"
        :src="avatarUrl"
        :size="50"
        @click="clickAvatar">
      </el-avatar>
      <p class="hello-text">
        {{identity === 'visitor' ? `Hi, please log in!` : `Welcome, ${userID}!`}}
      </p>
      <div class="nums-wrapper">
        <div 
          class="num-item"
          v-for="item in profileData"
          @click="item.onClick(item.value)">
          <p :class="['item-numeric', identity !== 'member' ? 'color-grey' : '']">{{item.value}}</p>
          <p class="item-label">{{item.label}}</p>
        </div>
      </div>
      <div class="browse-wrapper">
        <div 
          class="browse-item"
          v-for="item in browseData">
          <el-icon 
            class="point"
            :size="24"
            :color="iconColor(item.value)">
            <star 
              v-if="item.value === 'star'"
              @click="$router.push('/favorite')" />
            <clock
              v-else
              @click="$router.push('/favorite')" />
          </el-icon>
          <p class="item-label">{{item.label}}</p>
        </div>
      </div>      
    </div>

    <!--简要跳转板-->
    <div class="panel-wrapper">
      <!--游客-->
      <div
        class="panel"
        v-if="identity === 'visitor'">
        <p class="panel-text" style="color: #99CCCC;">PLEASE</p>
        <n-button
          class="panel-button"
          text-color="#fff"
          ghost
          color="#C0ECFB"          
          @click="$router.push('/login')">
          登录
        </n-button>
        <p class="panel-text" style="color: #FF9999">AND</p>
        <p class="panel-text" style="color: #CF9">THEN</p>
        <p class="panel-text" style="color: #FFCC99">EXPLORE</p>
      </div>
      <!--普通用户-->
      <div
        v-else-if="identity === 'member'"
        class="panel">
        <n-button
          class="panel-button"
          v-for="item in memberButtons"
          :key="item.label"
          text-color="#fff"
          ghost
          color="#C0ECFB"
          @click="item.action">
          <template #icon>
            <n-icon
              :size="18"
              color="#FFF">
              <lock v-if="item.label === '安全中心'"/>
              <pie-chart v-else-if="item.label === '卖出商品'"/>
              <files v-else-if="item.label === '我的闲置'"/>
              <Message v-else-if="item.label === '我的聊天'"/>
            </n-icon>
          </template>
          {{item.label}}
        </n-button>                      
      </div>
      <!--管理员-->
      <div
        v-else-if="identity === 'admin'"
        class="panel">
        <n-button
          class="panel-button"
          v-for="item in adminButtons"
          :key="item.label"
          text-color="#fff"
          ghost
          color="#C0ECFB"
          @click="item.action">
          <template #icon>
            <n-icon
              :size="18"
              color="#FFF">
              <help v-if="item.label === '受理举报'"/>
            </n-icon>
          </template>
          {{item.label}}
        </n-button>                      
      </div>         
    </div>
  </el-row>
</el-container>
</template>

<style scoped>
.search-wrapper {
  margin-top: 3em;
  display: flex;
  justify-content: center;
}
.search-input {
  width: 500px;
  text-align: left;
}
.search-icon {
  margin-top: 6px;
  margin-right: 2px;
}
.popular-wrapper {
  height: 30px;
  margin: 0px 33%;
  margin-bottom: .6em;
  display: flex;
  justify-content: center;
}
.keywords {
  padding: 0;
  color: #3399CC;
}
.keywords:hover {
  text-decoration: underline;
}
.menu-wrapper {
  height: 280px;
  margin-bottom: 25px;
  display: flex;
  justify-content: center;
}
.category-menu {
  width: 133px;
  margin-right: 2px;
}
.top-carousel {
  width: 836.05px;
}
.campus-menu {
  width: 133px;
  margin-left: 2px;
}
.mid-wrapper {
  height: 240px;
  display: flex;
  justify-content: center;
  margin-bottom: 1.2em;
}
.winter-wrapper {
  width: 133px;
  height: 240px;
  background-image: url('/src/assets/winter.jpg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: .2em; 
}
.winter-text-one {
  font-size: 22px;
  color: #ffffff;
}
.winter-text-two {
  font-size: 18px;
  color: #ffffff;
  font-family: Arial,Verdana,Sans-serif;
}
.winter-btn {
  background-color: rgba(102,204,255,0.8);
  padding: 0 .5em;
}
.good-carousel {
  width: 627px;
  margin-left: 5px;
}
.good-carousel-item {
  margin-left: 38px;
}
.good-card {
  width: 220px;
  height: 240px;
}
.good-img {
  max-height: 190px;
}
.good-title {
  font-size: 13px;
  color: #808080;
  max-width: 100%;
  padding-left: .2em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;  
  margin: 0;
}
.price {
  font-size: 18px;
  color: #FF9900;
  margin: 0;
  padding: 0;
}
.dash-board-wrapper {
  display: flex;
  flex-direction: column;
  max-height: 242px;
  align-items: space-evenly;
  justify-content: space-evenly;
  background-image: url('/src/assets/profile.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border-radius: .3em;
  width: 207px;
}
.avatar {
  margin-top: 15px;
  background-color: #F0F8FF;
  align-self: center;
  cursor: pointer;
}

.hello-text {
  font-size: 13px;
  font-weight: bold;
  margin: 0;
}
.nums-wrapper {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.num-item {
  display: flex;
  flex-direction: column;
  cursor: pointer;
}
.item-numeric {
  font-size: 18px;
  color: #FF9900;
  font-weight: bold;
  margin: 0;
}
.color-grey {
  color: #808080
}
.item-label {
  font-size: 14px;
  color: #696969;
  margin: 0;
}
.browse-wrapper {
  display: flex;
  justify-content: space-evenly;
}
.browse-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.panel-wrapper {
  width: 130px;
  height: 240px;
  margin-left: 3px;
  background-image: url('/src/assets/panel.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  height: 100%;
}
.panel-text {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}
.panel-button {
  background-color: rgba(102,204,255,0.8);
  padding: 0 .6em;
  height: 2.2em;
}
.point {
  cursor: pointer;
}
</style>