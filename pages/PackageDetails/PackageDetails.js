var app = getApp();
const Monohttps = app.globalData.Monohttps;
var that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    titleTxt:"",
    filePath: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    that = this;
    var bizopt = options.bizopt
    var param = {
      bizopt: bizopt
    }
    var paramJson = {
      body: param,
      sys: "1",
      sysVer: "html5",
      token: "",
      ver: "1.0"
    }
    wx.request({
      url: Monohttps + '/mono-biz-app/educationMiniProgram/getPackageDetail',
      method: 'post',
      data: paramJson,
      success: function (res) {
        that.setData({
          titleTxt: res.data.body.bizOptName,
          
        })
        console.log(res)
      },
      fail:function(fail){
        console.log(fail)
      },
    })
  },
})

