<template>
	<view style="width: 100%;">
		<image src="../../static/img/study_head.jpg"></image>
		<uni-grid :data="[
    {image:'https://img-cdn-qiniu.dcloud.net.cn/img/shu.png',text:'视频学习'},
    {image:'https://img-cdn-qiniu.dcloud.net.cn/img/lindang.png',text:'党史'},
    {image:'https://img-cdn-qiniu.dcloud.net.cn/img/laoren.png',text:'学习积分'},
    {image:'https://img-cdn-qiniu.dcloud.net.cn/img/liwu.png',text:'礼物'},
    {image:'https://img-cdn-qiniu.dcloud.net.cn/img/maozi.png',text:'帽子'},
    {image:'https://img-cdn-qiniu.dcloud.net.cn/img/shoutao.png',text:'手套'},
    {image:'https://img-cdn-qiniu.dcloud.net.cn/img/xueqiao.png',text:'雪橇'},
    {image:'https://img-cdn-qiniu.dcloud.net.cn/img/xunlu.png',text:'驯鹿'},
    {image:'https://img-cdn-qiniu.dcloud.net.cn/img/xuehua.png',text:'雪花'}]"
	 column-num="3"
	 @click = 'bindClick'>
		</uni-grid>
</view>


	
</template>

<script>
	// import {uniGrid} from '@dcloudio/uni-ui'
	import uniGrid from '@dcloudio/uni-ui/lib/uni-grid/uni-grid.vue'
	export default {
		components: {uniGrid},
		methods:{
			bindClick(e){
				switch (e.index) {
					case 0: 
						uni.navigateTo({
							url:"/pages/study/video/video-list"
						})
						break;
					case 1: 
						console.log("1")
						break;
				}
					
			}
		}
	}
</script>

<style>
		
</style>
