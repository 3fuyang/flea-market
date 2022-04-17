<template>
<div id="name">
  <el-container style="height: 40px;margin:30px 33% 0 33%;">
    <el-row>
    <el-input v-model.trim="keyWord" placeholder="Type to Search." style="width: 500px;" @keyup.enter="searchKeyWord()">
      <template #prefix>
        <el-icon :size="20" style="margin-top: 6px;margin-right: 2px">
          <Search/>
        </el-icon>
      </template>
      <template #suffix>
        <el-button plain type="primary" size="small" round style="margin-top: 5px;"  @click="searchKeyWord()">搜索</el-button>
      </template>        
    </el-input>
    </el-row>
  </el-container>
  <el-container style="height: 30px;margin: 0px 33%;">
    <el-row>
      <el-button type="text" size="small" style="padding: 0;color: #3399CC;" @click="jumpKeyWord('高数第七版')">高数第七版</el-button>
      <el-button type="text" size="small" style="padding: 0;color: #3399CC;" @click="jumpKeyWord('大红袍茶叶')">大红袍茶叶</el-button>
      <el-button type="text" size="small" style="padding: 0;color: #3399CC;" @click="jumpKeyWord('收音机')">四六级收音机</el-button>
      <el-button type="text" size="small" style="padding: 0;color: #3399CC;" @click="jumpKeyWord('羽毛球拍')">羽毛球拍</el-button>
      <el-button type="text" size="small" style="padding: 0;color: #3399CC;" @click="jumpKeyWord('空气净化器')">空气净化器</el-button>
      <el-button type="text" size="small" style="padding: 0;color: #3399CC;" @click="jumpKeyWord('雷蛇鼠标')">雷蛇鼠标</el-button>
      <el-button type="text" size="small" style="padding: 0;color: #3399CC;" @click="jumpKeyWord('机械键盘')">机械键盘</el-button>
    </el-row>
  </el-container>
  <div style="margin: 10px 0 0 0;"></div>
  <el-container style="height: 280px;margin:0 12%;">
  <el-row>
    <el-menu class="el-menu-vertical" style="width: 133px;margin-right:4px;">
      <el-menu-item index="1" @click="jumpMenu('图书音像')">
      <el-icon :size="20"><reading /></el-icon>
        <span>图书音像</span>
      </el-menu-item>
      <el-menu-item index="2" @click="jumpMenu('电子产品')">
        <el-icon :size="20"><monitor /></el-icon>
        <span>电子产品</span>
      </el-menu-item>
      <el-menu-item index="3" @click="jumpMenu('美妆个护')">
        <el-icon :size="20"><magic-stick /></el-icon>
        <span>美妆个护</span>
      </el-menu-item>
      <el-menu-item index="4" @click="jumpMenu('运动户外')">
        <el-icon :size="20"><bicycle /></el-icon>
        <span>运动户外</span>
      </el-menu-item>            
      <el-menu-item index="5" @click="jumpMenu('生活电器')">
        <el-icon :size="20"><odometer /></el-icon>
        <span>生活电器</span>
      </el-menu-item>           
    </el-menu>
    <!--走马灯1-->
    <el-carousel height="280px" style="width: 836.05px;">
      <el-carousel-item v-for="item in imageList" :key="item.no">
        <el-image :src="item.path" fit="scale-down" />
      </el-carousel-item>
    </el-carousel>
    <el-menu class="el-menu-vertical" style="width: 133px;margin-left: 4px;">
      <el-menu-item index="1">
        <el-icon :size="20"><position /></el-icon>
        <span>校区分布</span>
      </el-menu-item>
      <el-menu-item index="2" @click="jumpMenu('四平路校区')">
        <el-icon :size="20"><food /></el-icon>
        <span>四平路校区</span>
      </el-menu-item>
      <el-menu-item index="3" @click="jumpMenu('嘉定校区')">
        <el-icon :size="20"><office-building /></el-icon>
        <span>嘉定校区</span>
      </el-menu-item>
      <el-menu-item index="4" @click="jumpMenu('沪西校区')">
        <el-icon :size="20"><first-aid-kit /></el-icon>
        <span>沪西校区</span>
      </el-menu-item>            
      <el-menu-item index="5" @click="jumpMenu('沪北校区')">
        <el-icon :size="20"><suitcase /></el-icon>
        <span>沪北校区</span>
      </el-menu-item>           
    </el-menu>   
  </el-row>       
  </el-container>
  <div style="margin: 25px 0 0 0;"></div>
  <el-container style="height: 240px;margin:5px 12%;">
  <el-row>
  <el-card :body-style="{padding: '0px 0px 0px 0px'}" :style="bg" style="width: 133px;height: 240px;">
    <span style="display: inline-block;margin-top: 25px;margin-bottom: 10px;font-size: 22px;color: #ffffff;">冬季特价</span><br/>
    <span style="display: inline-block;margin-top: 10px;margin-bottom: 75px;font-size: 18px;color: #ffffff;font-family: Arial,Verdana,Sans-serif;">FOR &nbsp;&nbsp;SALE</span>
    <el-card class="point" round :body-style="{padding: '0px 0px 0px 0px'}" :style="go" style="width: 50px;height: 25px;margin-left: 38px;">
      <span style="display: inline-block;font-size: 17px;color: #ffffff;margin-top: 1px;" @click="jumpMenu('冬季促销')">前往</span>
    </el-card>
  </el-card>
  <!--走马灯2-->
  <el-carousel type="card" v-if="goodsList.length >= 5" indicator-position="none" height="240px" style="width: 627px;">
    <el-carousel-item v-for="item in goodsList" :key="item.id" style="margin-left: 38px;">
      <el-card :body-style="{ padding: '0px' }" style="width: 220px;height: 240px;" @click="jumpCard(item.id)">
        <el-image :src="item.path" fit="scale-down" />
          <span style="display: inline-block;font-size: 13px;color: #808080;margin-top: 3px;">{{item.name}}</span><br/>
          <span style="display: inline-block;font-size: 18px;color: #FF9900;margin-top: 0px;">￥{{item.price}}</span>
      </el-card>
    </el-carousel-item>
  </el-carousel>
  <!--用户信息简略展示-->
  <!--未登录状态-->      
  <el-card v-if="userID==='0'" :body-style="{ padding: '0px'}" :style="profile" style="width: 207px;height: 240px;margin-left: 3px;">
    <el-avatar class="point" shape="circle" :size="40" style="margin-top: 25px;background-color: #F0F8FF;color: #00BFFF;"
      @click="$router.push('/login')">LogIn</el-avatar><br/>
    <span style="display: inline-block;font-size: 13px;margin-top: 5px;font-weight: bold;">Hi! &nbsp;&nbsp;Please log in!</span>
    <el-row>
    <el-col :span="8">
      <span class="point" style="display: inline-block;font-size: 18px;color: #808080;margin-top: 15px;font-weight: bold;"
        @click="$router.push('/login')">---</span><br/>
      <span style="display: inline-block;font-size: 14px;color: #696969;margin-top: 5px;">购物车</span>
    </el-col>
    <el-col :span="8">
      <span class="point" style="display: inline-block;font-size: 18px;color: #808080;margin-top: 15px;font-weight: bold;"
        @click="$router.push('/login')">---</span><br/>
      <span style="display: inline-block;font-size: 14px;color: #696969;margin-top: 5px;">待付款</span>
    </el-col>
    <el-col :span="8">
      <span class="point" style="display: inline-block;font-size: 18px;color: #808080;margin-top: 15px;font-weight: bold;"
        @click="$router.push('/login')">---</span><br/>
      <span style="display: inline-block;font-size: 14px;color: #696969;margin-top: 5px;">待评价</span>
    </el-col>        
    </el-row><br/>
    <div style="margin-top: 13px;"></div>
    <el-row>
      <el-col :span="12">
        <el-icon class="point" :size="24" color="#808080"
          @click="$router.push('/login')"><star/></el-icon><br/>
        <span style="display: inline-block;font-size: 14px;color: #808080;margin-top: 5px;">收藏的宝贝</span>
      </el-col>
      <el-col :span="12">
        <el-icon class="point" :size="24" color="#808080"
          @click="$router.push('/login')"><clock/></el-icon><br/>
        <span style="display: inline-block;font-size: 14px;color: #808080;margin-top: 5px;">用户足迹</span>
      </el-col>        
    </el-row>
  </el-card>      
  <!--普通用户登录状态-->
  <el-card v-else-if="userID.length===7" :body-style="{ padding: '0px'}" :style="profile" style="width: 207px;height: 240px;margin-left: 3px;">
    <el-avatar class="point" shape="circle" :src="avatorSrc" :size="40" style="margin-top: 25px;background-color: #F0F8FF;"
      @click="$router.push('/info')"></el-avatar><br/>
    <span style="display: inline-block;font-size: 13px;margin-top: 5px;font-weight: bold;">Hi! &nbsp;&nbsp;{{userID}}</span>
    <el-row>
    <el-col :span="8">
      <span class="point" style="display: inline-block;font-size: 18px;color: #FF9900;margin-top: 15px;font-weight: bold;"
        @click="$router.push('/shoppingcart')">{{shoppingCartNum}}</span><br/>
      <span style="display: inline-block;font-size: 14px;color: #696969;margin-top: 5px;">购物车</span>
    </el-col>
    <el-col :span="8">
      <span class="point" style="display: inline-block;font-size: 18px;color: #FF9900;margin-top: 15px;font-weight: bold;"
        @click="$router.push('/order')">{{notPayNum}}</span><br/>
      <span style="display: inline-block;font-size: 14px;color: #696969;margin-top: 5px;">待付款</span>
    </el-col>
    <el-col :span="8">
      <span class="point" style="display: inline-block;font-size: 18px;color: #FF9900;margin-top: 15px;font-weight: bold;"
        @click="$router.push('/order')">{{notEvaluateNum}}</span><br/>
      <span style="display: inline-block;font-size: 14px;color: #696969;margin-top: 5px;">待评价</span>
    </el-col>        
    </el-row><br/>
    <div style="margin-top: 13px;"></div>
    <el-row>
      <el-col :span="12">
        <el-icon class="point" :size="24" color="#FF9900"
          @click="$router.push('/favorite')"><star/></el-icon><br/>
        <span style="display: inline-block;font-size: 14px;color: #FF9900;margin-top: 5px;">收藏的宝贝</span>
      </el-col>
      <el-col :span="12">
        <el-icon class="point" :size="24" color="#3399CC"
          @click="$router.push('/history')"><clock/></el-icon><br/>
        <span style="display: inline-block;font-size: 14px;color: #3399CC;margin-top: 5px;">用户足迹</span>
      </el-col>        
    </el-row>    
  </el-card>
  <!--管理员登录状态-->
  <el-card v-else-if="userID.length===4" :body-style="{ padding: '0px'}" :style="profile" style="width: 207px;height: 240px;margin-left: 3px;">
    <el-avatar class="point" shape="circle" :size="40" :src="avatorSrc" style="margin-top: 25px;background-color: #F0F8FF;"
      @click="$router.push('/admin/examine')"></el-avatar><br/>
    <span style="display: inline-block;font-size: 13px;margin-top: 5px;font-weight: bold;">Hi! &nbsp;&nbsp;Admin: &nbsp;{{userID}}</span>
    <el-row>
    <el-col :span="8">
      <span style="display: inline-block;font-size: 18px;color: #808080;margin-top: 15px;font-weight: bold;"
        >---</span><br/>
      <span style="display: inline-block;font-size: 14px;color: #696969;margin-top: 5px;">购物车</span>
    </el-col>
    <el-col :span="8">
      <span style="display: inline-block;font-size: 18px;color: #808080;margin-top: 15px;font-weight: bold;"
        >---</span><br/>
      <span style="display: inline-block;font-size: 14px;color: #696969;margin-top: 5px;">待付款</span>
    </el-col>
    <el-col :span="8">
      <span style="display: inline-block;font-size: 18px;color: #808080;margin-top: 15px;font-weight: bold;"
        >---</span><br/>
      <span style="display: inline-block;font-size: 14px;color: #696969;margin-top: 5px;">待评价</span>
    </el-col>        
    </el-row><br/>
    <div style="margin-top: 13px;"></div>
    <el-row>
      <el-col :span="12">
        <el-icon :size="24" color="#808080"
          ><star/></el-icon><br/>
        <span style="display: inline-block;font-size: 14px;color: #808080;margin-top: 5px;">收藏的宝贝</span>
      </el-col>
      <el-col :span="12">
        <el-icon :size="24" color="#808080"
          ><time/></el-icon><br/>
        <span style="display: inline-block;font-size: 14px;color: #808080;margin-top: 5px;">用户足迹</span>
      </el-col>        
    </el-row>
  </el-card>         
  <!--用户操作面板-->
  <!--未登录状态-->
  <el-card v-if="userID==='0'" :body-style="{ padding: '0px' }" :style="pn" style="width: 133px;height: 240px;margin-left: 3px;">
    <span style="display: inline-block;font-size: 20px;color: #99CCCC;margin-top: 30px;font-weight: bold;">PLEASE</span>
    <el-card class="point" :body-style="{padding: '0px 0px 0px 0px', backgroundColor: '#99CCFF', opacity: 0.7}" shadow="hover"
      style="width: 84px;height: 33px;margin-left: 24px;margin-top: 10px;" @click="$router.push('/login')">
      <el-icon :size="15" color="#ffffff" ><user/></el-icon>
      <span style="display: inline-block;font-size: 13px;color: #ffffff;margin-top: 8px;margin-bottom: 9px;">&nbsp;登录</span>
    </el-card>
    <span style="display: inline-block;font-size: 20px;color: #FF9999;margin-top: 12px;font-weight: bold;">OR</span>
    <el-card class="point" :body-style="{padding: '0px 0px 0px 0px', backgroundColor: '#99CCFF', opacity: 0.7}" shadow="hover"
      style="width: 84px;height: 33px;margin-left: 24px;margin-top: 10px;margin-top: 3px;" @click="$router.push('/login')">
      <el-icon :size="15" color="#ffffff" ><circle-plus/></el-icon>
      <span style="display: inline-block;font-size: 13px;color: #ffffff;margin-top: 8px;margin-bottom: 9px;">&nbsp;注册</span>
    </el-card>     
    <span style="display: inline-block;font-size: 20px;color: #FFCC99;margin-top: 10px;font-weight: bold;">FIRST</span>          
  </el-card>
  <!--普通用户登陆状态-->         
  <el-card v-else-if="userID.length===7" :body-style="{ padding: '0px' }" :style="pn" style="width: 133px;height: 240px;margin-left: 3px;">
    <el-card class="point" :body-style="{padding: '0px 0px 0px 0px', backgroundColor: '#99CCFF', opacity: 0.7}" shadow="hover"
      style="width: 84px;height: 33px;margin-left: 24px;margin-top: 20px;" @click="$router.push('/security')">
      <el-row>
        <el-col :span="4">
          <el-icon :size="18" color="#ffffff" style="margin: 6px 0px 0px 3px;"><lock/></el-icon>
        </el-col>
        <el-col :span="20">
          <span style="display: inline-block;font-size: 13px;color: #ffffff;margin-top: 8px;margin-bottom: 9px;">安全中心</span>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="point" :body-style="{padding: '0px 0px 0px 0px', backgroundColor: '#99CCFF', opacity: 0.7}" shadow="hover"
      style="width: 84px;height: 33px;margin-left: 24px;margin-top: 20px;" @click="$router.push('/stream')">
      <el-row>
        <el-col :span="4">
          <el-icon :size="18" color="#ffffff" style="margin: 6px 0px 0px 3px;"><pie-chart/></el-icon>
        </el-col>
        <el-col :span="20">
          <span style="display: inline-block;font-size: 13px;color: #ffffff;margin-top: 8px;margin-bottom: 9px;">流水统计</span>
        </el-col>
      </el-row>      
    </el-card>
    <el-card class="point" :body-style="{padding: '0px 0px 0px 0px', backgroundColor: '#99CCFF', opacity: 0.7}" shadow="hover"
      style="width: 84px;height: 33px;margin-left: 24px;margin-top: 20px;" @click="$router.push('/goods')">
      <el-row>
        <el-col :span="4">
          <el-icon :size="18" color="#ffffff" style="margin: 6px 0px 0px 3px;"><files/></el-icon>
        </el-col>
        <el-col :span="20">
          <span style="display: inline-block;font-size: 13px;color: #ffffff;margin-top: 8px;margin-bottom: 9px;">我的闲置</span>
        </el-col>
      </el-row>      
    </el-card>
    <el-card class="point" :body-style="{padding: '0px 0px 0px 0px', backgroundColor: '#99CCFF', opacity: 0.7}" shadow="hover"
      style="width: 84px;height: 33px;margin-left: 24px;margin-top: 20px;" @click="$router.push('/chat')">
      <el-row>
        <el-col :span="4">
          <el-icon :size="18" color="#ffffff" style="margin: 6px 0px 0px 3px;"><message/></el-icon>
        </el-col>
        <el-col :span="20">
          <span style="display: inline-block;font-size: 13px;color: #ffffff;margin-top: 8px;margin-bottom: 9px;">我的聊天</span>
        </el-col>
      </el-row>       
    </el-card>          
  </el-card>
  <!--管理员操作面板-->
  <el-card v-else-if="userID.length===4" :body-style="{ padding: '0px' }" :style="pn" style="width: 133px;height: 240px;margin-left: 3px;">
    <span style="display: inline-block;font-size: 20px;color: #99CCCC;margin-top: 30px;font-weight: bold;">ADMIN</span>
    <el-card class="point" :body-style="{padding: '0px 0px 0px 0px', backgroundColor: '#99CCFF', opacity: 0.7}" shadow="hover"
      style="width: 84px;height: 33px;margin-left: 24px;margin-top: 10px;" @click="$router.push('/admin/report')">
      <el-row>
        <el-col :span="4">
          <el-icon :size="18" color="#ffffff" style="margin: 6px 0px 0px 3px;"><help/></el-icon>
        </el-col>
        <el-col :span="20">
          <span style="display: inline-block;font-size: 13px;color: #ffffff;margin-top: 8px;margin-bottom: 9px;">举报中心</span>
        </el-col>
      </el-row>        
    </el-card>
    <span style="display: inline-block;font-size: 20px;color: #FF9999;margin-top: 12px;font-weight: bold;">PANEL</span>
    <el-card class="point" :body-style="{padding: '0px 0px 0px 0px', backgroundColor: '#99CCFF', opacity: 0.7}" shadow="hover"
      style="width: 84px;height: 33px;margin-left: 24px;margin-top: 10px;" @click="$router.push('/admin/examine')">
      <el-row>
        <el-col :span="4">
          <el-icon :size="18" color="#ffffff" style="margin: 6px 0px 0px 3px;"><message/></el-icon>
        </el-col>
        <el-col :span="20">
          <span style="display: inline-block;font-size: 13px;color: #ffffff;margin-top: 8px;margin-bottom: 9px;">审核中心</span>
        </el-col>
      </el-row>        
    </el-card>       
  </el-card>      
  </el-row>
  </el-container>
