// pages/monobang/monobang.js
var interval;
const app = getApp()
const Monohttps = app.globalData.Monohttps;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: '获取验证码',
    gudingtime: 60,
    telphone: '',
    // id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
 
  getyanzhengcode() {
    clearInterval(interval)
    var that = this;
    that.setData({
      gudingtime: 60
    });
    var telphone = that.data.telphone
    if (telphone == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
    } else if (telphone.length < 11) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
    } else {
      var gudingtime = that.data.gudingtime;
      that.setData({
        time: -(gudingtime) + 's'
      })
      interval = setInterval(function () {
        that.setData({
          time: -(gudingtime - 1) + 's'
        })
        gudingtime--;
        if (gudingtime <= 0) {
          clearInterval(interval)
          that.setData({
            time: '重新获取',
            gudingtime: 60,
          })
        }
      }, 1000)

      wx.request({
        url: Monohttps + '/mono-biz-app/user/sendCode',
        method: 'post',
        data: {
          "body": {
            "username": telphone,
            "operating": 0,
            "bizGroup": '6'
          },
          "sys": "html5",
          "sysVer": "1.0",
          "token": "",
          "ver": "1.0"
        },
        success: function (res) {
          console.log(res)
          wx.showToast({
            title: '绑定成功',
            icon: 'none'
          })
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }
  },

  getphonenum:function(e) {

    var val = e.detail.value;
    this.setData({
      telphone: val
    });
  },
  formSubmit(e) {
    clearInterval(interval)
    this.setData({
      gudingtime: 60
    });

    var openid = wx.getStorageSync('openid')
    var phone = e.detail.value.phonenumber
    var code = e.detail.value.yanzhengnum
    wx.request({
      url: Monohttps + '/mono-biz-app/eduUser/setMiniProgramBindingMono',
      method: 'post',
      data:{
        body: {
          phone: phone,
          code: code,
          openid: openid
        },
        sys: "1",
        sysVer: "html5",
        token: "",
        ver: "1.0"
      },
      success:function(res){
        if(res.data.code == 8000){
          wx.navigateTo({
            url: '../PrivateTutor/PrivateTutor?packageType=1',
          })
          wx.setStorage({
            key: 'monoid',
            data: res.data.body.monoid,
          })
        } else if (res.data.code == 9001){
          wx.showToast({
            title: '记录已存在',
            icon: 'none'
          })
        } else if (res.data.code == 9002){
          wx.showToast({
            title: '记录不存在',
            icon: 'none'
          })
        } else if (res.data.code == 9005){
          wx.showToast({
            title: '参数不能为空',
            icon: 'none'
          })
        } else if (res.data.code == 9007){
          wx.showToast({
            title: '短信验证失败',
            icon: 'none'
          })
        } else if (res.data.code == 9008){
          wx.showToast({
            title: '没有权限',
            icon: 'none'
          })
        } else if (res.data.code == 9012){
          wx.showToast({
            title: '短信验证过期',
            icon: 'none'
          })
        }
      },
      fail:function(fail){
        wx.showToast({
          title: '绑定失败！',
          icon:'none'
        })
        console.log(fail)
      }
    })
  },
  onLoad: function(options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})