<template>
	<view style="width: 100%;">
		<view>
			<view class="uni-list">
				<view>test</view>
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value,key) in list" :key="key"  @click="bindClick(value)">
					<view>test1</view>
				<!-- <view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value,key) in listData" :key="key" @click="goDetail(value)"> -->
					<view class="uni-media-list">
						<view class="uni-media-list-body">
							<view class="uni-media-list-text-top">{{value.targetTitle}}哇哇哇哇哇</view>
							<view>
								<text class="commentBody">{{value.commentContent}}</text>
							</view>
							<view class="uni-media-list-text-bottom">
								<text>你回复</text>
								<text>{{value.publishDate}}</text>
							</view>
						</view>
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
				id:0,
				commentList:[],
				count:0
			}
		},
		onLoad() {
			this.id = uni.getStorageSync( 'id');
			this.getUserComment();
		},
		methods:{
			bindClick(e){
				uni.navigateTo({
					url:"/pages/study/comment/commentDetail"
				})
			},
			getUserComment(){
				let that = this;
				uni.request({
					url: this.websiteUrl+'uniApp/comment/getMyCommentList',
					data:{
						userId:that.id
					},
					success:(data)=> {
						// console.log(data)
						that.list = data.data.data.list;
						that.count = data.data.data.count;
						console.log(that.list);
					}
				})
			}
		}
	}
</script>

<style>
	.commentBody{
		height: 120rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow:ellipsis;
		line-height:66upx;
		
	}
	
	
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
	/* 图文列表 */
	.uni-media-list {
		padding: 22upx 30upx;
		box-sizing: border-box;
		display: flex;
		width: 100%;
		flex-direction: row;
	}
	.uni-navigate-right.uni-media-list {
		padding-right: 74upx;
	}
	
	.uni-pull-right {
		flex-direction: row-reverse;
	}
	
	.uni-pull-right>.uni-media-list-logo {
		margin-right: 0upx;
		margin-left: 20upx;
	}
	
	.uni-media-list-logo image {
		height: 100%;
		width: 100%;
	}
	
	
	.uni-media-list-text-bottom {
		width: 100%;
		line-height: 30upx;
		font-size: 26upx;
		color: #8f8f94;
	}
	
	.uni-media-list-logo {
		width: 180upx;
		height: 140upx;
		margin-right: 20upx;
	}
	
	.uni-media-list-body {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
		overflow: hidden;
		height: auto;
	}
	
	.uni-media-list-text-top {
		width: 100%;
		line-height: 36upx;
		font-size: 30upx;
		height: 56upx;
		font-size: 28upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow:ellipsis;
	}
	
	.uni-media-list-text-bottom {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
</style>
