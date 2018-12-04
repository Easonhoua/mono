// pages/R-Units/R-Units.js
var app = getApp()
const Monohttps = app.globalData.Monohttps;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    curClass:'',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let val = wx.getStorageSync('val')
    let lan = wx.getStorageSync('lan')
    let tid = options.tid
    let whichclass = options.whichclass
    that.setData({
      curClass: whichclass
    })
    var param = {
      classLanguage: lan,
      classType: val,
      volume: tid
    }
    var paramJson = {
      body: param,
      sys: "1",
      sysVer: "html5",
      token: "",
      ver: "1.0"
    }

    wx.request({
      url: Monohttps + '/mono-biz-app/educationMiniProgram/queryClassUnitLesson',
      method: 'post',
      data: paramJson,
      success: function (res) {
        console.log(res)
        let listData = res.data.body
        that.setData({
          list: listData,
        })
      },
      fail: function (fail) {
        console.log(fail)
      }
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})