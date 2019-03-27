<template>
    <view class="center">
		<view class="logo">
			<!-- #ifdef MP-WEIXIN -->
			<image
				class="logo-img"
				:src="token ? userinfo.userImage : defaultUserImage"
				@click="gobind"
			></image>
			<view class="logo-title">
				<text class="uer-name" v-if="token" @click="gobind">
					Hi，{{ userinfo.nickName }}
				</text>
				<text class="name" v-if="token && name">({{ name }})</text>
				<button
					open-type="getUserInfo"
					v-if="!token"
					id="loginbutton"
					type="primary"
					@getuserinfo="bindLogin"
				>
					立即登录！
				</button>
			</view>
			<!-- #endif -->
		
			<!-- #ifdef APP-PLUS -->
			<image
				class="logo-img"
				@click="toggleavatar"
				:src="token ? userinfo.avatar : avatarUrl"
			></image>
			<view class="logo-title">
				<text v-if="token" @click="toggleavatar">Hi，{{ userinfo.nickName }}</text>
				<button v-if="!token" id="loginbutton" type="primary" @click="gologinpage">
					用户名登录或注册！
				</button>
			</view>
			<!-- #endif -->
		</view>
		<view class="center-list">
			<view class="center-list-item border-bottom" @click="myScore">
				<text class="list-text">我的积分</text>
			</view>
			<view class="center-list-item border-bottom" @click="myScoreReport">
				<text class="list-text">我的报表</text>
			</view>
			<view class="center-list-item border-bottom" @click="myComment">
				<text class="list-text">我的评论</text>
			</view>
		</view>
		<view class="center-list" @click="logout" v-if="token">
			<view class="center-list-item">
				<text class="list-text">退出登录</text>
			</view>
		</view>
        <!-- <view class="btn-row">
            <button v-if="!token" type="primary" class="primary" @tap="bindLogin">登录</button>
            <button v-if="token" type="default" @tap="bindLogout">退出登录</button>
        </view> -->
    </view>
</template>

<script>
//     import {
//         mapState,
//         mapMutations
//     } from 'vuex'

    export default {
		data(){
			return {
				token: false,//是否登录
				userinfo: {
					nickName:'林木木',
					userImage:'../../static/img/logo.png'
				},
				name:"",
				defaultUserImage: "../../static/img/logo.png"//默认头像路径
			}
			
		},
		mounted(){
			// console.log("Mounted")
		},
		onLoad(){
			// console.log("onload")
		},
		onShow(){
			// console.log("onshow")
			this.name = uni.getStorageSync( 'name');
			if(this.name == null || this.name == ''){
				this.token = false;
			}else{
				this.token = true;
				this.userinfo.nickName = uni.getStorageSync('nickName')
				this.userinfo.email = uni.getStorageSync( 'email')
				this.userinfo.identityCode = uni.getStorageSync('identityCode')
				this.userinfo.college = uni.getStorageSync( 'college')
				this.userinfo.major = uni.getStorageSync( 'major')
				this.userinfo.phone = uni.getStorageSync('phone')
				this.userinfo.userImage = uni.getStorageSync( 'userImage')
				
				if(this.userinfo.userImage == null || this.userinfo.userImage ==''){
					this.userinfo.userImage = this.defaultUserImage;
				}
			}
			
			
			
		},
//         computed: {
//             ...mapState(['hasLogin', 'forcedLogin'])
//         },
        methods: {
            // ...mapMutations(['logout']),
            bindLogin() {
                uni.navigateTo({
                    url: '../login/login',
                });
            },
            bindLogout() {
                this.logout();
                /**
                 * 如果需要强制登录跳转回登录页面
                 */
                if (this.token) {
                    uni.reLaunch({
                        url: '../login/login',
                    });
                }
            },
			logout(){
				let that = this;
				uni.showModal({
					content: '真的要退出么',
					success: function (res) {
						console.log(res)
						if (res.confirm) {
							that.token = false;
							uni.setStorageSync("name",'');
							uni.setStorageSync("nickName",'');
							uni.setStorageSync("email",'');
							uni.setStorageSync("identityCode",'');
							uni.setStorageSync("college",'');
							uni.setStorageSync("major",'');
							uni.setStorageSync("phone",'');
							uni.setStorageSync("userImage",'');
							uni.setStorageSync("id",'');
						} else if (res.cancel) {
							
						}
					}
				});
				
				
			},
			myScore() {
				 
			},
			myComment(){
				
			},
			myScoreReport(){
				
			}
			
        }
    }
</script>

<style>
.logo {
	position: relative;
	background: #f44336;
}
.center {
	overflow: hidden;
}
.logo-title {
	color: #ffffff;
}
.name {
	font-size: 20upx;
	color: #fff;
	margin-left: 10upx;
}
.center .list-icon {
	color: #f44336;
}
#loginbutton {
	display: flex;
	margin: 0;
	border: none;
	box-shadow: none;
	background: transparent;
	font-size: 30upx;
	z-index: 999;
	color: #ffffff;
	width: auto;
	position: absolute;
	top: 0;
	left: 0;
	text-align: center;
	width: 100%;
	height: 100%;
	align-items: center;
	justify-content: center;
}
#loginbutton:after,
#loginbutton:before {
	display: none;
}

.center {
	flex-direction: column;
}

.logo {
	width: 750px;
	height: 240px;
	padding: 20px;
	box-sizing: border-box;
	background-color: #d81e06;
	flex-direction: row;
	align-items: center;
}

.logo-hover {
	opacity: 0.8;
}

.logo-img {
	width: 150px;
	height: 150px;
	border-radius: 150px;
}

.logo-title {
	height: 150px;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	flex-direction: row;
	margin-left: 20px;
}

.uer-name {
	height: 60px;
	line-height: 60px;
	font-size: 38px;
	color: #FFFFFF;
}

.go-login.navigat-arrow {
	font-size: 38px;
	color: #FFFFFF;
}

.login-title {
	height: 150px;
	align-items: self-start;
	justify-content: center;
	flex-direction: column;
	margin-left: 20px;
}

.center-list {
	background-color: #FFFFFF;
	margin-top: 20px;
	width: 750px;
	flex-direction: column;
}

.center-list-item {
	height: 90px;
	width: 750px;
	box-sizing: border-box;
	flex-direction: row;
	padding: 0px 20px;
}

.border-bottom {
	border-bottom-width: 1px;
	border-color: #f1f1f1;
	border-bottom-style: solid;
}

.list-icon {
	width: 40px;
	height: 90px;
	line-height: 90px;
	font-size: 34px;
	color: #FF80AB;
	text-align: center;
	font-family: texticons;
	margin-right: 20px;
}

.list-text {
	height: 90px;
	line-height: 90px;
	font-size: 34px;
	color: #555;
	flex: 1;
	text-align: left;
}

.navigat-arrow {
	height: 90px;
	width: 40px;
	line-height: 90px;
	font-size: 34px;
	color: #555;
	text-align: right;
	font-family: texticons;
}

</style>
