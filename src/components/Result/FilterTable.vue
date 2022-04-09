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
    <template v-for="item in filterTable.catalog">
      <span
        v-if="!item.selected"
        class="text-tag"
        @click="applyFilter('catalog', item.value)">
        {{item.label}}
      </span>
      <el-tag
        v-else
        class="filter-tag"
        closable
        @close="removeFilter('catalog', item.value)">
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
import { onBeforeMount, onMounted, ref } from 'vue'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'

const router = useRouter()

// 关键词
const keywords = ref('')
// 已启用的筛选条件
const filters = ref({
  campus: [],
  catalog: [],
  onShelfTime: '',
  minPrice: undefined,
  maxPrice: undefined,
  score: []
})
// 价格上、下限
const minPrice = ref(undefined)
const maxPrice = ref(undefined)

onBeforeMount(() => {
  console.log('调用 beforeMount')  
  // 挂载组件前
  getAndParseQuery()
})

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

onMounted(() => {
  const inputs = document.getElementsByClassName('price-input')
  for(let input of inputs){
    input.addEventListener('keyup', (e) => {
      debounceInput(e)
    })
  }
})

onBeforeRouteUpdate((to) => {
  console.log('调用 beforeRouteUpdate')
  // 路由更新前
  getAndParseQuery(to.query)
})

// 获取并解析路由信息函数
function getAndParseQuery(...args) {
  // 获取query
  let query
  if(args.length){
    // 在beforeRouteUpdate中调用
    query = args[0]
    //console.log(query)
  }else{
    // 在beforeMount中调用
    query = router.currentRoute.value.query
  }
  keywords.value = query.keywords
  filters.value = query.filters ? JSON.parse(query.filters) : filters.value    
  //console.log(filters.value)

  // 根据query中filter的值操作filterTable中的selected属性
  for(let property in filterTable.value){
    if(property === 'onShelfTime'){
      for(let item of filterTable.value[property]){
        if(item.value === filters.value[property]){
          item.selected = true
        }else{
          item.selected = false
        }
      }
      continue
    }
    for(let obj of filterTable.value[property]){
      if(filters.value[property] && filters.value[property].indexOf(obj.value) >= 0){
        obj.selected = true
      }else{
        obj.selected = false
      }
    }
  }
  minPrice.value = filters.value.minPrice ? filters.value.minPrice : undefined
  maxPrice.value = filters.value.maxPrice ? filters.value.maxPrice : undefined
}

// 启用筛选函数
function applyFilter(key, value) {
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
  let query = {
    keywords: keywords.value,
    filters: JSON.stringify(filters.value)
  }
  router.push({
    path: '/newresult',
    query: query
  })
}

// 取消筛选条件函数
function removeFilter(key, value) {
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
  let query = {
    keywords: keywords.value,
    filters: JSON.stringify(filters.value)
  }
  router.push({
    path: '/newresult',
    query: query
  })  
}

// 应用价格区间函数
function applyPriceFilter(){
  if(minPrice.value > maxPrice.value){
    [minPrice.value, maxPrice.value] = [maxPrice.value, minPrice.value]
  }
  filters.value.maxPrice = maxPrice.value
  filters.value.minPrice = minPrice.value
  router.push({
    path: '/newresult',
    query: {
      keywords: keywords.value,
      filters: JSON.stringify(filters.value)
    }
  })
}

// 取消价格区间函数
function removePriceFilter(){
  filters.value.minPrice = undefined
  filters.value.maxPrice = undefined
  let query = {
    keywords: keywords.value,
    filters: JSON.stringify(filters.value)
  }
  router.push({
    path: '/newresult',
    query: query
  })    
}

// 筛选条件
const filterTable = ref({
  campus: 
    [
      {
        label: '四平路校区',
        value: 'Siping',
        selected: false
      },
      {
        label: '嘉定校区',
        value: 'Jiading',
        selected: false        
      },
      {
        label: '沪西校区',
        value: 'Huxi',
        selected: false        
      },
      {
        label: '沪北校区',
        value: 'Hubei',
        selected: false        
      }
    ],
  catalog:
    [
      {
        label: '图书音像',
        value: 'Book',
        selected: false        
      },
      {
        label: '电子产品',
        value: 'Digital',
        selected: false        
      },
      {
        label: '美妆个护',
        value: 'Makeup',
        selected: false        
      },
      {
        label: '运动户外',
        value: 'Sports',
        selected: false  
      },
      {
        label: '生活电器',
        value: 'Electro',
        selected: false  
      },
      {
        label: '其他',
        value: 'Other',
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
        value: 'OverZero',
        selected: false  
      },
      {
        label: '1-2分',
        value: 'OverOne',
        selected: false  
      },
      {
        label: '2-3分',
        value: 'OverTwo',
        selected: false  
      },
      {
        label: '3-4分',
        value: 'OverThree',
        selected: false  
      },
      {
        label: '4-5分',
        value: 'OverFour',
        selected: false  
      }
    ],
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