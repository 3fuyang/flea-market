<template>
<div class="root-wrapper">
  <p class="total-title">卖出闲置</p>
  <div class="list-box">
    <div class="sider"></div>
    <NDialogProvider>
      <TradeOrders/>
    </NDialogProvider>
    <div class="sider"></div>
  </div>
</div>
</template>

<script setup>
import TradeOrders from '../../components/Trade/TradeOrders.vue'
import { NDialogProvider } from 'naive-ui'
</script>

<style scoped>
.root-wrapper{
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
  justify-content: center;
}
.total-title{
  align-self: center;
  font-size: 1.3rem;
  font-weight: 600;
  color: #666;
  margin: 0;
  margin-bottom: 1em;
}
.list-box{
  display: flex;
}
.sider{
  width: 60rem;
}
</style>