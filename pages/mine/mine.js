//获取应用实例
const app = getApp()
const Monohttps = app.globalData.Monohttps;

Page({
  data: {
    nickName: '',
    avatarUrl: '',
    // list: list,
    hasmonoid: true,
    monoid: '',
    dakabtn:'',
    curdeta: ''
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
    var monoid = wx.getStorageSync('monoid')
    if (monoid == 0) {
      this.setData({
        hasmonoid: false
      })
    } else {
      this.setData({
        hasmonoid: true,
        monoid: monoid
      })
    }
    if (touxiang){
      this.setData({
        nickName: mingcheng,
        avatarUrl: touxiang
      })
    }
  },
  gopunchview() {
    var continueday = wx.getStorageSync('continueday')
    if (continueday == 0) {
      wx.navigateTo({
        url: '../PunchTheClock/PunchTheClock',
      })
    } else if (continueday == 1) {
      wx.navigateTo({
        url: '../dakarili/dakarili',
      })
    }
    
  },
  tips(){
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },
  getmonoid() {
    wx.navigateTo({
      url: '../monobang/monobang',
    })
  },
  godingdanlist(){
    wx.navigateTo({
      url: '../dingdanlist/dingdanlist',
    })
  },
  onShow(){
    var myDate = new Date();
    var year = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
    var month = myDate.getMonth() + 1;       //获取当前月份(0-11,0代表1月)
    var date = myDate.getDate();        //获取当前日(1-31)
    var str = "星期" + "日一二三四五六".charAt(new Date().getDay());
    this.setData({
      curdeta: year + "." + month + "." + date + " " + str
    })

    var continueday = wx.getStorageSync('continueday')
    if (continueday == 0) {
      this.setData({
        dakabtn: '打卡'
      })
    } else if (continueday == 1) {
      this.setData({
        dakabtn: '已打卡'
      })
    }
  },

  onShareAppMessage() {

  }
})
