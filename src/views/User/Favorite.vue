<template>
  <div class="root-wrapper">
    <page-title>
      <template #icon>
        <star-line-horizontal320-regular />
      </template>
      <template #main-title>
        我的收藏
      </template>
      <template #sub-title>
        Favorite
      </template>
    </page-title>
    <div style="text-align: right;margin-bottom: 10px;">
      <el-button v-show="searching === 1" type="text" round style="margin-right: 800px;" @click="cancelSearch()">
        <el-icon :size="18">
          <arrow-left />
        </el-icon>Cancel
      </el-button>
      <el-input v-model.trim="keyWord" placeholder="Search in collections." style="width: 250px;margin-right: 240px;"
        @keyup.enter="searchFavorite()">
        <template #prefix>
          <div style="display: flex;justify-content: center;align-items: center;">
            <el-icon :size="18" style="">
              <search />
            </el-icon>
          </div>
        </template>
        <template #suffix>
          <div style="display: flex;justify-content: center;align-items: center;">
            <el-button plain type="primary" size="small" round @click="searchFavorite()">搜索
            </el-button>
          </div>
        </template>
      </el-input>
    </div>
    <el-row>
      <el-col :span="2"></el-col>
      <el-col :span="20">
        <div v-if="showData.length === 0">
          <el-empty description="您暂时没有收藏！"></el-empty>
        </div>
        <div style="display: flex;gap: .5em;flex-wrap: wrap;">
          <template v-for="(goodItem) in showData" :key="goodItem.id">
            <favorite-card :good-i-d="goodItem.id" :src="goodItem.path" :price="goodItem.price" :title="goodItem.name"
              :removable="true" @delete-gooditem="deleteFavorite" />
          </template>
          <br />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useMessage, useDialog } from 'naive-ui'
import { ArrowLeft, Search } from "@element-plus/icons-vue"
import { ref } from 'vue'
import axios from 'axios'
import { serverHost } from '@/data/host'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import PageTitle from '@/components/Public/PageTitle.vue'
import { StarLineHorizontal320Regular } from '@vicons/fluent'
import FavoriteCard from '@/components/Favorite/FavoriteCard.vue'

const message = useMessage()
const dialog = useDialog()

// store
const userStore = useUserStore()
const { userID } = storeToRefs(userStore)

// 收藏夹类型
interface Favorite {
  id: string
  name: string
  price: string
  path: string
}

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
        id: item.collection_good_id,
        name: item.good_title,
        price: Number.parseFloat(item.good_price).toFixed(2),
        path: `http://${serverHost}:8082/public/images/${item.good_images.split(';')[0]}`
      })
    })
    showData.value.length = 0
    showData.value.push(...favoriteData.value)
  })

// 搜索收藏
function searchFavorite() {
  if (keyWord.value !== '') {
    searching.value = 1
    showData.value.length = 0
    for (let item of favoriteData.value) {
      if (new RegExp(keyWord.value, "img").test(item.name)) {
        showData.value.push(item)
      }
    }
  } else {
    message.error('请输入关键字进行搜索')
  }
}

// 取消搜素
function cancelSearch() {
  searching.value = 0
  showData.value = [...favoriteData.value]
}

// 取消收藏
function deleteFavorite(gid: string | number) {
  dialog.warning({
    title: '确认',
    content: '将从收藏夹中删除这件商品,是否继续操作?',
    positiveText: '继续',
    negativeText: '取消',
    onPositiveClick: () => {
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
          favoriteData.value.splice(index, 1)

          index = 0
          for (let item of showData.value) {
            if (item.id === gid) {
              break
            } else {
              index++
            }
          }
          showData.value.splice(index, 1)
          message.success('删除成功！')
        })
    }
  })
}
</script>

<style scoped>
.root-wrapper {
  width: 100%;
}

.point {
  cursor: pointer;
}
</style>