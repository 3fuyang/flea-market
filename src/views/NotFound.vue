<script lang="ts" setup>
import { NEmpty, NButton } from 'naive-ui'
import { Airplane } from '@vicons/ionicons5'

</script>

<template>
  <div class="empty-wrapper">
    <n-empty size="huge">
      <template #icon>
        <airplane />
      </template>
      哼，想逃?
      <span class="del">
        (指路由)
      </span>
      <template #extra>
        <n-button @click="$router.push('/home')">
          重返嘉园
        </n-button>
      </template>
    </n-empty>
  </div>
</template>

<style scoped>
.empty-wrapper {
  width: 100%;
  height: 34em;
  font-size: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.del {
  text-decoration: line-through;
}
</style>