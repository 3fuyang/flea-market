<template>
	<div id="app" style="background-color:#F5F5F5;">
  <el-container>
    <el-header v-if="$route.path!='/login'" style="padding: 0">
      <top-nav />
    </el-header>
		<el-main style="padding: 0;overflow-y: hidden;height: 100%;">
			<router-view/>
		</el-main>
    <el-footer v-if="$route.path!='/login'" style="background-color: #F0F8FF; height:100%">
    <p style="margin:0px; padding:30px 0px 40px 0px">
      Copyright ©2022 同济大学校内二手交易平台
    </p>
	</el-footer>
  </el-container>
	<el-backtop v-if="$route.path!='/login'" :bottom="100" :right="40">
	</el-backtop>
  </div>
</template>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	text-align: center;
	color: #2c3e50;
}
::-webkit-scrollbar {
  width: 0 !important;
}
::-webkit-scrollbar {
  width: 0 !important;
  height: 0;
}
</style>