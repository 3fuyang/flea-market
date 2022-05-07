<script lang="ts" setup>
import 'css-doodle'

// 点击更新doodle
function update (e: Event) {
  (e.target as any).update()
}
</script>

<template>
  <css-doodle
    class="base-doodle"
    @click="update">
    :doodle {
      @grid: 8 / 90%;
    }
    opacity: @r(.1, .9);
    transition: .2s @r(.6s);
    border-radius: @pick(100% 0, 0 100%);    
    width: 4em;
    height: 4em;
    will-change: transform;
    transform: scale(@r(.5, 1.3));

    background: hsla(
      calc(240 - 6 * @x * @y),
      70%, 68%, @r.8
    );    
  </css-doodle>
</template>

<style scoped lang="scss">
.base-doodle {
  cursor: pointer;
}
</style>