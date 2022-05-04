<template>
<div class="root-wrapper">
<span class="title">商品管理</span><br/>  
  <el-row>
    <el-col :span="6"/>
    <el-col :span="12">
      <div class="tab-wrapper">
        <el-tabs 
          v-model="currentTab" 
          class="tabs" 
          type="border-card" 
          stretch>
          <el-tab-pane label="上架中" name="onShelf" lazy>
            <GoodsListTable 
              v-if="currentTab === 'onShelf'" 
              :userId="userID" 
              :goodsStatus="currentTab" 
              @check-info="checkGoodInfo"/>
          </el-tab-pane>
          <el-tab-pane label="已售出" name="soldOut" lazy>
            <GoodsListTable 
              v-if="currentTab === 'soldOut'" 
              :userId="userID" 
              :goodsStatus="currentTab" 
              @check-info="checkGoodInfo"/>
          </el-tab-pane>
          <el-tab-pane label="新添闲置" name="uploadGood" lazy>
            <UploadGoodModal 
              v-if="currentTab === 'uploadGood'" 
              :userId="userID"/>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-col>
    <el-col :span="6"/>
  </el-row>
  <Teleport to="main">
    <GoodsInfoModal 
      v-if="showInfoModal" 
      :goodId="currentGoodId.toString()" 
      :status="currentTab"
      :show="showInfoModal"
      @close="closeGoodInfo"/>
  </Teleport>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GoodsListTable from '../../components/Goods/GoodsListTable.vue'
import UploadGoodModal from '../../components/Goods/UploadGoodModal.vue'
import GoodsInfoModal from '../../components/Goods/GoodsInfoModal.vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

// store
const userStore = useUserStore()
const { userID } = storeToRefs(userStore)

// 当前Tab页
const currentTab = ref('onShelf')

// 商品信息窗口开关
const showInfoModal = ref(false)
// 当前选中商品ID
const currentGoodId = ref('')
// 打开信息窗口
function checkGoodInfo(gid: string) {
  currentGoodId.value = gid
  showInfoModal.value = true
}
// 关闭信息窗口
function closeGoodInfo() {
  currentGoodId.value = ''
  showInfoModal.value = false
}
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