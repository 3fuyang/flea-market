<template>
<div id="name">
  <span style="display: inline-block;color: #000000;margin: 20px 0px 0px 20px;font-size: 24px;font-weight: bold;">浏览记录</span><br/>
  <div style="text-align: right;">
  <el-button type="info" icon="el-icon-delete" size="medium" style="width: 110px;margin-right: 200px;"
  @click="clearHistory()">清空记录</el-button>
  </div>
  <el-row>
  <el-col :span="2"></el-col>
  <el-col :span="20">
  <div v-for="(item) in dateArray" :key=item.date>
    <div style="text-align: left;margin-bottom: 10px;">
    <span style="display: inline-block;font-size: 18px;font-weight: bold;">{{item.date}}</span>
    </div>
    <el-row>
    <template v-for="(goodItem) in historyData" :key="goodItem.id">
    <el-card v-if="goodItem.date===item.date" :key=goodItem.id :body-style="{ padding: '0px' }" style="width: 220px;height: 240px;margin: 0px 5px 10px 5px;" 
    @click="jumpCard(goodItem.id)">
      <el-image class="point" :src="goodItem.path" fit="scale-down" />
        <span style="display: inline-block;font-size: 13px;color: #808080;margin-top: 3px;">{{goodItem.name}}</span><br/>
        <span style="display: inline-block;font-size: 18px;color: #FF9900;margin-top: 3px;">￥{{goodItem.price}}</span>
    </el-card> 
    </template>
    <br/>
    </el-row> 
  </div>
  </el-col>
  </el-row>
</div>
</template>

<script>
import {ElMessage, ElMessageBox} from 'element-plus'
export default {
  components:{
      
  },

  created(){
    // 调用接口：传入（用户ID） 返回（浏览记录数据:商品ID、图片url、名称、价格、浏览日期）
    // 数据已经能请求到，但时间的格式需进行修正
    /* this.axios.get('/api/getTrack/'+this.userID).then((response)=>{
      for(let item of response.data){
        this.axios.get('/api/getBriefInfo/'+item.goods_id).then((son_response)=>{
          console.log(son_response);
          this.historyData.push({
            id: item.goods_id,
            name: son_response.data[0].goods_title,
            price: son_response.data[0].price,
            date: item.day_time,
          });
          console.log(this.historyData);
        })
      }
    }) */
    this.historyData=[
      { id:'0',name:'大学物理学 (附)网络课程&配套习题',price:'15.00',path: require("../../assets/physics.png"),date: '2021年1月1日'},
      { id:'1',name:'Apple iPad Pro 11英寸平板电脑',price:'3499.00',path: require("../../assets/ipad.png"),date: '2021年1月1日'},
      { id:'2',name:'派克威雅XL系列 樱花粉特别款礼盒',price:'198.00',path: require("../../assets/pen.png"),date: '2021年12月31日'},
      { id:'3',name:'Ecovas智能家用空气净化器 机器智能',price:'3399.00',path: require("../../assets/philips.png"),date: '2021年12月31日'},
      { id:'4',name:'传奇武夷山 大红袍茶叶',price:'149.00',path: require("../../assets/tea.png"),date: '2021年12月25日'},
    ];
    for(let item of this.historyData){
      if(this.dateArray===[]){
        this.dateArray.push({date: item.date});
      }else{
        let isExist = 0;
        for(let xitem of this.dateArray){
          if(xitem.date === item.date){
            isExist = 1;
            break;
          }else{
            continue;
          }
        }
        if(isExist===0){
          this.dateArray.push({date: item.date});
        }
      }
    }
  },
  
  data(){
    return{
      userID: window.sessionStorage.getItem('uid'), // 用户ID
      historyData: [],  // 浏览记录数据
      dateArray: [], // 有浏览记录的日期
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
    // 清空浏览记录
    clearHistory(){
      if(this.historyData.length===0){
        ElMessage({type:'info',message:'您没有可清除的浏览记录。'});
      }else{
        ElMessageBox.confirm(
          '将清空您的所有浏览记录,是否继续操作?',
          '确认',
          {
            confirmButtonText:'继续',
            cancelButtonText:'取消',
            type:'warning',
          }
        ).then(()=>{
          // 调用接口：传入（用户ID） 返回（null）
          /* this.axios.get('/api/clearTrack/'+this.userID); */
          this.dateArray=[];
          this.historyData=[];
          ElMessage({
            type:'success',
            message:'清除成功!',
          });
        })
      }
    },
  },
}
</script>

<style scoped>
.point{
  cursor: pointer;
}
</style>