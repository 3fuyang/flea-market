<script lang="ts" setup>
import { NPopover, NRate, NDatePicker, NSelect, NInput, NForm, NFormItem, NButton, NDescriptions, NDescriptionsItem, NCard, NAvatar, NText, NDivider, NUpload } from 'naive-ui'
import type { UploadInst, FormInst, SelectOption, FormRules } from 'naive-ui'
import { useMessage, useDialog } from 'naive-ui'
import { ref, watch, h } from 'vue'
import type { CSSProperties } from 'vue'
import axios from 'axios'
import { serverHost } from '@/data/host'
import PageTitle from '../Public/PageTitle.vue'
import { PersonInfo16Filled } from '@vicons/fluent'
import { colleges } from '../Login/colleges'

const message = useMessage()
const dialog = useDialog()

const props = defineProps<{
  userID: string
}>()

// 用户信息基类
class BaseInfo {
  [index: string]: string | number
  nickName: string = ''
  selfIntro: string = ''
  college: string = ''
  gender: string = ''
}
// 用户可修改信息类型
class EditableInfo extends BaseInfo {
  birthday: number = 0
}
// 用户总信息类型
class UserInfo extends BaseInfo {
  userID: string = ''
  sellerRate: number = 0
  avatar: string = ''
  birthday: string = ''
}

// 用户只读信息model
const userInfo = ref<UserInfo>(new UserInfo())

// 修改后的信息，与表单绑定
const newInfo = ref<EditableInfo>(new EditableInfo())

// 表单ref对象
const formRef = ref<FormInst | null>(null)

// 调用接口：传入（用户ID） 返回（用户信息：头像URL、昵称、签名、学院、性别、生日）
axios.get(`/api/getUserInfo/${props.userID}`)
  .then((res: any) => {
    const data = res.data
    userInfo.value.userID = props.userID as string,
      userInfo.value.nickName = data.nickname,
      userInfo.value.selfIntro = data.biography,
      userInfo.value.college = data.college,
      userInfo.value.gender = data.gender,
      userInfo.value.birthday = data.birthday,
      userInfo.value.avatar = `http://${serverHost}:8082/public/avatars/${data.avatar}`,
      userInfo.value.sellerRate = 4

    copy()
  })

// 将服务端返回的个人信息复制到编辑表单model对象上
function copy() {
  for (let property in newInfo.value) {
    if (property === 'birthday') {
      // 服务端返回的生日是格式化后的值，使用Date.parse转换为毫秒数(Number)再赋值给编辑表单生日字段
      newInfo.value[property] = Date.parse(userInfo.value.birthday)
    } else {
      // 其余字段直接复制
      newInfo.value[property] = userInfo.value[property]
    }
  }
}

// 表单校验规则
const rules: FormRules = {
  nickName: {
    type: 'string',
    key: 'nickName',
    required: true,
    message: '请输入昵称'
  },
  selfIntro: {
    type: 'string',
    key: 'selfIntro',
    required: true,
    message: '请输入个性签名'
  },
  college: {
    type: 'string',
    key: 'college',
    required: true,
    message: '请选择学院'
  },
  gender: {
    type: 'string',
    key: 'gender',
    required: true,
    message: '请选择性别'
  },
  birthday: {
    type: 'number',
    key: 'birthday',
    required: true,
    message: '请选择生日'
  }
}

// 是否正在修改信息
const changingInfo = ref(false)

// 重置修改
function resetEdit() {
  message.info('取消编辑个人信息。')
  changingInfo.value = false
  edited.value = false
  // 恢复修改后的用户信息
  copy()
}

// 修改编辑状态
function changeEditStatus() {
  if (!changingInfo.value) {
    changingInfo.value = true
  } else if (edited.value) {
    dialog.warning({
      title: '提示',
      content: '不会保存已做的修改，是否确定取消编辑？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        resetEdit()
      }
    })
  } else {
    resetEdit()
  }
}

// 检查是否修改标志
const edited = ref(false)

// 监听是否修改
watch(newInfo, () => {
  for (let property in newInfo.value) {
    if (newInfo.value[property] !== userInfo.value[property]) {
      if (property === 'birthday') {
        if (newInfo.value.birthday !== Date.parse(userInfo.value.birthday)) {
          edited.value = true
          return
        } else {
          continue
        }
      } else {
        edited.value = true
        return
      }
    }
    edited.value = false
  }
}, { deep: true })


