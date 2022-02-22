<template>
<div class="order">
	<el-tabs type="border-card" stretch>
        <el-tab-pane label="购买订单">
            <OrderCardList :isCustomer="true"/>
        </el-tab-pane>
        <el-tab-pane label="销售订单">
            <OrderCardList :isCustomer="false"/>
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
import OrderCardList from '@/components/OrderCardList.vue'

export default {
    components:{
        OrderCardList
    },
    data(){
        return{

        }
    },
    methods:{

    },
}
</script>