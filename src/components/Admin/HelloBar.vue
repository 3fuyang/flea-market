<template>
  <section class="hello-bar">
    <n-avatar class="avatar" :size="70" :src="'https://naive-ui-admin.vercel.app/assets/schoolboy.9f04cdf7.png'" />
    <section class="txt-box">
      <p class="hello-text">
        早安，{{ props.adminName }}，开始您一天的工作吧！
      </p>
      <p class="quote">知者反失。</p>
    </section>
    <section class="jobs">
      <p class="job-label">待办</p>
      <p class="job-num">{{ remainedNum }}/{{ props.taskNum }}</p>
    </section>
    <section class="jobs">
      <p class="job-label">消息</p>
      <p class="job-num">22</p>
    </section>
    <section class="jobs">
      <p class="job-label">项目数</p>
      <p class="job-num">22</p>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NAvatar } from 'naive-ui'

const props = defineProps<{
  adminName: string
  completedNum: number
  taskNum: number
}>()

// 剩余待办数量
const remainedNum = computed(() => (props.taskNum as number) - (props.completedNum as number))

</script>

<style scoped>
.hello-bar {
  background-color: #fff;
  display: flex;
  padding: 1em;
  font-size: 1.1rem;
  margin: 1.2em 0;
  border-radius: .3em;
  width: 60vw;
  align-items: center;
  box-sizing: border-box;
}

.avatar {
  object-fit: contain;
  background-color: #fff;
}

.txt-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-left: 1rem;
}

.hello-text {
  margin: 0;
  font-size: 1.2rem;
  overflow: auto;
}

.quote {
  color: silver;
  font-size: .9rem;
  float: left;
  overflow: auto;
  margin: 0;
  margin-top: .5em;
}

.jobs {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
}

.job-label {
  margin: 0;
  margin-bottom: .5em;
  font-size: .9rem;
}

.job-num {
  margin: 0;
  font-size: 1.4rem;
}
</style>