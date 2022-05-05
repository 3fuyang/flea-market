<template>
<div class="commentCardList">
  <div v-if="commentList.length">
    <el-card
      v-for="(comment, index) in selectComments"
      :key="index"
      class="commentCard"
      :body-style="{ padding: '0px' }">
      <div class="time">
        {{ comment.time }}
      </div>
      <div class="commentCotent">
        <div class="commentatorInfo"> 
          <div class="commentAvatar">
            <el-avatar :src="comment.avatar" :size="50"/>
          </div>
          {{ comment.name }}
        </div>
        <div class="commentText">
          <el-scrollbar>
            {{ comment.text }}
          </el-scrollbar>
        </div>
        <div class="commentStar">
          <el-row>
            <p style="width: 30%;float: left;margin: 0;">评分:</p>
            <el-rate
              v-model="comment.rate"
              disabled 
              :show-score="comment.rate > 0"
              text-color="#ff9900" 
              style="width: 60%;float: left;height: auto;"/>
          </el-row>
        </div>
      </div>
    </el-card>
    <div class="pagination">
      <el-row justify="center">
        <el-pagination
          :page-size="pageSize" 
          layout="prev, pager, next" 
          :total="commentList.length"
          :hide-on-single-page="true"
          v-model:currentPage="currentPage">
        </el-pagination>
      </el-row>
    </div>
  </div>
  <el-empty 
    v-else 
    description="暂时还没有评论。" />
</div>        
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import '@/assets/fonts/font.css'

defineProps({
  userID: String
})

// 分页大小
const pageSize = 3
// 当前页码
const currentPage = ref(1)

// 评论类型
interface Comment {
  time: string
  name: string
  rate: number
  avatar: string
  text: string
}
// 全部评论
const commentList = ref<Comment[]>([])
// 视口评论
const selectComments = computed(() => {
  // 终点索引
  let end = currentPage.value * pageSize
  // 起点索引
  let begin = end - pageSize
  return commentList.value.slice(begin, end)
})
  // 调用接口：传入（用户ID） 返回（用户作为卖家收到的评论列表：评论时间、买家头像URL、买家ID、买家昵称、内容、评分）
  commentList.value.push(...[
    {
    time: "2022-01-07 09:55",
    name: "王大队长",
    rate: 4.6,
    avatar:
      "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
    text: "有人说，有人在饭里下了毒，我们都不敢吃。",
    },
    {
      time: "2022-01-07 09:55",
      rate: 3.6,
      name: "司令员",
      avatar:
        "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
      text: "我信，我非常相信。你要是没下毒，你就把这碗鸡汤喝了。你看你每天忙里忙完的，多辛苦呀，喝完鸡汤算什么呀，你要是不喝，就说明你真的下毒了。",
    },
    {
      time: "2022-01-07 09:55",
      name: "王大队长",
      rate: 3.8,
      avatar:
        "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
      text: "有人说，有人在饭里下了毒，我们都不敢吃。",
    },
    {
      time: "2022-01-07 09:55",
      rate: 3.6,
      name: "司令员",
      avatar:
        "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
      text: "我信，我非常相信。你要是没下毒，你就把这碗鸡汤喝了。你看你每天忙里忙完的，多辛苦呀，喝完鸡汤算什么呀，你要是不喝，就说明你真的下毒了。",
    },
    {
      time: "2022-01-07 09:55",
      name: "王大队长",
      rate: 3.8,
      avatar:
        "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
      text: "有人说，有人在饭里下了毒，我们都不敢吃。",
    }
  ])
</script>

<style scoped>
.commentCardList{
  clear: left;
  margin: 0 auto;
  position: relative;
}
.pagination{
  width: 100%;
}
.commentCard{
  margin-top: 1.5em;
  min-height: 120px;
  max-height: 130px;
  font-family: 'FZHeiBJW';
  padding: 0px;
  overflow: auto;
}
.commentCard:first-child{
  margin-top: 0;
}
.commentCard:last-child{
  margin-bottom: 1em;
}
.time{
  font-family: '楷体';
  margin-top: 5px;
  height: 20px;
}
.commentAvatar{
  height: 60px;
}
.commentatorInfo{
  width: 25%;
  float: left;
}
.commentText{
  width: 60%;
  float: right;
  margin-right: 50px;
  margin-top: 15px;
  height: 45px;
}
.commentStar{
  width: 60%;
  float: left;
  margin-top: 10px;
}
</style>