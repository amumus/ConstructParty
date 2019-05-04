<template>
	<view>
		<page-head :title="banner.title"></page-head>
		<view class="uni-common-mt">
			<view>
				<video id="myVideo" :src="banner.url"
				 @error="videoErrorCallback" :danmu-list="danmuList" enable-danmu danmu-btn controls></video>
			</view>
<!-- 弹幕相关内容 -->
<!-- 		<view class="uni-list uni-common-mt">
				<view class="uni-list-cell">
					<view>
						<view class="uni-label">弹幕内容</view>
					</view>
					<view class="uni-list-cell-db">
						<input v-model="danmuValue" class="uni-input" type="text" placeholder="在此处输入弹幕内容" />
					</view>
				</view>
			</view>
			<view class="uni-btn-v">
				<button @click="sendDanmu" class="page-body-button">发送弹幕</button>
			</view> -->

			<view class="contentTitle">| 简介</view>
			<view class="article-content">
			    <rich-text :nodes="banner.content"></rich-text>
			</view>
		</view>
		
		<view class="section">
			<form @submit="send">
				<textarea v-model="text" placeholder="期待你的神评论" />
				<button form-type="submit">发表评论</button>
			</form>
		</view>
		
		<!--评论区 -->
		<view class="contentTitle">| 观点</view>
		<view class="uni-padding-wrap">
			<!-- 评论区 start -->
			<view class="uni-comment">
				<view class="uni-comment-list" v-for="(value,key) in commentList" :key="key" @click="goToCommentDetail(value)">
						<view class="uni-comment-face">
							<image
								v-if="value.userImage == null || value.userImage == ''" :src="defaultImgUrl"
							  mode="widthFix">
							</image>
							<image v-else :src="value.userImage" mode="widthFix"></image>
						</view>
						<view class="uni-comment-body">
							<view class="uni-comment-top">
								<text>{{value.userName}}</text>
							</view>
							<view class="uni-comment-date">
								<text>{{value.publishDate}}</text>
							</view>
							<view class="uni-comment-content">{{value.commentContent}}</view>
						</view>
				</view>
			</view>
			<!-- 评论区 end -->
		</view>
		<view class="moreComment" v-if="haveMoreComment" @click="loadMoreComment">显示更多评论</view>
		<view class="moreComment" v-else>没有更多评论了</view>
	</view>
</template>
<script>
	var myTimeInterval = '';
	export default {
		data() {
			return {
				id:'',//用户id
				title: 'video',
				src: '',
// 				danmuList: [{
// 						text: '第 1s 出现的弹幕',
// 						color: '#ff0000',
// 						time: 1
// 					},
// 					{
// 						text: '第 3s 出现的弹幕',
// 						color: '#ff00ff',
// 						time: 3
// 					}
// 				],
				// danmuValue: '',
				banner:{},
				type:2,//video
				defaultImgUrl:"../../../../static/img/headImage.png",
				commentList:[],
				pageNum:5,//评论数
				pageStart:0,//评论页数
				text:'',//评论内容
				haveMoreComment:true
			}
		},
		onLoad(event) {
			let that = this;
			 // 目前在某些平台参数会被主动 decode，暂时这样处理。
			try {
			    this.banner = JSON.parse(decodeURIComponent(event.detailDate));
			} catch (error) {
			    this.banner = JSON.parse(event.detailDate);
			}
			this.banner.content =this.banner.content.replace(/\\/g, "").replace(/<img/g,
			"<img style=\"width:100%;\"");
			// console.log(this.banner)
			 this.getDetail();
			uni.setNavigationBarTitle({
			    title: this.banner.name
			});
			this.getCommentList();
			myTimeInterval = setInterval(function(){
				if(this.id != ''){
					uni.request({
					    url: that.websiteUrl+'uniApp/score/addUserScore?userId=' + that.id+'&type=3'
					})
					console.log('两分钟+2分');
				}
				console.log('定时器')
			},120000)//每两分钟执行一次，
		},
		onReady: function(res) {
			// #ifndef MP-ALIPAY
			this.videoContext = uni.createVideoContext('myVideo')
			// #endif
		},
		onUnload (){
				  console.log('页面关闭')
				  clearInterval(myTimeInterval);
		},
		methods: {
			sendDanmu: function() {
				this.videoContext.sendDanmu({
					text: this.danmuValue,
					color: this.getRandomColor()
				});
				this.danmuValue = '';
			},
			videoErrorCallback: function(e) {
				uni.showModal({
					content: e.target.errMsg,
					showCancel: false
				})
			},
			getRandomColor: function() {
				const rgb = []
				for (let i = 0; i < 3; ++i) {
					let color = Math.floor(Math.random() * 256).toString(16)
					color = color.length == 1 ? '0' + color : color
					rgb.push(color)
				}
				return '#' + rgb.join('')
			},
			getDetail : function(){
				//发送加分请求
				let that = this;
				this.id = uni.getStorageSync('id');
				console.log("Id = " + this.id)
				if(this.id != ''){
					uni.request({
						url: this.websiteUrl+'uniApp/score/addUserScore',
						data:{
							 userId:that.id,
							 type:5
						},
						success:(result)=>{
							if(result.data.data.display != 0){
								uni.showToast({
									icon:'none',
									title: result.data.data.message,
									duration: 2000
								});
							}
						}
					})
				}
			},
			getCommentList(){
				let that = this;
				let data = {
					type:that.type,
					targetId:that.banner.id,
					pageNum:that.pageNum,
					pageStart:that.pageStart
				};
				uni.request({
					url: this.websiteUrl+'uniApp/comment/getCommentListByIdAndType',
					data: data,
					success: (result) => {
						that.commentList = result.data.data.list;
					},
					fail: (data, code) => {
						uni.stopPullDownRefresh();
						console.log('fail' + JSON.stringify(data));
					}
				})
			},
			loadMoreComment(){
				this.haveMoreComment = false;
			},
			checklogin(){
				this.id = uni.getStorageSync('id');
				if(this.id == null || this.id == ''){
					return false;
				}else{
					return true;
				}
			},
			send(e) {
				if (!this.checklogin()) {
					uni.showModal({
						content: '请登录后再操作',
						confirmText:'马上登录',
						success: function (res) {
							if (res.confirm) {
								uni.navigateTo({
								    url: '../../login/login',
								});
							} else if (res.cancel) {
								
							}
						}
					});
					return false;
				}
				if (!this.text) {
					uni.showToast({
						title: '请输入评论内容',
						icon: 'none'
					});
					return false;
				}
				var self = this;
				
				var data = {
					userId:self.id,
					type:self.type,
					targetId:self.banner.id,
					parentId:0,
					rootId:0,
					parentUserId:0,
					commentContent:self.text
				};
				
				uni.request({
					url:this.websiteUrl+'uniApp/comment/addComment',
					data: data,
					success: (result) => {
						//评论成功，才重新请求comment列表
						if(result.data.status == 1){
							self.getCommentList();
						}else{
							uni.showToast({
								 title:  result.data.message,
								duration: 2000
							});
						}
					}
				})
			},
			goToCommentDetail(value){
				uni.navigateTo({
					url: "../comment/commentDetail?id=" + value.id+"&type=2"
				})
			}
		}
	}
