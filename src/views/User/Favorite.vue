<template>
<div id="name">
  <span style="display: inline-block;color: #000000;margin: 20px 0px 0px 20px;font-size: 24px;font-weight: bold;">我的收藏</span><br/>
  <div style="text-align: right;margin-bottom: 10px;">     
  <el-button v-show="searching === 1" type="text"  round style="margin-right: 800px;"
  @click="cancelSearch()"><el-icon :size="18"><arrow-left/></el-icon>Cancel</el-button>  
  <el-input v-model.trim="keyWord" placeholder="Search in collections." style="width: 250px;margin-right: 240px;" @keyup.enter="searchFavorite()">
    <template #prefix>
      <el-icon :size="18" style="margin-top: 5px;"><search/></el-icon>
    </template>
    <template #suffix>
      <el-button plain type="primary" size="small" round style="margin-top: 4px;" @click="searchFavorite()">搜索</el-button>         
    </template>        
  </el-input>  
  </div> 
  <el-row>
    <el-col :span="2"></el-col>
    <el-col :span="20">
      <el-row>
      <template v-for="(goodItem) in showData" :key="goodItem.id">
      <el-card :body-style="{ padding: '0px' }" style="width: 220px;height: 250px;margin: 0px 5px 10px 5px;" >
        <el-image class="point" :src="goodItem.path" @click="jumpCard(goodItem.id)" fit="scale-down" />
          <span style="display: inline-block;font-size: 13px;color: #808080;margin-top: 3px;">{{goodItem.name}}</span><br/>
          <span style="display: inline-block;font-size: 18px;color: #FF9900;margin-top: 3px;">￥{{goodItem.price}}</span>
          <el-icon class="point" style="font-size: 20px;color: #999999;font-weight: bold;margin-top: 5px;float: right;"
          @click="deleteFavorite(goodItem.id)"><close/></el-icon>
      </el-card> 
      </template>
      <br/>
      </el-row> 
    </el-col>
  </el-row>
</div>
</template>

<script>
import {ElMessage, ElMessageBox} from 'element-plus'
import { ArrowLeft, Search, Close } from "@element-plus/icons-vue";
export default {
  components:{
      ArrowLeft, Search, Close
  },

  created(){
    // 调用接口：传入（用户ID） 返回（收藏夹数据:商品ID、图片url、名称、价格）
    /* this.axios.get('/api/getFavorite/'+this.userID).then((response)=>{
      for(let item of response.data){
        this.axios.get('/api/getBriefInfo/'+item.goods_id).then((son_response)=>{
          console.log(son_response);
          this.favoriteData.push({
            id: item.goods_id,
            name: son_response.data[0].goods_title,
            price: son_response.data[0].price,
          });
          console.log(this.favoriteData);
        })
      }
    }) */    
    this.favoriteData=[
      { id:'0',name:'大学物理学 (附)网络课程&配套习题',price:'15.00',path: ("/src/assets/physics.png")},
      { id:'1',name:'Apple iPad Pro 11英寸平板电脑',price:'3499.00',path: ("/src/assets/ipad.png")},
      { id:'2',name:'派克威雅XL系列 樱花粉特别款礼盒',price:'198.00',path: ("/src/assets/pen.png")},
      { id:'3',name:'Ecovas智能家用空气净化器 机器智能',price:'3399.00',path: ("/src/assets/philips.png")},
      { id:'4',name:'传奇武夷山 大红袍茶叶',price:'149.00',path: ("/src/assets/tea.png")},
    ];
    this.showData = this.favoriteData;
  },
  
  data(){
    return{
      userID: window.sessionStorage.getItem('uid'), // 用户ID
      favoriteData: [],  // 收藏夹数据
      keyWord: '',  // 搜索关键字
      searching: 0,  // 标志是否显示搜索结果，0 为不显示，1 为显示
      showData: [], // 展示数据
    }
  },

  methods:{
    //点击卡片跳转商品详情页
    jumpCard(itemID){
      this.$router.push({
        path:'/details',
        query:{
          gid:itemID,
        }
      })
    },
    // 搜索收藏
    searchFavorite(){
      if(this.keyWord!=''){
        this.searching = 1;
        this.showData=[];
        for(let item of this.favoriteData){
          if(new RegExp(this.keyWord,"img").test(item.name)){
            this.showData.push(item)
          }
        }
      }else{
        ElMessage.error('请输入关键字进行搜索');
      }      
    },
    cancelSearch(){
      this.searching = 0;
      this.showData = this.favoriteData;
    },
    // 取消收藏
    deleteFavorite(gid){
      ElMessageBox.confirm(
        '将从收藏夹中删除这件商品,是否继续操作?',
        '确认',
        {
          confirmButtonText:'继续',
          cancelButtonText:'取消',
          type:'warning',
        }
      ).then(()=>{
        // 调用接口： 传入（用户ID,商品ID） 返回(null)
        /* this.axios.get('/api/cancelFavorite/' + this.userID + '/' + gid); */
        let index = 0;
        for(let item of this.favoriteData){
          if(item.id===gid){
            break;
          }else{
            index++;
          }
        }
        this.favoriteData.splice(index,1);

        index= 0;
        for(let item of this.showData){
          if(item.id===gid){
            break;
          }else{
            index++;
          }
        }
        this.showData.splice(index,1);        
        ElMessage({
          type:'success',
          message:'删除成功!',
        });
      })      
    },
  },
}
</script>

<style scoped>
.point{
  cursor: pointer;
}
</style>