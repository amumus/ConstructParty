<template>
	<view class="content">
		<view class="search-box">
			<!-- mSearch组件 如果使用原样式，删除组件元素-->
			<mSearch :mode="2" button="outside" isMain="false"
			:placeholder="defaultKeyword" @search="doSearch"  @confirm="doSearch" v-model="keyword"></mSearch>
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
	//引用mSearch组件，如不需要删除即可
	import mSearch from '@/components/mehaotian-search-revision/mehaotian-search.vue';
	export default {
		data() {
			return {
				defaultKeyword: "",
				keyword: "",
				
				// 列表
				pageStart:0,
				pageNum:10,
				listData: [],
				scoreType:1,
			}
		},
		onLoad() {
			this.loadDefaultKeyword();
		},
		components: {
			//引用mSearch组件，如不需要删除即可
			mSearch
		},
		methods: {
			//加载默认搜索关键字
			loadDefaultKeyword() {
				//定义默认搜索关键字，可以自己实现ajax请求数据再赋值,用户未输入时，以水印方式显示在输入框，直接不输入内容搜索会搜索默认关键字
				this.defaultKeyword = "默认关键字";
			},
			doSearch(e){
				this.keyword = e;
				console.log("点击搜索,keyword = "+this.keyword)
				this.getList(0);
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
					pageNum:this.pageNum,
					keyword:this.keyword
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
					publish_data:e.publish_data,
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
			},
			//================列表 end ======================
		}
			
		
	}
</script>
<style>
	.search-box {width:95%;background-color:rgb(242,242,242);padding:7.5px 2.5%;display:flex;justify-content:space-between;}
	.search-box .input-box {width:85%;flex-shrink:1;display:flex;justify-content:center;align-items:center;}
	.search-box .search-btn {width:15%;margin:0 0 0 2%;display:flex;justify-content:center;align-items:center;flex-shrink:0;font-size:14px;color:#fff;background:linear-gradient(to right,#ff9801,#ff570a);border-radius:30px;}
	.search-box .input-box>input {width:100%;height:30px;font-size:16px;border:0;border-radius:30px;-webkit-appearance:none;-moz-appearance:none;appearance:none;padding:0 3%;margin:0;background-color:#ffffff;}
	.placeholder-class {color:#9e9e9e;}
	.search-keyword {width:100%;background-color:rgb(242,242,242);}
	.keyword-list-box {height:calc(100vh - 55px);padding-top:5px;border-radius:10px 10px 0 0;background-color:#fff;}
	.keyword-entry-tap {background-color:#eee;}
	.keyword-entry {width:94%;height:40px;margin:0 3%;font-size:15px;color:#333;display:flex;justify-content:space-between;align-items:center;border-bottom:solid 1px #e7e7e7;}
	.keyword-entry image {width:30px;height:30px;}
	.keyword-entry .keyword-text,.keyword-entry .keyword-img {height:40px;display:flex;align-items:center;}
	.keyword-entry .keyword-text {width:90%;}
	.keyword-entry .keyword-img {width:10%;justify-content:center;}
	.keyword-box {height:calc(100vh - 55px);border-radius:10px 10px 0 0;background-color:#fff;}
	.keyword-box .keyword-block {padding:5px 0;}
	.keyword-box .keyword-block .keyword-list-header {width:94%;padding:5px 3%;font-size:13.5px;color:#333;display:flex;justify-content:space-between;}
	.keyword-box .keyword-block .keyword-list-header image {width:20px;height:20px;}
	.keyword-box .keyword-block .keyword {width:94%;padding:3px 3%;display:flex;flex-flow:wrap;justify-content:flex-start;}
	.keyword-box .keyword-block .hide-hot-tis {display:flex;justify-content:center;font-size:14px;color:#6b6b6b;}
	.keyword-box .keyword-block .keyword>view {display:flex;justify-content:center;align-items:center;border-radius:30px;padding:0 10px;margin:5px 10px 5px 0;height:30px;font-size:14px;background-color:rgb(242,242,242);color:#6b6b6b;}

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
