<template>
<article class="orders-wrapper">
  <section class="order-card" v-for="item in orders">
    <nav class="card-nav">
      <span class="nav-txt">
          订单号：{{item.orderId}}
      </span>
      <span class="nav-txt">
          {{item.time.replace('T', ' ')}}
      </span>
    </nav>
    <section class="card-body">
      <el-image
        class="img"
        :src="item.image"/>
      <section class="title">
        {{item.goodTitle}}
      </section>
      <section class="buyer-info">
        <span 
          class="nav-txt" 
          style="margin-right: .2em;width: 10em;text-overflow: ellipsis;">
          买家：{{item.buyerId}}-{{item.buyerName}}
        </span>
        <el-icon 
          class="chat-icon" 
          :size="16" 
          color="cornflowerblue"
          @click="contactBuyer(item.buyerId)">
          <ChatDotRound/>
        </el-icon>
        <NTag v-if="item.status === '已拒接'" type="error" style="margin: 0 3em;">
          {{item.status}}
        </Ntag>
        <NTag v-else-if="item.status === '待付款'" type="info" style="margin: 0 3em;">
          {{item.status}}
        </Ntag>
        <NTag v-else-if="item.status === '已完成'" type="success" style="margin: 0 3em;">
          {{item.status}}
        </Ntag>        
        <NTag v-else style="margin: 0 3em;">
          {{item.status}}
        </Ntag>                               
        <NButton 
          type="error" 
          secondary 
          round
          v-if="rejectable(item) && item.status !== '已完成'"
          @click="rejectOrder(item.orderId)"
          :disabled="item.status !== '待付款'">
          拒接订单
        </NButton>
        <NButton
          v-else-if="item.status === '已完成'"
          type="success"
          round
          @click="checkEvaluation(item.orderId)">
          查看评价
        </NButton>
        <NPopover v-else>
          <template #trigger>
            <NButton
              round 
              type="info" 
              secondary 
              class="disable-btn">
              不可拒接
            </NButton>
          </template>
          距离订单生成未满三天，不可拒接
        </NPopover>
      </section>
    </section>
  </section>
  <NPagination
    v-model:page="page" 
    :page-count="10"
    class="pagination">
  </NPagination>
</article>
</template>

<script setup>
import { onBeforeMount, ref, h } from 'vue'
import { ChatDotRound } from '@element-plus/icons-vue'
import { NTag, NButton, NPopover, NPagination, useDialog, NDescriptions, NDescriptionsItem, NRate } from 'naive-ui'
const orders = ref()

// 当前页码，与后端合并时使用onUpdate来获取对应页的数据
const page = ref(1)

// 计算订单能否被拒绝，只有生成订单三天以后才能运行
const rejectable = (o) => Date.now() - Date.parse(o.time) >= 3*24*60*60*1000

function rejectOrder(oid){
  // 调用接口：传入（订单iD） 返回（null）
  let index = orders.value.findIndex(item => item.orderId === oid)
  orders.value[index].status = '已拒接'
}

function contactBuyer(id) {
  // 调用接口：传入（用户ID， 买家ID） 返回（null）
}

const dialog = useDialog()
function checkEvaluation(oid) {
  let index = orders.value.findIndex(item => item.orderId === oid)
  dialog.create({
    title: '买家评价',
    positiveText: 'Wow!',
    content: () => h(
      NDescriptions,
      {
        labelPlacement: 'left',
        size: 'small',
        columns: 1
      },
      {
        default: () => [
          h(
            NDescriptionsItem,
            {
              label: '评分'
            },
            {
              default: () => h(
                NRate,
                {
                  readonly: true,
                  value: orders.value[index].commentStars,
                  allowHalf: true
                }
              )
            }
          ),        
          h(
            NDescriptionsItem,
            {
              label: '评价'
            },
            {
              default: () => orders.value[index].comment
            }
          )
        ]
      }
    )
  })
}
onBeforeMount(() => {
  // 调用接口：传入（用户ID） 返回（卖出产品）
  orders.value = [
    {
      orderId: '235579152576',
      goodId: 0,
      goodTitle: "混合商品",
      image: "/src/assets/physics.png",
      time: "2022-04-15T20:40:00",
      status: '待付款',
      commentStars: 1,
      buyerId: '1951001',
      buyerName: '甲',
      price: 998,
      comment: "被骗了！无良商家还我血汗钱！！！！",
      reportState: 1,
      reportReason: "无良商家，贩卖假冒伪劣产品！！",
      reportReply: "很抱歉给您造成了不好的购物体验，该商家当前已被封号处理，付款金额也将在七个工作日内返回给您的账号",
    },
    {
      orderId: '235579102596',
      goodId: 0,
      goodTitle: "混合商品",
      image: "/src/assets/physics.png",
      time: "2022-01-02T20:40:00",
      status: '待付款',
      commentStars: 1,
      buyerId: '1951001',
      buyerName: '甲',      
      price: 998,
      comment: "被骗了！无良商家还我血汗钱！！！！",
      reportState: 1,
      reportReason: "无良商家，贩卖假冒伪劣产品！！",
      reportReply: "很抱歉给您造成了不好的购物体验，该商家当前已被封号处理，付款金额也将在七个工作日内返回给您的账号",
    },
    {
      orderId: '235573152596',
      goodId: 0,
      goodTitle: "混合商品",
      image: "/src/assets/physics.png",
      time: "2022-01-02T20:40:00",
      status: '已完成',
      commentStars: 1,
      buyerId: '1951001',
      buyerName: '甲',      
      price: 998,
      comment: "被骗了！无良商家还我血汗钱！！！！",
      reportState: 1,
      reportReason: "无良商家，贩卖假冒伪劣产品！！",
      reportReply: "很抱歉给您造成了不好的购物体验，该商家当前已被封号处理，付款金额也将在七个工作日内返回给您的账号",
    }        
  ]
})
</script>

<style scoped>
.orders-wrapper{
  display: flex;
  flex-direction: column;
  width: 100%;
}
.order-card{
  width: 100%;
  display: flex;
  margin: .8rem 0;
  flex-direction: column;
  background-color: white;
  overflow: auto;
}
.order-card:nth-child(n - 1){
  margin-top: 0;
}
.card-nav{
  background-color: #E5E5E5;
  display: flex;
  padding: .2em;
}
.nav-txt{
  font-size: .8rem;
  color: #666;
  line-height: 1.2rem;
  margin: 0 2em;
}
.card-body{
  display: flex;
  padding: .4em 1em;
}
.img{
  width: 5em;
  object-fit: scale-down;
  box-sizing: border-box;
  border: 2px solid #eee;  
}
.title{
  align-self: center;
  margin: 0 1em;
  font-size: .8rem;
  color: #888;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  flex: 0 0 8em;
  text-align: left;
}
.buyer-info{
  display: flex;
  justify-content: center;
  align-items: center;
}
.chat-icon{
  cursor: pointer;
}
.disable-btn{
  cursor: not-allowed;
}
.pagination{
  align-self: center;
}
</style>