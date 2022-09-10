<template>
  <div class="info">
    <el-row justify="center">
      <new-info-panel v-if="identity === 'member'" :userID="userID" />
      <comment-list v-if="identity === 'member'" :userID="userID" />
    </el-row>
  </div>
</template>

<script setup lang="ts">
import CommentList from '../../components/UserInfo/CommentList.vue'
import NewInfoPanel from '@/components/UserInfo/NewInfoPanel.vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

// store
const userStore = useUserStore()
const { userID, identity } = storeToRefs(userStore)
</script>

<style scoped>
.info {
  width: 62.4rem;
  margin: 2em auto;
}
</style>