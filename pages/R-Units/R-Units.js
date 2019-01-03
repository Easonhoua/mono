// pages/R-Units/R-Units.js
var app = getApp()
const Monohttps = app.globalData.Monohttps;

Page({
  data: {
    curClass:'',
    list: {}
  },
  onLoad: function (options) {
    let that = this
    var optData1 = wx.getStorageSync('val')
    if (optData1 == '0') {
      wx.setNavigationBarTitle({
        title: '英语派课文'
      })
    } else if (optData1 == '1') {
      wx.setNavigationBarTitle({
        title: '人教版课文'
      })
    } else if (optData1 == '2') {
      wx.setNavigationBarTitle({
        title: '加州小学课文'
      })
    } else if (optData1 == '3') {
      wx.setNavigationBarTitle({
        title: '牛津小学课文'
      })
    } else if (optData1 == '4') {
      wx.setNavigationBarTitle({
        title: '外研社课文'
      })
    } else if (optData1 == '5'){
      wx.setNavigationBarTitle({
        title: '香港朗文课文'
      })
    }


    let tid = options.tid
    let whichclass = decodeURIComponent(wx.getStorageSync('whichclass'))
    that.setData({
      curClass: whichclass
    })
    var param = {
      unit: tid
    }
    var paramJson = {
      body: param,
      sys: "1",
      sysVer: "html5",
      token: "",
      ver: "1.0"
    }

    wx.request({
      url: Monohttps + '/mono-biz-app/educationMiniProgram/queryClassLesson',
      method: 'post',
      data: paramJson,
      success: function (res) {
        let listData = res.data.body
        that.setData({
          list: listData,
        })
      },
      fail: function (fail) {
        wx.showToast({
          title: '网络异常！',
        })
      }
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})