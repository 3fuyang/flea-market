<template>
  <article class="orders-wrapper">
    <n-empty v-if="ordersView.length === 0" size="huge">
      <template #default>
        什么，居然一件东西都没卖出去？
      </template>
      <template #extra>
        <n-gradient-text gradient="linear-gradient(45deg, #ffc107, deeppink, #9c27b0)">
          丢人，还不快去交易！
        </n-gradient-text>
      </template>
      <template #icon>
        <Library />
      </template>
    </n-empty>
    <section class="order-card" v-for="item in ordersView">
      <nav class="card-nav">
        <span class="nav-txt">
          订单号：{{ item.orderId }}
        </span>
        <span class="nav-txt">
          {{ item.time.replace('T', ' ') }}
        </span>
      </nav>
      <section class="card-body">
        <el-image class="img" :src="item.image" />
        <section class="title">
          {{ item.goodTitle }}
        </section>
        <section class="buyer-info">
          <span class="nav-txt" style="margin-right: .2em;width: 10em;text-overflow: ellipsis;">
            买家：{{ item.buyerId }}-{{ item.buyerName }}
          </span>
          <el-icon class="chat-icon" :size="16" color="cornflowerblue" @click="contactBuyer(item.buyerId)">
            <ChatDotRound />
          </el-icon>
          <NTag v-if="item.status === '已取消'" type="error" style="margin: 0 3em;">
            {{ item.status }}
          </Ntag>
          <NTag v-else-if="item.status === '待付款'" type="info" style="margin: 0 3em;">
            {{ item.status }}
          </Ntag>
          <NTag v-else-if="item.status === '已完成'" type="success" style="margin: 0 3em;">
            {{ item.status }}
          </Ntag>
          <NTag v-else style="margin: 0 3em;">
            {{ item.status }}
          </Ntag>
          <NButton type="error" secondary round v-if="rejectable(item) && item.status !== '已完成'"
            @click="rejectOrder(item.orderId)" :disabled="item.status !== '待付款'">
            拒接订单
          </NButton>
          <NButton v-else-if="item.status === '已完成'" type="success" round @click="checkEvaluation(item.orderId)">
            查看评价
          </NButton>
          <NPopover v-else>
            <template #trigger>
              <NButton round type="info" secondary class="disable-btn">
                不可拒接
              </NButton>
            </template>
            距离订单生成未满三天，不可拒接
          </NPopover>
        </section>
      </section>
    </section>
    <NPagination v-if="ordersView.length !== 0" v-model:page="page" :item-count="orders.length" :page-size="4"
      class="pagination">
    </NPagination>
  </article>
</template>

<script setup lang="ts">
import { ref, h, computed } from 'vue'
import { ChatDotRound } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { NTag, NButton, NPopover, NPagination, useDialog, NDescriptions, NDescriptionsItem, NRate, NEmpty, NGradientText } from 'naive-ui'
import { Library } from '@vicons/ionicons5'
import { serverHost } from '@/data/host'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

// store
const userStore = useUserStore()
const { userID } = storeToRefs(userStore)

const router = useRouter()

// 订单类型
interface Order {
  buyerId: string
  buyerName: string
  orderId: string
  goodId: string
  goodTitle: string
  image: string
  time: string
  status: string
  commentStars: string
  comment: string
  reported: string
}
// 订单数据
const orders = ref<Order[]>([])

const ordersView = computed(() => {
  let begin = (page.value - 1) * 4
  let end = begin + 4 > orders.value.length ? orders.value.length : begin + 4
  return orders.value.slice(begin, end)
})

// 当前页码，与后端合并时使用onUpdate来获取对应页的数据
const page = ref(1)

// 计算订单能否被拒绝，只有生成订单三天以后才能运行
const rejectable = (o: Order) => Date.now() - Date.parse(o.time) >= 3 * 24 * 60 * 60 * 1000

function rejectOrder(oid: string) {
  // 调用接口：传入（订单ID） 返回（null）
  axios.post(`/api/rejectOrder`, { orderID: oid })
    .then(() => {
      let index = orders.value.findIndex(item => item.orderId === oid)
      orders.value[index].status = '已取消'
    })
}

function contactBuyer(id: string) {
  // 传入（买家ID） 返回（买家昵称，头像）
  axios.get(`/api/getBuyerAvatarAndName/${id}`)
    .then(res => {
      const { nickname, avatar } = res.data
      const routeUrl = router.resolve({
        path: '/chat',
        query: {
          oponentID: id,
          oponentName: nickname,
          avatar: `http://${serverHost}:8082/public/avatars/${avatar}`
        }
      })
      // 在新页面打开聊天窗口
      router.push(routeUrl)
    })
}

const dialog = useDialog()
function checkEvaluation(oid: string) {
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
                  value: Number.parseFloat(orders.value[index].commentStars),
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

// 调用接口：传入（用户ID） 返回（订单列表：订单ID，订单时间，商品名称，金额，卖家ID，订单状态，订单评价）
axios.get(`/api/getSoldOrders/${userID.value}`)
  .then(res => {
    res.data.forEach((item: any) => {
      orders.value.push({
        buyerId: item.order_buyer,
        buyerName: item.nickName,
        orderId: new Array(12).join('0') + item.order_order_id,
        goodId: item.order_good_id,
        goodTitle: item.good_title,
        image: `http://${serverHost}:8082/public/images/${item.good_images.split(';')[0]}`,
        time: item.order_generated_time.slice(0, 19).replace('T', ' '),
        status: item.order_stat,
        commentStars: item.order_rate,
        comment: item.order_review,
        reported: item.order_reported
      })
    })
  })  
</script>

<style scoped>
.orders-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.order-card {
  width: 100%;
  display: flex;
  margin: .8rem 0;
  flex-direction: column;
  background-color: white;
  overflow: auto;
}

.order-card:nth-child(n - 1) {
  margin-top: 0;
}

.card-nav {
  background-color: #E5E5E5;
  display: flex;
  padding: .2em;
}

.nav-txt {
  font-size: .8rem;
  color: #666;
  line-height: 1.2rem;
  margin: 0 2em;
}

.card-body {
  display: flex;
  padding: .4em 1em;
}

.img {
  width: 5em;
  object-fit: scale-down;
  box-sizing: border-box;
  border: 2px solid #eee;
}

.title {
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

.buyer-info {
  display: flex;
  justify-content: center;
  align-items: center;
}

.chat-icon {
  cursor: pointer;
}

.disable-btn {
  cursor: not-allowed;
}

.pagination {
  align-self: center;
}
</style>