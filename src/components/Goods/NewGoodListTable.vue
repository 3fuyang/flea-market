<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NSpin, NButton, NPopover, NStatistic, NNumberAnimation, NImage, NIcon, NEmpty, NEllipsis, useMessage, useDialog } from 'naive-ui'
import axios from 'axios'
import { Eye12Regular, GlobeStar16Filled, TagSearch20Regular, Delete20Regular } from '@vicons/fluent'

const message = useMessage()
const dialog = useDialog()

const router = useRouter()

// 异步加载标志
const loading = ref(true)

const props = defineProps({
  userId: String,
  goodsStatus: String,
})

defineEmits<{
  (e: 'check-info', gid: string): void
}>()

// 商品信息类型
interface GoodInfo {
  id: string
  name: string
  price: number
  browsed: number
  likes: number
  image: string
}
// 商品视图
const goodsListView = ref<GoodInfo[]>([])

// 根据 props 中的商品状态，调用不同的接口
if (props.goodsStatus === 'onShelf') {
  // 调用接口：传入（用户ID） 返回（上架中商品列表）
  axios.get(`/api/onShelfGoods/${props.userId}`)
    .then((res) => {
      res.data.forEach((item: any) => {
        goodsListView.value.push({
          id: item.goodId,
          name: item.title,
          price: Number.parseFloat(item.price),
          browsed: item.browsed,
          likes: item.likes,
          image: `http://127.0.0.1:8082/public/images/${item.images.split(';')[0]}`
        })

        window.setTimeout(() => {
          loading.value = false
        }, 500)
      })
    })
} else if (props.goodsStatus === 'soldOut') {
  // 调用接口：传入（用户ID） 返回（已售出商品列表）
  axios.get(`/api/soldGoods/${props.userId}`)
    .then((res) => {
      res.data.forEach((item: any) => {
        goodsListView.value.push({
          id: item.goodId,
          name: item.title,
          price: Number.parseFloat(item.price),
          browsed: item.browsed,
          likes: item.likes,
          image: `http://127.0.0.1:8082/public/images/${item.images.split(';')[0]}`
        })
      })

      window.setTimeout(() => {
        loading.value = false
      }, 500)
    })
}

// 点击图片缩略图跳转商品详情页面
function jumpToDetail(goodId: string) {
  router.push({
    path: '/details',
    query: {
      gid: goodId,
    }
  })
}

// 下架商品
function pullOffGood(goodId: string) {
  // 显示确认对话框
  dialog.warning(
    {
      title: '提示',
      content: '您确定要下架该商品吗?系统不会保存该商品的信息。',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        // 调用接口：传入（商品ID）返回（下架结果）

        // 从视图中删除商品
        const copy = goodsListView.value.filter((item) => { return item.id !== goodId })
        goodsListView.value.length = 0
        goodsListView.value.push(...copy)
        message.success('下架成功！(但数据实在太少了，所以并没有删)')
      },
      onNegativeClick: () => {
        // 取消下架
        return false
      }
    }
  )
}
</script>

