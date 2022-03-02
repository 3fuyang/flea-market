<template>
<div class="RootDiv">
  <div class="TableNav">
    <el-row>
<!--       <el-col :span="24/columns.length" v-for="(column,index) of columns" :key="index">
        <span class="NavFont">{{column}}</span>
      </el-col> -->   
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
              v-for="item in categories"
              :key="item.index"
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
  <div class="Card" v-for="order of orderListView" :key="order.orderId">
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
          <el-icon :size="20" class="TrashBin" @click="deleteOrder(order.orderId)"><Delete/></el-icon>
          </span>
        </el-col>
      </el-row>
    </div>
    <div class="CardBody">
      <el-row>
        <el-col :span="3">
          <el-image class="Image" :src="order.image"></el-image>
        </el-col>
        <el-col :span="4">
          <span class="GoodName">{{order.goodName}}</span>
        </el-col>
        <el-col :span="2">
          <span class="Quantity">×1</span>
        </el-col>
        <el-col :span="3">
          <span class="Consult point" @click="$emit('show-report-modal', order.orderId)">
            <el-icon :size="16" class="Icon"><Service/></el-icon>
            申请售后
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
            <span class="Contact point" @click="contactSeller">
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
            @click="toPayPage(order.orderId)">
              <el-icon :size="13" class="Icon"><Wallet/></el-icon>
              去付款
            </span>  
            <span v-else-if="order.status === '待确定'" class="Option point"
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

<script setup>
// 在<script setup>中，this.$router 不能使用
// 需要引入 useRouter()，生成 router 实例
import { useRouter } from 'vue-router';
import { defineProps, defineEmits, ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from "element-plus";
import { Delete, Service, ChatDotRound, Edit, Wallet, CircleCheck } from '@element-plus/icons-vue';

const props = defineProps({
  orderList: Array, // 订单原始数据
})

const categories = ['全部订单', '待付款', '待确定', '待评价', '已完成']; // 订单状态
const category = ref('全部订单'); // 当前订单分类
const columns = ['','订单详情','', '金额', '状态', '操作']; // 表头
const rawOrderList = ref(props.orderList);
const orderListView = computed(()=>{
  if(category.value === '全部订单'){
    return rawOrderList.value;
  }else{
    return rawOrderList.value.filter((item)=>{
      return item.status === category.value;
    })
  }
}); // 订单视图
const router = useRouter();

defineEmits({
  'show-report-modal': null,  // 举报窗口展示
  'show-evaluate-modal': null,  // 评价窗口展示
});

// 删除订单
function deleteOrder(orderId){
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
    rawOrderList.value = rawOrderList.value.filter((item)=>{return item.orderId !== orderId});
    ElMessage({
      type:'success',
      message:'删除成功!',
    });
  }).catch(()=>{
    // 取消删除
  })  
}

// 联系买家
function contactSeller(){
  // 调用接口 将买家上升到用户消息列表的首位：传入（用户ID，买家ID）返回（无）
 
  // 在新窗口打开聊天页面。
  let routeUrl = router.resolve({
    path:'/chat'
  });
  window.open(routeUrl .href, '_blank');
}

// 进入付款页面
function toPayPage(oid){
  router.push({
    path:'/pay',
    params:{orderId: oid}
  })
}

// 确认收货
function confirmReceipt(oid){
  ElMessageBox.confirm(
    '请确保已收到并检验过货物，是否确定完成订单?',
    '提示',
    {
      confirmButtonText:'确定',
      cancelButtonText:'取消',
      type:'warning',
    }
  ).then(()=>{
    // 调用接口：传入（订单ID）返回（确定结果）

    // 从视图中修改订单状态
    for(let item of orderListView.value){
      if (item.orderId === oid){
        item.status = '已完成';
        break;
      }else{
        continue;
      }
    }
    ElMessage({
      type:'success',
      message:'感谢您的购物!',
    });
  }).catch(()=>{
    // 取消删除
  })  
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