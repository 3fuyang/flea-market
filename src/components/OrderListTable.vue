<template>
<div class="RootDiv">
  <div class="TableNav">
    <el-row>
      <el-col :span="24/columns.length" v-for="(column,index) of columns" :key="index">
        <span class="NavFont">{{column}}</span>
      </el-col>    
    </el-row>
  </div>
  <div class="Card" v-for="order of orderList" :key="order.orderId">
    <div class="CardNav">
      <el-row>
        <el-col :span="4">
          <span class="ShallowFont">{{order.time}}</span>
        </el-col>
        <el-col :span="4">
          <span class="ShallowFont">订单号:&nbsp;&nbsp;</span>
          <span class="DarkFont">{{order.orderId}}</span>
        </el-col>
        <el-col :span="12"></el-col>      
        <el-col :span="4">
          <span class="ShallowFont point">
          <el-icon :size="20" class="Icon" @click="deleteOrder(order.orderId)"><DeleteFilled/></el-icon>
          </span>
        </el-col>
      </el-row>
    </div>
    <div class="CardBody">
      <el-row>
        <el-col :span="4">
          <el-image class="Image" :src="order.image"></el-image>
        </el-col>
      </el-row>
    </div>
  </div>
</div>
</template>

<script setup>
import {defineProps} from 'vue'
import { DeleteFilled } from '@element-plus/icons-vue';
const columns = ['','订单详情','', '金额', '状态', '操作'];
defineProps({
  orderList: Array, // 订单数据数组
  userRole: Number, // 用户角色（0 代表买家，1 代表卖家）
})
function deleteOrder(orderId){
  // 调用接口：传入（订单ID）返回（删除结果）
  orderId;
}
</script>

<style scoped>
.point{
  cursor: pointer;
}
.TableNav{
  background-color: #ffffff;
  font-size: 15px;
  color: 	#909399;
  font-family: '微软雅黑';
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
}
.NavFont{
  display: inline-block;
  margin: 8px 0px 8px 0px;
}
.Card{
  margin-bottom: 20px;
}
.CardNav{
  height: 25px;
  background-color: #E5E5E5;
  font-size: 13px;
  font-family: '微软雅黑';
  text-align: center;
}
.ShallowFont{
  line-height:25px;
  color: #969696;
}
.DarkFont{
  line-height:25px;
}
.Icon{
  margin-top: 3px;
}
.CardBody{
  background-color: #FFFFFF;
  height: 100px;
  border: 1px solid #E0E0E0;
}
.Image{
  float: left;
  margin: 3px 0px 3px 10px;
  height: 90px;
  width: auto;
  border: 2px solid #E0E0E0;
  alt: 'Goods Thumbnail';
}
</style>