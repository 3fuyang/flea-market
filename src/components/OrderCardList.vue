<template>
<div class="orderCardList">
	<el-radio-group v-model="orderType">
        <el-radio :label="2">全部</el-radio>
        <el-radio :label="0">进行中</el-radio>
        <el-radio :label="1">已完成</el-radio>
    </el-radio-group>
    <el-divider></el-divider>
    <div v-if="selectOrderList.length">
        <div class = "orderCard" v-for="(order,index) in selectOrderList" :key="index">
            <div class="leftCard">
                <el-carousel height="120px" indicator-position="none">
                    <el-carousel-item v-for="(image,index) in order.images" :key="index">
                        <img :src="image" class="goodPic">
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div class="midCard">
                <el-link class="cardName" :underline=false style="cursor: pointer;" @click="clickOrder(order.goodId)">
                    {{order.goodName}}
                </el-link>
                <el-tooltip :content="order.detailedDescription" placement="top" :open-delay=500 effect="light">
                    <div class="cardTimeLocation">
                        <i class="el-icon-time"></i>
                        {{order.time}}
                        <i class="el-icon-location"></i>
                        {{"20号楼435寝室"}}
                    </div>
                </el-tooltip>
                <el-tooltip v-if="order.isCompleted" :disabled="order.commentStars == 0" :content="order.comment" placement="top" :open-delay=500 effect="light">
                    <div class="cardComment">
                        <el-rate v-model="order.commentStars" :disabled="order.commentStars > 0" @change="handleRate(order)" :icon-classes="rateIcons" void-icon-class="icon-rate-face-off" disabled-void-icon-class="icon-rate-face-off" :colors="['#99A9BF', '#F7BA2A', '#FF9900']"></el-rate>
                    </div> 
                </el-tooltip>
                <div v-else class="cardControl">
                    <el-button type="text" size="mini" @click="confirmOrder(order.orderId)">确认完成</el-button>
                    <el-button type="text" size="mini" @click="cancelOrder(order.orderId)">取消订单</el-button>
                </div>
            </div>
            <el-tooltip placement="right" effect="light">
                <template #content>
                    <div v-if="order.reportState==0">
                            <el-button type="text" @click="handleReport(order)">举报</el-button>
                    </div>
                    <div v-else-if="order.reportState==1">
                        <el-popover placement="top-start" title="举报内容" width="200" trigger="hover" :content="order.reportReason">
                            <template #reference>
                                <el-button type="text">举报审核中</el-button>
                            </template>
                        </el-popover>
                    </div>
                    <div v-else>
                        <el-popover placement="top-start" title="举报处理结果" width="200" trigger="hover" :content="order.reportReply">
                            <template #reference>
                                <el-button type="text">已处理</el-button>
                            </template>
                        </el-popover>
                    </div>
                </template>
                <div class="rightCard">
                    <div class="cardPrice">￥{{order.price}}</div>
                    <el-tooltip :content="order.name" placement="top" :open-delay=500 effect="light">
                        <div class="cardPhoto"><img :src="order.photo" class="userPic"></div>
                    </el-tooltip>
                </div>
            </el-tooltip>
        </div>
        <div class="pagination">
            <el-pagination :page-size="pageSize" layout="prev, pager, next" :total="selectOrders.length" v-model:currentPage="currentPage"></el-pagination>
        </div>
    </div>
    <div v-else>
        <el-empty description="暂时没有订单，快去逛一逛叭。">
            <el-button type="primary" @click="goHome">探索</el-button>
        </el-empty>
    </div>
    <el-dialog v-model="commentDialogVisible" title="评价" width="30%" :before-close="handleCommentDialogClose">
        <div class="dialogStarsLeft">
            评分：
        </div> 
        <div class="dialogStarsRight"> 
            <el-rate v-model="commentStars" :texts="['极差', '失望', '一般', '不错', '很棒']" show-text :icon-classes="rateIcons" void-icon-class="icon-rate-face-off" disabled-void-icon-class="icon-rate-face-off" :colors="['#99A9BF', '#F7BA2A', '#FF9900']"></el-rate>
        </div>
        <div class="dialogText">
            <el-input type="textarea" :rows="5" placeholder="请输入评论" v-model="commentText" maxlength="400" show-word-limit></el-input>
        </div>
        <template #footer>
            <span class="dialogFooter">
                <el-button @click="handleCommentDialogClose">取 消</el-button>
                <el-button type="primary" @click="handleCommentDialogConfirm">确 定</el-button>
            </span>
        </template>
    </el-dialog>
    <el-dialog title="举报" v-model="reportDialogVisible" width="25%" :before-close="handleReportDialogClose">
        <p style="text-align:left"><b>举报原因：</b></p>
        <el-input type="textarea" :rows="5" placeholder="请输入举报原因" v-model="reportText" maxlength="400" show-word-limit></el-input>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleReportDialogClose">取 消</el-button>
                <el-button type="primary" @click="handleReportDialogConfirm">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</div>