// 基本信息items
type InfoItem = {
  label: string
  key: string
}
const infoItems: InfoItem[] = [
  {
    label: '学院',
    key: 'college'
  },
  {
    label: '性别',
    key: 'gender'
  },
  {
    label: '生日',
    key: 'birthday'
  }
]

// 点击信息item，复制文本
async function copyInfoItem(key: string) {
  await navigator.clipboard.writeText(userInfo.value[key] as string)
  message.success('文本复制成功。')
}

// 提交修改
function confirmEdit() {
  if (edited.value) {
    dialog.info({
      title: '提示',
      content: '确认要修改个人信息吗?',
      positiveText: '确认',
      negativeText: '取消',
      onPositiveClick: () => {
        // 校验表单
        formRef.value?.validate((errors) => {
          if (!errors) {
            // 调用接口：传入（用户ID，新用户信息） 返回（修改结果）
            const birthdayStr = new Date(newInfo.value.birthday)
            birthdayStr.setHours(birthdayStr.getHours() + 8)

            const reqBodyOfInfo = {
              nickName: newInfo.value.nickName,
              selfIntro: newInfo.value.selfIntro,
              college: newInfo.value.college,
              gender: newInfo.value.gender,
              birthday: birthdayStr.toISOString().slice(0, 10),
              userID: props.userID
            }

            axios.post(`api/modifyUserInfo`, reqBodyOfInfo)
              .then(() => {
                // 修改视图
                for (let property in newInfo.value) {
                  if (property === 'birthday') {
                    (userInfo.value as UserInfo)[property] = reqBodyOfInfo.birthday
                  } else {
                    (userInfo.value as UserInfo)[property] = newInfo.value[property]
                  }
                }
                changingInfo.value = false
                edited.value = false
                message.success('个人信息已修改!')
              })
          }
        })
      }
    })
  } else {
    //console.log(userInfo.value, newInfo.value)
    message.warning('您没有要保存的修改。')
  }
}

// 头像上传组件ref对象
const uploadRef = ref<UploadInst | null>(null)

// 文件列表长度
const fileListLength = ref(0)

// 打开上传头像对话框
function openAvatarModal() {
  dialog.create({
    title: '上传头像',
    content: () => h(
      NUpload,
      {
        accept: '.jpg,.jpeg,.png,.gif,.tif,.tga,.bmp',
        action: '/api/uploadAvatar',
        headers: { 'userID': props.userID },
        defaultUpload: false,
        max: 1,
        ref: uploadRef,
        listType: 'image-card',
        name: 'file',
        fileListStyle: {
          display: 'flex',
          justifyContent: 'center'
        },
        onChange: (options) => {
          fileListLength.value = options.fileList.length
        }
      },
      {
        default: () => h(
          NButton,
          null,
          {
            default: () => '选择图片'
          }
        )
      }
    ),
    type: 'info',
    positiveText: '确认上传',
    positiveButtonProps: {
      disabled: !fileListLength
    },
    negativeText: '取消',
    onPositiveClick: () => {
      // 上传图片
      uploadRef.value?.submit()

      message.success('修改成功！')
    },
    onNegativeClick: () => {
      message.info('取消上传头像')
    }
  })
}

// 卡片内容样式
const contentStyle: CSSProperties = {
  boxSizing: 'border-box',
  padding: '1em',
  paddingBottom: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  alignItems: 'center',
}

// 卡片footer样式
const footerStyle: CSSProperties = {
  padding: '1em',
  paddingTop: 0
}

// 描述内容样式
const descriptionContentStyle: CSSProperties = {

}

// 标题样式
const pageTitleStyle: CSSProperties = {
  margin: 0,
  transform: 'scale(.75)',
  marginBottom: '-.5em',
  marginLeft: '-50%'
}

// 学院选项
const collegeOptions: SelectOption[] = colleges.map(item => ({
  label: item,
  value: item
}))

// 性别选项
const genderOptions: SelectOption[] = ['男', '女'].map(item => ({
  label: item,
  value: item
}))
</script>

