<template>
<article class="root-box">
  <HelloBar :completed-num="completed"/>
  <section class="task-wrapper">
    <NDataTable
      :columns="columns"
      :striped="true"
      v-model:data="reports"
      :row-key="rowKey"
      :pagination="pagination"/>
  </section>
</article>
</template>

<script setup>
import { NButton, NDataTable, NDescriptions, NDescriptionsItem, NIcon, NInput, NTag } from 'naive-ui'
import { h, onBeforeMount, ref } from 'vue'
import { Create } from '@vicons/ionicons5'
import HelloBar from '../../components/Admin/HelloBar.vue'

const rowKey = (row) => row.orderId

const replys = ref({})
const createColumns = () => [
  {
    title: 'No',
    key: 'no'
  },
  {
    title: '举报者',
    key: 'reporter'
  },  
  {
    title: '被告',
    key: 'accused'
  },  
  {
    title: '订单ID',
    key: 'orderId'
  },
  {
    title: '状态',
    key: 'state',
    render(row) {
      return h(
        NTag, 
        {
          type: row.state === '未处理' ? 'info' : (row.state === '已封禁' ? 'success' : 'warning')
        },
        {
          default: () => row.state
        }
      )
    }
  },
  {
    type: 'expand',
    title: () => h(
      NIcon,
      {
        size: 18,
        color: '#666'
      },{
        default: () => h(
        Create
      )
      }
    ),
    expandable: () => true,
    renderExpand: (rowData) => {
      return h(
        'div',
        {
          style: {
            overflow: 'auto',
          }
        },
        [
          h(
            NDescriptions,
            {
              bordered: true,
              labelPlacement: 'left',
              size: 'small',
              style: {
                margin: '1em',
                marginTop: '.6em',
                width: '92%',
              }
            },
            [
              h(
                NDescriptionsItem,
                {
                  label: '订单信息',
                },
                {
                  default: () =>`${rowData.goodTitle} (${rowData.tradeTime})`
                }
              ),
              h(
                NDescriptionsItem,
                {
                  label: '举报理由',
                },
                {
                  default: () =>`${rowData.reason}`
                }
              ),              
            ]
          ),
          h(
            NInput,
            {
              value: replys.value[rowData.orderId],
              onUpdateValue (value) {
                replys.value[rowData.orderId] = value
              },
              placeholder: '请输入对举报者的回复，不超过50字。',
              disabled: rowData.state === '已处理',
              style: {
                margin: '1em',
                marginTop: '0',
                width: '70%'
              }
            }
          ),
          h(
            NButton,
            {
              type: 'error',
              size: 'small',
              onClick: () => banAccused(rowData),
              disabled: rowData.state !== '未处理'
            }, { default: () => rowData.state === '未处理' ? '封禁用户' : '已处理'}
          ),
          h(
            NButton,
            {
              type: 'warning',
              size: 'small',
              onClick: () => refuseReport(rowData),
              disabled: rowData.state !== '未处理',
              style: {
                marginLeft: '1em'
              }
            }, { default: () => rowData.state === '未处理' ? '驳回举报' : '已处理'}
          )          
        ]
      )
    }
  }
]

const columns = ref([])
const reports = ref([])
const pagination = ref({
  pageSize: 8
})
const completed = ref(0)

function banAccused(row){
  // 调用接口：传入（被告者ID） 返回（null）

  // 调用接口：传入（投诉订单ID） 返回（null）

  row.state = '已封禁'
  completed.value++
}

function refuseReport(row) {
  // 调用接口：传入（被告者ID） 返回（null）

  // 调用接口：传入（投诉订单ID） 返回（null）

  row.state = '已驳回'
  completed.value++
}

onBeforeMount(() => {  
  columns.value = createColumns()
  // 调用接口：传入（管理员ID） 返回（待处理的举报列表：举报ID，举报者ID，被举报者ID，订单ID，举报时间，举报理由，处理状态）
  let counter = 0
  reports.value = [
    {
      no: ++counter,
      reporter: '1951051',
      accused: '205151',
      orderId: '152214',
      goodTitle: '商品1',
      tradeTime: '2022.2.2 22:22:22',
      reason: '谁吃到了马蹄酥？',
      state: '未处理'
    },
    {
      no: ++counter,
      reporter: '205151',
      accused: '1951051',      
      orderId: '127814',
      goodTitle: '商品2',
      tradeTime: '2022.2.2 22:22:22',
      reason: '刘浩存声援同济至善至美。',
      state: '未处理'
    },
    {
      no: ++counter,
      reporter: '1758051',
      accused: '205151',      
      orderId: '144214',
      goodTitle: '商品3',
      tradeTime: '2022.2.2 22:22:22',
      reason: '肖某战无耻偷吃罪大恶极。',       
      state: '未处理'
    }
  ]
  reports.value.forEach((rowData) => {
    replys.value[rowData.orderId] = '您的举报已收悉，管理员已对被举报者作出封禁处理，感谢您的监督。'
  })
})
</script>

<style scoped>
.root-box{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.task-wrapper{
  background-color: #fff;
  border-radius: .3em;
  display: flex;
  width: 60vw;
}
</style>