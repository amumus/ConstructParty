<template>
	<view class="container">
		<!-- <view class="page-section-title" style="display: block;">
			<view class="uni-hello-text uni-common-pb">
				学习总积分为：500
			</view>
			 <text class="navigate" @click="goBrowser" selectable>https://github.com/F-loat/mpvue-echarts</text> -->
		<!-- </view> -->
		<view style="background-image: url('https://construct-party-1256364044.cos.ap-guangzhou.myqcloud.com/score_bg.jpg');height: 300upx;width: 100%;display: block;">
			<view style="height: 50upx;"></view>
			<view style="font-size: 50upx ;color: #ff6699;margin-left:300upx;">总积分</view>
			<text style="color: #997722;font-size: 90upx;margin-left:290upx;">{{score}}</text>
		</view>
		<view class="canvasView">
			<view class="canvas-bar">
				<view class="title">积分比重</view>
				<!-- <button class="update-btn" type="primary" size="mini" @click="updatePie">修改饼状图数据</button> -->
			</view>
			<mpvue-echarts :echarts="echarts" :onInit="pieInit" canvasId="pie" ref="pieChart" />
		</view>
		<view class="canvasView">
			<view class="title">每月分数</view>
			<mpvue-echarts :echarts="echarts" :onInit="lineInit" canvasId="line" ref="lineChart" />
		</view>
	</view>
</template>

<script>
	import * as echarts from '@/components/echarts/echarts.simple.min.js';
	import mpvueEcharts from '@/components/mpvue-echarts/src/echarts.vue';
	var pieChart = '';
	var lineChart  = '';
	let cityList = [{
		value: 55,
		name: '登录积分'
	}, {
		value: 38,
		name: '学习视频时长'
	}, {
		value: 20,
		name: '学习文章时长'
	},{
		value: 30,
		name: '文章数积分'
	},{
		value: 40,
		name: '视频数积分'
	}];

	var pieOption = {
		animation: false,
		backgroundColor: '#F8F8F8',
		color: ['#37A2DA', '#32C5E9', '#67E0E3', '#91F2DE', '#FFDB5C', '#FF9F7F','#1F5F7F'],
		series: [{
			label: {
				normal: {
					fontSize: 14
				}
			},
			type: 'pie',
			center: ['50%', '50%'],
			radius: [0, '60%'],
			data: [],
			itemStyle: {
				emphasis: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 2, 2, 0.3)'
				}
			}
		}]
	};

	var lineOption = {
		animation: false,
		color: ['#37A2DA'],
		grid: {
			x: 35,
			x2: 10,
			y: 30,
			y2: 25
		},
		calculable: false,
		xAxis: [{
			type: 'category',
			data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
		}],
		yAxis: [{
			type: 'value',
			splitArea: {
				show: true
			}
		}],
		series: [{
			name: '分数',
			type: 'line',
			data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
		}]
	};

	export default {
		data() {
			return {
				echarts: echarts,
				updateStatus: false,
				id:'',
				score:''
			}
		},
		onLoad() {
			this.id = uni.getStorageSync( 'id');
			this.getData();
			this.getUserScore();

		},
		methods: {
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
			getData(){
				// 
				let that = this;
				pieOption.series[0].data.push({
					
					value: 40,
					name: '111'
					
				})
				uni.request({
					url: this.websiteUrl+'uniApp/score/getUserScoreReport',
					data: {
						userId : that.id 
					},
					success: (result) => {
						console.log("type")
						console.log(result.data.data.typeList);
						console.log("monthList")
						console.log(result.data.data.monthList);
						//  
						pieOption =  {
							animation: false,
							backgroundColor: '#F8F8F8',
							color: ['#37A2DA', '#32C5E9', '#67E0E3', '#91F2DE', '#FFDB5C', '#FF9F7F','#1F5F7F'],
							series: [{
								label: {
									normal: {
										fontSize: 14
									}
								},
								type: 'pie',
								center: ['50%', '50%'],
								radius: [0, '60%'],
								data: [],
								itemStyle: {
									emphasis: {
										shadowBlur: 10,
										shadowOffsetX: 0,
										shadowColor: 'rgba(0, 2, 2, 0.3)'
									}
								}
							}]
						};
						pieOption.series[0].data = result.data.data.typeList.slice(0);
						pieChart.setOption(pieOption);
						
						lineOption = {
							animation: false,
							color: ['#37A2DA'],
							grid: {
								x: 35,
								x2: 10,
								y: 30,
								y2: 25
							},
							calculable: false,
							xAxis: [{
								type: 'category',
								data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
							}],
							yAxis: [{
								type: 'value',
								splitArea: {
									show: true
								}
							}],
							series: [{
								name: '分数',
								type: 'line',
								data:result.data.data.monthList
							}]
						};
						lineChart.setOption(lineOption);
						
// 						lineOption.series[0] =
// 						[{
// 							name: '分数',
// 							type: 'line',
// 							data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
// 						}];
// lineOption.series[0].data =[0, 0, 0, 0, 0, 0, 135.6, 162.2, 32.6, 0, 0, 0];
					},
					fail: (data, code) => {
						uni.stopPullDownRefresh();
						console.log('fail' + JSON.stringify(data));
					}
				})
			},
			pieInit(canvas, width, height) {
				pieChart = echarts.init(canvas, null, {
					width: width,
					height: height
				})
				canvas.setChart(pieChart)

				pieChart.setOption(pieOption)
				return pieChart
			},
			lineInit(canvas, width, height) {
				lineChart = echarts.init(canvas, null, {
					width: width,
					height: height
				})
				canvas.setChart(lineChart)
				lineChart.setOption(lineOption)
				return lineChart
			}
		},
		components: {
			mpvueEcharts
		}
	}
</script>

<style>
	page,
	view {
		display: flex;
		/* uni-app默认使用flex布局。因为flex布局有利于跨更多平台，尤其是采用原生渲染的平台。如不了解flex布局，请参考http://www.w3.org/TR/css3-flexbox/。若不需要flex布局可删除本行*/
	}

	page {
		min-height: 100%;
	}

	.page-section-title {
		padding: 0 30upx;
	}

	.title {
		margin-left: 30upx;
		color: #8f8f94;
	}

	.container {
		padding-bottom: 30upx;
		box-sizing: border-box;
	}

	.container,
	.canvasView {
		flex: 1;
		flex-direction: column;
	}

	.navigate {
		color: #007AFF;
	}

	.canvas-bar {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.update-btn {
		margin-right: 30upx;
	}
</style>
