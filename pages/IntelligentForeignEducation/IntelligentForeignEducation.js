var app = getApp();
var that;
var chatListData = [];
const recorderManager = wx.getRecorderManager();
var res = wx.getSystemInfoSync();
if (res.platform == 'ios') {
  var myaudio = wx.getBackgroundAudioManager();
} else {
  var myaudio = wx.createInnerAudioContext();
}
const Monohttps = app.globalData.Monohttps;
var MD5 = require('../../utils/MD5.js');
const tokenhttps = 'https://openapi.baidu.com/oauth/2.0/token?'
const tsn = 'http://tsn.baidu.com/text2audio?'
var a = 0;
var iTime;

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
    viewWidth: '',
    showModal: false,
  },

  hideModal: function () {
    that = this;
    that.setData({
      showModal: false
    });
  },

  onLoad: function (options) {
    that = this;
    var avatarUrl = wx.getStorageSync('avatarUrl')
    if (avatarUrl){
      that.setData({
        userLogoUrl: avatarUrl
      })
    }else{
      that.setData({
        showModal: true
      });
    }
  },

  onShow() {
    that = this;
    wx.onSocketMessage(function (onMessage) {
      wx.hideLoading()
      var useData = JSON.parse(onMessage.data).result
      if (useData == undefined) {
        wx.showToast({
          title: '语音异常',
          duration: 2000,
          icon: 'none'
        })
      } else {
        //写在事件内部
        clearTimeout(iTime);
        iTime = setTimeout(function () {
          //需要执行的事件
          if (useData.overall >= 75) {
            that.addChat(that.data.filePath, "r", false, true, that.data.viewWidth, that.data.second, false, true)
            that.setData({
              ChineseBtn: false,
              EnglishBtn: true,
              gobackBtn: true
            })
            setTimeout(function () {
              myaudio.title = '兼容ios的title'
              myaudio.src = "https://dfs.aismono.net/group2/M00/00/22/rBK-w1v-ROyAWhBfAAAvanH_WC0883.mp3";
              myaudio.play();
            }, 500)
          } else if (useData.overall < 75) {
            that.addChat(that.data.filePath, "r", true, false, that.data.viewWidth, that.data.second, true, false)
            setTimeout(function () {
              myaudio.title = '兼容ios的title'
              myaudio.src = "https://dfs.aismono.net/group2/M00/00/22/rBK-w1v-RPKAXr3UAAAKrzF7Kfs186.mp3";
              myaudio.play();
            }, 500)
          }
        }, 100);
      }
    })


    myaudio.onEnded(function(e){
      console.log(e)
    })

  },

  sendSocketMessage(msg) {
    that = this;
    wx.sendSocketMessage({
      data: msg,
      success: function (res) {
        // console.log('已发送', res)
      },
      fail: function (fail) {
        wx.hideLoading();
        console.log(fail)
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
      that.setData({
        isSpeaking: false,
      })
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
        that.addChat(tempFilePaths, "r", true, true, viewWidth+'rpx', secondTime,true,true)
      }else{
        that.addChat(tempFilePaths, "r", true, true, '128rpx', secondTime,true,true)
      }
      wx.uploadFile({
        url: Monohttps + '/mono-biz-app/recognizer/voiceSemantic.shtml',
        filePath: tempFilePaths,
        name: 'file',
        success(ret) {
          wx.hideLoading()
          var chineseword = JSON.parse(ret.data)
          if (chineseword.code == 1 || chineseword.data == '' || chineseword.data == ''){
            wx.showToast({
              title: 'mono没听清，请重录。',
              icon: 'none',
              duration: 2000
            })
          }else{
            var pattern2 = new RegExp("[A-Za-z]+");
            var str2 = chineseword.data
            if (pattern2.test(str2)) {
              wx.showToast({
                title: '请说中文。',
                icon: 'none',
                duration: 2000
              })
            }else{
              that.addChat(chineseword, "l", true, true)
              that.baidurequest(chineseword)
              that.setData({
                ChineseBtn: true,
                EnglishBtn: false,
                chineseword: chineseword,
                gobackBtn: false,
                second: secondTime,
              })
            }
          }
        },
        fail: function (fail) {
          wx.showToast({
            title: '网络异常！',
            icon:'none',
            duration: 2000
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
      that.setData({
        isSpeaking: false,
      })
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
      var jsonData2;
      if (wordtxt.indexOf(" ") == -1) {
        jsonData2 = '{"tokenId":"' + MD5.md5(timestamp) + '", "request": { "attachAudioUrl": 1,"coreType": "en.word.score","rank": 100,"refText": "' + wordtxt + '","userId": "mono100669"},"audio": { "audioType": "mp3", "channel": 1, "sampleBytes": 2, "sampleRate": 16000}}';
      } else {
        jsonData2 = '{"tokenId":"' + MD5.md5(timestamp) + '", "request": { "attachAudioUrl": 1,"coreType": "en.sent.score","rank": 100,"refText": "' + wordtxt + '","userId": "mono100669"},"audio": { "audioType": "mp3", "channel": 1, "sampleBytes": 2, "sampleRate": 16000}}';
      }
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
    that = this
    wx.request({
      url: tokenhttps +'grant_type=client_credentials&client_id=S0uoANfKnvmH0qiVahBRm84i&client_secret=R11Y4xxLoM9Sl6nO67O3uYTAo8TXA95E',
      success:function(res){
        var acctkoen = res.data.access_token
        that.setData({
          token: acctkoen
        })
        var myaudioword = encodeURIComponent(encodeURIComponent(word.dataEn))
        myaudio.title = "兼容ios"
        myaudio.src = tsn + 'lan=zh&ctp=1&cuid=50-9A-4C-0F-ED-08&tok=' + acctkoen + '&tex=' + myaudioword + '&vol=15&per=4&spd=4&pit=2&aue=3'
        myaudio.play()
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
    myaudio.title = "兼容ios"//vol=15&per=4&spd=4&pit=2&aue=3
    myaudio.src = tsn + 'lan=zh&ctp=1&cuid=50-9A-4C-0F-ED-08&tok=' + acctkoen +'&tex=' + myaudioword +'&vol=15&per=4&spd=4&pit=2&aue=3'
    myaudio.play()
  },

  // 增加对话到显示界面（scrolltopFlag为True）
  addChat: function (word, orientation, rightIcon, wrongIcon, viewWidth, secondTime, righttxt, wrongtxt) {
    that.addChatWithFlag(word, orientation, rightIcon, wrongIcon, viewWidth, secondTime, righttxt,wrongtxt,true);
  },
  // 增加对话到显示界面（scrolltopFlag为是否滚动标志）
  addChatWithFlag: function (filePath, orientation, rightIcon, wrongIcon, viewWidth, secondTime, righttxt, wrongtxt,scrolltopFlag) {
    let ch = { 'src': filePath, 'time': new Date().getTime(), 'orientation': orientation, 'rightIcon': rightIcon, 'wrongIcon': wrongIcon, 'viewWidth': viewWidth, 'secondTime': secondTime, 'righttxt': righttxt, 'wrongtxt': wrongtxt };
    chatListData.push(ch);
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
    chatListData = [];
  },

  speaking: function () {
    //话筒帧动画 
    that = this
    var i = 0;
    that.speakerInterval = setInterval(function () {
      i++;
      i = i % 7;
      that.setData({
        speakerUrl: '../../images/speaker' + i + '.png',
      });
    }, 300);
  },

  // speaking: function () {
  //   //话筒帧动画 
  //   that = this
  //   var i = 0;
  //   that.speakerInterval = setInterval(function () {
  //     i++;
  //     i = i % 7;
  //     that.setData({
  //       speakerUrl: '../../images/speaker' + i + '.png',
  //     });
  //   }, 300);
  // },
  getUserInfo: function (e) {
    this.hideModal();
    this.setData({
      userLogoUrl: e.detail.userInfo.avatarUrl,
    })
  },
  // // 分享功能
  onShareAppMessage: function () {

  },
})
