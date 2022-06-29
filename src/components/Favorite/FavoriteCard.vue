<script lang="ts" setup>
import { NCard, NImage, NEllipsis } from 'naive-ui'
import { toRefs, type CSSProperties } from 'vue'

const props = defineProps<{
  goodID: string | number
  src: string
  title: string
  price: number | string
  removable: boolean
}>()

const { src } = toRefs(props)

const contentStyle: CSSProperties = {
  padding: 0,
  display: 'flex',
  flexDirection: 'column'
}
</script>

<template>
  <n-card class="good-card" :content-style="contentStyle" hoverble>
    <n-image class="image" width="220" height="200" object-fit="scale-down" alt="Good Image" :src="src" @click="$router.push({
      path: '/details',
      query: {
        gid: props.goodID
      }
    })" />
    <div class="title">
      <n-ellipsis>
        {{ props.title }}
      </n-ellipsis>
    </div>
    <div class="price">
      ￥{{ props.price }}
    </div>
  </n-card>
</template>

<style scoped lang="scss">
$gery: #808080;
$orange: #F90;

.good-card {
  width: 13.75rem;
}

.image {
  cursor: pointer;
}

.title {
  width: 100%;
  overflow: hidden;
  margin: .2em 0;
  font-size: .8rem;
  color: $gery;
}

.price {
  text-align: center;
  font-size: 1.125rem;
  color: $orange;
}
</style>