<template>
<Transition name="modal">
  <div v-if="show" class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <span class="modal-title">
          订单评价
        </span>
        <br/>
        <div class="modal-input">
          <el-input 
            :readonly="submitted"
            v-model.trim="evaluation" 
            placeholder="请输入您的评价。"
            :rows="4"
            maxlength="300"
            show-word-limit
            type="textarea">
          </el-input>
        </div>
        <div class="modal-footer">
          <el-row>
            <el-col :span="12">
              <el-button
                v-if="!submitted"
                @click="submitEvaluation"
                type="primary"
              >提交</el-button>
            </el-col>
            <el-col :span="12">
              <el-button
                v-if="!submitted"
                @click="$emit('close')"
              >取消</el-button>
              <el-button
                v-else
                @click="$emit('close')"
              >关闭</el-button>              
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</Transition>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, onMounted, onBeforeUpdate } from 'vue';
import { ElMessage } from 'element-plus';
const props = defineProps({
  show: Boolean,  // 是否显示对话框
  currOrderId: String,  // 当前订单 ID
  currOrderStatus: String, // 当前订单状态
});
const emits = defineEmits(['close']);

const evaluation = ref(''); // 评价文本
const submitted = computed(()=>{
  return props.currOrderStatus === '已完成'?true:false;
})  // 是否已提交过评价

// 每次渲染时，重新计算 textarea 的文本值
onMounted(()=>{
  console.log(submitted.value);
  if(submitted.value){
    // 调用接口：传入(订单ID) 返回（评价文本）
    evaluation.value = '已提交的评价';
  }else{
    evaluation.value = '';
  }
})

onBeforeUpdate(()=>{
  if(submitted.value){
    // 调用接口：传入(订单ID) 返回（评价文本）
    evaluation.value = '已提交的评价';
  }else{
    evaluation.value = '';
  }  
})

// 提交评价
function submitEvaluation(){
  if(evaluation.value === ''){
    ElMessage({
      type: 'error',
      message: '请输入您的评价！'
    })
  }else{
    // 调用接口：传入（订单ID，用户评价）返回（无）

    ElMessage({
      type: 'success',
      message: '谢谢您的评价！'
    });
    emits('close');
  }
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(204, 199, 199, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
  border-radius: 5px;
}
.modal-container {
  width: 400px;
  margin: 0px auto;
  padding: 5px 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}
.modal-title{
  display: inline-box;
  margin-bottom: 10px;
  float: left;
  font-size: 22px;
  font-weight: bold;
}
.modal-input{
  margin-bottom: 15px;
}
.modal-footer{
  margin-bottom: 10px;
}
/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */
.modal-enter-from {
  opacity: 0;
}
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>