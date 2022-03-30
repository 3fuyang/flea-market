<template>
<div id="name">
  <span style="display: inline-block;color: #000000;margin: 20px 0px 10px 20px;font-size: 24px;font-weight: bold;">购物车</span><br/>
  <el-row>
  <el-col :span="2"></el-col>
  <el-col :span="20">
  <el-table
    ref="multipleTable"
    :data="tableData"
    stripe
    :height="'75vh'"
    style="width: 100%;margin-bottom: 2px;"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="50" />
    <el-table-column label="商品信息" width="500">
      <template #default="scope">
          <el-row :gutter="10">
            <el-col :span="5">
              <el-image class="point" :src="scope.row.path" style="border: 1px solid #E3E3E3;" fit="scale-down" @click="jumpCard(scope.row.id)" />
            </el-col>
            <el-col :span="13">
              <div style="text-align: center">
              <span style="display: inline-block;font-size: 13px;color: #808080;margin-top: 25px;">{{scope.row.name}}</span>
              </div>
            </el-col>
          </el-row>
      </template>
    </el-table-column>
    <el-table-column label="金额" width="200" align="center">
      <template #default="scope">
        <span style="display: inline-block;font-size: 18px;font-weight: bold;color: #FF9900;margin-top: 3px;">￥{{scope.row.price}}</span>
      </template>      
    </el-table-column>
    <el-table-column label="操作" show-overflow-tooltip align="center">
      <template #default="scope">
        <el-button class="el-icon-delete" type="text"  @click="removeGoods(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div style="background: #fafafa;width: 1265px;height: 50px;border: 1px solid #ffffff;margin-bottom: 5px;">
    <el-row>
      <el-col :span="3">
        <el-button type="warning" size="small" plain style="margin-top: 10px;" @click="removeSelectedGoods()">删除选中商品</el-button>
      </el-col>
      <el-col :span="10">
      </el-col>
      <el-col :span="8">
        <span style="display: inline-block;font-size: 14px;color: #808080;margin-top: 15px;">已选商品&nbsp;&nbsp;</span>
        <span style="display: inline-block;font-size: 20px;color: #FF9900;margin-top: 13px;font-weight: bold;">{{selectedNum}}&nbsp;&nbsp;</span>
        <span style="display: inline-block;font-size: 14px;color: #808080;margin-top: 15px;">件&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span style="display: inline-block;font-size: 14px;color: #808080;margin-top: 15px;">合计 : </span>
        <span style="display: inline-block;font-size: 24px;color: #FF9900;margin-top: 13px;font-weight: bold;">&nbsp;&nbsp;{{cost}}&nbsp;&nbsp;</span>
        <span style="display: inline-block;font-size: 14px;color: #808080;margin-top: 15px;">元</span>
      </el-col>
      <el-col :span="3">
        <div class="point" style="background: #FF9900;width: 100%;height: 52px;" @click="jumpToConfirm()">
          <span style="display: inline-block;font-size: 24px;color: #ffffff;margin-top: 10px;">结&nbsp;&nbsp;&nbsp;算</span>
        </div>
      </el-col>
    </el-row>
  </div>  
  </el-col>
  </el-row>
</div>
</template>

<script>
import {ElMessageBox,ElMessage} from "element-plus"

