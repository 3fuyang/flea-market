<script lang="ts" setup>

// 点击更新doodle
function update(e: Event) {
  (e.target as any).update()
}
</script>

<template>
  <css-doodle class="base-doodle" @click="update">
    :doodle {
    @grid: 7 / 100%;
    }
    width: 5em;
    height: 5em;
    @shape: clover 5;
    will-change: transform;
    transition: .2s @r(.6s);
    background: hsla(calc(360 - @i * 4), 70%, 68%, @r.8);
    transform: scale(@r(.2, 1.5)) translate(@m2.@r(-50%, +50%));
  </css-doodle>
</template>

<style scoped lang="scss">
.base-doodle {
  cursor: pointer;
}
</style>