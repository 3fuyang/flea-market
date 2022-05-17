<template>
<div class="root-wrapper">
  <page-title>
    <template #icon>
      <Money20Regular/>
    </template>
    <template #main-title>
      卖出闲置
    </template>
    <template #sub-title>
      Trade
    </template>
  </page-title>
  <div class="list-box">
    <div class="sider"></div>
    <NDialogProvider>
      <TradeOrders/>
    </NDialogProvider>
    <div class="sider"></div>
  </div>
</div>
</template>

<script setup lang="ts">
import TradeOrders from '../../components/Trade/TradeOrders.vue'
import { NDialogProvider } from 'naive-ui'
import { Money20Regular } from '@vicons/fluent'
import PageTitle from '@/components/Public/PageTitle.vue'
</script>

<style scoped>
.root-wrapper{
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
  justify-content: center;
  z-index: 1;
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