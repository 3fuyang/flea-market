<script lang="ts" setup>
import { NIcon } from 'naive-ui'

</script>

<template>
  <div class="title-wrapper">
    <div class="page-title">
      <n-icon
        :size="50">
        <slot name="icon"></slot>
      </n-icon>
      <div class="title-text">
        <p
          class="main-title"
          depth="3">
          <slot name="main-title"></slot>
        </p>
        <p
          class="sub-title">
          <slot name="sub-title"></slot>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

.title-wrapper {
  display: flex;
  justify-content: center;
  margin: 1.15em 0;
}

.page-title {
  display: flex;
  gap: .5em;
}

.title-text {
  display: flex;
  flex-direction: column;
}

.main-title {
  margin: 0;
  letter-spacing: 2px;
  font-size: 1.1rem;
}

.sub-title {
  margin: 0;
  letter-spacing: 1px;
}
</style>