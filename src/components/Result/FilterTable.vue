<template>
<div class="filter-wrapper">
  <span class="label1">校区</span>
  <div class="filter1">
    <template v-for="item in filterTable.campus">
      <span
        v-if="!item.selected"
        class="text-tag"
        @click="applyFilter('campus', item.value)">
        {{item.label}}
      </span>
      <el-tag
        v-else
        class="filter-tag"
        closable
        @close="removeFilter('campus', item.value)">
        {{item.label}}
      </el-tag>      
    </template>
  </div>
  <span class="label2">商品类型</span>
  <div class="filter2">
    <template v-for="item in filterTable.category">
      <span
        v-if="!item.selected"
        class="text-tag"
        @click="applyFilter('category', item.value)">
        {{item.label}}
      </span>
      <el-tag
        v-else
        class="filter-tag"
        closable
        @close="removeFilter('category', item.value)">
        {{item.label}}
      </el-tag>      
    </template>
  </div>      
  <span class="label3">上架时间</span>
  <div class="filter3">
    <template v-for="item in filterTable.onShelfTime">
      <span
        v-if="!item.selected"
        class="text-tag"
        @click="applyFilter('onShelfTime', item.value)">
        {{item.label}}
      </span>
      <el-tag
        v-else
        class="filter-tag"
        closable
        @close="removeFilter('onShelfTime', item.value)">
        {{item.label}}
      </el-tag>       
    </template>
  </div>      
  <span class="label4">价格区间</span>
  <div class="filter4">
    <div class="price-wrapper">
      ￥
      <input v-model="minPrice" class="price-input" type="number" min="0" max="9999"/>
      <em>&nbsp; - </em>
      ￥
      <input v-model="maxPrice" class="price-input" type="number" min="0" max="9999"/>
      <button class="grey-btn" @click="applyPriceFilter">确定</button>
      <button class="grey-btn" @click="removePriceFilter">清空</button>
    </div>
  </div>      
  <span class="label5">卖家评价</span>
  <div class="filter5">
    <template v-for="item in filterTable.score">
      <span
        v-if="!item.selected"
        class="text-tag"
        @click="applyFilter('score', item.value)">
        {{item.label}}
      </span>
      <el-tag
        v-else
        class="filter-tag"
        closable
        @close="removeFilter('score', item.value)">
        {{item.label}}
      </el-tag>
    </template>
  </div>      
</div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { isNavigationFailure, onBeforeRouteUpdate, useRouter } from 'vue-router'
import { cloneDeep } from 'lodash'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 关键词，作为路由query参数传递
const keywords = ref('')
// 已启用的筛选条件，它用来作为路由query参数传递
const filters = ref({
  campus: [],
  category: [],
  onShelfTime: '',
  minPrice: undefined,
  maxPrice: undefined,
  score: []
})
// 价格上、下限
const minPrice = ref(undefined)
const maxPrice = ref(undefined)
// 筛选条件，它与模板中的视图相绑定
const filterTable = ref({
  campus: 
    [
      {
        label: '四平路校区',
        value: '四平路校区',
        selected: false
      },
      {
        label: '嘉定校区',
        value: '嘉定校区',
        selected: false        
      },
      {
        label: '沪西校区',
        value: '沪西校区',
        selected: false        
      },
      {
        label: '沪北校区',
        value: '沪北校区',
        selected: false        
      }
    ],
  category:
    [
      {
        label: '图书音像',
        value: '图书音像',
        selected: false        
      },
      {
        label: '电子产品',
        value: '电子产品',
        selected: false        
      },
      {
        label: '美妆个护',
        value: '美妆个护',
        selected: false        
      },
      {
        label: '运动户外',
        value: '运动户外',
        selected: false  
      },
      {
        label: '生活电器',
        value: '生活电器',
        selected: false  
      },
      {
        label: '其他',
        value: '其他',
        selected: false  
      }
    ],
  onShelfTime:
    [
      {
        label: '半年内',
        value: 'HalfYear',
        selected: false  
      },
      {
        label: '三十天内',
        value: 'Month',
        selected: false  
      },
      {
        label: '十五天内',
        value: 'HalfMonth',
        selected: false  
      },
      {
        label: '七天内',
        value: 'Week',
        selected: false  
      },
      {
        label: '一天内',
        value: 'Day',
        selected: false  
      }
    ],
  score:
    [
      {
        label: '低于1分',
        value: '0-1',
        selected: false  
      },
      {
        label: '1-2分',
        value: '1-2',
        selected: false  
      },
      {
        label: '2-3分',
        value: '2-3',
        selected: false  
      },
      {
        label: '3-4分',
        value: '3-4',
        selected: false  
      },
      {
        label: '4-5分',
        value: '4-5',
        selected: false  
      }
    ],
})

