<template>
  <div class="root-wrapper">
    <p class="confirm-title">确认订单</p>
    <el-scrollbar class="list-wrapper">
      <GoodMediaObject v-for="item in goodsInfo" :good-i-d="item.goodID" :seller-name="item.sellerName"
        :good-title="item.goodTitle" :image="item.image" :price="Number.parseFloat(item.price)" />
    </el-scrollbar>
    <div class="price-box">
      <p class="price-label">
        应付总额：
        <span class="price-total">
          ￥{{ totalPrice.toFixed(2) }}
        </span>
      </p>
      <p class="buyer-info">
        收货人：{{ userName }} ({{ `${telNum.substring(0, 3)} XXXX ${telNum.substring(7, 11)}` }})
      </p>
    </div>
    <div class="btn-box">
      <button class="submit-btn" @click="payBill">
        提交订单
      </button>
    </div>
  </div>
  <Teleport to="main">
    <PayQRCode :show="showQRModal" :price="totalPrice" @close="closeModal">
      <template #header>
        请扫描付款码，进行付款。
      </template>
      <template #body>
        <img style="object-fit: scale-down;width: 60%;" src="/src/assets/payment.jpg" />
      </template>
    </PayQRCode>
  </Teleport>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import GoodMediaObject from '../../components/Confirm/GoodMediaObject.vue'
import PayQRCode from '../../components/Confirm/PayQRCode.vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const message = useMessage()

const userStore = useUserStore()
const { userID } = storeToRefs(userStore)

const router = useRouter()
// 需要结算的商品ID集合
const goodsID = ref((router.currentRoute.value.query.gid as string).split('-'))
// 商品类型
interface Good {
  goodID: string
  sellerID: string
  sellerName: string
  image: string
  goodTitle: string
  price: string
}
// 商品简要信息
const goodsInfo = ref<Good[]>([])
// 总金额
const totalPrice = ref(0)
// 调用接口：传入（ID集合）返回（商品信息列表）
axios.post(`/api/goodsToConfirm`, goodsID.value)
  .then((res: any) => {
    res.data.forEach((info: any) => {
      goodsInfo.value.push({
        goodID: info.good_good_id,
        sellerID: info.good_seller_id,
        sellerName: info.user_nickname,
        image: `http://127.0.0.1:8082/public/images/${info.good_images.split(';')[0]}`,
        goodTitle: info.good_title,
        price: Number.parseFloat(info.good_price).toFixed(2)
      })
      totalPrice.value += Number.parseFloat(info.good_price)
    })
  })

// 昵称
const userName = ref('')
// 手机号
const telNum = ref('')
// 调用接口：传入（用户ID） 返回（用户昵称，绑定手机）
axios.get(`/api/getBuyerInfo/${userID.value}`)
  .then(res => {
    userName.value = res.data.realName
    telNum.value = res.data.telnum
  })

const showQRModal = ref(false)

// 关闭付款窗口，根据参数paid改变订单的相应状态
function closeModal(paid: boolean) {
  showQRModal.value = false
  const order = {
    buyer: userID.value,
    seller: '',
    goodID: '',
    price: 0,
    generatedTime: '',
    stat: paid ? '待确认' : '待付款'
  }
  const promises = []
  for (let item of goodsInfo.value) {
    let date = new Date()
    date.setHours(date.getHours() + 8)
    order.seller = item.sellerID
    order.goodID = item.goodID
    order.price = Number.parseFloat(item.price)
    order.generatedTime = date.toISOString().slice(0, 19).replace('T', ' ')
    // 调用接口：传入（用户ID，商品ID，下单时间） 返回（null）
    promises.push(axios.post(`/api/generateOrder`, order))
  }
  Promise.all(promises)
    .then(() => {
      message.success('提交成功，即将为您跳转到订单页！')
      window.setTimeout(() => router.push('/order'), 500)
    })
    .catch(err => {
      console.log(err)
    })
}

function payBill() {
  // 打开付款模态框
  showQRModal.value = true
}
</script>

<style scoped>
.root-wrapper {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
}

.confirm-title {
  margin: 1em 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: #666;
}

.list-wrapper {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  max-height: 75vh;
  overflow: auto;
  border: 1px solid #99CCFF;
  padding: 1em;
}

.price-box {
  width: calc(35vw + 4.5rem);
  background-color: #F4F4F4;
  box-sizing: border-box;
  border: 1px solid #eee;
  margin-top: 1em;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.price-label {
  font-size: .8rem;
}

.price-total {
  margin: .5em 1em .5em 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: red;
}

.buyer-info {
  margin: 0 1em 1em 0;
  font-size: .8rem;
  color: #aaa;
}

.btn-box {
  width: calc(35vw + 4rem);
  margin: 1em auto;
  display: flex;
  flex-direction: row-reverse;
}

.submit-btn {
  flex-grow: 0;
  font-size: 1.1rem;
  outline: none;
  cursor: pointer;
  box-sizing: border-box;
  border-color: #FF9900;
  background: #FF9900;
  color: #fff;
  text-align: center;
}

.submit-btn:hover {
  border-color: #ff6f00;
  background: #ff6f00;
}
</style>