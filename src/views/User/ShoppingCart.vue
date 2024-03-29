<template>
  <div class="root">
    <page-title>
      <template #icon>
        <cart-outline />
      </template>
      <template #main-title>
        购物车
      </template>
      <template #sub-title>
        Shopping Cart
      </template>
    </page-title>
    <el-row>
      <el-col :span="2"></el-col>
      <el-col :span="20">
        <el-table ref="multipleTable" :data="tableData" stripe :height="'75vh'" style="width: 100%;margin-bottom: 2px;"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" />
          <el-table-column label="商品信息" width="500">
            <template #default="scope">
              <el-row :gutter="10">
                <el-col :span="5">
                  <el-image class="point" :src="scope.row.path" style="border: 1px solid #E3E3E3;" fit="scale-down"
                    @click="jumpCard(scope.row.id)" />
                </el-col>
                <el-col :span="13">
                  <div style="text-align: center">
                    <span style="display: inline-block;font-size: 13px;color: #808080;margin-top: 25px;">{{
                    scope.row.name
                    }}</span>
                  </div>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="金额" width="200" align="center">
            <template #default="scope">
              <span style="display: inline-block;font-size: 18px;font-weight: bold;color: #FF9900;margin-top: 3px;">￥{{
              scope.row.price
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" show-overflow-tooltip align="center">
            <template #default="scope">
              <el-button class="el-icon-delete" type="text" @click="removeGoods(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="background: #fafafa;width: 1265px;height: 50px;border: 1px solid #ffffff;margin-bottom: 5px;">
          <el-row>
            <el-col :span="3">
              <el-button type="warning" size="small" plain style="margin-top: 10px;" @click="removeSelectedGoods()">
                删除选中商品</el-button>
            </el-col>
            <el-col :span="10">
            </el-col>
            <el-col :span="8">
              <span
                style="display: inline-block;font-size: 14px;color: #808080;margin-top: 15px;">已选商品&nbsp;&nbsp;</span>
              <span style="display: inline-block;font-size: 20px;color: #FF9900;margin-top: 13px;font-weight: bold;">{{
              selectedNum
              }}&nbsp;&nbsp;</span>
              <span
                style="display: inline-block;font-size: 14px;color: #808080;margin-top: 15px;">件&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span style="display: inline-block;font-size: 14px;color: #808080;margin-top: 15px;">合计 : </span>
              <span
                style="display: inline-block;font-size: 24px;color: #FF9900;margin-top: 13px;font-weight: bold;">&nbsp;&nbsp;{{
                cost
                }}&nbsp;&nbsp;</span>
              <span style="display: inline-block;font-size: 14px;color: #808080;margin-top: 15px;">元</span>
            </el-col>
            <el-col :span="3">
              <div class="point" style="background: #FF9900;width: 100%;height: 52px;" @click="jumpToConfirm()">
                <span
                  style="display: inline-block;font-size: 24px;color: #ffffff;margin-top: 10px;">结&nbsp;&nbsp;&nbsp;算</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { useMessage, useDialog } from "naive-ui"
import { serverHost } from '@/data/host'
import axios from 'axios'
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from '@/stores/user'
import { storeToRefs } from "pinia"
import PageTitle from "@/components/Public/PageTitle.vue"
import { CartOutline } from '@vicons/ionicons5'

const message = useMessage()
const dialog = useDialog()

const router = useRouter()
// store
const userStore = useUserStore()
const { userID } = storeToRefs(userStore)

// 购物车商品信息类型
interface CartGood {
  id: string
  name: string
  price: string
  path: string
}
const tableData = ref<CartGood[]>([])  // 购物车数据
const selectedData = ref<CartGood[]>([]) //选中商品列表
const selectedNum = ref(0)  // 选中商品数量
const cost = ref<string | number>(0)  // 选中商品总金额

// 调用接口：传入（用户ID） 返回（购物车数据：商品ID,图片url,名称,价格）
axios.get(`/api/getCart/${userID.value}`)
  .then((response) => {
    response.data.forEach((item: any) => {
      tableData.value.push({
        id: item.cart_good_id,
        name: item.good_title,
        price: Number.parseFloat(item.good_price).toFixed(2),
        path: `http://${serverHost}:8082/public/images/${item.good_images.split(';')[0]}`
      })
    })
  })

// 点击图片跳转商品详情页
function jumpCard(itemID: string) {
  router.push({
    path: '/details',
    query: {
      gid: itemID,
    }
  })
}

// 当选中状态变化时，计算选中商品数与总金额
function handleSelectionChange(selection: CartGood[]) {
  // 先清零
  selectedNum.value = 0;
  cost.value = 0;
  if (selection.length > 0) {
    selectedData.value.length = 0
    selectedData.value.push(...selection)
    selectedNum.value = selection.length
    for (let item of selectedData.value) {
      cost.value += Number.parseFloat(item.price)
    }
    cost.value = cost.value.toFixed(2)
  } else {
    selectedData.value.length = 0
    selectedNum.value = 0
    cost.value = 0
  }
}

// 从购物车中删除商品
function removeGoods(gid: string) {
  dialog.warning({
    title: '确认',
    content: '将从购物车中删除这件商品,是否继续操作?',
    positiveText: '继续',
    negativeText: '取消',
    onPositiveClick: () => {
      // 调用接口： 传入（用户ID,商品ID） 返回(null)
      axios.get(`/api/removeCart/${userID.value}/${gid}`)
        .then(() => {
          let index = 0
          for (let item of tableData.value) {
            if (item.id === gid) {
              break
            } else {
              index++
            }
          }
          tableData.value.splice(index, 1)
          message.success('删除成功!')
        })
    }
  })
}

// 批量移除商品
function removeSelectedGoods() {
  if (selectedData.value.length === 0) {
    message.error('请选中商品！')
  } else {
    dialog.warning({
      title: '确认',
      content: '将从购物车中删除选中商品,是否继续操作?',
      positiveText: '继续',
      negativeText: '取消',
      onPositiveClick: () => {
        for (let sitem of selectedData.value) {
          let index = 0
          for (let item of tableData.value) {
            if (item.id === sitem.id) {
              // 调用接口： 传入（用户ID,商品ID） 返回(null)
              axios.get(`/api/removeCart/${userID.value}/${sitem.id}`)
              break
            } else {
              index++
            }
          }
          tableData.value.splice(index, 1)
        }
        selectedData.value.length = 0
        selectedNum.value = 0
        cost.value = 0
        message.success('删除成功!')
      }
    })
  }
}

// 结算
function jumpToConfirm() {
  if (selectedData.value.length > 0) {
    let goodsIDArray = ''  // 结算商品ID字符串，ID之间以'-'隔开，用以query传参给confirm页面
    for (let item of selectedData.value) {
      if (goodsIDArray.length === 0) {
        goodsIDArray = item.id
      } else {
        goodsIDArray += `-${item.id}`
      }
    }
    router.push({
      path: '/confirm',
      query: {
        gid: goodsIDArray
      }
    })
  } else {
    message.error('请选中商品!')
  }
}
</script>

<style scoped>
.root {
  width: 100%
}

.point {
  cursor: pointer;
}
</style>