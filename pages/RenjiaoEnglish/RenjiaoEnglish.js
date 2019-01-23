var app = getApp();
const Monohttps = app.globalData.Monohttps
var that;
Page({
  data: {
    list: [],
    whichclass:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    let optData1 = options.val
    let optData2 = options.lan
    wx.setStorageSync('val', optData1)
    wx.setStorageSync('lan', optData2)
    if (optData1 == '0'){
      wx.setNavigationBarTitle({
        title: '英语派分册',
      })
      that.setData({
        whichclass: 'course-listR_item_yingyupai'
      })
    } else if (optData1 == '1'){
      wx.setNavigationBarTitle({
        title: '人教版分册',
      })
      that.setData({
        whichclass: 'course-listR_item_renjiao'
      })
    } else if (optData1 == '2'){
      wx.setNavigationBarTitle({
        title: '加州小学分册',
      })
      that.setData({
        whichclass: 'course-listR_item_jiazhou'
      })
    } else if (optData1 == '3'){
      wx.setNavigationBarTitle({
        title: '牛津小学分册',
      })
      that.setData({
        whichclass: 'course-listR_item_niujin'
      })
    } else if (optData1 == '4'){
      wx.setNavigationBarTitle({
        title: '外研社分册',
      })
      that.setData({
        whichclass: 'course-listR_item_waiyan'
      })
    } else if (optData1 == '5'){
      wx.setNavigationBarTitle({
        title: '香港朗文分册',
      })
      that.setData({
        whichclass: 'course-listR_item_langwen'
      })
    }
    
    let param = {
      classType: optData1,
      classLanguage: optData2
    }
    let paramJson = {
      body: param,
      sys: "1",
      sysVer: "html5",
      token: "",
      ver: "1.0"
    }
    wx.request({
      url: Monohttps +'/mono-biz-app/educationMiniProgram/queryClassVolume',
      method: 'post',
      data: paramJson,
      success: function (res) {
        let listData = res.data.body
        that.setData({
          list: listData
        })
      },
      fail: function (fail) {
        console.log(fail)
      }
    })
  },
  onShareAppMessage() {

  }
})