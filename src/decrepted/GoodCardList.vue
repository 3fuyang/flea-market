<template>
<div class="goodCardList">
    <div v-if="selectGoodList.length">
        <div class = "goodCard" v-for="(good,index) in selectGoodList" :key="index">
            <div class="leftCard">
                <el-carousel height="120px" indicator-position="none">
                    <el-carousel-item v-for="(image,index) in good.images" :key="index">
                        <img :src="image" class="goodPic">
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div class="rightCard">
                <el-link class="cardName" :underline=false style="cursor: pointer;" @click="clickGood(good.id)">
                    {{good.name}}
                </el-link>
                <div v-if="!hasSaled">
                    <div class="goodInfo">
                        
                        <i class="el-icon-view"></i>
                        浏览次数：{{good.visitTime}}
                        <el-divider direction="vertical"></el-divider>
                        <i class="el-icon-star-on"></i>
                        收藏人数：{{good.favoriteTime}}
                    </div>
                    <div class="goodControl">
                        <el-button size="mini" type="primary" round plain @click="editGood">编辑商品</el-button>
                        <el-button size="mini" type="danger" round plain @click="deleteGood(good.id)">下架商品</el-button>
                    </div>
                </div>
                <div v-else>
                    <div class="saledInfo">
                        <i class="el-icon-time"></i>
                        {{good.saledTime}}
                        <el-divider direction="vertical"></el-divider>
                        ￥{{good.saledPrice}}
                    </div>
                </div>
            </div>
        </div>
        <div class="pagination">
            <el-pagination :page-size="pageSize" layout="prev, pager, next" :total="selectGoods.length" v-model:currentPage="currentPage"></el-pagination>
        </div>
    </div>
    <div v-else>
        <el-empty description="可以点击右上方的上架商品卖掉不需要的东西，快来试试吧。"/>
    </div>
    <el-dialog v-model="editInfo">
        <GoodInfo/>
    </el-dialog>
</div>
</template>

<style scoped>
.goodCardList{
    width:500px;
    height:900px;
    margin: 0 auto;
    position:relative;
}
.goodCard:hover{
    box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;
    background-color: rgb(234, 236, 236);
}
.goodCard{
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
.rightCard{
    width:70%;
    float:left;
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
.goodInfo{
    height: 25px;
    font-family: 'FZHeiBJW';
}
.goodControl{
    height: 35px;
}
.saledInfo{
    margin-top: 25px;
    height: 30px;
    font-size: 15px;
}
</style>

<script>
import GoodInfo from '@/components/GoodInfo.vue'
import '@/assets/fonts/font.css'

export default {
    props: {
        hasSaled: Boolean
    },
    components:{
        GoodInfo
    },
    data(){
        return{
            goodList: [{
                id: 0,
                name: "软工如何不挂科",
                hasSaled: false,
                images: [require("../assets/physics.png"), require("../assets/ipad.png"), require("../assets/pen.png")],
                visitTime: 20,
                favoriteTime: 2,
            },{
                id: 1,
                name: "软工如何不挂科",
                hasSaled: true,
                images: [require("../assets/physics.png"), require("../assets/ipad.png"), require("../assets/pen.png")],
                visitTime: 0,
                favoriteTime: 0,
                saledTime: "2021-12-25 12:00",
                saledPrice: "200"
            }],
            pageSize: 5,
            currentPage: 1,
            editInfo: false,
        }
    },
    methods:{
        clickGood(i){
            //跳转
            this.$router.push({path:"/dataInfo",query:{goodId:i}});
        },
        editGood(){
            this.editInfo = true;
        },
        deleteGood(id)
        {
            this.$confirm('下架商品后，商品信息不会被保留，是否确认下架商品！','提示')
            .then(() => {
                this.goodList.splice(this.goodList.findIndex((good)=> good.id == id), 1);
                this.$message({
                    type: 'warning',
                    message: '商品已下架!'
                })    
            })
            .catch(() => {});
        },
    },
    computed:{
        selectGoods: function(){
            var goods = new Array();
            this.goodList.forEach((good)=>{
                if(good.hasSaled==this.hasSaled)
                    goods.push(good);
            })
            return goods
        },
        selectGoodList: function(){
            var end = this.currentPage * this.pageSize;
            var begin = end - this.pageSize;
            return this.selectGoods.slice(begin,end);
        },
    }
}
</script>