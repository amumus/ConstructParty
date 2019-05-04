<template>
	<view style="width: 100%;">
		<view style="background-image: url('https://construct-party-1256364044.cos.ap-guangzhou.myqcloud.com/score_bg.jpg');height: 300upx;width: 100%;">
			<view style="height: 50upx;"></view>
			<view style="font-size: 50upx ;color: #ff6699;margin-left:300upx;">总积分</view>
			<text style="color: #997722;font-size: 90upx;margin-left:290upx;">{{score}}</text>
		</view>
		<view class="rank">我的排名:{{rank}}名</view>
		<view>
			<navigator url="/pages/study/report/myScoreReport" hover-class="navigator-hover" class="myScoreReport">我的积分报表</navigator>
			<navigator url="/pages/study/scoreTask/scoreTask" hover-class="navigator-hover" class="scoreTask">查看积分规则</navigator>
		</view>
		
		<view class="uni-list">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value,key) in list" :key="key">
				<view class="uni-media-list" style="width: 100%;">
					<view class="uni-media-list-body" style="padding-left: 30upx;padding-top: 12upx;padding-bottom: 12upx;">
						<view class="uni-media-list-text-top">{{value.remark}}<text style="float: right;color: #007AFF;padding-right: 60upx;">+{{value.integralScore}}</text></view>
						<view class="uni-media-list-text-bottom uni-ellipsis">{{value.occurTime}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'media-list',
				id:'',
				rank:2,
				score:0,
				count:0,
				
				list: [
// 					{
// 						remark: "登录积分+1",
// 						time: "2019年3月22日 17：20",
// 						integralScore:1
// 					},
// 					{
// 						remark: "登录积分+1",
// 						time: "2019年3月22日 17：20",
// 						integralScore:1
// 					},
// 					{
// 						remark: "登录积分+1",
// 						time: "2019年3月22日 17：20",
// 						integralScore:1
// 					}
				]
			}
		},
		onLoad() {
// 			setTimeout(() => {
// 				this.showImg = true;
// 			}, 400)
			this.id = uni.getStorageSync( 'id');
			this.getUserRank();
			this.getUserScore();
			this.getScoreDetial();
		},
		methods:{
			getUserRank(){
				let that = this;
				uni.request({
					url: this.websiteUrl+'uniApp/score/getUserRank',
					data:{
						userId:that.id
					},
					success:(data)=> {
						that.rank = data.data.data;
					}
				})
			},
			getUserScore(){
				let that = this;
				uni.request({
					url: this.websiteUrl+'uniApp/score/getUserScore',
					data:{
						userId:that.id
					},
					success:(data)=> {
						that.score = data.data.data.score;
					}
				})
			},
			getScoreDetial(){
				let that = this;
				uni.request({
					url: this.websiteUrl+'uniApp/score/getScoreDetial',
					data:{
						userId:that.id
					},
					success:(data)=> {
						that.list = data.data.data.list;
						that.count = data.data.data.count;
					}
				})
			}
		}
	}
</script>
<style>

	/* 排名 */
	.rank {
		padding-left:8px;
		text-align:center;
		font-size:50upx;
		padding:25upx;
		color:#ff6699;
		border:5upx solid;
		border-radius:25upx;
		margin:15upx 25upx;
	}
	/* 积分规则 */
	.scoreTask{
		width: 45%;
		 padding-right: 20upx;
		 display: inline-block;
		color: #0066cc;
		text-align: right;
	}
	
	/* 我的积分 */
	.myScoreReport{
		width: 45%; 
		padding-left: 38upx;
		display: inline-block;
		color: #0066cc;
	}
	
	/* 列表 */
	.uni-list {
		background-color: #FFFFFF;
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
	}
	.uni-list:after {
		position: absolute;
		z-index: 10;
		right: 0;
		bottom: 0;
		left: 0;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}
	.uni-list::before {
		position: absolute;
		z-index: 10;
		right: 0;
		top: 0;
		left: 0;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}
	.uni-list-cell {
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.uni-list-cell-hover {
		background-color: #eee;
	}
	.uni-list-cell-pd {
		padding: 22upx 30upx;
	}
	.uni-list-cell-left {
		font-size:28upx;
		padding: 0 30upx;
	}
	.uni-list-cell-db,
	.uni-list-cell-right {
		flex: 1;
	}
	.uni-list-cell::after {
		position: absolute;
	  z-index: 3;
		right: 0;
		bottom: 0;
		left: 30upx;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}
	.uni-list .uni-list-cell:last-child::after {
		height: 0upx;
	}
	.uni-list-cell-last.uni-list-cell::after {
		height: 0upx;
	}
	.uni-media-list-body {
		width: 100%;
		height: 100upx;
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
		overflow: hidden;
	}
	.uni-media-list-text-top {
		width: 100%;
		line-height: 36upx;
		font-size: 38upx;
	}
	.uni-media-list-text-bottom {
		width: 100%;
		line-height: 30upx;
		font-size: 30upx;
		color: #8f8f94;
	}
	
</style>
