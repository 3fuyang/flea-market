<template>
  <div class="info">
    <el-row justify="center">
      <info-panel v-if="(userID as string).length > 0" :userID="(userID as string)"/>
      <comment-list v-if="(userID as string).length > 0" :userID="(userID as string)"/>
    </el-row>
  </div>  
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InfoPanel from '../../components/UserInfo/InfoPanel.vue'
import CommentList from '../../components/UserInfo/CommentList.vue'
const userID = ref(window.sessionStorage.getItem('uid'))
</script>

<style scoped>
.info {
  width: 65vw;
  margin: 0 auto;
}
</style>