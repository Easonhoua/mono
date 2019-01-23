var app = getApp();
var that;
const recorderManager = wx.getRecorderManager();
var res = wx.getSystemInfoSync();
if (res.platform == 'ios') {
  var myaudio = wx.getBackgroundAudioManager();
} else {
  var myaudio = wx.createInnerAudioContext();
}
var MD5 = require('../../utils/MD5.js');
const Monohttps = app.globalData.Monohttps;
var n = 0;
var a = 0;
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
    a: false,
    b: false,
    // score: ''
    readPartreal:'',
    option: ''
  },

  onLoad: function (e) {
    that = this
    var tid = e.tid
    that.setData({
      option: e
    })
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
            a: true,
            b: false
          })
        }else if (dialogues) {
          that.setData({
            dialoguesarr: dialogues,
            a: true,
            b: false
          })
        }else if (readParts) {
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
        // wx.showToast({
        //   title: '网络异常！',
        //   duration: 2000,
        //   icon:'none'
        // })
      }
    })
  },

  onShow() {
    that = this;
    wx.onSocketMessage(function (onMessage) {
      wx.hideLoading();
      var useData = JSON.parse(onMessage.data).result
      if (useData == undefined) {
        wx.showToast({
          title: '语音异常',
          duration: 2000,
          icon:'none',
          mask: true
        })
      } else {
        // that.setData({
        //   score: useData.overall
        // })
        var wordsarr = that.data.wordsarr
        var dialoguesarr = that.data.dialoguesarr
        var readPartsarr = that.data.readPartsarr
        if (useData.overall >= 80) {
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
            that.setData({
              readPartsarr: readPartsarr
            })
          }
          setTimeout(function () {
            that.ObtainData()
          }, 1000)
          a =0;
        } else if (useData.overall < 80) {
          that.setData({
            Bwrongplay: false,
            Brightplay: true
          })
          if (a < 2) {
            myaudio.title = '兼容ios的title'
            myaudio.src = "https://dfs.aismono.net/group2/M00/00/22/rBK-w1v-RPKAXr3UAAAKrzF7Kfs186.mp3";
            myaudio.play();
            a++;
          } else {
            a = 0;
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
              that.setData({
                readPartsarr: readPartsarr
              })
            }
            setTimeout(function () {
              that.ObtainData()
            }, 1000)
          }
        }
      }
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
        console.log(fail)
        wx.hideLoading();
        
      }
    })
  },

  // 按钮按下
  touchdown: function () {
    that = this;
    that.setData({
      Bwrongplay: true,
      Brightplay: true,
      isSpeaking: true
    })
    that.speaking.call();
    const options = {
      duration: 180000,
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 96000,
      format: 'mp3',
      frameSize: 50
    }
    recorderManager.start(options);
    recorderManager.onStart(() => {
      // console.log('开始')
    });

    recorderManager.onError((res) => {
      // console.log(res)
      that.setData({
        isSpeaking: false,
      })
      // wx.showToast({
      //   title: '网络异常！',
      //   duration: 2000,
      //   icon:'none'
      // })
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
    wx.showLoading({
      title: '数据加载中...',
    })
    clearInterval(that.speakerInterval);
    recorderManager.onStop(function (res) {
      var wordtxt = that.data.onlyText
      var timestamp = new Date().getTime()
      if (that.data.wordsarr != '') {
        var  jsonData2 = '{"tokenId":"' + MD5.md5(timestamp) + '", "request": { "attachAudioUrl": 1,"coreType": "en.word.score","rank": 100,"refText": "' + wordtxt + '","userId": "mono100669"},"audio": { "audioType": "mp3", "channel": 1, "sampleBytes": 2, "sampleRate": 16000}}';
      } else if (that.data.dialoguesarr != '') {
        var  jsonData2 = '{"tokenId":"' + MD5.md5(timestamp) + '", "request": { "attachAudioUrl": 1,"coreType": "en.sent.score","rank": 100,"refText": "' + wordtxt + '","userId": "mono100669"},"audio": { "audioType": "mp3", "channel": 1, "sampleBytes": 2, "sampleRate": 16000}}';
      } else if (that.data.readPartsarr != '') {
        var  jsonData2 = '{"tokenId":"' + MD5.md5(timestamp) + '", "request": { "attachAudioUrl": 1,"coreType": "en.pred.exam","rank": 100,"refText":{"lm":"' + wordtxt +'"},"userId": "mono100669"},"audio": { "audioType": "mp3", "channel": 1, "sampleBytes": 2, "sampleRate": 16000}}';
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
    });
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
            that.onLoad(that.data.option)
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
                a: true,
                b: false
              })

              setTimeout(function () {
                myaudio.src = duihuacur;
                myaudio.title = '测试';
                myaudio.autoplay = true;
                myaudio.play();
              }, 1000)
              n++;
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
            var readPartreal = res.data.body.readPart.replace(/\[/g, '<strong>').replace(/\]/g, '</strong>').replace(/@/g, '<br/><br/>')
            that.setData({
              toptitle: titlecontent,
              onlyText: readPart,
              yuanshiSrc: readpartSrc,
              readPartreal: readPartreal
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
          console.log('lalal')
          // wx.showToast({
          //   title: '网络异常！',
          //   duration: 2000,
          //   icon:'none'
          // })
        }
      })
    }
  },

  //播放原始语音
  monoyuyin(e) {
    var duihuaSrc = e.target.dataset.monosrc
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
  onShareAppMessage: function () {
    
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



