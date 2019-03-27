<template>
	<view>
		<page-head :title="title"></page-head>
		<view class="uni-padding-wrap uni-common-mt">
			<view>
				<video id="myVideo" :src="banner.url"
				 @error="videoErrorCallback" :danmu-list="danmuList" enable-danmu danmu-btn controls></video>
			</view>
			<!-- #ifndef MP-ALIPAY -->
			<view class="uni-list uni-common-mt">
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
			</view>
			<view class="article-content">
			    <rich-text :nodes="banner.content"></rich-text>
			</view>
			<!-- #endif -->
		</view>
	</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				title: 'video',
				src: '',
				danmuList: [{
						text: '第 1s 出现的弹幕',
						color: '#ff0000',
						time: 1
					},
					{
						text: '第 3s 出现的弹幕',
						color: '#ff00ff',
						time: 3
					}
				],
				danmuValue: '',
				banner:{}
			}
		},
		onLoad(event) {
			 // 目前在某些平台参数会被主动 decode，暂时这样处理。
			try {
			    this.banner = JSON.parse(decodeURIComponent(event.detailDate));
			} catch (error) {
			    this.banner = JSON.parse(event.detailDate);
			}
			// console.log(this.banner)
			 this.getDetail();
			uni.setNavigationBarTitle({
			    title: this.banner.name
			});
		},
		onReady: function(res) {
			// #ifndef MP-ALIPAY
			this.videoContext = uni.createVideoContext('myVideo')
			// #endif
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
</style>