<template>
  <n-card class="info-card" :content-style="contentStyle" :footer-style="footerStyle">
    <n-popover trigger="hover">
      <template #trigger>
        <n-avatar class="avatar" :src="userInfo?.avatar" round color="white" :size="100" @click="openAvatarModal" />
      </template>
      更换头像
    </n-popover>
    <template v-if="!changingInfo">
      <p class="nickname">
        {{ userInfo.nickName }}
      </p>
      <n-text :depth="3" class="intro">
        {{ userInfo.selfIntro }}
      </n-text>
      <n-divider class="divider" />
      <n-descriptions class="description-box" :content-style="descriptionContentStyle" v-if="!changingInfo"
        label-placement="left" :columns="1">
        <template #header>
          <page-title :style="pageTitleStyle">
            <template #icon>
              <person-info16-filled />
            </template>
            <template #main-title>
              基本信息
            </template>
            <template #sub-title>
              User Info
            </template>
          </page-title>
        </template>
        <n-descriptions-item v-for="item in infoItems">
          <template #label>
            <span class="label">
              {{ item.label }}
            </span>
          </template>
          <n-text class="item-value" depth="3" @click="copyInfoItem(item.key)">
            {{ userInfo[item.key] }}
          </n-text>
        </n-descriptions-item>
      </n-descriptions>
    </template>
    <template v-else>
      <n-form class="form" ref="formRef" :rules="rules" label-placement="left" label-width="auto"
        require-mark-placement="right-hanging" size="small" :model="newInfo">
        <n-form-item label="昵称" path="nickName">
          <n-input placeholder="Nickname" class="input" :maxlength="20" v-model:value="newInfo.nickName" />
        </n-form-item>
        <n-form-item label="个性签名" path="selfIntro">
          <n-input placeholder="Self Introduction" class="input" type="textarea" :maxlength="60"
            :autosize="{ minRows: 3, maxRows: 3 }" v-model:value="newInfo.selfIntro" />
        </n-form-item>
        <n-form-item label="学院" path="college">
          <n-select v-model:value="newInfo.college" placeholder="College" :options="collegeOptions" />
        </n-form-item>
        <n-form-item label="性别" path="gender">
          <n-select v-model:value="newInfo.gender" placeholder="Gender" :options="genderOptions" />
        </n-form-item>
        <n-form-item label="生日" path="birthday">
          <n-date-picker v-model:value="newInfo.birthday" type="date" clearable />
        </n-form-item>
      </n-form>
    </template>
    <div class="button-area">
      <n-button v-if="!changingInfo" size="small" color="#39C" @click="changeEditStatus">
        编辑个人信息
      </n-button>
      <n-button v-if="changingInfo" size="small" type="success" @click="confirmEdit">
        保存更改
      </n-button>
      <n-button v-if="changingInfo" size="small" @click="changeEditStatus">
        取消编辑
      </n-button>
    </div>
    <template #footer>
      <div class="footer-wrapper">
        <n-text class="rate-label">顾客评分：</n-text>
        <n-rate size="small" readonly :value="userInfo.sellerRate" />
      </div>
    </template>
  </n-card>
</template>

<style scoped lang="scss">
.info-card {
  width: 28%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.avatar {
  margin: 1.2em 0;
  padding: 0;
  cursor: pointer;
  transition: transform .6s;

  &:hover {
    transform: rotate(360deg);
  }
}

.nickname {
  margin: .2em 0 .2em;
  font-size: 1.8rem;
  letter-spacing: 1.2px;
}

.intro {
  margin: .4em 0;
  letter-spacing: 1px;
  text-align: left;
  animation: fade-out .6s ease-out;
}

.divider {
  padding: 0 1em;
  margin: .7em 0;
  margin-bottom: 1em;
}

.description-box {
  width: 70%;
  text-align: left;
}

.label {
  margin: 0;
  letter-spacing: 2px;
  font-size: 1.1rem;
}

.item-value {
  font-size: 1.1rem;
  letter-spacing: 1px;

  &:hover {
    text-decoration: underline;
    color: #2B7489;
    cursor: pointer;
  }
}

.form {
  margin-top: 1em;
}

.button-area {
  display: flex;
  gap: 1em;
  margin: 1.5em 0;
}

.input {
  text-align: left;
}

@keyframes fade-out {
  from {
    margin-left: -10em;
  }

  to {
    margin-left: 0;
  }
}

.footer-wrapper {
  justify-content: center;
  display: flex;
  align-items: center;
}

.rate-label {
  font-size: 1.05rem;
  line-height: 1em;
  letter-spacing: 1px;
}
</style>