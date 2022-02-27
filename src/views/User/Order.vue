<template>
<div id="name">
  <span class="title">商品管理</span><br/>
  <el-row>
    <el-col :span="2"></el-col>
    <el-col :span="20">
      <OrderListTable :orderList="orderList"/>
    </el-col>
    <el-col :span="2"></el-col>
  </el-row>
</div>
</template>

<script setup>
import {ref} from 'vue'
import OrderListTable from '../../components/OrderListTable.vue';
const orderList = ref([{
  userRole: 0,
  orderId: 235579152596,
  goodId: 0,
  goodName: "混合商品",
  image: require("@/assets/physics.png"),
  time: "2022-01-02 20:40",
  isCompleted: true,
  commentStars: 1,
  price: 998,
  comment: "被骗了！无良商家还我血汗钱！！！！",
  detailedDescription: "2022年1月2日晚上8点40后，卖家一直会在20号楼435寝室等着的，可以找一个时间来领，尽量不要来的太晚，以免影响其他人休息。",
  reportState: 1,
  reportReason: "无良商家，贩卖假冒伪劣产品！！",
  reportReply: "很抱歉给您造成了不好的购物体验，该商家当前已被封号处理，付款金额也将在七个工作日内返回给您的账号",
  name: "绝对不是奸商",
},{
  userRole: 0,
  orderId: 235579151234,
  goodId: 1,
  goodName: "混合商品",
  image: require("@/assets/physics.png"),
  time: "2022-01-01 09:25",
  isCompleted: true,
  commentStars: 5,
  price: 120,
  comment: "被骗了！无良商家还我血汗钱！！！！",
  detailedDescription: "2022年1月2日晚上8点40后，卖家一直会在20号楼435寝室等着的，可以找一个时间来领，尽量不要来的太晚，以免影响其他人休息。",
  reportState: 1,
  reportReason: "无良商家，贩卖假冒伪劣产品！！",
  reportReply: "很抱歉给您造成了不好的购物体验，该商家当前已被封号处理，付款金额也将在七个工作日内返回给您的账号",
  name: "绝对不是奸商",
}]);
</script>

<style scoped>
.title{
  display: inline-block;
  color: #000000;
  margin: 20px 0px 10px 20px;
  font-size: 24px;
  font-weight: bold;
}
</style>