// 获取并解析路由信息函数
function getAndParseQuery(args = undefined) {
  // 获取query
  let query
  if (args) {
    // 用户在该路由进行跳转，在beforeRouteUpdate中调用
    query = args
    //console.log(query)
  }else{
    // 用户第一次导航到该路由，在setup中调用
    query = router.currentRoute.value.query
    //console.log(`首次导航，query为:`)
    //console.log(query)
  }
  // 提取关键词
  keywords.value = query.keywords ? query.keywords : ''
  // 提取筛选条件到filters中，若无，则filters不变(延续之前的状态)
  filters.value = query.filters ? JSON.parse(query.filters) : filters.value    
  //console.log(`目前的filters为:`)
  //console.log(filters.value)

  // 根据query中filters的值操作filterTable中的selected属性
  for (let property in filterTable.value) {
    if (property === 'onShelfTime') {
      for (let item of filterTable.value[property]) {
        if (item.value === filters.value[property]) {
          item.selected = true
        } else {
          item.selected = false
        }
      }
      continue
    }
    for (let obj of filterTable.value[property]) {
      if (filters.value[property] && filters.value[property].indexOf(obj.value) >= 0) {
        obj.selected = true
      } else {
        obj.selected = false
      }
    }
  }
  minPrice.value = filters.value.minPrice ? filters.value.minPrice : undefined
  maxPrice.value = filters.value.maxPrice ? filters.value.maxPrice : undefined
  //console.log('解析后，filterTable为:')
  //console.log(filterTable.value)
}

// 首次导航
getAndParseQuery()

// 正常工作，但是浏览器地址栏不改变
// 路由更新前，解析将前往的url的query参数，并将其应用到filterTable上
onBeforeRouteUpdate((to) => {
  //console.log('调用 beforeRouteUpdate')
  getAndParseQuery(to.query)
})

// 导航
async function navigate () {
  const newQuery = cloneDeep(router.currentRoute.value.query)
  newQuery.keywords = keywords.value
  newQuery.filters = JSON.stringify(filters.value)
  // 用filters作为query参数，进行导航
  let failure = await router.push({
    path: '/result',
    query: newQuery
  })
  if (isNavigationFailure(failure)) {
    ElMessage.error('路由导航失败')
  }
}

// 启用筛选函数，工作正常，但是路由不改变
async function applyFilter(key, value) {
  // 根据筛选条件的类型，将其应用到filterTable和filters上
  if(key === 'onShelfTime'){
    let index = filterTable.value.onShelfTime.findIndex((obj) => {
      return obj.selected
    })
    if(index >= 0){
      filterTable.value.onShelfTime[index].selected = false
    }
    filters.value[key] = value
  }else{
    filters.value[key] ? filters.value[key].push(value) : filters.value[key] = [value]
  }
  navigate()
}

// 取消筛选条件函数
async function removeFilter(key, value) {
  // 修改 filters 即可
  if(key === 'onShelfTime'){
    filters.value[key] = ''
  }else{
    let index = filters.value[key].findIndex((item) => {
      return item === value
    })
    if(index >= 0){
      filters.value[key].splice(index, 1)
    }
  }
  navigate()
}

