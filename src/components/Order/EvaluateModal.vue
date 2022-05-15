<template>
<Transition name="modal">
  <div v-if="show" class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <span class="modal-title">
          订单评价
        </span>
        <br/>
        <span class="rate-wrapper">
          <el-rate
            v-model="grade"
            :texts="['oops', 'disappointed', 'normal', 'good', 'great']"
            show-score
            size="large"
            :disabled="submitted"
          >
          </el-rate>
        </span>
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

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUpdate } from 'vue'
import { useMessage } from 'naive-ui'
import axios from 'axios'

const message = useMessage()

const props = defineProps({
  show: Boolean,  // 是否显示对话框
  currOrderId: String,  // 当前订单 ID
  currOrderStatus: String, // 当前订单状态
})
const emits = defineEmits<{
  (e: 'close'): void
  (e: 'order-done', oid: string): void
}>()

const grade = ref(null) // 评分
const evaluation = ref('') // 评价文本

const submitted = computed(()=>{
  return props.currOrderStatus === '已完成' ? true : false
})  // 是否已提交过评价

// 每次渲染时，重新计算星级和 textarea 的文本值
onMounted(()=>{
  if(submitted.value){
    // 调用接口：传入(订单ID) 返回（评价文本）
    axios.get(`/api/getOrderEvaulation/${props.currOrderId}`)
      .then(res => {
        evaluation.value = res.data[0].review
        grade.value = res.data[0].rate
      })
  }else{
    evaluation.value = ''
  }
})

onBeforeUpdate(()=>{
  if(submitted.value){
    // 调用接口：传入(订单ID) 返回（评价文本，评价星级）
    axios.get(`/api/getOrderEvaluation/${props.currOrderId}`)
      .then(res => {
        evaluation.value = res.data[0].review
        grade.value = res.data[0].rate
      })
  }else{
    evaluation.value = ''
    grade.value = null
  }  
})

// 提交评价
function submitEvaluation(){
  if (evaluation.value === '') {
    message.error('请输入您的评价！')
  }
  else if (grade.value === null) {
    message.error('请为本次交易评分(0~5)！')    
  }
  else {
    let date = new Date()
    date.setHours(date.getHours() + 8)
    let data = {
      orderID: props.currOrderId,
      review: evaluation.value,
      grade: grade.value,
      time: date.toISOString().slice(0, 19).replace('T', ' ')
    }
    // 调用接口：传入（订单ID，用户评价）返回（无）
    axios.post(`/api/submitEvaluation`, data)
      .then(() => {
        // 触发事件，修改视图中订单状态为'已完成'
        emits('order-done', props.currOrderId as string)
        message.success('谢谢您的评价！')
        emits('close')
      })
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
.rate-wrapper{
  float: left;
}
/* el-rate 的icon和font尺寸 */
.el-rate{
--el-rate-icon-size: 26px !important;
--el-rate-font-size: 20px !important;
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