</script>

<style>
	video {
		width: 750upx;
	}
	
	.article-content {
	    padding: 0 30upx;
	    overflow: hidden;
	    font-size: 30upx;
	    margin-bottom: 30upx;
	}
	.contentTitle{
		margin-left:25rpx;
		font-size:38rpx;
		font-size:38rpx;
		color:#ff6666;
	}
	
	.uni-padding-wrap{
		width:690upx;
		padding:0 30upx;
	}
	/* comment */
	.uni-comment{padding:5rpx 0; display: flex; flex-grow:1; flex-direction: column;}
	.uni-comment-list{flex-wrap:nowrap; padding:10rpx 0; margin:10rpx 0; width:100%; display: flex;}
	.uni-comment-face{width:70upx; height:70upx; border-radius:100%; margin-right:20upx; flex-shrink:0; overflow:hidden;}
	.uni-comment-face image{width:100%; border-radius:100%;}
	.uni-comment-body{width:100%;}
	.uni-comment-top{line-height:1.5em; justify-content:space-between;}
	.uni-comment-top text{color:#0A98D5; font-size:24upx;}
	.uni-comment-date{line-height:38upx; flex-direction:row; justify-content:space-between; display:flex !important; flex-grow:1;}
	.uni-comment-date{color:#666666; font-size:24upx; line-height:38upx;}
	.uni-comment-content{line-height:1.6em; font-size:28upx; padding:8rpx 0;}
	.uni-comment-replay-btn{background:#FFF; font-size:24upx; line-height:28upx; padding:5rpx 20upx; border-radius:30upx; color:#333 !important; margin:0 10upx;}
	
	/* 发布评论 */
	.section {
		display: block;
	}
	.section form {
		display: block;
		padding: 20upx;
	}
	.section textarea {
		background: #ffffff;
		display: block;
		margin: auto;
		font-size: 25upx;
		width: 98%;
		height: 100upx;
		padding: 10upx;
	}
	.section button {
		display: block;
		width: 250upx;
		font-size: 30upx;
		margin: 10upx 0 10upx auto;
	}
	
	
	/* 显示更多评论 */
	.moreComment{
		text-align: center;
		font-size: 30upx;
		color: #666666;
	}
	
	/* 发布评论 */
	.section {
		display: block;
	}
	.section form {
		display: block;
		padding: 20upx;
	}
	.section textarea {
		background: #ffffff;
		display: block;
		margin: auto;
		font-size: 25upx;
		width: 98%;
		height: 100upx;
		padding: 10upx;
	}
	.section button {
		display: block;
		width: 250upx;
		font-size: 30upx;
		margin: 10upx 0 10upx auto;
	}
	
	
</style>
