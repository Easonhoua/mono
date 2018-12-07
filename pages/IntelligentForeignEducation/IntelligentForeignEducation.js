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
Page({
  data: {
    userInfo: {},
    chatList: [],
    scrolltop: '',
    userLogoUrl: '',
    filePath: null,
    speakerUrl: '../../images/speaker0.png',
    isSpeaking: false,
    talkBtn: "../../images/holdtalk.png",
    ChineseBtn: false,
    EnglishBtn: true
  },

  onLoad: function (options) {
    that = this;
    var userInfo = app.globalData.userInfo  
    console.log(userInfo)
    that.setData({
      userLogoUrl: userInfo.avatarUrl
    })
  },


  // 按钮按下
  touchdown: function () {
    that = this;
    that.speaking.call();
    that.setData({
      isSpeaking: true
    })
    const mp3RecoderOptions = {
      duration: 60000,
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 48000,
      format: 'mp3',
      frameSize: 50
    }
    
    recorderManager.start(mp3RecoderOptions);
    recorderManager.onStart(()=>{
      console.log('recorder start!')
    })
    recorderManager.onError(()=>{
      console.log('error')
    })
  },
  // 按钮松开
  touchup: function () {
    that= this
    recorderManager.stop();

    that.setData({
      studyWhat: true,
      isSpeaking: false,
      speakerUrl: '../../images/speaker0.png',
    })
    clearInterval(that.speakerInterval);
    recorderManager.onStop((res) => {
      this.tempFilePath = res.tempFilePath;
      console.log('停止录音', res.tempFilePath)
      const { tempFilePath } = res
      that.addChat("我是Eason","r")


    })
  },


  // 增加对话到显示界面（scrolltopFlag为True）
  addChat: function (word, orientation) {
    that.addChatWithFlag(word, orientation, true);
  },
  // 增加对话到显示界面（scrolltopFlag为是否滚动标志）
  addChatWithFlag: function (filePath, orientation, scrolltopFlag) {
    let ch = { 'src': filePath, 'time': new Date().getTime(), 'orientation': orientation };
    chatListData.push(ch);
    var charlenght = chatListData.length;
    console.log("[Console log]:Add message to chat list...");
    if (scrolltopFlag) {
      console.log("[Console log]:Rolling to the top...");
      that.setData({
        chatList: chatListData,
        scrolltop: "roll" + charlenght,
      });
    } else {
      // console.log("[Console log]:Not rolling...");
      that.setData({
        chatList: chatListData,
      });
    }
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
      console.log("[Console log]:Speaker image changing...");
    }, 300);
  },

  // 分享功能
  onShareAppMessage: function (res) {
    return {
      desc: '和Mono一起漂流吧',
      path: '../IntelligentForeignEducation/IntelligentForeignEducation',
      imageUrl: '../../image/curriculumPress2.png',
      success: function (res) {
        console.log("[Console log]:" + res.errMsg);
      },
      fail: function (res) {
        console.log("[Console log]:" + res.errMsg);
      }
    }
  },

 
})
