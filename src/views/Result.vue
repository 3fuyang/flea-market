<template>
<div class="result">
    <div class="searchBar">
        <el-input v-model.trim="keyWord" placeholder="Type to Search." style="width: 500px;" @keyup.enter="searchKeyWord()">
        <template #prefix>
            <i class="el-icon-search" style="width:20px;"></i>
        </template>
        <template #suffix>
            <el-button plain type="primary" size="small" round @click="searchKeyWord()" style="margin-top: 5px;">搜索</el-button>
        </template>        
        </el-input>
    </div>
    <div class="resultControl">
            <el-card :body-style="{ padding: '0px' }">
            校区:
            <el-select v-model="campus" class="selector" size="small">
                <el-option v-for="option in campusOptions" :key="option" :label="option" :value="option"/>
            </el-select>
            <el-divider direction="vertical"/>
            商品类型:
            <el-select v-model="goodType" class="selector" size="small">
                <el-option v-for="option in goodTypeOptions" :key="option" :label="option" :value="option"/>
            </el-select>
            <el-divider direction="vertical"/>
            上架时间:
            <el-select v-model="timeLimit" class="selector" size="small">
                <el-option v-for="option in timeLimitOptions" :key="option" :label="option" :value="option"/>
            </el-select>
        </el-card>
        <el-card :body-style="{ padding: '0px'}">
            价格:
            <el-input-number v-model="minPrice" :min="0" :max="maxPrice" size="small" controls-position="right"/>
            -
            <el-input-number v-model="maxPrice" :min="minPrice" size="small" controls-position="right"/>
            <el-divider direction="vertical"/>
            排序方式:
            <el-select v-model="sortType" class="selector" size="small" @change="sortTypeChange">
                <el-option v-for="option in sortTypeOptions" :key="option" :label="option" :value="option"/>
            </el-select>
        </el-card>
    </div>
    <el-divider/>
    <div class="searchResult">
        <div class="searchResultCard" v-for="(good,index) in selectGoods" :key="index">
            <el-card :body-style="{ padding: '0px' }">
                <el-carousel height="100px" indicator-position="none">
                    <el-carousel-item v-for="(image,index) in good.images" :key="index">
                        <img :src="image" class="goodPic">
                    </el-carousel-item>
                </el-carousel>
                <div class="goodTitle"><el-link :underline="false" @click="jumpGood(good.id)">{{good.title}}</el-link></div>
                <div class="goodSeller"><el-avatar size="small" :src="good.seller" @click="jumpInfo(good.sellerId)"/></div>
                <div class="goodPrice">￥{{good.price}}</div>
            </el-card>
        </div>
    </div>
    <div class="pagination">
        <el-pagination :background="true" :page-size="pageSize" layout="prev, pager, next" :total="searchedGoods.length" v-model:currentPage="currentPage"></el-pagination>
    </div>
</div>
</template>

<style scoped>
.result{
    margin: 0 auto;
    height: 900px;
    position:relative;
}
.searchBar{
    height: 40px;
    margin:30px 33% 0 33%;
}
.resultControl{
    width: 500px;
    margin: 5px auto;
    font-family: 'FZHeiBJW';
    font-size: 12px;
}
.selector{
    width:100px;
}
.searchResult{
    width: 860px;
    margin: 5px auto;
    font-family: 'FZHeiBJW';
}
.searchResultCard{
    width: 160px;
    margin: 0px 5px 10px 5px; 
    float:left
}
.point{
  cursor: pointer;
}
.goodTitle{
    display: inline-block;
    font-size: 13px;
    color: #808080;
    margin-top: 5px;
    overflow:hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
    text-align: center;
    height: 14px;
    width: 160px;
}
.goodSeller{
    width: 40px;
    float: left;
}
.goodPrice{
    margin-right: 5px;
    width: 110px;
    font-size: 25px;
    color: #FF9900;
    float: right;
    height: 28px;
    line-height: 36px;
    text-align: right;
}
.goodPic{
    height:100px;
    width:100px;
}
.pagination{
    position:absolute;
    bottom:20px;
    width:100%;
}
</style>

