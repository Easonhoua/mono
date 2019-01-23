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
    sales: "",
    originalPrice: "",
    nowPrice: "",
    bizOpt:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var bizopt = options.bizOpt
    var param = {
      bizOpt: bizopt
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
        // console.log(res)
        if (res.data.code == 8000){
          that.setData({
            titleTxt: res.data.body.bizOptName,
            filePath: res.data.body.imgPath,
            sales: res.data.body.sales,
            originalPrice: res.data.body.originalPrice / 100,
            nowPrice: res.data.body.amount / 100,
            bizOpt: res.data.body.bizOpt,
          })
        }
      },
      fail:function(fail){
        console.log(fail)
      },
    })
   
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})

