<template>
<div id="name">
  <span style="display: inline-block;color: #000000;margin: 20px 0px 0px 20px;font-size: 24px;font-weight: bold;">我的收藏</span><br/>
  <div style="text-align: right;margin-bottom: 10px;">     
  <el-button v-show="searching === 1" type="text"  round style="margin-right: 800px;"
  @click="cancelSearch()"><el-icon :size="18"><arrow-left/></el-icon>Cancel</el-button>  
  <el-input v-model.trim="keyWord" placeholder="Search in collections." style="width: 250px;margin-right: 240px;" @keyup.enter="searchFavorite()">
    <template #prefix>
      <el-icon :size="18" style="margin-top: 5px;"><search/></el-icon>
    </template>
    <template #suffix>
      <el-button plain type="primary" size="small" round style="margin-top: 4px;" @click="searchFavorite()">搜索</el-button>         
    </template>        
  </el-input>  
  </div> 
  <el-row>
    <el-col :span="2"></el-col>
    <el-col :span="20">
      <div v-if="showData.length === 0">
        <el-empty description="您暂时没有收藏！"></el-empty>
      </div>
      <el-row>
      <template v-for="(goodItem) in showData" :key="goodItem.id">
      <el-card :body-style="{ padding: '0px' }" style="width: 220px;height: 250px;margin: 0px 5px 10px 5px;" >
        <el-image class="point" :src="goodItem.path" @click="jumpCard(goodItem.id)" fit="scale-down" />
          <span style="display: inline-block;font-size: 13px;color: #808080;margin-top: 3px;">{{goodItem.name}}</span><br/>
          <span style="display: inline-block;font-size: 18px;color: #FF9900;margin-top: 3px;">￥{{goodItem.price}}</span>
          <el-icon class="point" style="font-size: 20px;color: #999999;font-weight: bold;margin-top: 5px;float: right;"
          @click="deleteFavorite(goodItem.id)"><close/></el-icon>
      </el-card> 
      </template>
      <br/>
      </el-row> 
    </el-col>
  </el-row>
</div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Search, Close } from "@element-plus/icons-vue"
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// 收藏夹类型
interface Favorite {
  id: string
  name: string
  price: string
  path: string
}

// 用户ID
const userID = ref(window.sessionStorage.getItem('uid'))
// 收藏夹数据
const favoriteData = ref<Favorite[]>([])
// 搜索关键字
const keyWord = ref('')
// 是否开启搜索
const searching = ref(0)
// 搜索视图
const showData = ref<Favorite[]>([])

// 调用接口：传入（用户ID） 返回（收藏夹数据:商品ID、图片url、名称、价格）
axios.get(`/api/getCollection/${userID.value}`)
  .then((response) => {
    response.data.forEach((item: any) => {
      favoriteData.value.push({
        id: item.good_id,
        name: item.title,
        price: Number.parseFloat(item.price).toFixed(2),
        path: `http://127.0.0.1:8082/public/images/${item.images.split(';')[0]}`
      })
    })
    showData.value = [...favoriteData.value]
  })

// 点击卡片跳转商品详情页
function jumpCard(itemID: string) {
  router.push({
    path:'/details',
    query:{
      gid:itemID,
    }
  })
}

// 搜索收藏
function searchFavorite() {
  if (keyWord.value !== '') {
    searching.value = 1
    showData.value = []
    for (let item of favoriteData.value) {
      if (new RegExp(keyWord.value, "img").test(item.name)) {
        showData.value.push(item)
      }
    }
  } else {
    ElMessage.error('请输入关键字进行搜索')
  }      
}

// 取消搜素
function cancelSearch() {
  searching.value = 0
  showData.value = [...favoriteData.value]
}

// 取消收藏
function deleteFavorite (gid: string) {
  ElMessageBox.confirm(
    '将从收藏夹中删除这件商品,是否继续操作?',
    '确认',
    {
      confirmButtonText:'继续',
      cancelButtonText:'取消',
      type:'warning',
    }
  ).then(()=>{
    // 调用接口： 传入（用户ID,商品ID） 返回(null)
    const data = {
      userID: userID.value,
      goodID: gid
    }
    axios.post('/api/cancelCollection', data)
      .then(() => {
        let index = 0
        for (let item of favoriteData.value) {
          if (item.id === gid) {
            break
          } else {
            index++
          }
        }
        favoriteData.value.splice(index,1)

        index= 0
        for (let item of showData.value) {
          if (item.id === gid) {
            break
          } else {
            index++
          }
        }
        showData.value.splice(index, 1)
        ElMessage({
          type:'success',
          message:'删除成功!',
        })
      })
  })      
}
</script>

<style scoped>
.point{
  cursor: pointer;
}
</style>