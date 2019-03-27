<template>
	<view style="width: 100%;">
		<image src="../../static/img/study_head.jpg"></image>
		<uni-grid :data="[
    {image:'https://img-cdn-qiniu.dcloud.net.cn/img/shu.png',text:'视频学习'},
    {image:'https://img-cdn-qiniu.dcloud.net.cn/img/laoren.png',text:'学习积分'},
    {image:'https://img-cdn-qiniu.dcloud.net.cn/img/liwu.png',text:'学习报表'},
    {image:'https://img-cdn-qiniu.dcloud.net.cn/img/maozi.png',text:'我的评论'}]"
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
						uni.navigateTo({
							url:"/pages/study/myscore/myscore"
						})
						break;
					case 2: 
						uni.navigateTo({
							url:"/pages/study/report/myScoreReport"
						})
						break;
					case 3: 
						uni.navigateTo({
							url:"/pages/study/comment/myComment"
						})
						break;
					case 4: 
						console.log("1")
						break;
				}
					
			}
		}
	}
</script>

<style>
		
</style>
