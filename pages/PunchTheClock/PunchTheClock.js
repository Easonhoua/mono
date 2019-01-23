var app = getApp();
const Monohttps = app.globalData.Monohttps;
var that;
var dataarr = new Array;
var n = 0;
Page({
  data: {
    orangehook: true,
    imagelist: '',
    curdeta: ''
  },
  onLoad() {
    that = this;
    var myDate = new Date();
    var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
    var month = myDate.getMonth() + 1 > 9 ? myDate.getMonth() + 1 : '0' + (myDate.getMonth() + 1); //获取当前月份(0-11,0代表1月)
    var date = myDate.getDate() > 9 ? myDate.getDate() : '0' + (myDate.getDate()); //获取当前日(1-31)
    that.setData({
      curdeta: year + "年" + month + "月" + date + "日"
    })

    wx.request({
      url: Monohttps+'/mono-biz-app/educationMiniProgram/queryCardContentList',
      method: 'post',
      data: {
        body: {},
        sys: "1",
        sysVer: "html5",
        token: "",
        ver: "1.0"
      },
      success: function(res) {
        that.setData({
          imagelist: res.data.body
        })
      },
      fail: function(fail) {
        console.log(fail)
      }
    })
  },
  selstudycon(e) {
    that = this
    var curindex = e.currentTarget.dataset.index
    var curval = e.currentTarget.dataset.val
    var curorangeicon = "imagelist[" + curindex + "].orangeicon"
    if (that.data.imagelist[curindex].orangeicon == undefined || that.data.imagelist[curindex].orangeicon == false) {
      n++;
      if (n <= 2){
        that.setData({
          [curorangeicon]: true
        })
        dataarr.push(curval)
      }else{
        n = 2
      }
    } else if (that.data.imagelist[curindex].orangeicon == true) {
        --n;
        if (n <= 0) {
          n = 0;
        }
        dataarr.splice(dataarr.indexOf(curval), 1)
         that.setData({
            [curorangeicon]: false
          })
      }
  },

  bindFormSubmit: function(e) {
    var bijicontent = e.detail.value.textarea
    if (bijicontent == ''){
      wx.showToast({
        title: '请输入心得内容',
      })
      return;
    }
    var openid = wx.getStorageSync('openid')
    wx.setStorage({
      key: 'dataarr',
      data: dataarr,
    })
    wx.request({
      url: Monohttps+"/mono-biz-app/educationMiniProgram/setCardInfo",
      method: 'Post',
      data: {
        body: {
          openid: openid,
          contentIds: dataarr.join(','),
          note: bijicontent
        }
      },
      success: function(res) {
        if (res.data.code == 8000) {
          wx.showToast({
            title: '打卡成功',
            image: '../../images/success.png'
          })
          setTimeout(function() {
            wx.navigateTo({
              url: '../dakarili/dakarili',
            })
          }, 1000)
          wx.setStorage({
            key: 'continueday',
            data: 1,
          })
        } else {
          wx.showToast({
            title: '打卡失败',
            image: '../../images/fail.png'
          })
        }
      },
      fail: function(fail) {
        wx.showToast({
          title: '打卡失败',
          image: '../../images/error2.png'
        })
      }
    })
  },
  onUnload(){
    n = 0;
  }
})