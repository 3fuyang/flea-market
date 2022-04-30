<template>
<div id="name">
  <span class="title">订单管理</span><br/>
  <el-row>
    <el-col :span="2"></el-col>
    <el-col :span="20">
      <OrderListTable 
        :orderList="orderList" 
        @show-report-modal="showReportModal" 
        @show-evaluate-modal="showEvaluateModal"/>
    </el-col>
    <el-col :span="2"></el-col>
  </el-row>
  <Teleport to="main">
    <ReportModal 
      :show="showReport" 
      :currOrderId="currentOrderId"
      :reported="currentOrderReported"
      @close="closeReport"/>
  </Teleport>
  <Teleport to="main">
    <EvaluateModal 
      :show="showEvaluate" 
      :currOrderId="currentOrderId" 
      :currOrderStatus="currentOrderStatus" 
      @order-done="completeOrder"
      @close="showEvaluate = false"/>
  </Teleport>  
</div>
</template>

<script setup>
import { ref } from 'vue'
import OrderListTable from '../../components/Order/OrderListTable.vue'
import ReportModal from '../../components/Order/ReportModal.vue'
import EvaluateModal from '../../components/Order/EvaluateModal.vue'
import axios from 'axios'

const userID = window.sessionStorage.getItem('uid')

const orderList = ref([])  // 订单原始数据
const showReport = ref(false) // 举报窗口开关
const showEvaluate = ref(false)  // 评价窗口开关
const currentOrderId = ref('') // 当前处理订单的ID
const currentOrderStatus = ref('') // 当前处理订单的状态
const currentOrderReported = ref(false) // 当前订单是否已被举报

// 调用接口：传入（用户ID） 返回（订单列表：订单ID，订单时间，商品名称，金额，卖家ID，订单状态，订单评价）
axios.get(`/api/getOrders/${userID}`)
  .then(res => {
    res.data.forEach(item => {
      orderList.value.push({
        sellerId: item.seller_id,
        orderId: new Array(12).join('0') + item.order_id,
        goodId: item.good_id,
        goodName: item.title,
        image: `http://127.0.0.1:8082/public/images/${item.images.split(';')[0]}`,
        time: item.generated_time.replace('T', ' '),
        status: item.stat,
        commentStars: 1,
        price: Number.parseFloat(item.price).toFixed(2),
        comment: item.review,
        reported: item.reported     
      })
    })
  })

function showReportModal(oid, orp){
  currentOrderId.value = oid
  currentOrderReported.value = orp === '未举报' ? false : true
  showReport.value = true
}

function closeReport(mode, oid) {
  if (mode === 'reported') {
    let index = orderList.value.findIndex(item => item.orderId === oid)
    if (index >= 0) {
      orderList.value[index].reported = '待处理'
    }
  }
  showReport.value = false
}

function showEvaluateModal(oid, ost){
  currentOrderId.value = oid
  currentOrderStatus.value = ost
  showEvaluate.value = true  
}

function completeOrder(oid) {
  // 更改视图中订单的状态为“已完成”
  let index = orderList.value.findIndex((item) => item.orderId === oid)
  if (index >= 0) {
    orderList.value[index].status = '已完成'
  }
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
</style>