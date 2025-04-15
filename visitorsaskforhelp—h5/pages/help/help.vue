<template>
    <view style="height: 100%">
        <!-- pages/help/help.wxml -->
        <view class="whole">
            <text class="navigation">游客求救</text>
            <image class="backpic" src="/static/images/rider.png"></image>
        </view>
        <view class="content">
            <view class="frame">
                <view class="every01">
                    <text class="label">定位</text>
                    <text class="inputmap" :decode="true" @input="getLocations">{{ text }}</text>
                    <image class="mapper" @tap="getMap" data-index="0" src="/static/images/map.png"></image>
                </view>
                <view class="every02">
                    <text class="label">联系方式</text>
                    <input class="inputnum" @input="getPhone" maxlength="20" placeholder="输入您的联系方式" placeholder-style="color:#000000" type="number" :auto-focus="true" />
                </view>
                <view class="every03">
                    <text class="label">求助问题</text>
                    <textarea class="inputmapf" @input="getContent" maxlength="200" placeholder="填写求助问题" placeholder-style="color:#000000" :auto-focus="true"></textarea>
                </view>
            </view>
            <image class="final" @tap="submit" src="/static/images/handup.png"></image>
        </view>
        <view class="popup-box" v-if="showIndex == '0'" @tap="closePopup"></view>
        <view class="info-bottom" v-if="showIndex == '0'">
            <view class="row-info">
                <view class="mapcontainer">
                    <map id="maps"></map>
                </view>
            </view>
            <view class="row-btn">
                <view class="left-btn" @tap="closePopup">取消</view>
                <view class="right-btn" @tap="locationreturn">确认</view>
            </view>
        </view>
    </view>
</template>

<script>
// pages/help/help.js
export default {
    data() {
        return {
            locations: '',
            phone: '',
            content: '',
            latitude: '',
            longitude: '',
            mapinput: 999,
            text: '点击右侧图标获取',
            showIndex: ''
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad() {
        uni.authorize({
            scope: 'scope.userLocation',
            success: function () {
                // 用户授权成功
            },
            fail: function () {
                // 用户拒绝授权或授权失败
                uni.showToast({
                    title: '请授权地理位置信息',
                    icon: 'none',
                    duration: 2000
                });
            }
        });
        uni.getLocation({
            type: 'gcj02',
            success: (res) => {
                console.log(res);
                this.setData({
                    latitude: res.latitude.toFixed(6),
                    longitude: res.longitude.toFixed(6)
                });
            }
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {},
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {},
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {},
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {},
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {},
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {},
    methods: {
        //定位返回位置名称
        locationreturn: function (e) {
            if (this.latitude > 1 && this.longitude > 2) {
                this.setData({
                    locations: '千佛山景区',
                    showIndex: null,
                    mapinput: 0,
                    text: '千佛山景区'
                });
            }
        },

        //获取三个数据
        getPhone: function (e) {
            this.setData({
                phone: e.detail.value
            });
        },

        getContent: function (e) {
            this.setData({
                content: e.detail.value
            });
        },

        //定位服务
        getMap: function (e) {
            var that = this;
            uni.request({
                url: 'https://restapi.amap.com/v3/geocode/regeo?parameters',
                data: {
                    // 'city':'101120909',
                    key: 'ef1489ce8aa969cdf92aa6db4a220c81',
                    location: that.longitude + ',' + that.latitude,
                    extensions: 'all',
                    radius: 1000,
                    batch: false,
                    roadlevel: 0
                },
                success: function (res) {
                    console.log('|-----------------位置获取：-----------------');
                    console.log(res.data);
                    console.log(that.longitude);
                    that.setData({
                        locations: res.data.regeocode.aois[0].name,
                        text: res.data.regeocode.aois[0].name
                    });
                }
            });
        },

        //提交事件及格式检查
        submit: function (e) {
            if (!this.locations) {
                uni.showToast({
                    icon: 'error',
                    title: '请填写位置'
                });
                return;
            }
            if (!this.phone) {
                uni.showToast({
                    icon: 'error',
                    title: '请填写电话'
                });
                return;
            }
            if (!/(^[0-9]*$)/.test(this.phone)) {
                uni.showToast({
                    icon: 'error',
                    title: '请正确填写电话'
                });
                return;
            }
            if (!this.content) {
                uni.showToast({
                    icon: 'error',
                    title: '请填写求救内容'
                });
                return;
            }
            console.log();
            uni.request({
                url: 'https://bd45.yunyouqilu.com/tms-fork/admin/warning/addWarning',
                method: 'POST',
                data: {
                    latitude: this.latitude,
                    longitude: this.longitude,
                    warningPhone: this.phone,
                    warningText: this.content
                },
                header: {
                    accessToken: 'd62a75df5bdc475b84b80958cd2c6439'
                },
                success: function (res) {
                    uni.showToast({
                        title: '提交成功~',
                        icon: 'loading',
                        duration: 2000
                    });
                    console.log(res);
                    // that.setData({
                    //   success: true
                    // })
                }
            });
        },

        //定位界面：确定
        openPopup(e) {
            var index = e.currentTarget.dataset.index;
            this.setData({
                showIndex: index
            });
        },

        //定位界面：取消
        closePopup() {
            this.setData({
                showIndex: null,
                text: '点击右侧图标获取',
                locations: null
            });
        },

        getLocations() {
            console.log('占位：函数 getLocations 未声明');
        }
    }
};
</script>
<style>
@import './help.css';
</style>
