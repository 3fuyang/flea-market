<template>
  <div class="root-wrapper">
    <div class="list-wrapper">
      <el-empty v-if="goodsListView.length === 0" description="好像什么都看不到，只能说很神秘。" />
      <div v-for="good of goodsListView" :key="good.id" class="good-card">
        <el-row>
          <el-col :span="6">
            <el-image class="image point" :src="good.image" @click="jumpToDetail(good.id)"></el-image>
          </el-col>
          <el-col :span="12">
            <span class="name">
              <n-ellipsis>&nbsp;&nbsp;{{ good.name }}</n-ellipsis>
            </span>
            <br />
            <el-row>
              <el-col :span="12">
                <span class="key">浏览数</span><br />
                <el-row>
                  <el-col :span="12">
                    <Avatar class="icon" />
                  </el-col>
                  <el-col :span="12">
                    <span class="num">{{ good.browsed }}</span>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="12">
                <span class="key">收藏数</span><br />
                <el-row>
                  <el-col :span="12">
                    <StarFilled class="icon star" />
                  </el-col>
                  <el-col :span="12">
                    <span class="num">{{ good.likes }}</span>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <span class="price">￥{{ good.price }}</span><br />
            <div class="options-wrapper">
              <el-button plain color="#0099CC" class="button" @click="$emit('check-info', good.id)">查看详情</el-button>
              <br />
              <el-tooltip v-if="goodsStatus === 'soldOut'" content="已售出的商品不能被下架。" placement="right" effect="light">
                <el-button plain color="#626aef" class="button">
                  下架商品
                </el-button>
              </el-tooltip>
              <el-button v-else plain color="#626aef" class="button" @click="pullOffGood(good.id)">下架商品</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { StarFilled, Avatar } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { NEllipsis, useMessage, useDialog } from 'naive-ui'
import axios from 'axios'

const message = useMessage()
const dialog = useDialog()

const router = useRouter()

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
  price: string
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
          id: item.good_id,
          name: item.title,
          price: Number.parseFloat(item.price).toFixed(2),
          browsed: item.browsed,
          likes: item.likes,
          image: `http://106.15.78.201:8082/public/images/${item.images.split(';')[0]}`
        })
      })
    })
} else if (props.goodsStatus === 'soldOut') {
  // 调用接口：传入（用户ID） 返回（已售出商品列表）
  axios.get(`/api/soldGoods/${props.userId}`)
    .then((res) => {
      res.data.forEach((item: any) => {
        goodsListView.value.push({
          id: item.good_id,
          name: item.title,
          price: Number.parseFloat(item.price).toFixed(2),
          browsed: item.browsed,
          likes: item.likes,
          image: `http://106.15.78.201:8082/public/images/${item.images.split(';')[0]}`
        })
      })
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

<style scoped>
.point {
  cursor: pointer;
}

.list-wrapper {
  margin: 20px 15px;
}

.good-card {
  height: 144px;
  border-radius: 5px;
  border: 1px solid #eee;
  background-color: #fafafa;
  margin: 20px 10px;
  box-shadow: 1px 1px 1px rgba(27, 27, 27, 0.22);
}

.good-card:hover {
  box-shadow: 1px 1px 2px rgba(97, 97, 97, 0.575);
}

.image {
  float: left;
  margin: 10px 0px 10px 15px;
  height: 120px;
  width: auto;
  border: 2px solid #E0E0E0;
  alt: 'Goods Thumbnail';
}

.image:hover {
  border: 2px solid #CCCCCC;
}

.name {
  font-size: 14px;
  display: inline-block;
  color: #999999;
  margin: 20px 0px 15px 0px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.key {
  display: inline-block;
  font-size: 16px;
  color: #777777;
  font-weight: 600;
  margin-bottom: 10px;
}

.icon {
  margin-top: 3px;
  float: right;
  width: 40px;
  height: 40px;
  color: #999999;
}

.num {
  line-height: 52px;
  float: left;
  margin-left: 5px;
  font-size: 25px;
  font-weight: bold;
  color: #999999;
}

.star {
  color: orange;
}

.price {
  margin-top: 15px;
  display: inline-block;
  font-size: 20px;
  font-weight: bold;
  color: #FF9900;
}

.options-wrapper {
  height: 100px;
}

.button {
  margin: 10px 0px;
}
</style>