</template>

<style scoped>
.orderCardList{
    width:500px;
    height:900px;
    margin: 0 auto;
    position:relative;
}
.orderCard:hover{
    box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;
    background-color: rgb(234, 236, 236);
}
.orderCard{
    width: 100%;
    height: 120px;
    margin:30px auto;
    border-radius: 15px;
    background-color:rgba(246, 248, 248, 0.8);
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
}
.pagination{
    position:absolute;
    bottom:20px;
    width:100%;
}
.leftCard{
    width:30%;
    float:left;
    color:white;
}
.goodPic{
    height:120px;
    width:150px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
}
.midCard{
    width:55%;
    float:left;
}
.cardTimeLocation{
    height:30px;
    line-height:30px;
    font-family: 'Lato-Bold','FZHeiBJW';
    color:#003399;
    font-size:10px;
}
.rightCard{
    width:15%;
    float:left;
}
.cardPrice{
    height:70px;
    font-family: 'Lato-Bold';
    font-size: 20px;
    line-height: 50px;
    text-align: center;
    word-break: break-all;
    word-wrap: break-word;
}
.cardPhoto{
    height: 40px;
    margin:auto;
}
.userPic{
    height: 40px;
    width: 40px;
    border-radius: 50%;
}
.cardName{
    width: 100%;
    height:60px;
    line-height:65px;
    font-size:30px;
    font-family:"楷体";
    overflow:hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
    text-align: center;
}
.cardComment{
    margin-top: 5px;
}
.cardControl{
    margin-top: 0px;
    float: right;
}
.dialogStarsLeft{
    float: left;
    text-align: right;
    font-weight: 900;
    width: 40%;
    line-height: 17.5px;
    font-family: 'FZHeiBJW';
}
.dialogStarsRight{
    float: left;
    text-align: left;
}
.dialogStarsRight>>>.el-rate__text{
    font-family: 'FZHeiBJW';
}
.dialogText{
    margin-top: 40px;
}
</style>

<script>

import '@/assets/fonts/style.css'
import '@/assets/fonts/font.css'

