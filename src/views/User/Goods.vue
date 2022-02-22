<template>
<div class="goods">
	<el-tabs type="border-card" stretch>
        <el-tab-pane label="销售中">
            <GoodCardList :hasSaled="false"/>
        </el-tab-pane>
        <el-tab-pane label="卖掉的">
            <GoodCardList :hasSaled="true"/>
        </el-tab-pane>
        <el-tab-pane label="上架商品">
            <GoodInfo/>
        </el-tab-pane>
    </el-tabs>
</div>
</template>

<style scoped>
::v-deep .el-tabs__nav-scroll{
	width:20%;
	margin:0 auto
}
</style>

<script>
import GoodCardList from '@/components/GoodCardList.vue'
import GoodInfo from '@/components/GoodInfo.vue'
export default {
    components:{
        GoodCardList,
        GoodInfo
    },
    data(){
        return{

        }
    },
    methods:{

    },
}
</script>