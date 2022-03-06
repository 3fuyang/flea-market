<template>
<div class="root-wrapper">
  <div class="list-wrapper">
    <div 
      v-for="good of goodsListView"
      :key="good.id"
      class="good-card">
       <el-row>
         <el-col :span="6">
          <el-image 
            class="image point" 
            :src="good.image"
            @click="jumpToDetail(good.id)"></el-image>
         </el-col>
         <el-col :span="12">
          <span class="name">&nbsp;&nbsp;{{good.name}}</span><br/>
          <el-row>
            <el-col :span="12">
              <span class="key">浏览数</span><br/>
              <el-row>
                <el-col :span="12">
                  <Avatar class="icon"/>
                </el-col>
                <el-col :span="12">
                  <span class="num">{{good.browsed}}</span>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12">
              <span class="key">收藏数</span><br/>            
              <el-row>
                <el-col :span="12">
                  <StarFilled class="icon star"/>
                </el-col>
                <el-col :span="12">
                  <span class="num">{{good.likes}}</span>
                </el-col>
              </el-row>            
            </el-col>
          </el-row>
         </el-col>
         <el-col :span="6">
          <span class="price">￥{{good.price}}</span><br/>
          <div class="options-wrapper">
            <el-button plain color="#0099CC" class="button"
              @click="checkDetailCard">查看详情</el-button><br/>
            <el-button plain color="#626aef" class="button"
              @click="pullOffGood(good.id)">下架商品</el-button>
          </div>
         </el-col>
       </el-row>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { StarFilled, Avatar } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
const props = defineProps({
  userId: String,
  goodsStatus: String,
})
const goodsListView = ref([]);
const router = useRouter();

onMounted(()=>{
  // 根据 props 中的商品状态，调用不同的接口
  if(props.goodsStatus === 'onShelf'){
    // 调用接口：传入（用户ID） 返回（上架中商品列表）
    goodsListView.value.push.apply(goodsListView.value, [{ 
      id:'0',
      name:'大学物理学 (附)网络课程&配套习题', 
      status: '上架中',
      price:'15.00',
      browsed: 798,
      likes: 909,
      image: ("/src/assets/physics.png")},{ 
      id:'1',
      name:'Apple iPad Pro 11英寸平板电脑',
      status: '上架中',    
      price:'3499.00',
      browsed: 1006,
      likes: 66,
      image: ("/src/assets/ipad.png")},{ 
      id:'3',
      name:'Ecovas智能家用空气净化器 机器智能',
      status: '上架中',    
      price:'3399.00',
      browsed: 377,
      likes: 100,
      image: ("/src/assets/philips.png")}
    ]);    
  }else if(props.goodsStatus === 'soldOut'){
    // 调用接口：传入（用户ID） 返回（已售出商品列表）
    goodsListView.value.push.apply(goodsListView.value, [{ 
      id:'2',
      name:'派克威雅XL系列 樱花粉特别款礼盒',
      status: '已售出',    
      price:'198.00',
      browsed: 2667,
      likes: 420,
      image: ("/src/assets/pen.png")},{
      id:'4',
      name:'传奇武夷山 大红袍茶叶',
      status: '已售出',    
      price:'149.00',
      browsed: 177,
      likes: 66,
      image: ("/src/assets/tea.png")}
    ]);    
  }
})

// 点击图片缩略图跳转商品详情页面
function jumpToDetail(goodId){
  router.push({
    path:'/details',
    query:{
      gid: goodId,
    }
  })
}

// 下架商品
function pullOffGood(goodId){
  // 显示确认对话框
  ElMessageBox.confirm(
    '您确定要下架该商品吗?',
    '系统不会保存该商品的信息。',
    '提示',
    {
      confirmButtonText:'确定',
      cancelButtonText:'取消',
      type:'warning',
    }
  ).then(()=>{
    // 调用接口：传入（商品ID）返回（下架结果）

    // 从视图中删除商品
    goodsListView.value = goodsListView.value.filter((item)=>{return item.id !== goodId});
    ElMessage({
      type:'success',
      message:'下架成功!',
    });
  }).catch(()=>{
    // 取消下架
  })
}
</script>

<style scoped>
.point{
  cursor: pointer;
}
.list-wrapper{
  margin: 20px 15px;
}
.good-card{
  height: 144px;
  border-radius: 5px;
  border: 1px solid #eee;
  background-color: #fafafa;
  margin: 20px 10px;
  box-shadow: 1px 1px 1px rgba(27, 27, 27, 0.22);
}
.good-card:hover{
  box-shadow: 1px 1px 2px rgba(97, 97, 97, 0.575);  
}
.image{
  float: left;
  margin: 10px 0px 10px 15px;
  height: 120px;
  width: auto;
  border: 2px solid #E0E0E0;
  alt: 'Goods Thumbnail';
}
.image:hover{
  border: 2px solid #CCCCCC;  
}
.name{
  font-size: 14px;
  display: inline-block;
  color: #999999;
  margin: 20px 0px 15px 0px;
  overflow-x: scroll;
}
.key{
  display: inline-block;
  font-size: 16px;
  color: #777777;
  font-weight: 600;
  margin-bottom: 10px;
}
.icon{
  margin-top: 3px;
  float: right;
  width: 40px;
  height: 40px; 
  color: #999999;
}
.num{
  line-height: 52px;
  float: left;
  margin-left: 5px;
  font-size: 25px;
  font-weight: bold;
  color: #999999;
}
.star{
  color: orange;
}
.price{
  margin-top: 15px;
  display: inline-block;
  font-size: 20px;
  font-weight: bold;
  color: #FF9900;
}
.options-wrapper{
  height: 100px;
}
.button{
  margin: 10px 0px;
}
</style>