export default {
    components:{
        
    },

    created(){
      // 调用接口：传入（用户ID） 返回（购物车数据：商品ID,图片url,名称,价格）
      /* this.axios.get('/api/getCart/'+this.userID).then((response)=>{
        for(let item of response.data){
          this.axios.get('/api/getBriefInfo/'+item.goods_id).then((son_response)=>{
            console.log(son_response);
            this.tableData.push({
              id: item.goods_id,
              name: son_response.data[0].goods_title,
              price: son_response.data[0].price,
            });
            console.log(this.tableData);
          })
        }
      }) */      
      this.tableData=[
        { id:'0',name:'大学物理学 (附)网络课程&配套习题',price:'15.00',path: ("/src/assets/physics.png")},
        { id:'1',name:'Apple iPad Pro 11英寸平板电脑',price:'3499.00',path: ("/src/assets/ipad.png")},
        { id:'2',name:'派克威雅XL系列 樱花粉特别款礼盒',price:'198.00',path: ("/src/assets/pen.png")},
        { id:'3',name:'Ecovas智能家用空气净化器 机器智能',price:'3399.00',path: ("/src/assets/philips.png")},
        { id:'4',name:'传奇武夷山 大红袍茶叶',price:'149.00',path: ("/src/assets/tea.png")},
        { id:'0',name:'大学物理学 (附)网络课程&配套习题',price:'15.00',path: ("/src/assets/physics.png")},
        { id:'1',name:'Apple iPad Pro 11英寸平板电脑',price:'3499.00',path: ("/src/assets/ipad.png")},
        { id:'2',name:'派克威雅XL系列 樱花粉特别款礼盒',price:'198.00',path: ("/src/assets/pen.png")},
        { id:'3',name:'Ecovas智能家用空气净化器 机器智能',price:'3399.00',path: ("/src/assets/philips.png")},
        { id:'4',name:'传奇武夷山 大红袍茶叶',price:'149.00',path: ("/src/assets/tea.png")},
        { id:'0',name:'大学物理学 (附)网络课程&配套习题',price:'15.00',path: ("/src/assets/physics.png")},
        { id:'1',name:'Apple iPad Pro 11英寸平板电脑',price:'3499.00',path: ("/src/assets/ipad.png")},
        { id:'2',name:'派克威雅XL系列 樱花粉特别款礼盒',price:'198.00',path: ("/src/assets/pen.png")},
        { id:'3',name:'Ecovas智能家用空气净化器 机器智能',price:'3399.00',path: ("/src/assets/philips.png")},
        { id:'4',name:'传奇武夷山 大红袍茶叶',price:'149.00',path: ("/src/assets/tea.png")},
        { id:'0',name:'大学物理学 (附)网络课程&配套习题',price:'15.00',path: ("/src/assets/physics.png")},
        { id:'1',name:'Apple iPad Pro 11英寸平板电脑',price:'3499.00',path: ("/src/assets/ipad.png")},
        { id:'2',name:'派克威雅XL系列 樱花粉特别款礼盒',price:'198.00',path: ("/src/assets/pen.png")},
        { id:'3',name:'Ecovas智能家用空气净化器 机器智能',price:'3399.00',path: ("/src/assets/philips.png")},
        { id:'4',name:'传奇武夷山 大红袍茶叶',price:'149.00',path: ("/src/assets/tea.png")},                        
      ];
    },

    data(){
        return{
          userID: window.sessionStorage.getItem('uid'), // 用户ID
          tableData: [],  // 购物车数据
          selectedData: [], //选中商品列表
          selectedNum: 0,  // 选中商品数量
          cost: 0,  // 选中商品总金额
        }
    },
    methods:{
      // 点击图片跳转商品详情页
      jumpCard(itemID){
        this.$router.push({
          path:'/details',
          query:{
            gid:itemID,
          }
        })
      },
      // 当选中状态变化时，计算选中商品数与总金额
      handleSelectionChange(selection){
        // 先清零
        this.selectedNum = 0;
        this.cost = 0;
        if(selection){
          this.selectedData = selection;
          this.selectedNum = selection.length;
          for(let item of this.selectedData){
            this.cost+=Number(item.price);
          }
          this.cost = this.cost.toFixed(2);
        }else{
          this.selectedData = [];
          this.selectedNum = 0;
          this.cost = 0;
        }
      },
      // 从购物车中删除商品
      removeGoods(gid){
        ElMessageBox.confirm(
          '将从购物车中删除这件商品,是否继续操作?',
          '确认',
          {
            confirmButtonText:'继续',
            cancelButtonText:'取消',
            type:'warning',
          }
        ).then(()=>{
          // 调用接口： 传入（用户ID,商品ID） 返回(null)
          /* this.axios.get('/api/removeCart/' + this.userID + '/' + gid); */
          let index = 0;
          for(let item of this.tableData){
            if(item.id===gid){
              break;
            }else{
              index++;
            }
          }
          this.tableData.splice(index,1);       
          ElMessage({
            type:'success',
            message:'删除成功!',
          });
        })        
      },
      // 批量移除商品
      removeSelectedGoods(){
        if(!this.selectedData.length){
          ElMessage({
            type:'error',
            message:'请选中商品！',
          });          
        }else{
          ElMessageBox.confirm(
            '将从购物车中删除选中商品,是否继续操作?',
            '确认',
            {
              confirmButtonText:'继续',
              cancelButtonText:'取消',
              type:'warning',
            }
          ).then(()=>{
            for(let sitem of this.selectedData){
              let index = 0;
              for(let item of this.tableData){
                if(item.id===sitem.id){
                // 调用接口： 传入（用户ID,商品ID） 返回(null)
                /* this.axios.get('/api/removeCart/' + this.userID + '/' + sitem.id); */
                  break;
                }else{
                  index++;
                }
              }
              this.tableData.splice(index,1);
            }    
            this.selectedData=[];
            this.selectedNum=0;
            this.cost=0;   
            ElMessage({
              type:'success',
              message:'删除成功!',
            });
          }) 
        }       
      },  
      // 结算
      jumpToConfirm(){
        if(this.selectedData.length){
          let goodsIDArray = '';  // 结算商品ID字符串，ID之间以'-'隔开，用以query传参给confirm页面
          for(let item of this.selectedData){
            if(!goodsIDArray){
              goodsIDArray = item.id;
            }else{
              goodsIDArray += '-'+item.id;
            }
          }
          this.$router.push({
            path:'/confirm',
            query:{
              goodsIDArray,
            },
          })
        }else{
          ElMessage({
            type:'error',
            message:'请选中商品！',
          });
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