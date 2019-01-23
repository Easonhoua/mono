var app = getApp();
const Monohttps = app.globalData.Monohttps;
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['全部订单', '未付款', '已付款'],
    currentTab: 0,
    listData: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  navbarTap: function(e) {
    that = this
    var monoid = wx.getStorageSync('monoid')
    var jsondata;
    if (e == undefined || e ==0 ) {
      jsondata = {
        userid: monoid
      }
      that.setData({
        currentTab:0
      })
    } else if (e == 1){
      jsondata = {
        userid: monoid,
        state: 0
      }
      that.setData({
        currentTab: 1
      })
    } else if (e.currentTarget.dataset.idx == 0){
      jsondata = {
        userid: monoid
      }
      that.setData({
        currentTab: 0
      })
    } else if (e.currentTarget.dataset.idx == 1) {
      jsondata = {
        userid: monoid,
        state: 0
      }
      that.setData({
        currentTab: 1
      })
    } else if (e.currentTarget.dataset.idx == 2) {
      jsondata = {
        userid: monoid,
        state: 1
      }
      that.setData({
        currentTab: 2
      })
    } 

    wx.request({
      url: Monohttps + '/mono-biz-app/educationMiniProgram/getMyOrders',
      method: 'post',
      data: {
        body: jsondata,
        sys: "1",
        sysVer: "html5",
        token: "",
        ver: "1.0"
      },
      success: function(res) {
        console.log(res)
        that.setData({
          listData: res.data.body
        })
      },
      fail: function(fail) {
        console.log(fail)
      }
    })
  },

  
  querengopay(e){
    wx.requestPayment({
      timeStamp: e.currentTarget.dataset.timestamp,
      nonceStr: e.currentTarget.dataset.noncestr,
      package: 'prepay_id=' + e.currentTarget.dataset.prepayid,
      signType: 'MD5',
      paySign: e.currentTarget.dataset.sign,
      success: function (res) {
        wx.showToast({
          title: '支付成功',
        })
        setTimeout(function () {
          wx.navigateTo({
            url: '../zhifuchenggong/zhifuchenggong',
          })
        }, 1000)
      },
      fail: function (res) {
        wx.showToast({
          title: '支付失败',
          icon: 'none'
        })
      },
    })
  },  

  cancalOrder(e){
    // console.log(e)
    that = this;
    wx.showModal({
      title: '提示',
      content: '确认取消订单吗？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: Monohttps + '/mono-biz-app/eduTransaction/cancelOrder',
            method: 'post',
            data: {
              body: {
                order_no: e.currentTarget.dataset.order_no,
                userid: e.currentTarget.dataset.id
              },
              sys: "1",
              sysVer: "html5",
              token: "",
              ver: "1.0"
            },
            success(res) {
              // console.log(res)
              wx.showToast({
                title: '取消成功',
                icon:'none'
              })
              that.navbarTap(that.data.currentTab);
              
            },
            fail(fail) {
              console.log(fail)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })


   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.navbarTap();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

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