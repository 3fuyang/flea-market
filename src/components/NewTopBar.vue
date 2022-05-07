<script lang="ts" setup>
import { NButton, NMenu, type MenuOption } from 'naive-ui'
import { ref, computed, h } from 'vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from "element-plus"
import { useRouter, RouterLink } from "vue-router"
import { memberRoutes, adminRoutes, loginRoutes, endRoutes } from "@/router"

const router = useRouter()

const userStore = useUserStore()
const { identity } = storeToRefs(userStore)

const activeKey = ref<string | null>(null)

// 当前选项
const currOptions = computed(() => {
  switch (identity.value) {
    case 'visitor':
      return visitorOptions
    case 'member':
      return memberOptions
    case 'admin':
      return adminOptions
  }
})

// 游客选项
const visitorOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'home'
          }
        },
        { default: () => '首页' }
      ),
    key: 'go-back-home'
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'login'
          }
        },
        { default: () => '登录/注册' }
      ),
    key: 'go-login'
  },  
]

// 普通会员选项
const memberOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'home'
          }
        },
        { default: () => '首页' }
      ),
    key: 'go-back-home'
  },
  {
    label: '个人中心',
    key: 'info-center',
    children: [
      {
        label: () => 
          h(
            RouterLink,
            {
              to: {
                name: 'info'
              },
              onClick: () => {
                activeKey.value = 'info-center'
              }
            },
            { default: () => '用户信息' }
          ),
        key: 'info'
      },
      {
        label: () => 
          h(
            RouterLink,
            {
              to: {
                name: 'security'
              },
              onClick: () => {
                activeKey.value = 'info-center'
              }
            },
            { default: () => '安全中心' }
          ),
        key: 'security'
      },      
    ]
  },
  {
    label: '浏览管理',
    key: 'browse-management',
    children: [
      {
        label: () => 
          h(
            RouterLink,
            {
              to: {
                name: 'shoppingcart'
              },
              onClick: () => {
                activeKey.value = 'browse-management'
              }
            },
            { default: () => '购物车' }
          ),
        key: 'shopping-cart'
      },
      {
        label: () => 
          h(
            RouterLink,
            {
              to: {
                name: 'favorite'
              },
              onClick: () => {
                activeKey.value = 'browse-management'
              }
            },
            { default: () => '收藏夹' }
          ),
        key: 'favorite'
      },   
      {
        label: () => 
          h(
            RouterLink,
            {
              to: {
                name: 'history'
              },
              onClick: () => { 
                activeKey.value = 'browse-management'
              }
            },
            { default: () => '浏览记录' }
          ),
        key: 'history'
      },          
    ]
  },
  {
    label: '我的交易',
    key: 'my-bussiness',
    children: [
      {
        label: () => 
          h(
            RouterLink,
            {
              to: {
                name: 'order'
              },
              onClick: () => {
                activeKey.value = 'my-bussiness'
              }
            },
            { default: () => '订单管理' }
          ),
        key: 'order'
      },
      {
        label: () => 
          h(
            RouterLink,
            {
              to: {
                name: 'goods'
              },
              onClick: () => {
                activeKey.value = 'my-bussiness'
              }
            },
            { default: () => '商品管理' }
          ),
        key: 'goods'
      },   
      {
        label: () => 
          h(
            RouterLink,
            {
              to: {
                name: 'trade'
              },
              onClick: () => {
                activeKey.value = 'my-bussiness'
              }
            },
            { default: () => '卖出闲置' }
          ),
        key: 'trade'
      }, 
      {
        label: () => 
          h(
            RouterLink,
            {
              to: {
                name: 'chat'
              },
              onClick: () => {
                activeKey.value = 'my-bussiness'
              }
            },
            { default: () => '我的聊天' }
          ),
        key: 'chat'
      },               
    ]
  },
  {
    label: () => 
      h(
        NButton,
        {
          text: true,
          onClick: logOut,
        },
        { default: () => '注销' }
      )
  },    
]

// 管理员选项
const adminOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'home'
          }
        },
        { default: () => '首页' }
      ),
    key: 'go-back-home'
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'report'
          }
        },
        { default: () => '处理举报' }
      ),
    key: 'go-report'
  },
  {
    label: () => 
      h(
        NButton,
        {
          text: true,
          onClick: logOut,
        },
        { default: () => '注销' }
      )
  },  
]

// 登出
function logOut () {
  //对话框询问
  ElMessageBox.confirm(
    '您的账号将注销登录,是否继续操作?',
    '确认',
    {
      confirmButtonText:'继续',
      cancelButtonText:'取消',
      type:'warning'
    }
  ).then(() => {
    //用store的actions设置登录状态为false
    const preIdentity = identity.value
    userStore.logOut()    
    // 移除权限路由
    switch (preIdentity) {
      case 'member':
        memberRoutes.forEach((route) => {
          router.removeRoute(route.name)
        })
        break
      case 'admin':
        adminRoutes.forEach((route) => {
          router.removeRoute(route.name)
        })
        break
      default:
        break
    }
    // 添加登录路由
    loginRoutes.forEach((route) => {
      router.addRoute(route)
    })
    // 将endRoutes移至尾部
    endRoutes.forEach((route) => {
      router.addRoute(route)
    })
    router.push('/home')
    ElMessage({
      type:'success',
      message:'注销成功!'
    })
  }).catch(() => {
    ElMessage({
      type:'info',
      message:'取消注销'
    })
  })
}
</script>

<template>
  <div class="top-wrapper">
    <h1
      class="wave-wrapper"
      @click="$router.push('/home')">
      TJ Flea <span class="dash">_</span>
    </h1>
    <div class="gap"/>
    <n-menu
      class="menu"
      v-model:value="activeKey"
      mode="horizontal"
      :options="currOptions">
    </n-menu>
  </div>
</template>

<style scoped lang="scss">
.top-wrapper {
  font-size: 1rem;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  background-color: #fff;
  align-items: center;
  padding-left: 2em;
  border-bottom: 1px solid #f4f4f5;
}
.wave-wrapper {
  margin: 0;
  letter-spacing: .05em;
  justify-self: flex-start;
  font-weight: normal;
  position: relative;
  color: #000;
  overflow: hidden;
  padding: 0 .8em 0 1em;
  cursor: pointer;
  &::before, &::after {
    content: "";
    position: absolute;
    top: 33em;
    left: 50%;
    width: 62.5em;
    height: 62.5em;
    border-radius: 45% 48% 43% 47%;
    transform: translate(-50%, -50%);
    background: hsl(180, 50%, 80%);
    animation: rotate 10s infinite linear;
    z-index: 1;
    mix-blend-mode: darken;
  }
  &::after {
    border-radius: 43% 47% 44% 48%;
    animation: rotate 10s infinite .5s linear; 
  }  
}
.dash {
  font-weight: bold;
  color: hsl(200, 80%, 55%);
}
.gap {
  flex: 4;
}
.menu {
  flex-grow: 1;
  flex-shrink: 0;
}

@keyframes rotate {
  0% {
    transform: translate(-50%, -50%) rotate(0);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>