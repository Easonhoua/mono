var app = getApp();
const httpUrl = app.globalData.Monohttps

Page({
  data: {
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let optData1 = options.val
    let optData2 = options.lan
    wx.setStorageSync('val', optData1)
    wx.setStorageSync('lan', optData2)
    let param = {
      classType: optData1,
      classLanguage: optData2
    }
    let paramJson = {
      body: param,
      sys: "1",
      sysVer: "html5",
      token: "",
      ver: "1.0"
    }
    wx.request({
      url: httpUrl +'/mono-biz-app/educationMiniProgram/queryClassVolume',
      method: 'post',
      data: paramJson,
      success: function (res) {
        let listData = res.data.body
        that.setData({
          list: listData
        })
      },
      fail: function (fail) {
        console.log(fail)
      }
    })
  },
  goUnit: function(ev) {              
    let evData = ev.currentTarget.dataset
    wx.navigateTo({
      url: '../R-Units/R-Units?tid=' + evData.tid + '&whichclass=' + evData.whichclass,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})