var app = getApp();
var that;
var chatListData = [];
const recorderManager = wx.getRecorderManager()
var res = wx.getSystemInfoSync();
if (res.platform == 'ios') {
  var myaudio = wx.getBackgroundAudioManager();
} else {
  var myaudio = wx.createInnerAudioContext();
}
const Monohttps = app.globalData.Monohttps;
const websocketaddr = app.globalData.websocketaddr;
var MD5 = require('../../utils/MD5.js');
const tokenhttps = 'https://openapi.baidu.com/oauth/2.0/token?'
const tsn = 'http://tsn.baidu.com/text2audio?'
var SocketTask;
var socketOpen = false;
var a = 0;
Page({
  data: {
    userInfo: {},
    chatList: [],
    scrolltop: '',
    userLogoUrl: '',
    filePath: null,
    speakerUrl: '../../images/speaker0.png',
    isSpeaking: false,
    ChineseBtn: false,
    EnglishBtn: true, 
    studyWhat: false,
    token:'',
    chineseword:'',
    gobackBtn: true,
    startTime:'',
    stopTime:'',
    second:'',
    viewWidth: ''
  },

  onLoad: function (options) {
    that = this;
    if (!socketOpen) {
      that.webSocket()
    }
    var userInfo = app.globalData.userInfo  
    that.setData({
      userLogoUrl: userInfo.avatarUrl
    })
  },

  onShow() {
    that = this;
    SocketTask.onOpen(res => {
      socketOpen = true;
      var timestamp = new Date().getTime()
      var sig = MD5.md5('1543281970000043' + timestamp + '665309ac00d60d0c804caf8e9cf93c4e')
      var jsonData1 = '{"app":{"applicationId":"1543281970000043", "sig": "' + sig + '","alg": "md5","timestamp":"' + timestamp + '", "userId": "mono100669"}}'
      that.sendSocketMessage(jsonData1)//验证用户信息
    })

    SocketTask.onClose(onClose => {
      socketOpen = false;
    })
    SocketTask.onError(onError => {
      socketOpen = false;
      wx.hideLoading()
      that.webSocket()
      wx.showToast({
        title: '连接失败！',
      }) 
    })

    SocketTask.onMessage(onMessage => {
      wx.hideLoading()
      var useData = JSON.parse(onMessage.data).result
      if (useData == undefined) {
        wx.showToast({
          title: '语音异常',
          duration: 2000,
          mask: true
        })
        SocketTask.close({
          success: function (res) {
            that.webSocket()
          }
        })
      } else {
        if (useData.overall >= 80) {
          that.addChat(that.data.filePath, "r", false, true, that.data.viewWidth, that.data.second)
          that.setData({
            ChineseBtn: false,
            EnglishBtn: true,
            gobackBtn : true
          })
          setTimeout(function(){
            myaudio.title = '兼容ios的title'
            myaudio.src = "https://dfs.aismono.net/group2/M00/00/22/rBK-w1v-ROyAWhBfAAAvanH_WC0883.mp3";
            myaudio.play();
          },500)
        } else if (useData.overall < 80) {
          that.addChat(that.data.filePath, "r", true, false, that.data.viewWidth, that.data.second)
          setTimeout(function(){
            myaudio.title = '兼容ios的title'
            myaudio.src = "https://dfs.aismono.net/group2/M00/00/22/rBK-w1v-RPKAXr3UAAAKrzF7Kfs186.mp3";
            myaudio.play();
          },500)
        }
      }
    })
  },

  webSocket: function () {
    // 创建Socket
    SocketTask = wx.connectSocket({
      url: websocketaddr + '/ws?e=0&t=0&version=2',
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {
        console.log('WebSocket连接创建', res)
      },
      fail: function (err) {
        wx.showToast({
          title: '网络异常！',
        })
      },
    })
  },

  sendSocketMessage(msg) {
    var that = this;
    SocketTask.send({
      data: msg,
      success: function (res) {
        console.log('已发送', res)
      },
      fail: function (fail) {
        wx.showToast({
          title: '信息发送失败！',
        })
      }
    })
  },

  // 中文按钮按下
  touchdownchin: function () {
    that = this;
    that.speaking.call();
    that.setData({
      studyWhat:true,
      isSpeaking: true
    })
    const mp3RecoderOptions = {
      duration: 60000,
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 96000,
      format: 'mp3',
      frameSize: 50
    }
    recorderManager.start(mp3RecoderOptions);
    recorderManager.onStart(()=>{
      that.setData({
        startTime: new Date().getTime()
      })
    })
    recorderManager.onError(()=>{
      console.log('error')
    })
  },
  // 中文按钮松开
  touchupchin: function () {
    that= this
    recorderManager.stop();
    that.setData({
      studyWhat: true,
      isSpeaking: false,
      speakerUrl: '../../images/speaker0.png',
    })
    clearInterval(that.speakerInterval);
    recorderManager.onStop((res) => {
      wx.showLoading({
        title: '数据加载中...',
      })
      var tempFilePaths = res.tempFilePath;
      var secondTime = Math.ceil((new Date().getTime() - that.data.startTime) / 1000)
      if (secondTime > 5) {
        var viewWidth = (secondTime - 5) * 6.5 + 128
        that.addChat(tempFilePaths, "r", true, true, viewWidth+'rpx', secondTime)
      }else{
        that.addChat(tempFilePaths, "r", true, true, '128rpx', secondTime)
      }
      wx.uploadFile({
        url: Monohttps + '/mono-biz-app/recognizer/voiceSemantic.shtml',
        filePath: tempFilePaths,
        name: 'file',
        success(ret) {
          wx.hideLoading()
          console.log(ret)
          var chineseword = JSON.parse(ret.data)
          if (chineseword.data != ''){
            that.addChat(chineseword, "l", true, true)
            that.baidurequest(chineseword)
            that.setData({
              ChineseBtn: true,
              EnglishBtn: false,
              chineseword: chineseword,
              gobackBtn: false,
              second: secondTime,
            })
          }else{
            wx.showToast({
              title: 'mono没听清，请重录。',
              icon: 'none',
            })
          }
        },
        fail: function (fail) {
          wx.showToast({
            title: '网络异常！',
            icon:'none'
          })
        }
      })
    })
  },

  //英文按钮按下
  touchdownEnglish: function () {
    that = this;
    that.setData({
      isSpeaking: true
    })
    that.speaking.call();
    const mp3RecoderOptions = {
      duration: 60000,
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 96000,
      format: 'mp3',
      frameSize: 50
    }
    recorderManager.start(mp3RecoderOptions);
    recorderManager.onStart(() => {
      that.setData({
        startTime: new Date().getTime()
      })
    })
    recorderManager.onError(() => {
      console.log('error')
    })
  },
  // 英文按钮松开
  touchupEnglish: function () {
    that = this
    recorderManager.stop();
    that.setData({
      isSpeaking: false,
      speakerUrl: '../../images/speaker0.png',
    })
    clearInterval(that.speakerInterval);
    recorderManager.onStop((res) => {
      wx.showLoading({
        title: '数据加载中...',
      })
      var tempFilePaths = res.tempFilePath
      var secondTime = Math.ceil((new Date().getTime() - that.data.startTime) / 1000)
      if (secondTime > 5) {
        var viewWidth = (secondTime - 5) * 6.5 + 128
        that.setData({
          viewWidth: viewWidth + 'rpx',
        })
      }
      that.setData({
        filePath: tempFilePaths,
        second: secondTime
      })
      var wordtxt = that.data.chineseword.dataEn
      var timestamp = new Date().getTime()
      var jsonData2 = '{"tokenId":"' + MD5.md5(timestamp) + '", "request": { "attachAudioUrl": 1,"coreType": "en.sent.score","rank": 100,"refText": "' + wordtxt + '","userId": "mono100669"},"audio": { "audioType": "mp3", "channel": 1, "sampleBytes": 2, "sampleRate": 16000}}';
      that.sendSocketMessage(jsonData2)
      var filePath = res.tempFilePath
      var FileSystemManager = wx.getFileSystemManager();
      FileSystemManager.readFile({
        filePath: filePath,
        success: function (ret) {
          var bufferStr = ret.data;
          that.sendSocketMessage(bufferStr)
          that.sendSocketMessage('{"cmd":"stop"}')
        }
      })
    })
  },

  baidurequest(word){
    var that = this
    wx.request({
      url: tokenhttps +'grant_type=client_credentials&client_id=S0uoANfKnvmH0qiVahBRm84i&client_secret=R11Y4xxLoM9Sl6nO67O3uYTAo8TXA95E',
      success:function(res){
        that.setData({
          token: res.data.access_token
        })
      }
    })
  },

  gobackchinese(){
    that = this;
    that.setData({
      ChineseBtn: false,
      EnglishBtn: true,
      gobackBtn: true
    })
  },

  //播放我自己的录音
  mineVioce(e){
    myaudio.title="兼容ios"
    myaudio.src = e.target.dataset.src
    myaudio.play()
  },

  //返回的英语音频
  englishvioce(e){
    var myaudioword = encodeURIComponent(encodeURIComponent(e.target.dataset.enword))
    var acctkoen = this.data.token
    myaudio.title = "兼容ios"
    myaudio.src = tsn + 'lan=zh&ctp=1&cuid=50-9A-4C-0F-ED-08&tok=' + acctkoen +'&tex=' + myaudioword +'&vol=5&per=4&spd=5&pit=5&aue=3'
    myaudio.play()
  },

  // 增加对话到显示界面（scrolltopFlag为True）
  addChat: function (word, orientation, rightIcon, wrongIcon, viewWidth, secondTime) {
    that.addChatWithFlag(word, orientation, rightIcon, wrongIcon, viewWidth, secondTime,true);
  },
  // 增加对话到显示界面（scrolltopFlag为是否滚动标志）
  addChatWithFlag: function (filePath, orientation, rightIcon, wrongIcon, viewWidth, secondTime,scrolltopFlag) {
    let ch = { 'src': filePath, 'time': new Date().getTime(), 'orientation': orientation, 'rightIcon': rightIcon, 'wrongIcon': wrongIcon, 'viewWidth': viewWidth, 'secondTime': secondTime };
    chatListData.push(ch);
    // console.log(chatListData)
    var charlenght = chatListData.length;
    if (scrolltopFlag) {
      that.setData({
        chatList: chatListData,
        scrolltop: "roll" + charlenght,
      });
    } else {
      that.setData({
        chatList: chatListData,
      });
    }
  },

  onUnload: function () {
    if (res.platform == 'ios') {
      myaudio.stop()
    } else {
      myaudio.destroy()
    }
    SocketTask.close({
      success: function (res) {
        console.log(res)
      }
    })
    chatListData = [];
  },

  speaking: function () {
    //话筒帧动画 
    var i = 0;
    that.speakerInterval = setInterval(function () {
      i++;
      i = i % 7;
      that.setData({
        speakerUrl: '../../images/speaker' + i + '.png',
      });
    }, 300);
  },


  // // 分享功能
  // onShareAppMessage: function (res) {
  //   return {
  //     desc: '和Mono一起漂流吧',
  //     path: '../IntelligentForeignEducation/IntelligentForeignEducation',
  //     imageUrl: '../../image/curriculumPress2.png',
  //     success: function (res) {
  //       console.log("[Console log]:" + res.errMsg);
  //     },
  //     fail: function (res) {
  //       console.log("[Console log]:" + res.errMsg);
  //     }
  //   }
  // },
})
