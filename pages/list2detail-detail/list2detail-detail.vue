<template>
    <view>
        <view class="banner">
            <image class="banner-img" :src="banner.image"></image>
            <view class="banner-title">{{banner.title}}</view>
        </view>
        <view class="article-meta">
            <text class="article-author">{{banner.author}}</text>
            <text class="article-text">发表于</text>
            <text class="article-time">{{banner.publish_data}}</text>
        </view>
        <view class="article-content">
            <rich-text :nodes="htmlString"></rich-text>
        </view>
        <!-- #ifdef MP-WEIXIN -->
        <ad v-if="htmlString" unit-id="adunit-01b7a010bf53d74e"></ad>
        <!-- #endif -->
		<!-- 发布评论 -->
		<view class="section">
			<form @submit="send">
				<textarea v-model="text" placeholder="期待你的神评论" />
				<button form-type="submit">发表评论</button>
			</form>
		</view>
		
		<!--评论区 -->
		<view class="uni-padding-wrap">
			<!-- 评论区 start -->
			<view class="uni-comment">
				<view class="uni-comment-list" v-for="(value,key) in commentList" :key="key">
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
		<view class="moreComment" v-if="haveMoreComment">显示更多评论</view>
		<view class="moreComment" v-else>没有更多评论了</view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
				id:'',//用户id
                title: 'list-triplex-row',
                banner: {},
                htmlString: "",
				type:1,//1代表页面类型是新闻
				defaultImgUrl:"../../static/img/headImage.png",
				// defaultImgUrl:"https://construct-party-1256364044.cos.ap-guangzhou.myqcloud.com/video/1.jpg"
				commentList:[],
				pageNum:5,//评论数
				pageStart:0,//评论页数
				text:'',//评论内容
				haveMoreComment:true
            }
        },
        onLoad(event) {
			uni.showLoading({
				title: '加载中'
			});
            // 目前在某些平台参数会被主动 decode，暂时这样处理。
            try {
                this.banner = JSON.parse(decodeURIComponent(event.detailDate));
            } catch (error) {
                this.banner = JSON.parse(event.detailDate);
            }
			console.log(this.banner)
            this.getDetail();
            uni.setNavigationBarTitle({
                title: this.banner.title
            });
			this.getCommentList();
        },
        methods: {
            getDetail() {
                uni.request({
                    url: this.websiteUrl+'uniApp/news/getNews?id=' + this.banner.id,
                    success: (data) => {
                        
                        this.htmlString = data.data.data.newsContent.content.replace(/\\/g, "").replace(/<img/g,
                        "<img style=\"width:100%;\"");
							// this.htmlString = data.data.data.newsContent.content;
                         uni.hideLoading();
                    },
                    fail: () => {
                        console.log('fail');
                    }
                })
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
								    url: '../login/login',
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
// 				self.replylist.unshift({
// 					text: this.text,
// 					avatar: this.userinfo.avatarUrl,
// 					nickName: this.userinfo.nickName,
// 					pubtime: '刚刚'
// 				});
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
				
// 				uni.request({
// 					url: util.apiurl + 'syj/index/setpinglun',
// 					method: 'POST',
// 					data: {
// 						text: self.text,
// 						id: self.id,
// 						token: self.token,
// 						shebei: util.shebei
// 					},
// 					success: ret => {
// 						if (ret.statusCode == 200 && ret.data.code < 1) {
// 							self.text = '';
// 							uni.showToast({
// 								title: '审核后显示'
// 							});
// 							setTimeout(function() {
// 								uni.hideLoading();
// 							}, 1000);
// 						} else {
// 							uni.showToast({
// 								title: ret.data.msg,
// 								icon: 'none'
// 							});
// 							setTimeout(function() {
// 								uni.hideLoading();
// 							}, 1000);
// 						}
// 					},
// 					fail: function() {
// 						uni.hideLoading();
// 					},
// 					complete: function() {
// 						this.loading = false;
// 					},
// 					header: {
// 						auth: util.httpauth
// 					}
// 				});
			},
        }
    }
</script>

<style>
    view {
        font-size: 28upx;
        line-height: 1.8;
    }

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

    .article-meta {
        padding: 20upx 40upx;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        color: gray;
    }

    .article-text {
        font-size: 26upx;
        line-height: 50upx;
        margin: 0 20upx;
    }

    .article-author,
    .article-time {
        font-size: 30upx;
    }

    .article-content {
        padding: 0 30upx;
        overflow: hidden;
        font-size: 30upx;
        margin-bottom: 30upx;
    }
	/* 评论区 */
	/* .uni-comment-face image{
		height: 50upx;
		width: 50upx;
	} */
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
	.uni-comment-date view{color:#666666; font-size:24upx; line-height:38upx;}
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
</style>
