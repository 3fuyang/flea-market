<template>
<div class="good-wrapper">
  <p class="seller-name">
    商家：{{briefInfo.sellerName}}
  </p>
  <div class="img-txt-wrapper">
    <el-image 
      class="img"
      :src="briefInfo.image">
    </el-image>
    <div class="title-num-wrapper">
      <p class="good-title">
        {{briefInfo.goodTitle}}
      </p>
      <p class="num">
        <el-icon :size="14" color="#6679b3" class="icon">
          <Discount/>
        </el-icon>
        ×1&nbsp; &nbsp;&nbsp; &nbsp;有货
      </p>
    </div>
    <p class="good-price">
      ￥{{briefInfo.price}}
    </p>
  </div>
</div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { Discount } from '@element-plus/icons-vue'
defineProps({
  goodID: String
})

// 商品简要信息
const briefInfo = ref(null)
onBeforeMount(() => {
  // 调用接口：传入（商品ID） 返回（商品简要信息：卖家昵称，商品标题，图片，价格）
  briefInfo.value = {
    sellerName: '卖家名称',
    image: '/src/assets/tea.png',
    goodTitle: '商品标题，最多两行，商品标题，最多两行,商品标题，最多两行，商品标题，最多两行，商品标题，最多两行超过以...隐藏',
    price: 10.00
  }
})
</script>

<style scoped>
.good-wrapper{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1em;
  background-color: #F3FBFE;
  border: 1px solid #eee;
  border-radius: .4em;
  margin-bottom: 1rem;
  width: 35vw;
}
.good-wrapper:hover{
  box-shadow: 2px 2px 5px #ddd;
}
.seller-name{
  margin: 0;
  margin-bottom: 1em;
  font-size: .8rem;
  color: #666;
  font-weight: 600;
}
.img-txt-wrapper{
  display: flex;
  justify-content: flex-start;
  width: 100%;
}
.img{
  object-fit: scale-down;
  height: 6em;
  border: 1px solid #eee;
  flex: 0 0 auto;
}
.title-num-wrapper{
  display: flex;
  flex-direction: column;
  flex: 2;
  justify-content: space-around;
}
.good-title{
  margin: 0 1em;
  font-size: .9rem;
  color: #666;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-height: 1.2rem;
  height: 2.4rem;
  text-align: left;
}
.num{
  margin-left: 1em;
  font-size: .8rem;
  align-self: flex-start;
  line-height: 1rem;
}
.icon{
  line-height: 1rem;
}
.good-price{
  flex: 1;
  color: #e4393c;
  font-size: .9rem;
  margin: 0;
}
</style>