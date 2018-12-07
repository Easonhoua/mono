var app = getApp();
const aismonohttps = app.globalData.Monohttps;

var app = getApp()
Page({
  data: {
    DataList :[],
    tempFilePaths: '../../images/Photograph2.png',
  },
  onLoad: function (options) {
    var tid= options.tid
    var listWord = options.listword
    var wordarr = listWord.split(',')
    var allDatas = []
    var eachdata = {}
    for(var i=0;i<wordarr.length;i++ ){
      eachdata={
        name: wordarr[i],
        rightIcon: true,
        errorIcon: true,
        src:''
      }
      allDatas.push(eachdata)
    }
    this.setData({
      DataList: allDatas
    })
  },
  chooseimage: function (ev) {
    let _this = this;
    let evData = ev.currentTarget.dataset
    let thisindex = evData.index
    let word = evData.item.name
    var paramJson = {
      word: word,
      sys: "1",
      sysVer: "html5",
      token: "",
      ver: "1.0"
    }

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有original(原图),
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res1) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res1.tempFilePaths[0]
        var imgSrc = 'DataList[' + thisindex + '].src'
        var rightIcon = 'DataList[' + thisindex + '].rightIcon'
        var errorIcon = 'DataList[' + thisindex + '].errorIcon'
        _this.setData({
          [imgSrc]: tempFilePaths,
        })
        wx.uploadFile({
          url: aismonohttps +'/mono-biz-app/recognizer/aliyuncsImageTag.shtml',
          formData: paramJson,
          filePath: tempFilePaths,
          name: 'file', 
          success(ret) {
            if (JSON.parse(ret.data).code == 0){
              _this.setData({
                [errorIcon]:true,
                [rightIcon] : false
              })
            }else{
              _this.setData({
                [rightIcon]: true,
                [errorIcon]: false
              })
            }
          },
          fail:function(fail){
            wx.showToast({
              title: '网络异常！',
            })
          }
        })
      },
      fail:function(fail){
        wx.showToast({
          title: '网络异常！',
        })
      }
    })
  }
})


