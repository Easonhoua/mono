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
    // userInfo: {},
    imgUrls: swiper,
    // indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    list: list,
    showModal: false,
    openid:''
  },

  hideModal: function () {
    this.setData({
      showModal: false
    });
  },

  onCancel: function () {
    wx.showToast({
      title: "小程序功能不能用哦！",
      image:'../../images/error2.png',
      duration:3000,
      mask:'true'
    });
    this.hideModal();
  },

  onLoad: function () {
    that = this;
    app.getLogin().then(function(ret){
      // console.log(ret)

      if (ret.data.code == 9002){
        that.setData({
           showModal: true,
           openid: ret.data.body.openid
         })
      } else if (ret.data.code == 9000){
        wx.showToast({
          title: "网络错误",
          icon: 'none'
        });
      } else if (ret.data.code == 9005){
        wx.showToast({
          title: "参数不能为空",
          icon: 'none'
        });
      } else if (ret.data.code == 9008){
        wx.showToast({
          title: "没有权限",
          icon: 'none'
        });
      } else if (ret.data.code == 8000){
        wx.setStorage({
          key: 'avatarUrl',
          data: ret.data.body.avatarUrl,
        })
        wx.setStorage({
          key: 'nickName',
          data: ret.data.body.nickName,
        })
        wx.setStorage({
          key: 'monoid',
          data: ret.data.body.monoid,
        })
      }
    })
  },
  
  getUserInfo: function(e) {
    this.hideModal();
    if (e.detail.userInfo == undefined){
      this.setData({
        showModal: true
      });
    }else{
      wx.setStorage({
        key: 'avatarUrl',
        data: e.detail.userInfo.avatarUrl,
      })
      wx.setStorage({
        key: 'nickName',
        data: e.detail.userInfo.nickName,
      })

      var jsonParam = {
        openid: this.data.openid,
        rawData: e.detail.rawData,
        signature: e.detail.signature,
        encrypteData: e.detail.encryptedData,
        iv: e.detail.iv
      }

      var realjson = {
        body: jsonParam,
        sys: "1",
        sysVer: "html5",
        token: "",
        ver: "1.0"
      }
      wx.request({
        url: Monohttps + '/mono-biz-app/miniProgram/loginRegister',
        method: 'post',
        data: realjson,
        success: function (res) {
          console.log(res)
        },
        fail: function (fail) {
          console.log(fail)
        }
      })
    }
  },
  onShareAppMessage() {

  } 
})
