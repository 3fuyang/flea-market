<template>
<div class="total-wrapper">
  <div class="gl-wrapper" v-if="resultGoodsView.length > 0">
    <GoodCard 
      v-for="good in resultGoodsView" 
      :good-i-d="good.goodID.toString()"
      :price="good.price"
      :title="good.title" 
      :images="good.images" />
  </div>
  <el-empty v-else description="啥也没搜到? Don't Panick. 这很正常。"/>
  <div class="pagination-wrapper">
    <n-pagination
      v-if="resultGoods.length !== 0"
      v-model:page="page" 
      :item-count="resultGoods.length"
      :page-size="24">
    </n-pagination>
  </div>  
</div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref, computed } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import type { RouteLocationNormalized } from 'vue-router'
import { NPagination } from 'naive-ui'
import GoodCard from './GoodCard.vue'

// 结果商品类型
interface ResultGood {
  goodID: string,
  price: string,
  title: string,
  images: string[]
}
// 结果商品
const resultGoods = ref<ResultGood[]>([])
// 当前页码
const page = ref(1)
// 商品视图
const resultGoodsView = computed(() => {
  let begin = (page.value - 1) * 24
  let end = begin + 24 > resultGoods.value.length ? resultGoods.value.length : begin + 24
  return resultGoods.value.slice(begin, end)
})

interface RequestBody {
  keywords: string
  filters?: any
}

// 解析query参数
const parseQuery = (route: RouteLocationNormalized) => {
  resultGoods.value.length = 0
  // 提取关键字
  let keywords = route.query.keywords
  // campus, category, minPrice, maxPrice, onShelfTime, score
  // 提取筛选条件
  let filters = route.query.filters ? JSON.parse(route.query.filters as string) : null
  // 请求体
  let body: RequestBody = { keywords: keywords as string }
  // 解析filters
  if (filters) {
    for(let property in filters) {
      if (property !== 'minPrice' && property !== 'maxPrice' && filters[property].length === 0) {
        delete filters[property]
      }
    }
    // 检查filters对象在解析后是否是空字面值对象
    if (Object.keys(filters).length > 0) {
      body.filters = filters
    }
  }
  // 发送请求，获取新数据
  axios.post('/api/getResult', body)
    .then(res => {
      res.data && res.data.forEach((item: any) => {
        resultGoods.value.push({
          goodID: item.good_id,
          price: Number.parseFloat(item.price).toFixed(2),
          title: item.title,
          images: item.images.split(';')
        })
      })
    })
}

// 首次导航
parseQuery(useRoute())

// 路由更新前
onBeforeRouteUpdate((to, from, next) => {
  parseQuery(to)
})
</script>

<style scoped>
.total-wrapper{
  border: 1px solid #eee;
  box-sizing: border-box;
  padding: .4em 0;
  display: flex;
  flex-direction: column;
  min-height: 44em;
  z-index: 1;
}
.gl-wrapper{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.pagination-wrapper{
  align-self: center;
}
</style>