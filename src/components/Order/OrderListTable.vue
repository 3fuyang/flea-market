<template>
<div class="RootDiv">
  <div class="TableNav">
    <el-row>
      <el-col :span="4">       
      </el-col>       
      <el-col :span="4">
        <span class="NavFont">{{columns[1]}}</span>        
      </el-col> 
      <el-col :span="4">       
      </el-col>     
      <el-col :span="4">
        <span class="NavFont">{{columns[3]}}</span>        
      </el-col>        
      <el-col :span="4">
        <div class="nav-select">
          <el-select 
            v-model="category" 
            placeholder="Select">
            <el-option
              v-for="(item, index) in categories"
              :key="index"
              :value="item"
            >
            </el-option>
          </el-select>          
        </div>        
      </el-col>   
      <el-col :span="4">
        <span class="NavFont">{{columns[5]}}</span>        
      </el-col>           
    </el-row>
  </div>
  <el-empty v-if="orderListView.length === 0"/>
  <div 
    class="Card" 
    v-for="order of orderListView" 
    :key="order.orderId">
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
      </el-row>
    </div>
    <div class="CardBody">
      <el-row>
        <el-col :span="3">
          <el-image 
            class="Image" 
            :src="order.image"/>
        </el-col>
        <el-col :span="4">
          <span class="GoodName">
            {{order.goodName}}
          </span>
        </el-col>
        <el-col :span="2">
          <span class="Quantity">×1</span>
        </el-col>
        <el-col :span="3">
          <span 
            class="Consult point" 
            @click="$emit('show-report-modal', order.orderId, order.reported)">
            <el-icon 
              :size="16" 
              class="Icon">
              <Service/>
            </el-icon>
            {{ order.reported === '未举报' ? '申请售后' : '查看申请' }}
          </span>
        </el-col>
        <el-col :span="4">
            <span class="Price">￥{{order.price}}</span><br/>
            <div class="SimpleLine"></div>
            <span class="PayApproach">&nbsp;&nbsp;（在线支付）</span>
        </el-col>
        <el-col :span="4">
          <span class="StatusText">
            {{order.status}}
          </span>
        </el-col>
        <el-col :span="4">
            <span class="Contact point" @click="contactSeller(order.sellerId)">
              <el-icon :size="13" class="Icon"><ChatDotRound/></el-icon>
              联系卖家
            </span><br/>
            <span v-if="order.status === '待评价'" class="Option point"
            @click="$emit('show-evaluate-modal', order.orderId, order.status)">
              <el-icon :size="13" class="Icon"><Edit/></el-icon>
              评价交易
            </span>
            <span v-else-if="order.status === '已完成'" class="Option point"
            @click="$emit('show-evaluate-modal', order.orderId, order.status)">
              <el-icon :size="13" class="Icon"><Edit/></el-icon>
              查看评价
            </span>            
            <span v-else-if="order.status === '待付款'" class="Option point"
            @click="payOrder(order.orderId, Number.parseFloat(order.price))">
              <el-icon :size="13" class="Icon"><Wallet/></el-icon>
              去付款
            </span>  
            <span v-else-if="order.status === '待确认'" class="Option point"
            @click="confirmReceipt(order.orderId)">
              <el-icon :size="13" class="Icon"><CircleCheck/></el-icon>
              确认收货
            </span>                             
        </el-col>
      </el-row>
    </div>
  </div>
</div>
</template>

<script lang="ts" setup>
// 在<script setup>中，this.$router 不能使用
// 需要引入 useRouter()，生成 router 实例
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { useMessage, useDialog } from 'naive-ui'
import { Service, ChatDotRound, Edit, Wallet, CircleCheck } from '@element-plus/icons-vue'
import axios from 'axios'

const message = useMessage()

const dialog = useDialog()

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

const props = defineProps<{
  orderList: Order[]
}>()

