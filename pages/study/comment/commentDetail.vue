<template>
	<view id="moments">
		<view class="moments__post">
			<view class="post-left">
				<image class="post_header" :src="post.headImg"></image>
			</view>

			<view class="post_right">
				<text class="post-username">{{post.username}}</text>
				<view id="paragraph" class="paragraph">{{post.content}}</view>

				<!-- 资料条 -->
				<view class="toolbar">
					<view class="timestamp">{{post.created}}</view>
					<view class="comment" @tap="comment(0)">
						<image src="../../../static/index/comment.png"></image>
					</view>
				</view>
				<!-- 赞／评论区 -->
				<view class="post-footer">
					<view class="uni-list">
						<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="goDetail(value)">
							<view class="uni-media-list">
								<image class="uni-media-list-logo" :src="value.image"></image>
								<view class="uni-media-list-body">
									<view class="uni-media-list-text-top">{{value.title}}</view>
									<view class="uni-media-list-text-bottom">
										<text>{{value.author}}</text>
										<text>{{value.created}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					
					<view class="footer_content" v-for="(comment,comment_index) in post.comments.comment" :key="comment_index" @tap="reply(index,comment_index)">
						<text class="comment-nickname">{{comment.userName}}: <text class="comment-content">{{comment.commentContent}}</text></text>
					</view>
				</view>
			</view>
			<!-- 结束 post -->
		</view>

		<view class="foot" v-show="showInput">
			<chat-input @send-message="send_comment" @blur="blur" :focus="focus" :placeholder="input_placeholder"></chat-input>
			<!-- <chat-input @send-message="send_comment" @blur="blur" :placeholder="input_placeholder"></chat-input> -->
		</view>
		<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
	</view>

</template>

<script>
	import chatInput from './chatinput.vue'; //input框
	// import postData from '../../../common/index.post.data.js';//朋友圈数据
	
	export default {
		components: {
			chatInput
		},
		data() {
			return {
				id:'',//评论id
				targetId:'',
				type:2,
				post: '',//模拟数据
						// posts: postData,//模拟数据
				userId: '',
				username: 'Liuxy',
				parentUserId:'',//根评论id
				index: '',
				comment_index: '',

				input_placeholder: '评论', //占位内容
				focus: false, //是否自动聚焦输入框
				is_reply: false, //回复还是评论
				showInput: false, //评论输入框

				screenHeight: '', //屏幕高度(系统)
				platform: '',
				windowHeight: '' ,//可用窗口高度(不计入软键盘)
				
				loadMoreText: "加载中...",
				showLoadMore: false,
				
				value:{
					id:"",
					title:"",
					author:"",
					created:"",
					image:""
				},
				// inputValue:''
			}
		},
		mounted() {
			uni.getStorage({
				key: 'posts',
				success: function (res) {
					console.log(res.data);
					this.posts = res.data;
				}
			});

		},
		onLoad(event) {		
			this.id = event.id;
			this.userId = uni.getStorageSync( 'id');
			
			uni.getSystemInfo({ //获取设备信息
				success: (res) => {
					this.screenHeight = res.screenHeight;
					this.platform = res.platform;
				}
			});
			this.getCommontById();
			
		},
		onShow() {
			uni.onWindowResize((res) => { //监听窗口尺寸变化,窗口尺寸不包括底部导航栏
				if(this.platform === 'ios'){
					this.windowHeight = res.size.windowHeight;
					this.adjust();
				}else{
					if (this.screenHeight - res.size.windowHeight > 60 && this.windowHeight <= res.size.windowHeight) {
						this.windowHeight = res.size.windowHeight;
						this.adjust();
					}
				}
			});
		},
		onHide() {
			uni.offWindowResize(); //取消监听窗口尺寸变化
		},
		onUnload() {
			this.max = 0,
				this.data = [],
				this.loadMoreText = "加载更多",
				this.showLoadMore = false;
		},
		onReachBottom() { //监听上拉触底事件
			console.log('onReachBottom');
			this.showLoadMore = true;
			setTimeout(() => {
				//获取数据
				if (this.posts.length < 20){//测试数据
					this.posts = this.posts.concat(this.posts);
				}else{
					this.loadMoreText = "暂无更多";
				}
			}, 1000);
		},
		onPullDownRefresh() { //监听下拉刷新动作
			console.log('onPullDownRefresh');
			// 这里获取数据
			setTimeout(function() {
				//初始化数据
				uni.stopPullDownRefresh(); //停止下拉刷新
			}, 1000);
		},
		onNavigationBarButtonTap(e) {//监听标题栏点击事件
			if (e.index == 0) {
				this.navigateTo('../publish/publish')
			}
		},
		computed:{
			
		},
		methods: {
			getCommontById(){
				let that = this;
				uni.request({
				    url: this.websiteUrl+'uniApp/comment/getCommontById?id=' + this.id,
				    success: (data) => {
						data = data.data.data;
						that.value = data.contentMap;
						if(that.value.name != null){
							that.value.title = that.value.name;
							that.value.image = that .value.img;
						}
						that.type = data.comment.type;
						that.targetId = data.contentMap.id;
						that.parentUserId = data.comment.userId;
						
						that.post = {
							"id": that.id,
							"userId": data.user.id,
							"username": data.user.userName,
							"headImg": data.user.headImg,
							"content": data.comment.commentContent,
							"islike": 0,
							"comments": {
								"total": 2,
								"comment":data.list,
							},
							"created": data.comment.created
						}
						
				    },
				    fail: () => {
				        console.log('fail');
				    }
				})
			},
			test(){
				this.navigateTo('../test/test');
			},
			navigateTo(url) {
				uni.navigateTo({
					url: url
				});
			},
			comment(index) {
				console.log(index)
				this.showInput = true; //调起input框
				this.focus = true;
				this.index = index;
			},
			adjust() { //当弹出软键盘发生评论动作时,调整页面位置pageScrollTo
				return;
				uni.createSelectorQuery().selectViewport().scrollOffset(res => {
					var scrollTop = res.scrollTop;
					let view = uni.createSelectorQuery().select("#post-" + this.index);
					view.boundingClientRect(data => {
						console.log("data:" + JSON.stringify(data));
						console.log("手机屏幕高度:" + this.screenHeight);
						console.log("竖直滚动位置" + scrollTop);
						console.log("节点离页面顶部的距离为" + data.top);
						console.log("节点高度为" + data.height);
						console.log("窗口高度为" + this.windowHeight);

						uni.pageScrollTo({
							scrollTop: scrollTop - (this.windowHeight - (data.height + data.top + 45)), //一顿乱算
							// scrollTop: 50, 
							duration: 300
						});
					}).exec();
				}).exec();
			},
			reply(index, comment_index) {
				this.is_reply = true; //回复中
				this.showInput = true; //调起input框
				let replyTo = this.posts[index].comments.comment[comment_index].username;
				this.input_placeholder = '回复' + replyTo;
				this.index = index; //post索引
				this.comment_index = comment_index; //评论索引
				this.focus = true;
			},
			blur: function() {
				this.init_input();
			},
			//发送评论
			send_comment: function(message) {
				let that = this;
				console.log(message.content)
				uni.request({
					url: this.websiteUrl+'uniApp/comment/addComment',
					data:{
						userId:that.userId,
						commentContent:message.content,
						type:that.type,
						targetId:that.targetId,
						rootId:that.id,
						parentUserId:that.parentUserId
						
					},
					success:(data)=> {
						// console.log(data)
// 						that.commentList = data.data.data.list;
// 						that.count = data.data.data.count;
// 						console.log(that.commentList);
						that.getCommontById();
					}
				})
				
				this.init_input();
			},
			init_input() {
				this.showInput = false;
				this.focus = false;
				this.input_placeholder = '评论';
				this.is_reply = false;
			},
			previewImage(imageList, image_index) {
				var current = imageList[image_index];
				uni.previewImage({
					current: current,
					urls: imageList
				});
			},
// 			goPublish() {
// 				uni.navigateTo({
// 					url: './publish/publish',
// 					success: res => {},
// 					fail: () => {},
// 					complete: () => {}
// 				});
// 			},
			goDetail(){
				let that = this;
				if(that.value.name !=null){
					uni.navigateTo({
						url: '/pages/study/video/video-detial?detailDate=' + encodeURIComponent(JSON.stringify(that.value))
					});
				}else{
					uni.navigateTo({
						url: "/pages/list2detail-detail/list2detail-detail?detailDate=" + encodeURIComponent(JSON.stringify(
							that.value))
					})
				}
				
			}
		}
	}
</script>

<style scoped>
	.liked{
		/* display: inline-block; */
		position: relative;
		margin-right: 10upx;
		width: 34upx;
		height: 34upx;
	}
	.post-username{
		font-size:32upx;
		font-weight: 600;
		color: #36648B;
	}
		
		
	
	
	.gallery_img {
		width: 100%;
		height: 100%
	}
	
	.header {
		width: 100%;
		height: 100%;
		z-index: 10;
		border-radius: 40upx;
	}
	
	.publish {
		position: absolute;
		top: 20upx;
		right: 20upx;
	
		/* z-index: 9999; */
	}
	
	
	
	.post_header {
		
		width: 90upx !important;
		height: 90upx !important;
		border-radius: 10upx;
		margin-top: 8upx;
	}
	
	#moments {
		background: #fff;
	}
	
	#moments .moments__post {
		background: #fff;
		display: block;
		border-bottom: 1px solid #f2eeee;
		padding: 30upx 20upx;
		position: relative;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
	}
	
	#moments .moments__post::before {
		content: none
	}
	
	#moments .moments__post .post_right {
		font-size: 32upx;
		display: table-cell;
		padding-left: 20upx;
		width: 100%;
	}
	
	/* #moments .moments__post .post_right .paragraphExtender {
			margin: 5px auto;
			display: -webkit-box;
			display: -webkit-flex;
			display: -ms-flexbox;
			display: flex
		} */
	
	#moments .moments__post .title {
		color: #094dcc
	}
	
	#moments .moments__post .thumbnails {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		/* display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox; */
		/* -webkit-flex-wrap: wrap;
		-ms-flex-wrap: wrap; */
	}
	
	#moments .moments__post .thumbnails .thumbnail {
		width: 30%;
		height: 180upx;
		margin: 4upx;
		background: #757575;
		overflow: hidden;
	}
	
	.my-gallery{
		width: 250upx;
		height: 400upx;
		margin: 4upx;
		background: #757575;
		overflow: hidden
	}
	
	#moments .moments__post .toolbar {
		position: relative;
		top: 10upx;
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-align: center;
		-webkit-align-items: center;
		-ms-flex-align: center;
		align-items: center
	}
	
	#moments .moments__post .toolbar .timestamp {
		color: #757575;
		font-size: 22upx;
	}
	
	
	#moments .moments__post .like {
		width: auto;
		height: auto;
		position: absolute;
		right: 60upx;
		display: flex;
		align-items: center;
	}
	#moments .moments__post .comment {
		width: auto;
		height: auto;
		position: absolute;
		right: 0upx;
		display: flex;
		align-items: center;
	}
	
	#moments .moments__post .toolbar image{
		padding-left: 20upx;
		width: 40upx;
		height: 40upx;
	}
	
	.post-footer{
		margin-top: 30upx;
		background-color: #f3f3f5;
		width: 100%;
	}
	
	#moments .moments__post .footer_content {
		padding-left: 10upx;
		position: relative;
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-align: center;
		-webkit-align-items: center;
		-ms-flex-align: center;
		align-items: center;
		-webkit-flex-wrap: wrap;
		-ms-flex-wrap: wrap;
		flex-wrap: wrap
	}
	
	#moments .moments__post .footer_content .nickname {
		color: #36648B;
		font-size: 32upx
	}
	
	#moments .moments__post .footer_content .comment-nickname {
		color: #36648B;
		font-size: 32upx
	}
	
	#moments .moments__post .footer_content .comment-content {
		color: #000000;
		font-size: 32upx
	}
	
	.foot {
		position: fixed;
		width: 100%;
		height: 90upx;
		min-height: 90upx;
		left: 0upx;
		bottom: 0upx;
		overflow: hidden;
	}
	
	
	/* 中间文章列表 */
	.uni-list {
		background-color: #FFFFFF;
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
		border:1upx solid #c8c7cc;
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
		padding: 12upx 20upx;
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
