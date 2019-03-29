<template>
    <view class="content">
		<view style="text-align: center;">
			<image src="../../static/img/logo.jpg" style="width: 300upx;height: 300upx;"></image>
		</view>
        <view class="input-group">
            <view class="input-row border">
                <text class="title">学号：</text>
                <input type="text" v-model="account" placeholder="请输入学号">
            </view>
            <view class="input-row">
                <text class="title">密码：</text>
                <input type="text" password="true" v-model="password" placeholder="请输入密码">
            </view>
        </view>
        <view class="btn-row">
            <button type="warn" class="primary" @tap="bindLogin">登录</button>
        </view>
        <view class="action-row">
            <navigator url="../reg/reg">注册账号</navigator>
            <text>|</text>
            <navigator url="../pwd/pwd">忘记密码</navigator>
        </view>
     <!--   <view class="oauth-row" v-if="hasProvider" v-bind:style="{top: positionTop + 'px'}">
            <view class="oauth-image" v-for="provider in providerList" :key="provider.value">
                <image :src="provider.image" @tap="oauth(provider.value)"></image>
            </view>
        </view> -->
    </view>
</template>

<script>
    // import service from '../../service.js';
//     import {
//         mapState,
//         mapMutations
//     } from 'vuex'
// 
    export default {
        data() {
            return {
                providerList: [],
                hasProvider: false,
                account: '',
                password: '',
                positionTop: 0,
				// forcedLogin:false
            }
        },
        methods: {
            initPosition() {
                /**
                 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
                 * 反向使用 top 进行定位，可以避免此问题。
                 */
                this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
            },
            bindLogin() {
                /**
                 * 客户端对账号信息进行一些必要的校验。
                 * 实际开发中，根据业务需要进行处理，这里仅做示例。
                 */
                if (this.account.length < 5) {
                    uni.showToast({
                        icon: 'none',
                        title: '账号最短为 5 个字符'
                    });
                    return;
                }
                if (this.password.length < 6) {
                    uni.showToast({
                        icon: 'none',
                        title: '密码最短为 6 个字符'
                    });
                    return;
                }
                /**
                 * 下面简单模拟下服务端的处理
                 * 检测用户账号密码是否在已注册的用户列表中
                 * 实际开发中，使用 uni.request 将账号信息发送至服务端，客户端在回调函数中获取结果信息。
                 */
                const data = {
                    identityCode: this.account,
                    password: this.password
                };
//                 const validUser = service.getUsers().some(function (user) {
//                     return data.account === user.account && data.password === user.password;
//                 });
				uni.request({
					url: this.websiteUrl+'/uniApp/user/login',
					data: data,
					success: (result) => {
						console.log(result.data.data)
						//登录成功
						if(result.data.status == 1){
							uni.setStorageSync("name",result.data.data.name);
							uni.setStorageSync("nickName",result.data.data.userName);
							uni.setStorageSync("email",result.data.data.email);
							uni.setStorageSync("identityCode",result.data.data.identityCode);
							uni.setStorageSync("college",result.data.data.college);
							uni.setStorageSync("major",result.data.data.major);
							uni.setStorageSync("phone",result.data.data.phone);
							uni.setStorageSync("userImage",result.data.data.headImg);
							uni.setStorageSync("id",result.data.data.id);
							
							this.toMain();
						}else{
							uni.showToast({
							    icon: 'none',
							    title: '用户账号或密码不正确',
							});
						}
						
					},
					fail: (data, code) => {
						uni.showToast({
						    icon: 'none',
						    title: '服务器出问题了，正在努力恢复中',
						});
					}
				})
				
            },
            toMain() {
                /**
                 * 强制登录时使用reLaunch方式跳转过来
				 * 返回首页也使用reLaunch方式
                 */
//                 if (this.forcedLogin) {
//                     uni.reLaunch({
//                         url: '../user/user',
//                     });
//                 } else {
                    uni.navigateBack();
                // }

            }
        },
        onLoad(e) {
            this.initPosition();
			// this.forcedLogin = e.forcedLogin;
            // this.initProvider();
        }
    }
</script>

<style>
	
	
    .action-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .action-row navigator {
        color: #007aff;
        padding: 0 20px;
    }

    .oauth-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
    }

    .oauth-image {
        width: 100px;
        height: 100px;
        border: 1px solid #dddddd;
        border-radius: 100px;
        margin: 0 40px;
        background-color: #ffffff;
    }

    .oauth-image image {
        width: 60px;
        height: 60px;
        margin: 20px;
    }
	
	.primary{
		background-color:#d81e06;
	}
</style>
