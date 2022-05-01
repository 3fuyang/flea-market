<template>
<div class="handleReports">
    <el-card>
        <div class="title">
            剩余{{num}}条
        </div>
        <el-divider/>
        <el-form label-width="120px">
            <el-form-item label="举报用户:">
                {{reporter}}
            </el-form-item>
            <el-form-item label="被举报用户:">
                {{reported}}
            </el-form-item>
            <el-form-item label="举报原因:">
                {{reason}}
            </el-form-item>
            <el-form-item label="处理结果:">
                <el-input v-model="result" type="textarea" autosize class="timeDescriptionInput"/>
            </el-form-item>
            <el-form-item>
                <el-button type="info" @click="blockUser">封禁用户</el-button>
                <el-button type="primary" @click="submit">提交</el-button>
            </el-form-item>
        </el-form>
        <el-dialog v-model="isBlockUser">
            <el-form>
            <el-form-item label="封禁天数">
                <el-input-number v-model="days"/>
            </el-form-item>
            <el-form-item label="封禁原因">
                <el-input v-model="blockReason" type="textarea" autosize class="timeDescriptionInput"/>
            </el-form-item>
            <el-form-item>
                <el-button type="danger" @click="cancel">取消</el-button>
                <el-button type="primary" @click="confirm">确认</el-button>
            </el-form-item>
            </el-form>
        </el-dialog>
    </el-card>
</div>
</template>

<style scoped>
.title{
    font-size: 27px;
    font-weight: 800;
    color: #262626;
    font-family: '楷体';
    padding: 0 20;
}
.handleReports{
    margin: 20px auto;
    width: 400px;
}
</style>

<script>

export default {
    components:{
        
    },
    data(){
        return{
            num: 5,
            reporter: 1952218,
            reported: 1950001,
            reason: "这个人出售假冒伪劣产品，可谓是可恶至极！",
            result: "",
            isBlockUser: false,
            days:0,
            blockReason:'',
        }
    },
    methods:{
        blockUser(){
            this.isBlockUser=true;
        },
        confirm(){
            this.$confirm('确认要封禁该用户吗？','提示')
                .then(() => {
                    this.isBlockUser=false;
                    this.$message({
                        type: 'success',
                        message: '封禁成功'
                    })
                })
                .catch(() => {});
        },
        cancel(){
            this.isBlockUser=false;
        },
        submit(){
            this.$confirm('确认提交审理结果吗？','提示')
                .then(() => {
                    this.$message({
                        type: 'success',
                        message: '审理成功'
                    })
                    if(this.num > 1){
                        --this.num;
                    }
                })
                .catch(() => {});
        }
    },
}
</script>

<style scoped>

.el-header {
  background-color: #003680;
  color: white;
}

.upheader {
  height: 60px;
}
a:link {
  text-decoration: none;
  color: white;
}

a:visited {
  color: white;
}

.margin1 {
  margin-left: 5%;
}
.logo {
  width: 300px;
  height: 60px;
  font-family: "Microsoft YaHei";
  font-size: 38px;
  text-align: left;
  line-height: 60px;
  text-indent: 1em;
  float: left;
}
#personinfo{
  position: absolute;
  top: 80px;
  right: 30px;
}
#returnLogin{
  position: absolute;
  top: 100px;
  right: 30px;
}

</style>
