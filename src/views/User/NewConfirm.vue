<template>
<div class="root-wrapper">
  <p class="confirm-title">确认订单</p>
  <el-scrollbar class="list-wrapper">
    <GoodMediaObject 
      v-for="item in goodsID" 
      :good-i-d="item"/>
  </el-scrollbar>
  <div class="price-box">
    <p class="price-label">
      应付总额：
      <span class="price-total">
        ￥{{totalPrice}}
      </span>
    </p>
    <p class="buyer-info">
      收货人：{{userName}} {{telNum}}
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
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import GoodMediaObject from '../../components/Confirm/GoodMediaObject.vue'

// 需要结算的商品ID集合
const goodsID = ref(null)
// 总金额
const totalPrice = ref(0)
// 昵称
const userName = ref('')
// 手机号
const telNum = ref('')

const router = useRouter()
onBeforeMount(() => {
  // 从query中提取要购买的商品ID
  let query = router.currentRoute.value.query.gid
  goodsID.value= query.split('-')
  // 调用接口：传入（商品ID） 返回（总金额）
  totalPrice.value = 1000.55
  // 调用接口：传入（用户ID） 返回（用户昵称，绑定手机）
  userName.value = '买家昵称'
  telNum.value = '123 XXXX 5678'
})

function payBill() {
  // 调用支付宝API，显示付款码

  for(let gid of goodsID.value){
    // 调用接口：传入（用户ID，商品ID，下单时间） 返回（null）
    gid
  }
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