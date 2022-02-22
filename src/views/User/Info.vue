<template>
    <div class="info">
        <el-card class="baseInfo" @click="changeBaseInfo">
            <el-avatar :src="avatarPic" :size="100"/>
            <div class="nickName">{{ nickName }}</div>
            <div class="selfIntroduction">{{selfIntroduction}}</div>
            <el-divider/>
            <el-form label-width="75px" class="infoForm">
                <el-form-item>
                    <template #label>
                        <i class="el-icon-school"/>
                        学院:
                    </template>
                    {{academy}}
                </el-form-item>
                <el-form-item>
                    <template #label>
                        <i :class="[gender=='男'?'el-icon-male':'el-icon-female']"/>
                        性别:
                    </template>
                    {{gender}}
                </el-form-item>
                <el-form-item>
                    <template #label>
                        <i class="el-icon-date"/>
                        生日:
                    </template>
                    {{birthday}}
                </el-form-item>
                <el-form-item label="买家分数:">
                    <el-rate v-model="buyerRate" disabled :show-score="buyerCommentList.length" text-color="#ff9900" style="margin-top:10px"/>
                </el-form-item>
                <el-form-item label="卖家分数:">
                    <el-rate v-model="sellerRate" disabled :show-score="sellerCommentList.length" text-color="#ff9900" style="margin-top:10px"/>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="commentInfo">
            <el-tabs v-model="commentSelect">
                <el-tab-pane label="卖家评论" name="sellerComment">
                    <CommentCardList :comments="sellerCommentList"/>
                </el-tab-pane>
                <el-tab-pane label="买家评论" name="buyerComment">
                    <CommentCardList :comments="buyerCommentList"/>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <el-dialog v-model="changeInfoForm"  :before-close="changeInfoClose" width="30%">
            <el-form label-width="75px" class="infoChange">
                <el-form-item label="昵称:">
                    <el-input v-model="nickNameInput" placeholder="设置你的昵称"/>
                </el-form-item>
                <el-form-item label="个性签名:">
                    <el-input v-model="introductionInput" placeholder="设置你的个性签名"/>
                </el-form-item>
                <el-form-item label="生日:">
                    <el-date-picker v-model="birthdayInput" type="date" placeholder="输入你的生日"/>
                </el-form-item>
                <el-form-item label="头像:">
                    <el-upload 
                    v-if="!uploadAvatarUrl.length"
                    ref="avatarUpload" 
                    action="" 
                    list-type="picture-card" 
                    :auto-upload="false" 
                    :show-file-list="false" 
                    :on-change="uploadAvatar"
                    >
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-avatar v-else :src="uploadAvatarUrl" :size="150" @click="reSelectAvatar"/>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="changeInfoClose">取 消</el-button>
                    <el-button type="primary" @click="changeInfoConfirm">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped>
.info {
    width: 1000px;
    margin: 0 auto;
}
.baseInfo{
    margin-top: 10px;
    margin-left: 10px;
    margin-bottom: 10px;
    width: 30%;
    text-align: center;
    padding: 20px 0;
    height: 600px;
    float: left;
}
.commentInfo{
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 30px;
    width: 60%;
    text-align: center;
    padding: 20px 0;
    height: 600px;
    float: left;
}
.nickName {
    margin: 15px 0 10px;
    font-size: 40px;
    font-weight: 800;
    color: #262626;
    font-family: '楷体';
}
.selfIntroduction{
    font-family: 'FZHeiBJW';
    margin-top: 15px;
}
.infoForm{
    padding:5px 20px;
    font-family: 'FZHeiBJW';
}
.infoChange{
    padding:5px 50px;
    font-family: 'FZHeiBJW';
}
</style>

<script>
import '@/assets/fonts/font.css'
import CommentCardList from '@/components/CommentCardList.vue'

export default {
    components:{
        CommentCardList,
    },
    data(){
        return{
            avatarPic: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
            nickName: "催逝员",
            selfIntroduction: "这喝汤，多是一件美事啊。",
            academy: "软件学院",
            gender: "男",
            birthday: "2022-01-06",
            commentSelect: 'sellerComment',
            changeInfoForm: false,
            uploadAvatarUrl: '',
            nickNameInput: '',
            introductionInput: '',
            birthdayInput: '',
            buyerCommentList: [],
            sellerCommentList: [{
                    time: "2022-01-07 09:55",
                    name: "王大队长",
                    rate: 4.6,
                    avatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
                    text: "有人说，有人在饭里下了毒，我们都不敢吃。",
                },{
                    time: "2022-01-07 09:55",
                    rate: 3.6,
                    name: "司令员",
                    avatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
                    text: "我信，我非常相信。你要是没下毒，你就把这碗鸡汤喝了。你看你每天忙里忙完的，多辛苦呀，喝完鸡汤算什么呀，你要是不喝，就说明你真的下毒了。"
                },{
                    time: "2022-01-07 09:55",
                    name: "王大队长",
                    rate: 3.8,
                    avatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
                    text: "有人说，有人在饭里下了毒，我们都不敢吃。",
                },{
                    time: "2022-01-07 09:55",
                    rate: 3.6,
                    name: "司令员",
                    avatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
                    text: "我信，我非常相信。你要是没下毒，你就把这碗鸡汤喝了。你看你每天忙里忙完的，多辛苦呀，喝完鸡汤算什么呀，你要是不喝，就说明你真的下毒了。"
                },{
                    time: "2022-01-07 09:55",
                    name: "王大队长",
                    rate: 3.8,
                    avatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
                    text: "有人说，有人在饭里下了毒，我们都不敢吃。",
                },
            ],
        }
    },
    methods:{
        changeBaseInfo(){
            this.changeInfoForm = true;
            this.uploadAvatarUrl=this.avatarPic;
            this.nickNameInput=this.nickName;
            this.introductionInput=this.selfIntroduction;
            this.birthdayInput=this.birthday;
        },
        changeInfoClose(){
            this.$confirm('退出后信息不会保存，是否确认退出!','提示')
            .then(() => {
                this.changeInfoForm=false;
                this.$message({
                    type: 'info',
                    message: '修改已取消!'
                })    
            })
        },
        changeInfoConfirm(){
            this.$confirm('确认要修改个人信息吗?','提示')
            .then(() => {
                if(!this.nickNameInput.length){
                   this.$message({
                    type: 'error',
                    message: '姓名不可为空!'
                    })
                    return;   
                }
                this.changeInfoForm=false;
                this.avatarPic=this.uploadAvatarUrl;
                this.nickName=this.nickNameInput;
                this.selfIntroduction=this.introductionInput;
                this.birthday=this.birthdayInput;
                this.$message({
                    type: 'success',
                    message: '个人信息已修改!'
                })    
            })
        },
        uploadAvatar(file){
            this.uploadAvatarUrl = URL.createObjectURL(file.raw);
        },
        reSelectAvatar(){
            this.uploadAvatarUrl='';
        }
    },
    computed:{
        buyerRate: function(){
            var totalRate=0;
            this.buyerCommentList.forEach((comment)=>{
                totalRate += comment.rate;
            })
            return Number((totalRate / this.buyerCommentList.length).toFixed(1));
        },
        sellerRate: function(){
            var totalRate=0;
            this.sellerCommentList.forEach((comment)=>{
                totalRate += comment.rate;
            })
            return Number((totalRate / this.sellerCommentList.length).toFixed(1));
        },
    }
}
</script>