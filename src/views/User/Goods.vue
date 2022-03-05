<template>
<div class="root-wrapper">
<span class="title">商品管理</span><br/>  
  <el-row>
    <el-col :span="6"></el-col>
    <el-col :span="12">
      <div class="tab-wrapper">
        <el-tabs v-model="currentTab" class="tabs" type="border-card" stretch>
          <el-tab-pane label="上架中" name="onShelf" lazy>
            <GoodsListTable v-if="currentTab === 'onShelf'" :userId="uid" :goodsStatus="currentTab"/>
          </el-tab-pane>
          <el-tab-pane label="已售出" name="soldOut">
            <GoodsListTable v-if="currentTab === 'soldOut'" :userId="uid" :goodsStatus="currentTab"/>
          </el-tab-pane>
          <el-tab-pane label="新添闲置" name="uploadGood">
            <UploadGoodModal v-if="currentTab === 'uploadGood'" :userId="uid"/>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-col>
    <el-col :span="6"></el-col>
  </el-row>
</div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import GoodsListTable from '../../components/Goods/GoodsListTable.vue';
import UploadGoodModal from '../../components/Goods/UploadGoodModal.vue';
const currentTab = ref('onShelf');
const uid = ref(null);

onMounted(()=>{
  // 获取用户ID
  uid.value = window.sessionStorage.getItem('uid');
})
</script>

<style scoped>
.title{
  display: inline-block;
  color: #000000;
  margin: 20px 0px 10px 20px;
  font-size: 24px;
  font-weight: bold;
}  
.tab-wrapper{
  margin-bottom: 20px;
}
</style>