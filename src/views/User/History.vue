<template>
  <div class="root">
    <page-title>
      <template #icon>
        <history20-filled />
      </template>
      <template #main-title>
        浏览记录
      </template>
      <template #sub-title>
        History
      </template>
    </page-title>
    <div style="text-align: right;">
      <el-button type="info" style="width: 110px;margin-right: 200px;margin-bottom: -1em;" @click="clearHistory">
        <el-icon :size="17">
          <delete />
        </el-icon>
        &nbsp;清空记录
      </el-button>
    </div>
    <el-row>
      <el-col :span="2" />
      <el-col :span="20">
        <div v-if="dateArray.length === 0">
          <el-empty description="脑袋空空。" />
        </div>
        <div v-for="(item) in dateArray" :key=item>
          <div style="text-align: left;margin-bottom: 10px;">
            <span class="date-tag">{{ item }}</span>
          </div>
          <div class="date-wrapper">
            <template v-for="(goodItem) in historyData" :key="goodItem.id">
              <favorite-card v-if="goodItem.date === item" :good-i-d="goodItem.id" :src="goodItem.image"
                :price="goodItem.price" :title="goodItem.title" :removable="false" />
            </template>
            <br />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useMessage, useDialog } from 'naive-ui'
import { Delete } from "@element-plus/icons-vue"
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import PageTitle from '@/components/Public/PageTitle.vue'
import { History20Filled } from '@vicons/fluent'
import FavoriteCard from '@/components/Favorite/FavoriteCard.vue'

const message = useMessage()
const dialog = useDialog()

// store
const userStore = useUserStore()
const { userID } = storeToRefs(userStore)

const router = useRouter()

// 浏览记录类型
interface History {
  id: string
  date: string
  price: string
  title: string
  image: string
}
const historyData = ref<History[]>([])  // 浏览记录数据
const dateArray = ref<string[]>([]) // 日期

// 调用接口：传入（用户ID） 返回（浏览记录数据:商品ID、图片url、名称、价格、浏览日期）
axios.get(`/api/getTrack/${userID.value}`)
  .then((res) => {
    res.data.forEach((item: any) => {
      historyData.value.push({
        id: item.history_good_id,
        date: item.history_day_time.substr(0, 10),
        price: Number.parseFloat(item.good_price).toFixed(2),
        title: item.good_title,
        image: `http://106.15.78.201:8082/public/images/${item.good_images.split(';')[0]}`
      })
    })
  })
  .then(() => {
    historyData.value.forEach((item) => {
      if (!dateArray.value.includes(item.date)) {
        dateArray.value.push(item.date)
      }
    })
  })

//点击卡片跳转商品详情页
function jumpCard(itemID: string) {
  router.push({
    path: '/details',
    query: {
      gid: itemID,
    }
  })
}
// 清空浏览记录
function clearHistory() {
  if (historyData.value.length === 0) {
    message.info('您没有可清除的浏览记录。')
  } else {
    dialog.warning({
      title: '确认',
      content: '将清空您的所有浏览记录,是否继续操作?',
      positiveText: '继续',
      negativeText: '取消',
      onPositiveClick: () => {
        // 调用接口：传入（用户ID） 返回（null）
        axios.get(`/api/clearTrack/${userID.value}`)
          .then(() => {
            dateArray.value.length = 0
            historyData.value.length = 0
            message.success('清除成功!')
          })
      }
    })
  }
}
</script>

<style scoped lang="scss">
.root {
  width: 100%
}

.point {
  cursor: pointer;
}

.date-tag {
  display: inline-block;
  font-size: 18px;
  font-weight: bold;
  margin-top: 1em;
}

.date-wrapper {
  display: flex;
  gap: 1.8em;
  flex-wrap: wrap;
}
</style>