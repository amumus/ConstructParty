<template>
	<view class="content">
		<!-- 轮播图 -->
		<view class="uni-padding-wrap">
			<view class="page-section swiper">
				<view class="page-section-spacing">
					<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
						<swiper-item v-for="(value,key) in contentData" :key="key" @click="goContentDetail(value)">
							<image :src="value.image" mode="scaleToFill" class="swiper-item"></image>
							<text style="display: inline;">{{value.title}}</text>
							<view style="float: right;">
								<text>--</text>
								<text style="color: #007aff;">{{value.id}}</text>
								<text>--</text>
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
		
		<!-- 新闻列表 -->
		<view class="uni-list">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value,key) in listData" :key="key" @click="goDetail(value)">
				<view class="uni-media-list">
					<image class="uni-media-list-logo" :src="value.image"></image>
					<view class="uni-media-list-body">
						<view class="uni-media-list-text-top">{{value.title}}</view>
						<view class="uni-media-list-text-bottom">
							<text>{{value.author}}</text>
							<text>{{value.publish_data}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	var dateUtils = require('../../common/util.js').dateUtils;
	import {
		mapState
	} from 'vuex'

	export default {
		data() {
			return {
				//轮播图配置
				title: 'swiper',
				contentData:[],
				indicatorDots: false,
				autoplay: true,
				interval: 2000,
				duration: 500,
				// 列表
				pageStart:0,
				pageNum:10,
				listData: [],
				reload: false
			}
		},
		computed: mapState(['forcedLogin', 'hasLogin', 'userName']),
		onLoad() {
			// 			if (!this.hasLogin) {
			// 				uni.showModal({
			// 					title: '未登录',
			// 					content: '您未登录，需要登录后才能继续',
			// 					/**
			// 					 * 如果需要强制登录，不显示取消按钮
			// 					 */
			// 					showCancel: !this.forcedLogin,
			// 					success: (res) => {
			// 						if (res.confirm) {
			// 							/**
			// 							 * 如果需要强制登录，使用reLaunch方式
			// 							 */
			// 							if (this.forcedLogin) {
			// 								uni.reLaunch({
			// 									url: '../login/login'
			// 								});
			// 							} else {
			// 								uni.navigateTo({
			// 									url: '../login/login'
			// 								});
			// 							}
			// 						}
			// 					}
			// 				});
			// 			}
			// 列表
			this.getSwiper();
			this.getList(0);
		},
		onPullDownRefresh() {
			uni.showNavigationBarLoading();
			uni.showLoading({'title':"加载中..."});
			this.pageStart = 0;
			this.reload = true;
			this.getList(0);
			setTimeout(function() {
				uni.hideNavigationBarLoading();
				uni.stopPullDownRefresh();
				uni.hideLoading();
			}, 1000)
		},
		onReachBottom() {
			this.getList(1);
		},
		methods: {
			getSwiper(){
				let that = this;
				console.log(this.websiteUrl);
				uni.request({
					url: this.websiteUrl+'uniApp/content/listContent',
					success:(data)=> {
						that.contentData = data.data.data;
					}
				})
			},
			goContentDetail(value){
				console.log(value);
			},
			//================列表 start =============
			getList(type) {
				let that = this;
				//上拉加载更多
				if( type == 1){
					this.pageStart += 1;
				}else{//下拉刷新或第一次进入
					this.pageStart = 0;
				}
				var data = {
					pageStart:this.pageStart,
					pageNum:this.pageNum
				};
				
				uni.request({
					url: this.websiteUrl+'uniApp/news/getNewsList',
					data: data,
					success: (data) => {
 						if( type == 1){
							that.listData = that.listData.concat(data.data.data.data);
						}else{//下拉刷新或第一次进入
							that.listData = data.data.data.data;
							console.log(that.listData);
						}
						
					},
					fail: (data, code) => {
						uni.stopPullDownRefresh();
						console.log('fail' + JSON.stringify(data));
					}
				})
			},
			goDetail: function(e) {
				// 				if (!/前|刚刚/.test(e.published_at)) {
				// 					e.published_at = dateUtils.format(e.published_at);
				// 				}
				let detail = {
					author: e.author,
					image: e.image,
					id: e.id,
					created: e.created,
					title: e.title
				}
				uni.navigateTo({
					url: "../list2detail-detail/list2detail-detail?detailDate=" + encodeURIComponent(JSON.stringify(
						detail))
				})
			},
			setTime: function(items) {
				var newItems = [];
				items.forEach((e) => {
					newItems.push({
						author: e.author,
						image: e.image,
						id: e.id,
						created: dateUtils.format(e.created),
						title: e.title
					});
				});
				return newItems;
			}
		}
		//================列表 end ======================
		
	}
</script>

<style>
	.hello {
		display: flex;
		flex: 1;
		flex-direction: column;
	}

	.title {
		color: #8f8f94;
		margin-top: 50px;
	}

	.ul {
		font-size: 30px;
		color: #8f8f94;
		margin-top: 50px;
	}

	.ul>view {
		line-height: 50px;
	}

	/* 	轮播图 */
	.swiper {
		height: 500upx;
		
	}
/* background-color: rgba(0,0,0,0.1); */
	.swiper-item {
		display: block;
		height: 400upx;
		line-height: 400upx;
		text-align: center;
	}
	.swiper-item text{
		font-size: 25upx;
	}

	.swiper-list {
		margin-top: 40upx;
		margin-bottom: 0;
	}

	.uni-common-mt {
		margin-top: 60upx;
		position: relative;
	}

	.info {
		position: absolute;
		right: 20upx;
	}
		
	/* 列表 */
	.banner {
		height: 360upx;
		overflow: hidden;
		position: relative;
		background-color: #ccc;
	}

	.banner-img {
		width: 100%;
	}

	.banner-title {
		max-height: 84upx;
		overflow: hidden;
		position: absolute;
		left: 30upx;
		bottom: 30upx;
		width: 90%;
		font-size: 32upx;
		font-weight: 400;
		line-height: 42upx;
		color: white;
		z-index: 11;
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
		height: 74upx;
		font-size: 28upx;
		overflow: hidden;
	}

	.uni-media-list-text-bottom {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
</style>
