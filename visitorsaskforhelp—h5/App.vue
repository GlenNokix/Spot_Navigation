<script>
// app.js
export default {
    data() {
        return {};
    },
    onLaunch() {
        // 展示本地存储能力
        const logs = uni.getStorageSync('logs') || [];
        logs.unshift(Date.now());
        uni.setStorageSync('logs', logs);

        // 登录
        uni.login({
            success: (res) => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        });
    },
    globalData: {
        userInfo: null
    }
};
</script>
<style>
@import './app.css';
</style>
