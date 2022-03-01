<template>
<div id="name">
  <span class="title">订单管理</span><br/>
  <el-row>
    <el-col :span="2"></el-col>
    <el-col :span="20">
      <OrderListTable :orderList="orderList" @show-report-modal="showReportModal" @show-evaluate-modal="showEvaluateModal"/>
    </el-col>
    <el-col :span="2"></el-col>
  </el-row>
  <Teleport to="main">
    <ReportModal :show="showReport" :currOrderId="currentOrderId" @close="showReport = false"/>
  </Teleport>
  <Teleport to="main">
    <EvaluateModal :show="showEvaluate" :currOrderId="currentOrderId" :currOrderStatus="currentOrderStatus" @close="showEvaluate = false"/>
  </Teleport>  
</div>
</template>

<script setup>
import {ref, onMounted,} from 'vue'
import OrderListTable from '../../components/OrderListTable.vue';
import ReportModal from '../../components/ReportModal.vue';
import EvaluateModal from '../../components/EvaluateModal.vue';
const orderList = ref([]);  // 订单原始数据
const showReport = ref(false); // 举报窗口开关
const showEvaluate = ref(false);  // 评价窗口开关
const currentOrderId = ref(''); // 当前处理订单的ID
const currentOrderStatus = ref(''); // 当前处理订单的状态

onMounted(()=>{
  // 调用接口：传入（用户ID） 返回（订单列表：订单ID，订单时间，商品名称，金额，卖家ID，订单状态，订单评价）
  orderList.value.push.apply(orderList.value, [{
    userRole: 0,
    orderId: '235579152596',
    goodId: 0,
    goodName: "混合商品",
    image: require("@/assets/physics.png"),
    time: "2022-01-02 20:40",
    status: '待付款',
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
    orderId: '235579151234',
    goodId: 1,
    goodName: "混合商品",
    image: require("@/assets/physics.png"),
    time: "2022-01-01 09:25",
    status: '已完成',
    isCompleted: true,
    commentStars: 5,
    price: 120,
    comment: "被骗了！无良商家还我血汗钱！！！！",
    detailedDescription: "2022年1月2日晚上8点40后，卖家一直会在20号楼435寝室等着的，可以找一个时间来领，尽量不要来的太晚，以免影响其他人休息。",
    reportState: 1,
    reportReason: "无良商家，贩卖假冒伪劣产品！！",
    reportReply: "很抱歉给您造成了不好的购物体验，该商家当前已被封号处理，付款金额也将在七个工作日内返回给您的账号",
    name: "绝对不是奸商",
  },{
    userRole: 0,
    orderId: '235579321232',
    goodId: 1,
    goodName: "混合商品",
    image: require("@/assets/pen.png"),
    time: "2022-01-01 09:25",
    status: '待确定',
    isCompleted: true,
    commentStars: 5,
    price: 3999,
    comment: "被骗了！无良商家还我血汗钱！！！！",
    detailedDescription: "2022年1月2日晚上8点40后，卖家一直会在20号楼435寝室等着的，可以找一个时间来领，尽量不要来的太晚，以免影响其他人休息。",
    reportState: 1,
    reportReason: "无良商家，贩卖假冒伪劣产品！！",
    reportReply: "很抱歉给您造成了不好的购物体验，该商家当前已被封号处理，付款金额也将在七个工作日内返回给您的账号",
    name: "绝对不是奸商",
  },{
    userRole: 0,
    orderId: '235579159090',
    goodId: 1,
    goodName: "混合商品",
    image: require("@/assets/philips.png"),
    time: "2022-01-01 09:25",
    status: '待评价',
    isCompleted: true,
    commentStars: 5,
    price: 120,
    comment: "被骗了！无良商家还我血汗钱！！！！",
    detailedDescription: "2022年1月2日晚上8点40后，卖家一直会在20号楼435寝室等着的，可以找一个时间来领，尽量不要来的太晚，以免影响其他人休息。",
    reportState: 1,
    reportReason: "无良商家，贩卖假冒伪劣产品！！",
    reportReply: "很抱歉给您造成了不好的购物体验，该商家当前已被封号处理，付款金额也将在七个工作日内返回给您的账号",
    name: "绝对不是奸商",
  }]) 
});

function showReportModal(oid){
  currentOrderId.value = oid;
  console.log(currentOrderId.value);
  showReport.value = true;
}

function showEvaluateModal(oid, ost){
  currentOrderId.value = oid;
  currentOrderStatus.value = ost;
  console.log(currentOrderId.value, currentOrderStatus.value);
  showEvaluate.value = true;  
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