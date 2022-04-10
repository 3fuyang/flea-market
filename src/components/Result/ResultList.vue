<template>
<div class="total-wrapper">
  <div class="gl-wrapper">
    <GoodCard v-for="n in 21" :good-i-d="`00000${n}`"/>
  </div>
  <div class="pagination-wrapper">
    <el-pagination
      :page-size="24"
      :pager-count="11"
      layout="prev, pager, next"
      :total="1000"
    />
  </div>  
</div>
</template>

<script setup>
import { onBeforeMount } from 'vue'
import GoodCard from './GoodCard.vue'
onBeforeMount(() => {
  // 根据query中的关键词、过滤条件、以初始页码1，向服务器请求数据

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