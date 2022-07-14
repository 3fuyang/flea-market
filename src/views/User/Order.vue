<template>
  <div class="root">
    <page-title>
      <template #icon>
        <ClipboardTaskListRtl20Regular />
      </template>
      <template #main-title>
        订单管理
      </template>
      <template #sub-title>
        Order
      </template>
    </page-title>
    <el-row>
      <el-col :span="2"></el-col>
      <el-col :span="20">
        <OrderListTable :orderList="orderList" @show-report-modal="showReportModal"
          @show-evaluate-modal="showEvaluateModal" @show-pay-modal="showQRModal" />
      </el-col>
      <el-col :span="2"></el-col>
    </el-row>
    <Teleport to="main">
      <ReportModal :show="showReport" :currOrderId="currentOrderId" :reported="currentOrderReported"
        @close="closeReport" />
    </Teleport>
    <Teleport to="main">
      <EvaluateModal v-if="showEvaluate" :show="showEvaluate" :currOrderId="currentOrderId"
        :currOrderStatus="currentOrderStatus" @order-done="completeOrder" @close="showEvaluate = false" />
    </Teleport>
    <Teleport to="main">
      <PayQRCode :show="showQR" :price="currentOrderPrice" @close="closeQRModal">
        <template #header>
          请扫描付款码，进行付款。
        </template>
        <template #body>
          <img style="object-fit: scale-down;width: 60%;" src="/src/assets/payment.jpg" />
        </template>
      </PayQRCode>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import OrderListTable from '../../components/Order/OrderListTable.vue'
import ReportModal from '../../components/Order/ReportModal.vue'
import EvaluateModal from '../../components/Order/EvaluateModal.vue'
import PayQRCode from '../../components/Confirm/PayQRCode.vue'
import axios from 'axios'
import { useMessage } from 'naive-ui'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import PageTitle from '@/components/Public/PageTitle.vue'
import { ClipboardTaskListRtl20Regular } from '@vicons/fluent'

const message = useMessage()

const userStore = useUserStore()
const { userID } = storeToRefs(userStore)

// 订单类型
interface Order {
  sellerId: string
  orderId: string
  goodId: string
  goodName: string
  image: string
  time: string
  status: string
  commentStars: number
  price: string
  comment: string
  reported: string
}
const orderList = ref<Order[]>([])  // 订单原始数据
const showReport = ref(false) // 举报窗口开关
const showEvaluate = ref(false)  // 评价窗口开关
const showQR = ref(false) // 付款窗口开关
const currentOrderPrice = ref(0) // 当前订单金额
const currentOrderId = ref('') // 当前处理订单的ID
const currentOrderStatus = ref('') // 当前处理订单的状态
const currentOrderReported = ref('') // 当前订单是否已被举报

// 调用接口：传入（用户ID） 返回（订单列表：订单ID，订单时间，商品名称，金额，卖家ID，订单状态，订单评价）
axios.get(`/api/getOrders/${userID.value}`)
  .then(res => {
    res.data.forEach((item: any) => {
      orderList.value.push({
        sellerId: item.good_seller_id,
        orderId: new Array(12).join('0') + item.order_order_id,
        goodId: item.order_good_id,
        goodName: item.good_title,
        image: `http://106.15.78.201:8082/public/images/${item.good_images.split(';')[0]}`,
        time: item.order_generated_time.slice(0, 19).replace('T', ' '),
        status: item.order_stat,
        commentStars: 1,
        price: Number.parseFloat(item.order_price).toFixed(2),
        comment: item.order_review,
        reported: item.order_reported
      })
    })
  })

// 打开举报窗口
function showReportModal(oid: string, orp: string) {
  currentOrderId.value = oid
  currentOrderReported.value = orp
  showReport.value = true
}

// 关闭举报窗口
function closeReport(mode: string, oid: string) {
  if (mode === 'reported') {
    let index = orderList.value.findIndex(item => item.orderId === oid)
    if (index >= 0) {
      orderList.value[index].reported = '待处理'
    }
  }
  showReport.value = false
}

// 打开评价窗口
function showEvaluateModal(oid: string, ost: string) {
  currentOrderId.value = oid
  currentOrderStatus.value = ost
  showEvaluate.value = true
}

// 关闭评价窗口
function completeOrder(oid: string) {
  // 更改视图中订单的状态为“已完成”
  let index = orderList.value.findIndex((item) => item.orderId === oid)
  if (index >= 0) {
    orderList.value[index].status = '已完成'
  }
}

// 打开付款窗口
function showQRModal(oid: string, price: number) {
  showQR.value = true
  currentOrderId.value = oid
  currentOrderPrice.value = price
}

// 关闭付款窗口
function closeQRModal(paid: boolean) {
  if (paid) {
    axios.post(`/api/payOrder`, { orderID: currentOrderId.value })
      .then(() => {
        let index = orderList.value.findIndex(item => item.orderId === currentOrderId.value)
        if (index >= 0) {
          orderList.value[index].status = '待确认'
        }
        message.success(`付款成功，交易完成后记得确认完成订单哦~`)
      })
  } else {
    message.info(`取消支付`)
  }
  showQR.value = false
}
</script>

<style scoped>
.root {
  width: 100%;
  z-index: 1;
}

.title {
  display: inline-block;
  color: #000000;
  margin: 20px 0px 10px 20px;
  font-size: 24px;
  font-weight: bold;
}
</style>