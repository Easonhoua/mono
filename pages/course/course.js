//index.js
//获取应用实例
const app = getApp()
const httpUrl = 'https://http.aismono.net'
var swiper = [
  "../../images/Advertising2.png",
];


Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgUrls: swiper,
    // indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    list: [],
    showModal:false
  },

  onLoad: function () {
    let that = this;
    if (app.globalData.userInfo === null){
      that.setData({
        showModal: true
      })
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    var param = {
      classLanguage: 3
    }
    var paramJson = {
      body: param,
      sys: "1",
      sysVer: "html5",
      token: "",
      ver: "1.0"
    }
    wx.request({
      url: httpUrl + '/mono-biz-app/educationMiniProgram/queryClassType',
      method: 'post',
      data: paramJson,
      success:function(res){
        // console.log(res)
        let listData = res.data.body
        that.setData({
          list: listData
        }) 
      },
      fail:function(fail){
        console.log(fail)
      }
    })
  },

  getUserInfo: function (e) {
    this.hideModal();
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShareAppMessage() {

  }

})
