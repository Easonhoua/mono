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
var WxParse = require('../wxParse/wxParse.js');
const Monohttps = app.globalData.Monohttps;
const websocketaddr = app.globalData.websocketaddr;
var SocketTask;
var socketOpen = false;
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
  },

  onLoad: function (e) {
    that = this
    if (!socketOpen) {
      that.webSocket()
    }
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
            a: true,
            b: false
          })
        }
        if (dialogues) {
          that.setData({
            dialoguesarr: dialogues,
            a: true,
            b: false
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
        wx.showToast({
          title: '网络异常！',
        })
      }
    })
  },

  onReady() {
    that = this;
    SocketTask.onOpen(res => {
      // console.log('open了')
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
      that.webSocket()
      wx.showToast({
        title: '连接失败！',
      })
    })


    SocketTask.onMessage(onMessage => {
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
      
    });

    recorderManager.onError((res) => {
      console.log(res)
      wx.showToast({
        title: '网络异常！',
      })
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
            var readPartreal = res.data.body.readPart.replace('[', '<strong>').replace(']', '</strong>').replace(/@/g, '<br/><br/>')
            var readParttrue = WxParse.wxParse('readParttxt', 'html', readPartreal, that, 0);
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
          wx.showToast({
            title: '网络异常！',
          })
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

    SocketTask.close({
      success: function (res) {
        console.log(res)
      }
    })
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



