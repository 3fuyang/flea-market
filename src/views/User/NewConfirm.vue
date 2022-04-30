<template>
<div class="root-wrapper">
  <p class="confirm-title">确认订单</p>
  <el-scrollbar class="list-wrapper">
    <GoodMediaObject 
      v-for="item in goodsInfo" 
      :good-i-d="item.goodID"
      :seller-name="item.sellerName"
      :good-title="item.goodTitle"
      :image="item.image"
      :price="item.price"/>
  </el-scrollbar>
  <div class="price-box">
    <p class="price-label">
      应付总额：
      <span class="price-total">
        ￥{{totalPrice.toFixed(2)}}
      </span>
    </p>
    <p class="buyer-info">
      收货人：{{userName}} ({{`${telNum.substring(0, 3)} XXXX ${telNum.substring(7, 11)}`}})
    </p>
  </div>
  <div class="btn-box">
    <button 
      class="submit-btn"
      @click="payBill">
      提交订单
    </button>
  </div>
</div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import GoodMediaObject from '../../components/Confirm/GoodMediaObject.vue'

// 用户ID
const userID = window.sessionStorage.getItem('uid')

const router = useRouter()
// 需要结算的商品ID集合
const goodsID = ref(router.currentRoute.value.query.gid.split('-'))
// 商品简要信息
const goodsInfo = ref([])
// 总金额
const totalPrice = ref(0)
// 调用接口：传入（ID集合）返回（商品信息列表）
axios.post(`/api/goodsToConfirm`, goodsID.value)
  .then(res => {
    res.data.forEach(info => {
      goodsInfo.value.push({
        goodID: info.good_id,
        sellerName: info.nickname,
        image: `http://127.0.0.1:8082/public/images/${info.images.split(';')[0]}`,
        goodTitle: info.title,
        price: Number.parseFloat(info.price).toFixed(2)
      })
      totalPrice.value += info.price
    })
  })

// 昵称
const userName = ref('')
// 手机号
const telNum = ref('')
// 调用接口：传入（用户ID） 返回（用户昵称，绑定手机）
axios.get(`/api/getBuyerInfo/${userID}`)
  .then(res => {
    userName.value = res.data[0].real_name
    telNum.value = res.data[0].telnum
  })

function payBill() {
  // 调用支付宝API，显示付款码

  for(let gid of goodsID.value){
    // 调用接口：传入（用户ID，商品ID，下单时间） 返回（null）
    gid
  }
  ElMessage.success('提交成功，即将为您跳转到订单页！')
  window.setTimeout(() => router.push('/order'), 500)
}
</script>

<style scoped>
.root-wrapper{
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
}
.confirm-title{
  margin: 1em 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: #666;
}
.list-wrapper{
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  max-height: 75vh;  
  overflow: auto;
  border: 1px solid #99CCFF;
  padding: 1em;
}
.price-box{
  width: calc(35vw + 4.5rem);  
  background-color: #F4F4F4;
  box-sizing: border-box;
  border: 1px solid #eee;
  margin-top: 1em;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.price-label{
  font-size: .8rem;
}
.price-total{
  margin: .5em 1em .5em 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: red;
}
.buyer-info{
  margin: 0 1em 1em 0;
  font-size: .8rem;
  color: #aaa;
}
.btn-box{
  width: calc(35vw + 4rem);
  margin: 1em auto;
  display: flex;
  flex-direction: row-reverse;
}
.submit-btn{
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
.submit-btn:hover{
	border-color: #ff6f00;
	background: #ff6f00;
}
</style>