export default {
    props: {
        isCustomer: Boolean
    },
    components:{
        
    },
    data(){
        return{
            orderType: 2,
            orderList: [{
                    isCustomer: true,
                    orderId: 0,
                    goodId: 0,
                    goodName: "混合商品",
                    images: [require("../assets/physics.png"), require("../assets/ipad.png"), require("../assets/pen.png")],
                    time: "2022-01-02 20:40",
                    isCompleted: true,
                    commentStars: 1,
                    price: 998,
                    photo: require("../assets/avator.png"),
                    comment: "被骗了！无良商家还我血汗钱！！！！",
                    detailedDescription: "2022年1月2日晚上8点40后，卖家一直会在20号楼435寝室等着的，可以找一个时间来领，尽量不要来的太晚，以免影响其他人休息。",
                    reportState: 1,
                    reportReason: "无良商家，贩卖假冒伪劣产品！！",
                    reportReply: "很抱歉给您造成了不好的购物体验，该商家当前已被封号处理，付款金额也将在七个工作日内返回给您的账号",
                    name: "绝对不是奸商",
                },{
                    isCustomer: true,
                    orderId: 1,
                    goodId: 0,
                    goodName: "混合商品",
                    images: [require("../assets/physics.png"), require("../assets/ipad.png"), require("../assets/pen.png")],
                    time: "2022-01-02 20:40",
                    isCompleted: true,
                    commentStars: 0,
                    price: 998,
                    photo: require("../assets/avator.png"),
                    comment: "被骗了！无良商家还我血汗钱！！！！",
                    detailedDescription: "2022年1月2日晚上8点40后，卖家一直会在20号楼435寝室等着的，可以找一个时间来领，尽量不要来的太晚，以免影响其他人休息。",
                    reportState: 0,
                    reportReason: "无良商家，贩卖假冒伪劣产品！！",
                    reportReply: "很抱歉给您造成了不好的购物体验，该商家当前已被封号处理，付款金额也将在七个工作日内返回给您的账号",
                    name: "绝对不是奸商",
                },{
                    isCustomer: true,
                    orderId: 2,
                    goodId: 0,
                    goodName: "混合商品",
                    images: [require("../assets/physics.png"), require("../assets/ipad.png"), require("../assets/pen.png")],
                    time: "2022-01-02 20:40",
                    isCompleted: true,
                    commentStars: 1,
                    price: 998,
                    photo: require("../assets/avator.png"),
                    comment: "被骗了！无良商家还我血汗钱！！！！",
                    detailedDescription: "2022年1月2日晚上8点40后，卖家一直会在20号楼435寝室等着的，可以找一个时间来领，尽量不要来的太晚，以免影响其他人休息。",
                    reportState: 2,
                    reportReason: "无良商家，贩卖假冒伪劣产品！！",
                    reportReply: "很抱歉给您造成了不好的购物体验，该商家当前已被封号处理，付款金额也将在七个工作日内返回给您的账号",
                    name: "绝对不是奸商",
                },{
                    isCustomer: true,
                    orderId: 3,
                    goodId: 0,
                    goodName: "混合商品",
                    images: [require("../assets/physics.png"), require("../assets/ipad.png"), require("../assets/pen.png")],
                    time: "2022-01-02 20:40",
                    isCompleted: false,
                    commentStars: 0,
                    price: 998,
                    photo: require("../assets/avator.png"),
                    comment: "被骗了！无良商家还我血汗钱！！！！",
                    detailedDescription: "2022年1月2日晚上8点40后，卖家一直会在20号楼435寝室等着的，可以找一个时间来领，尽量不要来的太晚，以免影响其他人休息。",
                    reportState: 1,
                    reportReason: "无良商家，贩卖假冒伪劣产品！！",
                    reportReply: "很抱歉给您造成了不好的购物体验，该商家当前已被封号处理，付款金额也将在七个工作日内返回给您的账号",
                    name: "绝对不是奸商",
                },{
                    isCustomer: true,
                    orderId: 4,
                    goodId: 0,
                    goodName: "混合商品",
                    images: [require("../assets/physics.png"), require("../assets/ipad.png"), require("../assets/pen.png")],
                    time: "2022-01-02 20:40",
                    isCompleted: false,
                    commentStars: 0,
                    price: 998,
                    photo: require("../assets/avator.png"),
                    comment: "被骗了！无良商家还我血汗钱！！！！",
                    detailedDescription: "2022年1月2日晚上8点40后，卖家一直会在20号楼435寝室等着的，可以找一个时间来领，尽量不要来的太晚，以免影响其他人休息。",
                    reportState: 1,
                    reportReason: "无良商家，贩卖假冒伪劣产品！！",
                    reportReply: "很抱歉给您造成了不好的购物体验，该商家当前已被封号处理，付款金额也将在七个工作日内返回给您的账号",
                    name: "绝对不是奸商",
                },{
                    isCustomer: false,
                    orderId: 5,
                    goodId: 0,
                    goodName: "混合商品",
                    images: [require("../assets/physics.png"), require("../assets/ipad.png"), require("../assets/pen.png")],
                    time: "2022-01-02 20:40",
                    isCompleted: true,
                    commentStars: 0,
                    price: 998,
                    photo: require("../assets/avator.png"),
                    comment: "被骗了！无良商家还我血汗钱！！！！",
                    detailedDescription: "2022年1月2日晚上8点40后，卖家一直会在20号楼435寝室等着的，可以找一个时间来领，尽量不要来的太晚，以免影响其他人休息。",
                    reportState: 1,
                    reportReason: "无良商家，贩卖假冒伪劣产品！！",
                    reportReply: "很抱歉给您造成了不好的购物体验，该商家当前已被封号处理，付款金额也将在七个工作日内返回给您的账号",
                    name: "绝对不是奸商",
                },
            ],
            rateIcons: ['icon-rate-face-1', 'icon-rate-face-2', 'icon-rate-face-3'],
            pageSize: 5,
            currentPage: 1,
            commentDialogVisible: false,
            reportDialogVisible: false,
            commentStars: 5,
            commentText: '',
            reportText: '',
            orderId: '',
        }
    },
    methods:{
        clickOrder(i){
            //跳转
            this.$router.push({path:"/dataInfo",query:{goodId:i}});
        },
        handleRate(order)
        {
            this.commentStars=order.commentStars;
            this.orderId=order.orderId;
            this.commentText='';
            this.commentDialogVisible=true;
        },
        confirmOrder(orderId)
        {
            this.$confirm('该操作不可逆，是否确认完成订单？','提示')
            .then(() => {
                this.orderList[this.orderList.findIndex((order)=> order.orderId == orderId)].isCompleted=true;
                this.$message({
                    type: 'success',
                    message: '订单已完成!'
                })    
            })
            .catch(() => {});
        },
        cancelOrder(orderId)
        {
            this.$confirm('取消订单可能会扣除您一定的信誉分，是否确认要取消订单？','提示')
            .then(() => {
                this.orderList.splice(this.orderList.findIndex((order)=> order.orderId == orderId), 1);
                this.$message({
                    type: 'warning',
                    message: '订单已取消!'
                })    
            })
            .catch(() => {});
        },
        handleCommentDialogClose()
        {
            this.$confirm('退出后评价信息不会保存，是否确认退出!','提示')
            .then(() => {
                this.orderList[this.orderList.findIndex((order)=> order.orderId == this.orderId)].commentStars=0;
                this.commentDialogVisible=false;
                this.$message({
                    type: 'info',
                    message: '评价已取消!'
                })    
            })
            .catch(() => {});
        },
        handleCommentDialogConfirm()
        {
            this.$confirm('评价信息提交后不可更改，是否确认提交!','提示')
            .then(() => {
                if(this.commentText.length == 0)
                {
                    this.$alert('评价内容不可为空!', '警告', {
                        confirmButtonText: '确定',
                        callback: () => {
                            this.$message({
                                type: 'warning',
                                message: '评价内容为空!'
                            });
                        }
                    });
                }
                else
                {
                    this.orderList[this.orderList.findIndex((order)=> order.orderId == this.orderId)].comment=this.commentText;
                    this.commentDialogVisible=false;
                    this.$message({
                        type: 'success',
                        message: '评价成功!'
                    })
                }
            })
            .catch(() => {});
        },
        handleReport(order)
        {
            this.orderId=order.orderId;
            this.reportText='';
            this.reportDialogVisible=true;
        },
        handleReportDialogClose()
        {
            this.$confirm('退出后举报信息不会保存，是否确认退出!','提示')
            .then(() => {
                this.reportDialogVisible=false;
                this.$message({
                    type: 'info',
                    message: '举报已取消!'
                })    
            })
            .catch(() => {});
        },
        handleReportDialogConfirm()
        {
            this.$confirm('举报信息提交后不可更改，是否确认提交!','提示')
            .then(() => {
                if(this.reportText.length == 0)
                {
                    this.$alert('举报原因不可为空!', '警告', {
                        confirmButtonText: '确定',
                        callback: () => {
                            this.$message({
                                type: 'warning',
                                message: '举报内容为空!'
                            });
                        }
                    });
                }
                else
                {
                    var targetOrder = this.orderList[this.orderList.findIndex((order)=> order.orderId == this.orderId)];
                    targetOrder.reportState=1;
                    targetOrder.reportReason=this.reportText;
                    this.reportDialogVisible=false;
                    this.$message({
                        type: 'success',
                        message: '评价成功!'
                    })
                }
            })
            .catch(() => {});
        },
        goHome(){
            //跳转
            this.$router.push({path:"/home"});
        },
    },
    computed:{
        selectOrders: function(){
            var orders = new Array();
            this.orderList.forEach((order)=>{
                if(order.isCustomer == this.isCustomer &&(this.orderType == 2 || this.orderType == order.isCompleted))
                    orders.push(order);
            })
            return orders
        },
        selectOrderList: function(){
            var end = this.currentPage * this.pageSize;
            var begin = end - this.pageSize;
            return this.selectOrders.slice(begin,end);
        },
    },
}
</script>