<template>
<div class="GoodInfo">
	<el-steps :space="200" :active="active" process-status="finish" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="简介和图片"></el-step>
        <el-step title="交易信息"></el-step>
        <el-step title="内容审核"></el-step>
    </el-steps>
    <el-card class="contentCard">
        <div v-if="active==0">
            <div>
                标题:
                <el-input v-model="titleInput" placeholder="为你的商品起一个响亮的标题" class="titleInput"/>
            </div>
            <div>
                商品类型:     
                <el-select v-model="goodType" placeholder="选择商品类型" size="large" class="typeSelect">
                    <el-option v-for="item in typeOptions" :key="item" :label="item" :value="item"/>
                </el-select>
            </div>
            <div>
                商品名称:
                <el-input v-model="nameInput" placeholder="你想出售的商品是什么" class="nameInput"/>
            </div>
            <div>
                关键词:     
                <el-input v-model="keywordsInput" placeholder="输入搜索关键词，用分号分隔" class="keywordsInput"/>
            </div>
            <div>
                校区:     
                <el-select v-model="campus" placeholder="选择发布校区" size="large" class="campusSelect">
                    <el-option v-for="item in campusOptions" :key="item" :label="item" :value="item"/>
                </el-select>
            </div>
        </div>
        <div v-if="active==1">
            <div>
                <div style="width:50px;">简介:</div>
                <el-input v-model="introductionInput" placeholder="快来简单介绍一下你的商品吧" type="textarea" autosize class="introductionInput"/>
            </div>
            <div>
                <div style="width:50px;margin-top:20px">图片:</div>
                <el-upload
                    ref="picList"
                    action=""
                    list-type="picture-card"
                    :auto-upload="false"
                    :on-preview="handlePictureCardPreview"
                    :on-exceed="handleExceed"
                    :limit="5"
                >
                    <i class="el-icon-plus"></i>
                    <template #tip>
                        <div class="el-upload__tip">jpg/png files with a size less than 500kb</div>
                    </template>
                </el-upload>
                <el-dialog v-model="picPreview">
                    <img  width="600" :src="previewUrl" alt="" />
                </el-dialog>
            </div>
        </div>
        <div v-if="active==2">
            <div>
                价格:
                <el-input-number v-model="priceInput" :min="0" class="priceInput"/>
            </div>
            <div>
                交易地址:     
                <el-input v-model="locationInput" placeholder="若不输入，则由买家决定地址。" class="locationInput"/>
            </div>
            <div v-if="locationInput.length">
                <div class="locationDescriptionTitle">地址说明:</div>
                <el-input v-model="locationDescriptionInput" placeholder="详细介绍地址的信息" type="textarea" autosize class="locationDescriptionInput"/>
            </div>
            <div>
                <div class="timeDescriptionTitle">时间说明:</div>
                <el-input v-model="timeDescriptionInput" placeholder="详细说明你对于交易时间的要求" type="textarea" autosize class="timeDescriptionInput"/>
            </div>
        </div>
        <div v-if="active==3">
            <el-result
                icon="success"
                title="审核成功"
                sub-title="点击发布按钮就可以完成上架了！"
            />
        </div>
    </el-card>
    <div v-if="active < 4" class="controlButton">
        <el-button @click="preStep" type="primary">上一步</el-button>
        <el-button @click="nextStep" type="primary">{{buttonInfo}}</el-button>
    </div>
</div>
</template>

<style scoped>
.GoodInfo{
    width: 500px;
    min-height: 400px;
    margin: 0 auto;
    position: relative;
}
.contentCard{
    font-family: 'FZHeiBJW';
    margin-top: 20px;
    margin-bottom: 10px;
}
.titleInput{
    width: 300px;
    margin-left:10px;
    margin-top: 16px;
}
.nameInput{
    width: 200px;
    margin-left:10px;
    margin-top: 16px;
    margin-right:132px;
}
.typeSelect{
    width:150px;
    margin-left:10px;
    margin-right:182px;
    margin-top: 20px;
}
.keywordsInput{
    width:300px;
    margin-left:10px;
    margin-right:16px;
    margin-top: 20px;
}
.campusSelect{
    width:150px;
    margin-left:10px;
    margin-right:150px;
    margin-top: 20px;
}
.introductionInput {
    width: 300px;
    margin-left:10px;
    margin-top: 16px;
}
.priceInput{
    width:150px;
    margin-left:10px;
    margin-right:150px;
    margin-top: 20px;
}
.locationInput{
    width:300px;
    margin-left:10px;
    margin-right:32px;
    margin-top: 20px;
}
.locationDescriptionTitle{
    width:100px;
    margin-left:6px;
    margin-top: 20px;
}
.locationDescriptionInput{
    width: 300px;
    margin-left:50px;
}
.timeDescriptionTitle{
    width:100px;
    margin-left:6px;
    margin-top: 20px;
}
.timeDescriptionInput{
    width: 300px;
    margin-left:50px;
}
</style>

<script>
import '@/assets/fonts/font.css'
import { ElMessage } from 'element-plus'

export default {
    components:{
        
    },
    data(){
        return{
            active: 0,
            titleInput: "",
            nameInput: "",
            keywordsInput: "",
            introductionInput: "",
            goodType: "",
            campus: "",
            typeOptions: [
                "图书音像",
                "电子产品",
                "美妆个护",
                "运动户外",
                "生活电器",
                "其他"
            ],
            campusOptions: [
                "四平路校区",
                "嘉定校区",
                "沪西校区",
                "沪北校区"
            ],
            previewUrl: '',
            picPreview: false,
            priceInput: 0,
            locationInput: '',
            locationDescriptionInput: '',
            timeDescriptionInput: '',
            imgaes: [],
        }
    },
    methods:{
        preStep(){
            if(this.active > 0)
                --this.active;
        },
        nextStep(){
            switch(this.active)
            {
            case 0:
                if(this.titleInput=="")
                    ElMessage.error('标题不可为空!');
                else if(this.goodType=="")
                    ElMessage.error('商品类型不可为空!');
                else if(this.nameInput=="")
                    ElMessage.error('商品名称不可为空');
                else if(this.keywordsInput=="")
                    ElMessage.error('关键词不可为空!');
                else if(this.campus=="")
                    ElMessage.error('校区不可为空!');
                else
                    ++this.active;
                break;
            case 1:
                if(this.introductionInput == "")
                    ElMessage.error('商品简介不可为空!');
                else{
                    this.images=this.$refs.picList.uploadFiles;
                    ++this.active;
                }
                break;
            case 2:
                ++this.active;
                break;
            case 3:
                this.$confirm('确认要上架商品吗？','提示')
                .then(() => {
                    this.$message({
                        type: 'success',
                        message: '上架成功'
                    })
                    console.log(URL.createObjectURL(this.images[0]));
                    //location.reload();
                })
                .catch(() => {});
            }
        },
        handlePictureCardPreview(file) {
            //图片信息
            this.previewUrl = URL.createObjectURL(file.raw);
            this.picPreview = true;
        },
        handleExceed(){
            ElMessage.error('最多上传5张图片!');
        }
    },
    computed:{
        buttonInfo: function(){
            return this.active < 3 ? "下一步" : "发布";
        },
        timeChanged: function(){
            if(this.timeInput[0].getHours() != 0 || this.timeInput[0].getMinutes() != 0)
                return true;
            if(this.timeInput[1].getHours() != 23 || this.timeInput[1].getMinutes() != 59)
                return true;
            return false;
        },
    },
}
</script>