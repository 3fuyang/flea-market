<template>
  <div class="info">
    <el-row justify="center">
      <info-panel :userID="userID"/>
      <comment-list :userID="userID"/>
    </el-row>
  </div>  
</template>

<script setup>
import { onMounted, ref } from 'vue'
import InfoPanel from '../../components/UserInfo/InfoPanel.vue'
import CommentList from '../../components/UserInfo/CommentList.vue'
const userID = ref('')
onMounted(() => {
  userID.value = window.sessionStorage.getItem('uid')
})
</script>

<style scoped>
.info {
  width: 65vw;
  margin: 0 auto;
}
</style>