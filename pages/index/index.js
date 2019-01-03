//index.js
//获取应用实例
const app = getApp()
const Monohttps = app.globalData.Monohttps;
var swiper = [
  "../../images/Advertising2.png",
];
var that;
var list = [
  {
    image: '../../images/AIteacher.png',
    open: false,
    url: '../IntelligentForeignEducation/IntelligentForeignEducation?packageType=2'
  }
  //  {
  //   image: '../../images/sirenTeacher.png',
  //   open: false,
  //   url: '../PrivateTutor/PrivateTutor?packageType=1'
  // }
];


Page({
  data: {
    userInfo: {},
    imgUrls: swiper,
    // indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    list: list,
    showModal: false
  },

  hideModal: function () {
    this.setData({
      showModal: false
    });
  },

  onCancel: function () {
    this.hideModal();
  },

  onLoad: function () {
    that = this;
    setTimeout(function(){
      if (app.globalData.userInfo == null) {
        that.setData({
          showModal: true,
          userInfo: app.globalData.userInfo,
        })
      }  else {
        that.setData({
          showModal: false,
        })
      }
    },1000)
  },
  
  getUserInfo: function(e) {
    this.hideModal();
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
    })

    // var jsonParam ={
    //   openid: app.globalData.openid,
    //   rawData: e.detail.rawData,
    //   signature: e.detail.signature,
    //   encrypteData: e.detail.encryptedData,
    //   iv: e.detail.iv
    // }

    // var realjson = {
    //   body: jsonParam,
    //   sys: "1",
    //   sysVer: "html5",
    //   token: "",
    //   ver: "1.0"
    // }

    // wx.request({
    //   url: Monohttps + '/mono-biz-app/miniProgram/loginRegister',
    //   method:'post',
    //   data: realjson,
    //   success:function(res){
    //     console.log(res)
    //   },
    //   fail:function(fail){
    //     console.log(fail)
    //   }
    // })
  }
})
