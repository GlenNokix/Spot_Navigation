// pages/help/help.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    locations: '',
    phone: '',
    content: '',
    latitude:'',
    longitude:'',
    mapinput:999,
    text:'点击右侧图标获取'
  },

  /**
   * 生命周期函数--监听页面加载
   */
onLoad() {      
  wx.authorize({
    scope: 'scope.userLocation',
    success: function () {
    // 用户授权成功
    },
    fail: function () {
    // 用户拒绝授权或授权失败
    wx.showToast({
    title: '请授权地理位置信息',
    icon: 'none',
    duration: 2000
    });
    }
    })
  wx.getLocation({
    type:'gcj02',
    success: (res) => {
      console.log(res)
      this.setData({
        latitude: res.latitude.toFixed(6),
        longitude: res.longitude.toFixed(6)
      })
    }
  })
},
//定位返回位置名称
locationreturn:function(e){
  if(this.data.latitude>1&&this.data.longitude>2){
    this.setData({
    locations:"千佛山景区",
    showIndex:null,
    mapinput:0,
    text:"千佛山景区"
    })
  }
},
//获取三个数据
getPhone: function (e) {
  this.setData({
    phone: e.detail.value
  })
},
getContent: function (e) {
  this.setData({
    content: e.detail.value
  })
},
//定位服务
getMap:function(e){
  var self = this;
  wx.request({
    url: 'https://restapi.amap.com/v3/geocode/regeo?parameters',
    data: {
      // 'city':'101120909',
      'key': 'ef1489ce8aa969cdf92aa6db4a220c81',
      'location':self.data.longitude+','+self.data.latitude,
      'extensions':"all",
      'radius':1000,
      'batch':false,
      'roadlevel':0
    },
    success: function (res) {
      console.log("|-----------------位置获取：-----------------");
      console.log(res.data);
      console.log(self.data.longitude)
      self.setData({
        locations:res.data.regeocode.aois[0].name,
        text:res.data.regeocode.aois[0].name,
      })
    }
  }) 
 
},
//提交事件及格式检查
submit: function (e) {
  if(!this.data.locations){
    wx.showToast({
      icon:"error",
      title: '请填写位置',
    })
    return
  }
  if(!this.data.phone){
    wx.showToast({
      icon:"error",
      title: '请填写电话',
    })
    return
  }
  if(!(/(^[0-9]*$)/.test(this.data.phone))){
    wx.showToast({
      icon:"error",
      title: '请正确填写电话',
    })
    return
  }
  if(!this.data.content){
    wx.showToast({
      icon:"error",
      title: '请填写求救内容',
    })
    return
  }
  console.log()
  wx.request({
    url: 'https://bd45.yunyouqilu.com/tms-fork/admin/warning/addWarning' ,
    method: "POST",
    data: {
      latitude:this.data.latitude,
      longitude: this.data.longitude,
      warningPhone: this.data.phone,
      warningText: this.data.content
    },
    header: {
      "accessToken": accessToken
    },
    success: function (res) {
      wx.showToast({
        title: '提交成功~',
        icon: 'loading',
        duration: 2000
      })
      console.log(res)
      // that.setData({
      //   success: true
      // })
    }
  })
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  //定位界面：确定
  openPopup(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      showIndex:index
    })
  },
  //定位界面：取消
  closePopup(){
    this.setData({
      showIndex:null,
      text:"点击右侧图标获取",
      locations:null

    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})