</div>    
</template>

<script>
import { ElMessage } from 'element-plus'
import { Search, Reading, Monitor, MagicStick, Bicycle, Odometer, Position, Food, OfficeBuilding, FirstAidKit, Suitcase, Star, Clock, User, CirclePlus, Lock, PieChart, Files, Message, Help } from '@element-plus/icons-vue'
export default {
    components:{
      Search, Reading, Monitor, MagicStick, Bicycle, Odometer, Position, Food, OfficeBuilding, FirstAidKit, Suitcase, Star, Clock, User, CirclePlus, Lock, PieChart, Files, Message, Help
    },
    created(){
      //为图片列表赋值
      this.imageList=[
        { no:'1',path: ("/src/assets/1.jpg")},
        { no:'2',path: ("/src/assets/2.png")},
        { no:'3',path: ("/src/assets/3.jpg")},
        { no:'4',path: ("/src/assets/4.png")},
      ];
      let IDArray = ['000001','000002','000003','000004','000005'];
      for(let item of IDArray){
        // 调用接口：传入（商品ID） 返回（商品标题、商品价格、图片url）
        this.axios.get('/api/goodsBriefInfo/'+ item).then((response) => {
          this.goodsList.push({
            id: item,
            name: response.data[0].goods_title,
            price: response.data[0].price,
            path: ("/src/assets/"+response.data[0].url),
          });       
        })
      }      
      /* this.goodsList=[     
        { id:'0',name:'大学物理学 (附)网络课程&配套习题',price:'15.00',path: ("/src/assets/physics.png")},
        { id:'1',name:'Apple iPad Pro 11英寸平板电脑',price:'3499.00',path: ("/src/assets/ipad.png")},
        { id:'2',name:'派克威雅XL系列 樱花粉特别款礼盒',price:'198.00',path: ("/src/assets/pen.png")},
        { id:'3',name:'Ecovas智能家用空气净化器 机器智能',price:'3399.00',path: ("/src/assets/philips.png")},
        { id:'4',name:'传奇武夷山 大红袍茶叶',price:'149.00',path: ("/src/assets/tea.png")},  
      ] */
      //获取用户ID
      this.userID=window.sessionStorage.getItem('uid');
      if(this.userID === null){
        this.userID='0';
      }
      //调用接口：传入（用户ID） 返回（用户购物车数量，待付款数量，待评价数量）
      this.axios.get('/api/homeinfo/'+this.userID).then((response) => {
        this.shoppingCartNum=response.data.shoppingCartNum;
        this.notPayNum=response.data.notPaidNum;
        this.notEvaluateNum=response.data.notEvaluateNum;        
      })      
    },
    data(){
        return{
          bg: {   //背景样式
            backgroundImage: "url(" + ("/src/assets/winter.jpg") + ")",
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%",
            opacity: 0.8,
          },
          go:{  //小窗样式
            backgroundColor: "#66CCFF",
            opacity: 0.9,
          },
          profile:{ //用户卡片样式
            backgroundImage: "url(" + ("/src/assets/profile.png") + ")",
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%",
            opacity: 0.9,
          },
          pn:{ //功能面板卡片样式
            backgroundImage: "url(" + ("/src/assets/panel.png") + ")",
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%",
            opacity: 0.9,
          },          
          keyWord:'', //搜索关键字
          imagelist: [],  //走马灯1图片
          goodsList: [],  //走马灯2图片  
          avatorSrc:  ('/src/assets/avator.png'), //头像图片 
          userID:'',  //用户ID       
          shoppingCartNum:'', //购物车数量
          notPayNum:'', //待付款数量
          notEvaluateNum:'',  //待评价数量
          winterSale: ('/src/assets/winter.jpg'),  //冬季会场图片
        }
    },
    methods:{
      //根据关键字搜索商品
      searchKeyWord(){
        if(this.keyWord!=''){
          this.$router.push({
            path:'/result',
            query:{
              keywords:this.keyWord,
            },
          });
        }else{
          ElMessage.error('亲,请输入关键字哦');
        }
      },
      //点击关键字搜索商品
      jumpKeyWord(givenWord){
        this.$router.push({
          path:'/result',
          query:{
            keywords:givenWord,
          },
        });
      },
      //根据目录跳转分区
      jumpMenu(item){
        let tail=item.substr(-2,2);
        if(tail==='校区'){
          //将分类作为query参数传递至result页面
          this.$router.push({
            path:'./result',
            query:{
              region:item,
            }
          });
        }else if(tail==='分布'){
          return
        }else{
          this.$router.push({
            path:'/result',
            query:{
              catalog:item,
            }
          });
        }
      },
      //点击卡片跳转商品详情页
      jumpCard(itemID){
        this.$router.push({
          path:'/details',
          query:{
            gid:itemID,
          }
        })
      },
    },
}
</script>

<style scoped>
.point{cursor:pointer}
</style>