<script>
import { ElMessage } from 'element-plus'
import '@/assets/fonts/font.css'
export default {
    components:{
        
    },
    data(){
        return{
            keyWord:'',
            campus: '全部校区',
            campusOptions: [
                '全部校区',
                '四平校区',
                '嘉定校区',
                '沪北校区',
                '沪西校区',
            ],
            goodType:'全部类型',
            goodTypeOptions:[
                "全部类型",
                "图书音像",
                "电子产品",
                "美妆个护",
                "运动户外",
                "生活电器",
                "其他",
            ],
            timeLimit: '全部时间',
            timeLimitOptions:[
                '全部时间',
                '一天内',
                '七天内',
                '十五天内',
                '三十天内',
                '半年内',
            ],
            sortType: "默认排序",
            sortTypeOptions:[
                "时间顺序",
                "时间逆序",
                "价格升序",
                "价格降序",
            ],
            minPrice: 0,
            maxPrice: 1000,
            searchedGoods:[{
                    id: 0,
                    images: [("/src/assets/physics.png"), ("/src/assets/ipad.png"), ("/src/assets/pen.png")],
                    title: "挥泪大甩卖，清仓特惠，快来抢购吧1",
                    price: 200,
                    seller: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
                    sellerId: 0,
                    campus: "四平校区",
                    goodType: "图书音像",
                    time: "2021-10-05 20:41",
                },{
                    id: 0,
                    images: [("/src/assets/physics.png"), ("/src/assets/ipad.png"), ("/src/assets/pen.png")],
                    title: "挥泪大甩卖，清仓特惠，快来抢购吧2",
                    price: 201,
                    seller: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
                    sellerId: 0,
                    campus: "四平校区",
                    goodType: "图书音像",
                    time: "2021-12-25 20:42",
                },{
                    id: 0,
                    images: [("/src/assets/physics.png"), ("/src/assets/ipad.png"), ("/src/assets/pen.png")],
                    title: "挥泪大甩卖，清仓特惠，快来抢购吧3",
                    price: 202,
                    seller: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
                    sellerId: 0,
                    campus: "四平校区",
                    goodType: "图书音像",
                    time: "2022-01-02 20:43",
                },{
                    id: 0,
                    images: [("/src/assets/physics.png"), ("/src/assets/ipad.png"), ("/src/assets/pen.png")],
                    title: "挥泪大甩卖，清仓特惠，快来抢购吧4",
                    price: 203,
                    seller: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
                    sellerId: 0,
                    campus: "四平校区",
                    goodType: "图书音像",
                    time: "2022-01-07 20:30",
                },
            ],
            pageSize: 20,
            currentPage: 1,
        }
    },
    methods:{
        searchKeyWord(){
            if(this.keyWord!=''){
                this.$router.push({
                    path:'/result',
                    query:{
                        name:this.keyWord,
                    },
            });
            }else{
                ElMessage.error('亲,请输入关键字哦');
            }
        },
        jumpGood(itemID){
            this.$router.push({
                path:'/details',
                query:{
                    gid:itemID,
                }
            })
        },
        jumpInfo(infoID){
            this.$router.push({
                path:'/info',
                query:{
                    id:infoID,
                }
            })
        },
        sortTypeChange(type){
            console.log(type);
            switch(type){
                case '时间顺序':
                    this.searchedGoods.sort((a, b)=>{return a.time < b.time ? -1 : 1;});
                    break;
                case '时间逆序':
                    this.searchedGoods.sort((a, b)=>{return a.time > b.time ? -1 : 1;});
                    break;
                case '价格升序':
                    this.searchedGoods.sort((a, b)=>{return a.price - b.price});
                    break;
                case '价格降序':
                    this.searchedGoods.sort((a, b)=>{return b.price - a.price});
                    break;
            }
        },
    },
    computed:{
        selectGoodList: function(){
            var goods = new Array();
            this.searchedGoods.forEach((good)=>{
                if(this.campus != "全部校区" && this.campus != good.campus)
                    return;
                if(this.goodType != "全部类型" && this.goodType != good.goodType)
                    return;
                if(this.minPrice > good.price || this.maxPrice < good.price)
                    return;
                if(this.timeLimit != "全部时间"){
                    var cur = new Date();
                    var date = new Date(good.time);
                    var differDay = Math.abs(cur-date)/1000/60/60/24;
                    if(this.timeLimit == '一天内' && differDay > 1)
                        return;
                    else if(this.timeLimit == '七天内' && differDay > 7)
                        return;
                    else if(this.timeLimit == '十五天内' && differDay > 15)
                        return;
                    else if(this.timeLimit == '三十天内' && differDay > 30)
                        return;
                    else if(this.timeLimit == '半年内' && differDay > 182)
                        return;
                }
                goods.push(good);
            })
            return goods;
        },
        selectGoods: function(){
            var end = this.currentPage * this.pageSize;
            var begin = end - this.pageSize;
            return this.selectGoodList.slice(begin,end);
        },
    },
}
</script>