const categories = ['全部订单', '待付款', '待确认', '待评价', '已完成', '已取消'] // 订单状态
const category = ref('全部订单') // 当前订单分类
const columns = ['','订单详情','', '金额', '状态', '操作'] // 表头

const rawOrderList = ref(props.orderList)

const orderListView = computed(() => {
  if (category.value === '全部订单') {
    return rawOrderList.value
  } else {
    return rawOrderList.value.filter((item) => {
      return item.status === category.value
    })
  }
}) // 订单视图

const router = useRouter()

const emits = defineEmits<{
  (e: 'show-report-modal', oid: string, orp: string): void
  (e: 'show-evaluate-modal', oid: string, ost: string): void
  (e: 'show-pay-modal', oid: string, price: number): void
}>()

// 联系卖家
function contactSeller (sid: string) {
  // 在新窗口打开聊天页面。
  axios.get(`/api/sellerAvatarAndName/${sid}`)
    .then(res => {
      const routeUrl = router.resolve({
        path:'/chat',
        query: {
          oponentID: sid,
          oponentName: res.data[0].nickname,
          avatar: `http://106.15.78.201:8082/public/avatars/${res.data[0].avatar}`
        }
      })
      window.open(routeUrl .href, '_blank')  
    })
}

// 付款
function payOrder (oid: string, price: number) {
  emits('show-pay-modal', oid, price)
}

// 确认收货
function confirmReceipt (oid: string) {
  dialog.info({
    title: '提示',
    content: '请确保已收到并检验过货物，是否确定完成订单?',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      // 调用接口：传入（订单ID）返回（确定结果）
      axios.post(`/api/completeOrder`, { orderID: oid})
        .then(() => {
          // 从视图中修改订单状态
          for (let item of orderListView.value) {
            if (item.orderId === oid) {
              item.status = '待评价'
              break
            }else{
              continue
            }
          }
          message.success('感谢您的购物!')
        })
    },
    onNegativeClick: () => {
      // 取消
      return false
    }
  })
}

// 删除订单
/* function deleteOrder(orderId){
  // 显示确认对话框
  ElMessageBox.confirm(
    '您确定要删除该订单吗?',
    '提示',
    {
      confirmButtonText:'确定',
      cancelButtonText:'取消',
      type:'warning',
    }
  ).then(()=>{
    // 调用接口：传入（订单ID）返回（删除结果）

    // 从视图中删除订单
    rawOrderList.value = rawOrderList.value.filter((item)=>{return item.orderId !== orderId})
    ElMessage({
      type:'success',
      message:'删除成功!',
    })
  }).catch(()=>{
    // 取消删除
  })  
} */
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
.nav-select{
  text-align: center;
  padding: 5px 30px;
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
.TrashBin{
  margin-top: 3px;
}
.TrashBin:hover{
  color: #99CCFF;
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
.GoodName{
  line-height: 100px;
  font-size: 13px;
  color: #808080;
}
.Quantity{
  line-height: 100px;
  font-size: 14px;
  color: #808080;  
}
.Consult{
  line-height: 100px;
  font-size: 13px;
  color: #000000;
}
.Consult:hover{
  color: rgb(255, 0, 51);
}
.Icon{
  color: cornflowerblue;
}
.Price{
  margin: 23px 0px 2px 0px;
  display: inline-block;
  font-size: 18px;
  font-weight: bold;
  color: #FF9900;
}
.SimpleLine{
  margin: 0px 50px;
  border-bottom: 1px solid #E2E2E2;
}
.PayApproach{
  display: inline-block;
  margin-top: 2px;
  font-size: 13px;
  color: #808080;
}
.StatusText{
  line-height: 100px;
  font-size: 13px;
  color: #808080;
}
.Contact{
  display: inline-block;
  margin: 30px 0px 5px 0px;
  font-size: 13px;
  color: #808080;
}
.Contact:hover{
  color: #66CCFF;
}
.Option{
  display: inline-block;
  margin: 0px;
  font-size: 13px;
  color: #808080;
}
.Option:hover{
  color: #66CCFF;
}
</style>