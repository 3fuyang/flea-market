<template>
<div id="name">
  <span style="display: inline-block;color: #000000;margin: 20px 0px 0px 20px;font-size: 24px;font-weight: bold;">浏览记录</span><br/>
  <div style="text-align: right;">
  <el-button type="info"  style="width: 110px;margin-right: 200px;"
  @click="clearHistory()"><el-icon :size="17"><delete/></el-icon>&nbsp;清空记录</el-button>
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
    <el-card v-if="goodItem.date===item.date" :key=goodItem.id :body-style="{ padding: '0px' }" style="width: 220px;height: 250px;margin: 0px 5px 10px 5px;" 
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
import { Delete } from "@element-plus/icons-vue";
export default {
  components:{
      Delete
  },

  created(){
    // 调用接口：传入（用户ID） 返回（浏览记录数据:商品ID、图片url、名称、价格、浏览日期）
    // 数据已经能请求到，但时间的格式需进行修正
    const promises = []
    this.axios.get('/api/getTrack/'+this.userID)
      .then((response)=>{
        for(let item of response.data){
          promises.push(
            this.axios.get('/api/getBriefInfo/'+item.good_id)
              .then((son_response)=>{
                //console.log(son_response);
                this.historyData.push({
                  id: item.good_id,
                  name: son_response.data[0].title,
                  price: Number.parseFloat(son_response.data[0].price).toFixed(2),
                  date: item.day_time.substr(0, 10),
                });
                return true
                //console.log(this.historyData);
              })
          )
        }
    })
    Promise.all(promises).then(() => {
      console.log(this.historyData)
      Array.from(this.historyData).forEach(() => {
        console.log(item)
        if(this.dateArray.findIndex((i) => i.date && i.date === item.date) < 0){
          this.dateArray.push({
            date: item.date
          })
        }
      })
      console.log(this.dateArray)
    })
    /* this.historyData=[
      { id:'0',name:'大学物理学 (附)网络课程&配套习题',price:'15.00',path: ("/src/assets/physics.png"),date: '2021年1月1日'},
      { id:'1',name:'Apple iPad Pro 11英寸平板电脑',price:'3499.00',path: ("/src/assets/ipad.png"),date: '2021年1月1日'},
      { id:'2',name:'派克威雅XL系列 樱花粉特别款礼盒',price:'198.00',path: ("/src/assets/pen.png"),date: '2021年12月31日'},
      { id:'3',name:'Ecovas智能家用空气净化器 机器智能',price:'3399.00',path: ("/src/assets/philips.png"),date: '2021年12月31日'},
      { id:'4',name:'传奇武夷山 大红袍茶叶',price:'149.00',path: ("/src/assets/tea.png"),date: '2021年12月25日'},
    ]; */
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