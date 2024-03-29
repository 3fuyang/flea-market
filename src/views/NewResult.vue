<template>
  <div class="root-wrapper">
    <div class="query-wrapper">
      <div class="query-box">
        <div class="flex-row-center">
          <input class="query-input" type="text" placeholder="请输入商品关键词" v-model="keywords"
            @keyup.enter="queryByKeywords" />
          <button class="query-btn" @click="queryByKeywords">
            搜索
          </button>
        </div>
        <div class="flex-row-center apply-space-evenly">
          <span class="popular-keywords" v-for="item in popularKeywords" @click="queryByPupular(item)">
            {{ item }}
          </span>
        </div>
      </div>
    </div>
    <FilterTable />
    <div class="goods-wrapper">
      <div class="recommend-wrapper">
        <RecommendList />
      </div>
      <div class="result-wrapper">
        <ResultList />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { onBeforeMount, ref } from 'vue'
import { onBeforeRouteUpdate, useRouter, useRoute, isNavigationFailure, type LocationQueryValue } from 'vue-router'
import { cloneDeep } from 'lodash'
import FilterTable from '../components/Result/FilterTable.vue'
import RecommendList from '../components/Result/RecommendList.vue'
import ResultList from '../components/Result/ResultList.vue'

const message = useMessage()

const router = useRouter()
// 用户输入的搜索关键字
const keywords = ref<string | undefined>('')
onBeforeMount(() => {
  let queryValue = useRoute().query.keywords
  keywords.value = queryValue?.toString() ? queryValue.toString() : ''
})
onBeforeRouteUpdate((to) => {
  keywords.value = to.query.keywords?.toString()
})
// 流行的关键词列表
const popularKeywords = [
  '高数第七版',
  '大红袍茶叶',
  '四六级收音机',
  '羽毛球拍',
  '空气净化器',
  '雷蛇鼠标',
  '机械键盘'
]
// 使用流行关键词搜索
async function queryByPupular(item: string) {
  const newQuery = cloneDeep(router.currentRoute.value.query)
  newQuery.keywords = item
  const failure = await router.push({
    path: '/result',
    query: newQuery
  })
  if (isNavigationFailure(failure)) {
    message.error('路由导航失败')
  }
}
// 使用关键词搜索
async function queryByKeywords() {
  if (!(keywords.value as string).length) {
    message.warning('亲，请输入关键词哦。')
    return false
  } else {
    const newQuery = cloneDeep(router.currentRoute.value.query)
    newQuery.keywords = keywords.value as LocationQueryValue
    const failure = await router.push({
      path: '/result',
      query: newQuery
    })
    if (isNavigationFailure(failure)) {
      message.error('路由导航失败')
    }
  }
}
</script>

<style scoped>
.root-wrapper {
  background-color: white;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.query-wrapper {
  display: flex;
  justify-content: center;
  overflow: auto;
  padding: 1.5em .5em .5em;
}

.query-box {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.flex-row-center {
  display: flex;
  justify-content: center;
  margin-bottom: .4em;
}

.query-input {
  width: 45em;
  outline-style: none;
  border: 2px solid #3399CC;
  padding: .6em 1.4em;
  font-size: .8rem;
  font-family: "Microsoft soft";
}

.query-input:focus {
  border-color: #66afe9;
  outline: none;
  box-shadow: inset 0 .1em .1em rgba(0, 0, 0, .075), 0 0 .8em rgba(102, 175, 233, .6);
}

.query-btn {
  outline: none;
  background-color: #0099CC;
  border: none;
  padding: 0 1.2em;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
}

.query-btn:hover {
  box-shadow: inset 0 .1em .1em rgba(0, 0, 0, .075), 0 0 .8em rgba(102, 175, 233, .6);
}

.apply-space-evenly {
  justify-content: space-evenly;
}

.popular-keywords {
  color: #3399CC;
  font-size: .8rem;
  overflow: auto;
  cursor: pointer;
}

.popular-keywords:hover {
  text-decoration: underline;
}

.goods-wrapper {
  display: flex;
  flex-direction: row;
  width: 74rem;
  margin: .8em auto;
}

.recommend-wrapper {
  z-index: 1;
  flex: 0 1 15%;
  padding: .3rem;
}

.result-wrapper {
  z-index: 1;
  flex: 1 0 85%;
}
</style>