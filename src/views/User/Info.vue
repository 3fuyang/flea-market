<template>
  <div class="info">
    <el-row justify="center">
      <info-panel v-if="identity === 'member'" :userID="userID"/>
      <comment-list v-if="identity === 'member'" :userID="userID"/>
    </el-row>
  </div>  
</template>

<script setup lang="ts">
import InfoPanel from '../../components/UserInfo/InfoPanel.vue'
import CommentList from '../../components/UserInfo/CommentList.vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

// store
const userStore = useUserStore()
const { userID, identity } = storeToRefs(userStore)
</script>

<style scoped>
.info {
  width: 65vw;
  margin: 0 auto;
}
</style>