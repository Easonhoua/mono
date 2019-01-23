var interval;
var that;
var app = getApp();
const Monohttps = app.globalData.Monohttps;
Page({
  data: {
    titleTxt: "",
    nowPrice: "",
    bizOpt: "",
    imgsrc:"",
    region: ['全部', '全部', '全部'],
    customItem: '全部',
    num:1,
    bianprice:'',
    showModal:false,
    tongguo: true,
    butongguo: true,
    rightIcon: true,
    gudingtime: 60,
    time:''
  },
  onLoad: function (opt) {
    that= this;
    that.setData({
      titleTxt: opt.titleTxt,
      nowPrice: opt.nowPrice,
      bizOpt: opt.bizOpt,
      imgsrc: opt.imgsrc,
      bianprice: opt.nowPrice,
    })
  },
   bindRegionChange(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    that = this
     that.setData({
      region: e.detail.value
    })
  },
  jian(){
    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    var jianprice = this.data.bianprice * num
    // 将数值与状态写回  
    this.setData({
      num: num,
      nowPrice: jianprice
    });  
  },
  jia(){
    var num = this.data.num;
    // 不作过多考虑自增1  
    num++;
    var jiaprice = this.data.bianprice * num
    // 将数值与状态写回  
    this.setData({
      num: num,
      nowPrice: jiaprice
    });  
  },
  hideModal: function () {
    clearInterval(interval)
    this.setData({
      showModal: false,
      gudingtime: 60,
    });
  },

  
  formSubmit(e) {
    // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    that = this
    var openid = wx.getStorageSync('openid')
    var monoid = wx.getStorageSync('monoid')
    var receiver = e.detail.value.shoujirenname
    var mobilePhone = e.detail.value.contectphonenumber
    var address = e.detail.value.addresspicker[0] + e.detail.value.addresspicker[1] + e.detail.value.addresspicker[2] + e.detail.value.Detailedaddress
    var amount = that.data.nowPrice*100
    
    if (e.detail.value.Detailedaddress == ''){
      wx.showToast({
        title: '请输入详细地址', 
        icon: 'none'
      })
      return false;
    } else if (receiver == ''){
      wx.showToast({
        title: '请输入收件人',
        icon: 'none'
      })
      return false;
    } else if (mobilePhone == ''){
      wx.showToast({
        title: '请输入联系电话',
        icon: 'none'
      })
      return false;
    }else{
      wx.navigateTo({
        url: '../OrderPayment/OrderPayment?titleTxt=' + that.data.titleTxt + '&nowPrice=' + that.data.nowPrice + '&num=' + that.data.num + '&imgsrc=' + that.data.imgsrc,
      })
    }
    
    wx.request({
      url: 'http://pv.sohu.com/cityjson?ie=utf-8',
      success: function (res) {
        var ip = JSON.parse(res.data.split("=")[1].replace(';', '')).cip
        that.setData({
          ip: ip
        })
        var json = {
          "openid": openid,
          "userid": monoid,
          "payerid": monoid,
          "payer_source": "0",
          "direction": 3,
          "spbill_create_ip": ip,
          "bizOpt": that.data.bizOpt,
          "body": "这是套餐的描述",
          "amount": amount,
          "receiver": receiver,
          "mobilePhone": mobilePhone,
          "address": address,
        }
        wx.request({
          url: Monohttps + '/mono-biz-app/educationMiniProgram/buyPackage',
          method: 'post',
          data: {
            "body": json,
            "sys": "html5",
            "sysVer": "1.0",
            "token": "",
            "ver": "1.0"
          },
          success: function (res) {
            // console.log(res)
            wx.setStorage({
              key: 'jsondata',
              data: res.data.body,
            })
          },
          fail:function(res){
            console.log(res)
            wx.showToast({
              title: '下单失败！',
              icon: 'none'
            })
          }
        })
      },
    })
  },
})
