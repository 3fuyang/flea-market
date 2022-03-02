<template>
<Transition name="modal">
  <div v-if="show" class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <span class="modal-title">
          举报
        </span>
        <br/>
        <div class="modal-input">
          <el-input 
            v-model.trim="reasonView" 
            placeholder="请输入举报理由。"
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
                @click="reportOrder"
                type="primary"
              >确定</el-button>
            </el-col>
            <el-col :span="12">
              <el-button
                @click="$emit('close')"
              >取消</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</Transition>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { ElMessage } from 'element-plus';
defineProps({
  show: Boolean,  // 是否显示对话框
  currOrderId: String,  // 当前订单 ID
});
const emits = defineEmits(['close']);

let reasonView = ref(''); // 举报理由

function reportOrder(){
  if(reasonView.value === ''){
    ElMessage({
      type: 'error',
      message: '请输入举报理由！'
    })
  }else{
    // 调用接口：传入（订单ID，举报理由）

    ElMessage({
      type: 'success',
      message: '举报成功，敬请等待管理员回复！'
    });
    // 注意这里用defineEmits返回的emits在脚本中发出事件的方法！
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