<template>
  <div class="list-wrapper">
    <!--加载中-->
    <n-spin v-if="loading" stroke="#8ACADA">
      <template #description>
        <span class="spin-text">
          我不知道你有多幸运。
        </span>
      </template>
    </n-spin>

    <!--空内容-->
    <n-empty v-else-if="goodsListView.length === 0" description="好像什么都看不到，只能说很神秘。" />

    <!--商品卡片-->
    <template v-if="!loading">
      <div v-for="good of goodsListView" :key="good.id" class="good-card">

        <!--商品图片-->
        <n-image class="good-image" lazy :src="good.image" @click="jumpToDetail(good.id)" />

        <!--商品简要信息-->
        <div class="mid-info">
          <!--商品标题-->
          <n-ellipsis :delay="500" class="good-name">&nbsp;&nbsp;{{ good.name }}</n-ellipsis>
          <!--浏览数与收藏量-->
          <div class="icon-box">
            <div class="icon-unit">
              <div class="icon-prop">
                <n-popover :delay="200" trigger="hover" placement="bottom">
                  <template #trigger>
                    <n-icon :size="38" color="#6F7C7E">
                      <Eye12Regular />
                    </n-icon>
                  </template>
                  浏览量
                </n-popover>
              </div>
              <n-statistic class="icon-number" tabular-nums>
                <n-number-animation :from="999" :to="good.browsed" />
              </n-statistic>
            </div>
            <div class="icon-unit">
              <div class="icon-prop">
                <n-popover :duration="200" trigger="hover" placement="bottom">
                  <template #trigger>
                    <n-icon :size="38" color="#F9A647">
                      <GlobeStar16Filled />
                    </n-icon>
                  </template>
                  收藏量
                </n-popover>
              </div>
              <n-statistic class="icon-number" tabular-nums>
                <n-number-animation :from="999" :to="good.likes" />
              </n-statistic>
            </div>
          </div>
        </div>

        <!--操作区域-->
        <div class="operation-panel">
          <span class="price">￥{{ good.price.toFixed(2) }}</span>
          <n-button size="small" round color="#105AA0" @click="$emit('check-info', good.id)">
            <template #icon>
              <n-icon>
                <TagSearch20Regular />
              </n-icon>
            </template>
            查看详情
          </n-button>
          <n-button round color="#CAE0E5" size="small" text-color="#00558D" @click="pullOffGood(good.id)">
            <template #icon>
              <n-icon>
                <Delete20Regular />
              </n-icon>
            </template>
            下架商品
          </n-button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.list-wrapper {
  padding: 1.25rem 0;
}

.spin-text {
  color: #8ACADA;
  letter-spacing: 1px;
  animation: .6s in ease-out;
}

@keyframes in {
  from {
    margin-left: -10rem;
  }

  to {
    margin-left: 0;
  }
}

.good-card {
  height: 8rem;
  border-radius: .375rem;
  background-image: linear-gradient(135deg, #ebedee 10%, #fdfbfb 60%, #ebedee 100%);
  padding: .8rem;
  box-sizing: border-box;
  border: .6px solid #D1D5DB;
  display: flex;
  align-items: center;
  transition: all .8s ease-out;

  &:not(:last-child) {
    margin-bottom: 1rem;
  }

  &:hover {
    box-shadow: inset 0 0 3.6rem rgba(17, 17, 26, 0.1);
  }
}

.good-image {
  background: white;
  height: 7.5rem;
  width: 8rem;
  display: flex;
  justify-content: center;
  border: 1px solid #E0E0E0;
  alt: 'Goods Thumbnail';
  transition: border-color .4s ease-out;
  margin-right: .6rem;
  cursor: pointer;

  &:hover {
    border-color: #CCC;
  }
}

.mid-info {
  display: flex;
  flex-direction: column;
  width: 58%;
}

:deep(.good-name) {
  color: #6F7677;
  display: inline-block;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: .2px;
  line-height: 1.5em;
}

.icon-box {
  margin-top: 1.4rem;
  display: flex;
  align-items: center;
  height: 3rem;
  justify-content: space-evenly;
}

.icon-unit {
  display: flex;
  align-items: center;
  width: 25%;
}

.icon-prop {
  display: flex;
  flex-direction: column;
  margin-right: 1rem;
}

:deep(.n-statistic-value__content) {
  font-size: 1.6rem !important;
  color: #6F7C7E !important;
}

.operation-panel {
  display: flex;
  flex: 1;
  flex-direction: column;
  //padding: 0 1.3rem;
  align-items: center;
  height: 100%;

  &> :not(:first-child) {
    margin-top: .8rem;
  }
}

.price {
  color: #F9A647;
  font-size: 1.25rem;
  font-weight: bold;
  letter-spacing: .6px;
  line-height: 1em;
}
</style>