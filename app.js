var MD5 = require('utils/MD5.js');
App({
  onLaunch: function () {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onShow(){
    var that = this;
    wx.connectSocket({
      url: that.globalData.websocketaddr + '/ws?e=0&t=0&version=2',
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {
        console.log('WebSocket连接创建', res)
      },
      fail: function (err) {
        console.log(err)
        // wx.showToast({
        //   title: '网络异常！',
        //   icon: 'none',
        //   duration: 2000
        // })
      },
    })
    wx.onSocketClose(function (res) {
      wx.connectSocket({
        url: that.globalData.websocketaddr+'/ws?e=0&t=0&version=2',
        header: {
          'content-type': 'application/json'
        },
        method: 'post',
        success: function (res) {
          console.log('WebSocket连接创建', res)
        },
        fail: function (err) {
          console.log(err)
        },
      })
    })

    wx.onSocketOpen(function (res) {
      var timestamp = new Date().getTime()
      var sig = MD5.md5('1543281970000043' + timestamp + '665309ac00d60d0c804caf8e9cf93c4e')
      var jsonData1 = '{"app":{"applicationId":"1543281970000043", "sig": "' + sig + '","alg": "md5","timestamp":"' + timestamp + '", "userId": "mono100669"}}'
      sendSocketMessage(jsonData1)
    })

    wx.onSocketError(function (res) {
      console.log(res)
    })
  },

  getLogin() {
    var that = this;
    return new Promise(function (resolve, reject) {
      // 登录
      wx.login({
        success: res => {
          //todo 发送 res.code 到后台换取 openId, sessionKey, unionId
          var paramJson = {
            body: { code: res.code },
            sys: "1",
            sysVer: "html5",
            token: "",
            ver: "1.0"
          }
          wx.request({
            url: that.globalData.Monohttps + '/mono-biz-app/miniProgram/login',
            data: paramJson,
            method: 'post',
            success: function (ret) {
              resolve(ret);
            },
            fail: function (data) {
              wx.hideLoading();
              console.log(data);
            }
          });
        }
      });
    });
  },

  globalData: {
    userInfo: null,
    Monohttps: 'https://http.aismono.net',
    websocketaddr:'wss://cloud.chivox.com',
    openId:''
  },
})

function sendSocketMessage(msg) {
  wx.sendSocketMessage({
    data: msg,
    success: function (res) {
      console.log('已发送', res)
    },
    fail: function (fail) {
      wx.hideLoading();
      console.log(fail)
    }
  })
}