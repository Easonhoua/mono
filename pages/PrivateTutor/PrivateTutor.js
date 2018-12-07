// pages/PrivateTutor/PrivateTutor.js
var app = getApp();
var that;
const Monohttps = app.globalData.Monohttps;
var swiper = [
  "../../images/Advertising2.png",
];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperlist: swiper,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    Listofpackages:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var packageType = options.packageType
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
      success: function (res) {
        console.log(res)
        let resData = res.data.body
        that.setData({
          Listofpackages: resData
        })
      },
      fail:function(fail){
        console.log(fail)
      },
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