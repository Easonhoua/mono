// pages/courseTitle/coursetitle.js

var app = getApp();
const Monohttps = app.globalData.Monohttps
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curClass: '',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    var optData1 = wx.getStorageSync('val')
    if (optData1 = '0') {
      wx.setNavigationBarTitle({
        title: '英语派单元'
      })
    } else if (optData1 = '1') {
      wx.setNavigationBarTitle({
        title: '人教版单元'
      })
    } else if (optData1 = '2') {
      wx.setNavigationBarTitle({
        title: '加州小学单元'
      })
    } else if (optData1 = '3') {
      wx.setNavigationBarTitle({
        title: '牛津小学单元'
      })
    } else if (optData1 = '4') {
      wx.setNavigationBarTitle({
        title: '研究社单元'
      })
    }


    let tid = options.tid
    let whichclass = options.whichclass
    wx.setStorageSync('whichclass', whichclass)
    that.setData({
      curClass: whichclass
    })
    var param = {
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
      url: Monohttps + '/mono-biz-app/educationMiniProgram/queryClassUnit',
      method: 'post',
      data: paramJson,
      success: function (res) {
        // console.log(res)
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})