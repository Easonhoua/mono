var app = getApp();
var that;
const Monohttps = app.globalData.Monohttps;
// var swiper = [
//   "../../images/Advertising2.png",
// ];
Page({
  data: {
    // swiperlist: swiper,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    Listofpackages: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    var packageType = options.packageType
    var monoid = wx.getStorageSync('monoid')
    var param = {
      packageType: packageType
    }
    var paramJson = {
      body: param,
      sys: "1",
      sysVer: "html5",
      token: "",
      ver: "1.0"
    }
    wx.request({
      url: Monohttps + '/mono-biz-app/educationMiniProgram/getMiniProgramPackages',
      method: 'post',
      data: paramJson,
      success: function(res) {
        // console.log(res)
        let resData = res.data.body
        that.setData({
          Listofpackages: resData
        })
      },
      fail: function(fail) {
        console.log(fail)
      },
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */

  onShow: function(options) {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})