// 应用价格区间函数
async function applyPriceFilter(){
  if (minPrice.value > maxPrice.value) {
    [minPrice.value, maxPrice.value] = [maxPrice.value, minPrice.value]
  }
  filters.value.maxPrice = maxPrice.value
  filters.value.minPrice = minPrice.value
  navigate()
}

// 取消价格区间函数
async function removePriceFilter(){
  filters.value.minPrice = undefined
  filters.value.maxPrice = undefined
  navigate()
}

// 防抖
const debounce = (fn, delay) => {
  let timer
	return (...args) => {
		timer = setTimeout(() => {
			fn(...args)
			clearTimeout(timer)
			timer = null
		}, delay)
	}
}

const debounceInput = debounce((e) => {
  const pattern = /\-/g
  if(pattern.test(e.target.value)){
    e.target.value = undefined
  }
}, 500)

// 组件挂载后，获取价格输入元素，添加keyup事件，以校验其输入
onMounted(() => {
  const inputs = document.getElementsByClassName('price-input')
  for(let input of inputs){
    input.addEventListener('keyup', (e) => {
      debounceInput(e)
    })
  }
})
</script>

<style scoped>
.filter-wrapper{
  display: grid;
  align-self: center;
  font-size: .8rem;
  width: 74rem;
  border: 1px solid #DDD;
  /*  声明列的宽度  */
  grid-template-columns: 15% 85%;
  /*  声明行的高度  */
  grid-template-rows: repeat(5, 1.6rem);
  grid-template-areas: 
    "label1 filter1"
    "label2 filter2"
    "label3 filter3"
    "label4 filter4"
    "label5 filter5";
}
.label1 {
  grid-area: label1;
  line-height: 1.6rem;
  background-color: #F3F3F3;
  border-right: 1px solid #DDD;
  border-bottom: 1px solid #DDD;
  font-weight: 600;
  color: #666;
}
.label2 {
  grid-area: label2;
  line-height: 1.6rem;
  background-color: #F3F3F3;
  border-right: 1px solid #DDD;
  border-bottom: 1px solid #DDD;
  font-weight: 600;
  color: #666;  
}
.label3 {
  grid-area: label3;
  line-height: 1.6rem;
  background-color: #F3F3F3;
  border-right: 1px solid #DDD;
  border-bottom: 1px solid #DDD;
  font-weight: 600;  
  color: #666;  
}
.label4 {
  grid-area: label4;
  line-height: 1.6rem;
  background-color: #F3F3F3;
  border-right: 1px solid #DDD;
  border-bottom: 1px solid #DDD;
  font-weight: 600;  
  color: #666;  
}
.label5 {
  grid-area: label5;
  line-height: 1.6rem;
  background-color: #F3F3F3;
  border-right: 1px solid #DDD;
  font-weight: 600;  
  color: #666;  
}
.filter1{
  grid-area: filter1;
  border-bottom: 1px solid #DDD;
  display: flex;
}
.text-tag:first-child{
  margin-left: 4em;
}
.text-tag{
  color: #3399CC;
  margin: 0 2em;
  line-height: 1.6rem;
  cursor: pointer;
}
.text-tag:hover{
  color: #e4393c;
}
.filter-tag{
  margin: 0 2em;
}

.filter-tag:first-child{
  margin-left: 4em;
}
.filter2{
  grid-area: filter2;
  border-bottom: 1px solid #DDD;
  display: flex;
}
.filter3{
  grid-area: filter3;
  border-bottom: 1px solid #DDD;
  display: flex; 
}
.filter4{
  grid-area: filter4;
  border-bottom: 1px solid #DDD;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.price-wrapper{
  width: 44%;
}
.price-input{
  outline: none;
  border: 1px solid #CCC;
}
.grey-btn{
  outline: none;
  font-size: .8em;
  margin: 0 2em;
  background-color: #eee;
  border: 1px solid #ccc;
  cursor: pointer;
}
.grey-btn:last-child{
  margin-left: 0em;
}
.grey-btn:hover{
  background-color: #ddd;
  box-shadow: inset .1em .1em .3em #ccc;
}
.filter5{
  grid-area: filter5;
  display: flex;
}
</style>