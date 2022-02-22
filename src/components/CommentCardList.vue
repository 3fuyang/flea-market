<template>
<div class="commentCardList">
    <div v-if="comments.length">
        <el-card v-for="(comment,index) in selectComments" :key="index" class="commentCard" :body-style="{ padding: '0px' }">
            <div class="time">
                {{comment.time}}
            </div>
            <div class="commentCotent">
                <div class="commentatorInfo"> 
                    <div class="commentAvatar">
                        <el-avatar :src="comment.avatar" :size="50"/>
                    </div>
                        {{comment.name}}
                </div>
                <div class="commentText">
                    <el-scrollbar>
                        {{comment.text}}
                    </el-scrollbar>
                </div>
                <div class="commentStar">
                    <div style="width:30%;float:left;">评分:</div>
                    <el-rate v-model="comment.rate" disabled :show-score="comment.length" text-color="#ff9900" style="width:60%;float:left"/>
                </div>
            </div>
        </el-card>
        <div class="pagination">
            <el-pagination :page-size="pageSize" layout="prev, pager, next" :total="comments.length" v-model:currentPage="currentPage"></el-pagination>
        </div>
    </div>
    <el-empty description="暂时还没有评论。" v-else/>
</div>
</template>

<style scoped>
.commentCardList{
    width:400px;
    height:500px;
    margin: 0 auto;
    position:relative;
}
.pagination{
    position:absolute;
    bottom:10px;
    width:100%;
}
.commentCard{
    margin-top: 30px;
    height: 120px;
    font-family: 'FZHeiBJW';
    padding: 0px;
}
.time{
    font-family: '楷体';
    margin-top: 5px;
    height: 20px;
}
.commentContent{
    width: 360px;
}
.commentAvatar{
    height: 60px;
}
.commentatorInfo{
    width: 25%;
    float: left;
}
.commentText{
    width: 60%;
    float:right;
    margin-right: 50px;
    margin-top: 15px;
    height: 45px;
}
.commentStar{
    width: 60%;
    float:left;
    margin-top: 10px;
}
</style>

<script>
import '@/assets/fonts/font.css'

export default {
    props: {
        comments: {},
    },
    components:{
        
    },
    data(){
        return{
            pageSize: 3,
            currentPage: 1,
        }
    },
    methods:{

    },
    computed:{
        selectComments: function(){
            var end = this.currentPage * this.pageSize;
            var begin = end - this.pageSize;
            return this.comments.slice(begin,end);
        },
    }
}
</script>