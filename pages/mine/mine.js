//获取应用实例
const app = getApp()
const Monohttps = app.globalData.Monohttps;

var list = [
  {
    id: 'about',
    title: "我的订单",
    url: '#',
    images:'../../images/myaccount.png'
  }, 
  {
    id: 'feedback',
    title: "我的学习报告",
    url: '#',
    images: '../../images/studyreport.png'
  }, 
  {
    id: 'redpacket',
    title: "联系客服",
    url: '#',
    images: '../../images/kefu.png'
  }
];

Page({
  data: {
    // userInfo: {},
    // hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    list: list,
    // userdataurlb: true,
    // userdatanicknameb: true,
    avatarb: false,
    nicknameb: false,
    nickName: '',
    avatarUrl: ''
  },

  phoneCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.replyPhone,
      success: function () {
        console.log("成功拨打电话")
      },
    })
  },

  onLoad: function () {
    var touxiang = wx.getStorageSync('avatarUrl')
    var mingcheng = wx.getStorageSync('nickName')
    if (touxiang){
      this.setData({
        nickName: mingcheng,
        avatarUrl: touxiang
      })
    }else{
      console.log('2222')
    }
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     console.log(res)
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },
  // getUserInfo: function (e) {
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  //   var jsonParam = {
  //     openid: app.globalData.openid,
  //     rawData: e.detail.rawData,
  //     signature: e.detail.signature,
  //     encrypteData: e.detail.encryptedData,
  //     iv: e.detail.iv
  //   }

  //   var realjson = {
  //     body: jsonParam,
  //     sys: "1",
  //     sysVer: "html5",
  //     token: "",
  //     ver: "1.0"
  //   }

  //   wx.request({
  //     url: Monohttps + '/mono-biz-app/miniProgram/loginRegister',
  //     method: 'post',
  //     data: realjson,
  //     success: function (res) {
  //       console.log(res)
  //     },
  //     fail: function (fail) {
  //       console.log(fail)
  //     }
  //   })
  // },
  onShareAppMessage() {

  }
})
