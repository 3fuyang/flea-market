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
  <div v-if="dateArray.length === 0">
    <el-empty description="脑袋空空。"/>
  </div>
  <div v-for="(item) in dateArray" :key=item>
    <div style="text-align: left;margin-bottom: 10px;">
    <span style="display: inline-block;font-size: 18px;font-weight: bold;">{{item}}</span>
    </div>
    <el-row>
    <template v-for="(goodItem) in historyData" :key="goodItem.id">
    <el-card v-if="goodItem.date === item" :key=goodItem.id :body-style="{ padding: '0px' }" style="width: 220px;height: 250px;margin: 0px 5px 10px 5px;" 
    @click="jumpCard(goodItem.id)">
      <el-image class="point" :src="goodItem.image" fit="scale-down" style="max-height: 190px;"/>
        <span style="display: inline-block;font-size: 13px;color: #808080;margin-top: 3px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{goodItem.title}}</span><br/>
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
import { Delete } from "@element-plus/icons-vue"

export default {
  components:{
      Delete
  },

  created(){
    // 调用接口：传入（用户ID） 返回（浏览记录数据:商品ID、图片url、名称、价格、浏览日期）
    // 数据已经能请求到，但时间的格式需进行修正
    this.axios.get(`/api/getTrack/${this.userID}`)
      .then((res) => {
        res.data.forEach((item) => {
          this.historyData.push({
            id: item.good_id,
            date: item.day_time.substr(0, 10),
            price: Number.parseFloat(item.price).toFixed(2),
            title: item.title,
            image: `http://127.0.0.1:8082/public/images/${item.images.split(';')[0]}`
          })
        })
      })
      .then(() => {
        this.historyData.forEach((item) => {
          if(!this.dateArray.includes(item.date)){
            this.dateArray.push(item.date)
          }
        })
        //console.log(this.dateArray)
      })
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
          this.axios.get('/api/clearTrack/'+this.userID); 
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