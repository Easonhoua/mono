var app = getApp();
var that;
const recorderManager = wx.getRecorderManager();
var res = wx.getSystemInfoSync()
if (res.platform == 'ios') {
  var myaudio = wx.getBackgroundAudioManager();
} else {
  var myaudio = wx.createInnerAudioContext();
}
const Monohttps = app.globalData.Monohttps;
const websocketaddr = app.globalData.websocketaddr;
var n = 0;
var a= 0
Page({
  data: {
    speakerUrl: '../../images/speaker0.png',
    isSpeaking: false,
    Brightplay: true,
    Bwrongplay: true,
    toptitle: '',
    onlyText: '',
    duihua: [],
    src: '',
    yuanshiSrc: '',
    wordsarr: [],
    dialoguesarr: [],
    readPartsarr: [],
    a :false,
    b: false
  },

  onLoad: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    that = this


  //连接webSocket
    wx.connectSocket({
      url: websocketaddr +'/ws?e=0&t=0&version=2',
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success:function(res){
        console.log(res)
      }
    })








    var tid = e.tid
    var param = {
      tid: tid
    }
    var paramJson = {
      body: param,
      sys: "1",
      sysVer: "html5",
      token: "",
      ver: "1.0"
    }
    wx.request({
      url: Monohttps + '/mono-biz-app/educationMiniProgram/queryClassClass',
      method: 'post',
      data: paramJson,
      success: function (res) {
        var words = res.data.body.words
        var dialogues = res.data.body.dialogues
        var readParts = res.data.body.readParts
        if (words) {
          that.setData({
            wordsarr: words,
            a : true
          })
        }
        if (dialogues) {
          that.setData({
            dialoguesarr: dialogues,
            a: true
          })
        }
        if (readParts) {
          that.setData({
            readPartsarr: readParts,
            a: false,
            b: true
          })
        }
        that.ObtainData();
      },
      fail: function (fail) {
        console.log(fail)
      }
    })
  },

  onShow() {
    wx.hideLoading()
  },

  //获取单词数据
  ObtainData() {
    that = this
    var wordtid = that.data.wordsarr[0]
    var dialoguetid = that.data.dialoguesarr[0]
    var readParttid = that.data.readPartsarr[0]
    if (wordtid != undefined) {
      var param = {
        tid: wordtid,
        classType: 1
      }
    } else if (dialoguetid != undefined) {
      var param = {
        tid: dialoguetid,
        classType: 2
      }
    } else if (readParttid != undefined) {
      var param = {
        tid: readParttid,
        classType: 3
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '这节课已学完',
        success(res) {
          if (res.confirm) {
            wx.navigateBack()
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    that.setData({
      Bwrongplay: true,
      Brightplay: true
    })

    if (param != undefined) {
      var paramJson = {
        body: param,
        sys: "1",
        sysVer: "html5",
        token: "",
        ver: "1.0"
      }
      wx.request({
        url: Monohttps + '/mono-biz-app/educationMiniProgram/queryClassClassInfo',
        method: 'post',
        data: paramJson,
        success: function (res) {
          // console.log(res)
          var titlecontent = res.data.body.content
          var danci = res.data.body.word
          var danciSrc = res.data.body.wordAudio
          var dialogues = res.data.body.dialogues
          var readPart = res.data.body.readPart
          var readpartSrc = res.data.body.readPartAudio
          if (danci != undefined) {
            that.setData({
              toptitle: titlecontent,
              onlyText: danci,
              yuanshiSrc: danciSrc
            })
            //延时一秒自动播放音频
            setTimeout(function () {
              myaudio.src = danciSrc;
              myaudio.title = '测试'
              myaudio.autoplay = true;
              myaudio.play();
            }, 1000)

          } else if (dialogues != undefined) {
            if (dialogues[n] != undefined) {
              var duihuacur = dialogues[n].dialogueAudio
              var duihuaText = dialogues[n].dialogue
              that.setData({
                toptitle: titlecontent,
                duihua: dialogues,
                yuanshiSrc: duihuacur,
                onlyText: duihuaText,
              })

              setTimeout(function () {
                myaudio.src = duihuacur;
                myaudio.title = '测试';
                myaudio.autoplay = true;
                myaudio.play();
              }, 1000)
              n++;
              console.log(n)
            } else {
              n = 0;
              var dialoguesarr = that.data.dialoguesarr
              dialoguesarr.splice(0, 1)
              that.setData({
                Bwrongplay: true,
                Brightplay: true,
                dialoguesarr: dialoguesarr
              })
              that.ObtainData();
            }
          } else if (readPart != undefined) {
            that.setData({
              toptitle: titlecontent,
              onlyText: readPart,
              yuanshiSrc: readpartSrc
            })
            //延时一秒自动播放音频
            setTimeout(function () {
              myaudio.src = readpartSrc;
              myaudio.title = '测试';
              myaudio.autoplay = true;
              myaudio.play();
            }, 1000)
          }

        },
        fail: function (fail) {
          console.log(fail)
        }
      })
    }
  },

  // 按钮按下
  touchdown: function () {
    that = this;
    that.speaking.call();
    that.setData({
      Bwrongplay: true,
      Brightplay: true,
      isSpeaking: true
    })
    const options = {
      duration: 10000,
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 96000,
      format: 'mp3',
      frameSize: 50
    }
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start');
    });

    recorderManager.onError((res) => {
      console.log(res);
    });
  },

  // // 按钮松开
  touchup: function () {
    that = this;
    //  结束录音
    recorderManager.stop();
    that.setData({
      isSpeaking: false,
      speakerUrl: '../../images/speaker0.png',
    })
    clearInterval(that.speakerInterval);
    recorderManager.onStop(function (res) { 
      var filePath = res.tempFilePath
      that.setData({
        src: filePath
      })

      var param = {
        evaluator: that.data.onlyText,
        sys: "1",
        sysVer: "html5",
        token: "",
        ver: "1.0"
      }
      console.log(param)
      that.getData(param, filePath);
    });
  },


  getData(param, filePath) {
    wx.uploadFile({
      url: Monohttps + '/mono-biz-app/recognizer/voiceEvaluator.shtml',
      filePath: filePath,
      formData: param,
      name: "file",
      success(ret) {
        var useData = JSON.parse(ret.data)
        if (useData.code == 1) {
          wx.showToast({
            title: '语音异常',
            duration: 2000,
            mask: true
          })
        } else {
          var wordsarr = that.data.wordsarr
          var dialoguesarr = that.data.dialoguesarr
          var readPartsarr = that.data.readPartsarr

          if (useData.code == 0 && useData.score >= 60) {
            that.setData({
              Brightplay: false,
              Bwrongplay: true,
            })

            myaudio.title = '兼容ios的title'
            myaudio.src = "https://dfs.aismono.net/group2/M00/00/22/rBK-w1v-ROyAWhBfAAAvanH_WC0883.mp3";
            myaudio.play();

            if (wordsarr != '') {
              wordsarr.splice(0, 1)
              that.setData({
                wordsarr: wordsarr
              })
            } else if (dialoguesarr != '') {
              that.setData({
                dialoguesarr: dialoguesarr
              })
            } else if (readPartsarr != '') {
              readPartsarr.splice(0, 1)
              that.setDat({
                readPartsarr: readPartsarr
              })
            }
            setTimeout(function(){
              that.ObtainData()
            },1000)
          } else if (useData.code == 0 && useData.score <= 60) {
            that.setData({
              Bwrongplay: false,
              Brightplay: true
            })
            if(a<2){
              myaudio.title = '兼容ios的title'
              myaudio.src = "https://dfs.aismono.net/group2/M00/00/22/rBK-w1v-RPKAXr3UAAAKrzF7Kfs186.mp3";
              myaudio.play();
              a++;
            }else{
              a=0;
              myaudio.title = '兼容ios的title'
              myaudio.src = "https://dfs.aismono.net/group2/M00/00/22/rBK-w1v-RPKAXr3UAAAKrzF7Kfs186.mp3";
              myaudio.play();

              if (wordsarr != '') {
                wordsarr.splice(0, 1)
                that.setData({
                  wordsarr: wordsarr
                })
              } else if (dialoguesarr != '') {
                that.setData({
                  dialoguesarr: dialoguesarr
                })
              } else if (readPartsarr != '') {
                readPartsarr.splice(0, 1)
                that.setDat({
                  readPartsarr: readPartsarr
                })
              }
              setTimeout(function () {
                that.ObtainData()
              }, 1000)
            }
            
          }
        }
      },
      fail(err) {
        wx.hideLoading();
        console.log("录音发送到后台失败");
        console.log(err);
      }
    })
  },


  // //播放自己录音
  // mineluyin: function () {
  //   myaudio.onError((res) => {
  //     // 播放音频失败的回调
  //     console.log(res)
  //   })
  //   myaudio.title = '测试'
  //   myaudio.src = this.data.src; // 这里可以是录音的临时路径
  //   if (myaudio.paused) {
  //     myaudio.play();
  //     return;
  //   } else {
  //     myaudio.pause()
  //   }
  // },


  //播放原始语音
  monoyuyin(e) {
    var duihuaSrc = e.target.dataset.monosrc
    console.log(e)
    console.log(this.data.yuanshiSrc)
    if (duihuaSrc != undefined) {
      myaudio.title = '测试'
      myaudio.src = duihuaSrc;
      myaudio.play();
    } else {
      myaudio.title = '测试'
      myaudio.src = this.data.yuanshiSrc
      myaudio.play();
    }
  },


  onUnload: function () {
    n = 0;
    if (res.platform == 'ios') {
      myaudio.stop()
    } else {
      myaudio.destroy()
    }
  },

  // 分享功能
  onShareAppMessage: function (res) {
    return {
      desc: '魔脑陪读-跟读课文',
      path: 'pages/ReadTheText/ReadTheText',
      imageUrl: '../../images/CaliforniaEnglish2.png',
      success: function (res) {
        console.log("[Console log]:" + res.errMsg);
      },
      fail: function (res) {
        console.log("[Console log]:" + res.errMsg);
      }
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
    }, 300);
  }
})



