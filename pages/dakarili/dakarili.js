const app = getApp()
const Monohttps = app.globalData.Monohttps
var that;
Page({
  data: {
    dayStyle: [{
      month: 'current',
      day: new Date().getDate(),
      color: 'white',
      background: '#84e7d0',
    }],
    continueday: '',
    xindelist: [],
    nowdata: true,
    pastdata: false,
    pageNum: 1,
    pageSize: 5,
    hasMoreData: true,
    maskHidden: false,
    contentIds: '',
    imagePath:'',
    avatarUrl:'',
    nickName:'',
    imgurl:'',
    dakariqi: '',
    isdaka:true
  },

  //给点击的日期设置一个背景颜色
  dayClick: function(event) {
    that = this;
    if (event.detail.background == "transparent") {
      that.setData({
        isdaka: false
      })
    }else{
      that.setData({
        isdaka: true
      })
    }
    var year = event.detail.year;
    var month = event.detail.month;
    var date = event.detail.day;
    var curyear = new Date().getFullYear();
    var curMonth = new Date().getMonth() + 1;
    var curDays = new Date().getDate();
    var curriqi = curyear + '/' + curMonth + '/' + curDays;
    var riqinum = year + '/' + month + "/" + date;
    var timestamp = Date.parse(new Date(riqinum));
    var curtimestamp = Date.parse(new Date(curriqi));
    that.setData({
      xindelist: [],
      pageNum: 1,
      hasMoreData: true,
      dakariqi: year+'.'+month+'.'+date
    })
    var jsonData = {
      body: {
        curPage: that.data.pageNum,
        pageSize: that.data.pageSize,
        creatday: timestamp
      }
    }

    that.getcurData(jsonData)

    var changeyear = wx.getStorageSync('changeyear')
    var changemonth = wx.getStorageSync('changemonth')
    var openid = wx.getStorageSync('openid')
    var rilidata;
    if (changeyear != '' || changeyear != '') {
      rilidata = {
        body: {
          openid: openid,
          createtime: year + '-' + month
        }
      }
    } else {
      rilidata = {
        body: {
          openid: openid,
        }
      }
    }

    wx.request({
      url: Monohttps + '/mono-biz-app/educationMiniProgram/getCardInfoMonth',
      method: 'post',
      data: rilidata,
      success: function(res) {
        let dayStyle = [];
        var daysstr = res.data.body.createtime
        var daysarr = daysstr.split(',')
        for (var i = 0; i < daysarr.length; i++) {
          dayStyle.push({
            month: 'current',
            day: Number(daysarr[i]),
            color: 'white',
            background: '#DC5828'
          })
        }
        var curbianse = {
          month: 'current',
          day: date,
          color: 'white',
          background: '#84e7d0',
        }
        dayStyle.push(curbianse)
        that.setData({
          dayStyle: dayStyle,
          continueday: res.data.body.continueday
        })
      },
    })

    if (curtimestamp > timestamp) {
      that.setData({
        nowdata: false,
        pastdata: true
      })
    } else if (curtimestamp == timestamp) {
      that.setData({
        nowdata: true,
        pastdata: false
      })
    }
  },

  bindnextMonth: function(event) { //监听点击下个月事件:nextMonth
    that = this;
    var curryear = event.detail.currentYear
    var curMonth = event.detail.currentMonth
    that.getdakaxinxi(curryear, curMonth)
  },
  bindprevMonth: function(event) { //监听点击上个月事件:prevMonth
    that = this;
    var curryear = event.detail.currentYear
    var curMonth = event.detail.currentMonth
    that.getdakaxinxi(curryear, curMonth)
  },
  dateChange: function(event) {
    that = this;
    var curryear = event.detail.currentYear
    var curMonth = event.detail.currentMonth
    that.getdakaxinxi(curryear, curMonth)
  },


  getdakaxinxi(year, month) {
    that = this;
    var openid = wx.getStorageSync('openid');
    wx.setStorage({
      key: 'changeyear',
      data: year,
    })
    wx.setStorage({
      key: 'changemonth',
      data: month,
    })

    wx.request({
      url: Monohttps + '/mono-biz-app/educationMiniProgram/getCardInfoMonth',
      method: 'post',
      data: {
        body: {
          openid: openid,
          createtime: year + '-' + month
        }
      },
      success: function(res) {
        let dayStyle = [{
          month: 'current',
          day: new Date().getDate(),
          color: 'white',
          background: '#84e7d0',
        }];
        var daysstr = res.data.body.createtime
        if (daysstr != 0) {
          var daysarr = daysstr.split(',')
          for (var i = 0; i < daysarr.length; i++) {
            dayStyle.push({
              month: 'current',
              day: Number(daysarr[i]),
              color: 'white',
              background: '#DC5828'
            })
          }
        }

        that.setData({
          dayStyle: dayStyle,
          continueday: res.data.body.continueday
        })
      },
    })

    var date = new Date().getDate();
    var timestamp1 = year + '/' + month + "/" + date + " 0:0:0"
    var timestamp2 = Date.parse(new Date(timestamp1))

    var jsonData = {
      body: {
        curPage: that.data.pageNum,
        pageSize: that.data.pageSize,
        creatday: timestamp2
      }
    }
    that.getcurData(jsonData)
  },

  getcurData(jsonData) {
    that = this;
    wx.setStorage({
      key: 'fenyeshijian',
      data: jsonData.body.creatday,
    })
    wx.request({
      url: Monohttps + '/mono-biz-app/educationMiniProgram/getCardNoteInfo',
      method: 'post',
      data: jsonData,
      success: function(res) {

        wx.hideLoading();
        var xindelist = that.data.xindelist;
        var listRooms = res.data.body;
        var nickname = wx.getStorageSync('nickName')
        if (res.data.code == 9002) {
          wx.showToast({
            title: "没有更多的数据了...",
            icon: 'none',
            duration: 1000
          });
          //分页失败，分页数据减1
          if (that.data.pageNum > 1) {
            that.setData({
              hasMoreData: false,
              pageNum: --that.data.pageNum
            });
          }
          return;
        } else if (res.data.code == 8000) {
          for (var i = 0; i < res.data.body.length; i++) {
            if (res.data.body[i].createtime / 3600 < 1 && res.data.body[i].createtime / 60 > 1) {
              res.data.body[i].createtime = parseInt(res.data.body[i].createtime / 60) + '分钟'
            } else if (res.data.body[i].createtime / 3600 >= 1) {
              res.data.body[i].createtime = parseInt(res.data.body[i].createtime / 3600) + '小时'
            } else if (res.data.body[i].createtime / 3600 < 1 && res.data.body[i].createtime / 60 <= 1) {
              res.data.body[i].createtime = '1分钟'
            }
            if (res.data.body[i].nickName == nickname) {
              that.setData({
                contentIds: res.data.body[i].contentIds,
              })
            }
            res.data.body[i].contentIds = res.data.body[i].contentIds.replace(',', " ")
          }

          that.setData({
            xindelist: xindelist.concat(listRooms)
          });
        }
      },
      fail: function() {
        wx.showToast({
          title: '加载数据失败',
          icon: none
        })
      },
      complete: function() {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }

    })
  },
  goshare() {
    that = this;
    that.setData({
      maskHidden: false
    });
    wx.showLoading({
      title: '图片生成中...',
    });
    setTimeout(function() {
      wx.hideToast()
      that.createNewImg();
      that.setData({
        maskHidden: true
      });
    }, 1000)

  },


  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function() {
    that = this;
    var txt1;
    if (that.data.contentIds.split(',')[0] != undefined && that.data.contentIds.split(',')[1] != undefined) {
      var txt1 = "《" + that.data.contentIds.split(',')[0] + "》" + "《" + that.data.contentIds.split(',')[1] +"》"
    } else if (that.data.contentIds.split(',')[0] != undefined){
      var txt1 = "《" + that.data.contentIds.split(',')[0] + "》" 
    }
    var context = wx.createCanvasContext('mycanvas');
    // context.setFillStyle("#ffe200")
    // context.fillRect(0, 0, 375, 667)
    var path = "../../images/bgimg.png";
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    //不知道是什么原因，手机环境能正常显示
    context.drawImage(path, 0, 0, 375, 667);
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    var qrCode = "../../images/xiaochengxuCode.jpg";

    context.setFontSize(20);
    context.setFillStyle('#000000');
    context.setTextAlign('center');
    context.fillText("我的英语派学习记录", 120, 60);

    context.setFontSize(12);
    context.setFillStyle('#000000');
    context.setTextAlign('left');
    context.fillText("Hi，我今天学习了" + txt1 + "魔脑英语课，", 32, 95);

    context.setFontSize(12);
    context.setFillStyle('#000000');
    context.fillText("口语感觉进步了呢，我们一起学习吧，join us！", 32, 115);

    context.rect(30, 130, 165, 30)
    context.setFillStyle('#000000')
    context.stroke()

    context.setFontSize(15);
    context.setFillStyle('#000000');
    context.fillText("魔脑陪读 / " + that.data.dakariqi , 38, 150);

    var draw = function (x, y, width, height, radius, color, type) {
      context.beginPath();
      context.moveTo(x, y + radius);
      context.lineTo(x, y + height - radius);
      context.quadraticCurveTo(x, y + height, x + radius, y + height);
      context.lineTo(x + width - radius, y + height);
      context.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
      context.lineTo(x + width, y + radius);
      context.quadraticCurveTo(x + width, y, x + width - radius, y);
      context.lineTo(x + radius, y);
      context.quadraticCurveTo(x, y, x, y + radius);
      context[type + 'Style'] = color || params.color;
      context.closePath();
      context[type]();
    }
    draw(15, 330, 341, 197, 15, '#ffffff', 'fill')

    context.setFontSize(18);
    context.setFillStyle('#000000');
    context.fillText(that.data.nickName, 100, 366);

    context.setFontSize(12);
    context.setFillStyle('#555555');
    context.fillText("刚刚在【魔脑陪读】完成了英语学习打卡", 100, 386);

    context.setFontSize(12);
    context.setFillStyle('#555555');
    context.fillText("坚持打卡", 158, 420);


    context.setFontSize(20);
    context.setFillStyle('#000000');
    context.fillText(that.data.continueday+'天', 164, 450);

    context.moveTo(50, 465)
    context.lineTo(320, 465)
    context.setStrokeStyle('#cccccc')
    context.stroke()

    context.setFontSize(12);
    context.setFillStyle('#000000');
    context.fillText("AI陪练，外教陪读", 130, 490);

    context.setFontSize(12);
    context.setFillStyle('#000000');
    context.fillText("同步课堂，原版绘本，自然拼读", 90, 510);

    draw(15, 540, 341, 99, 15, '#ffffff', 'fill')

    context.setFontSize(16);
    context.setFillStyle('#000000');
    context.fillText("魔脑陪读", 32, 574);

    context.setFontSize(16);
    context.setFillStyle('#000000');
    context.fillText("马上会说，一听就懂", 32, 596);

    draw(28, 608, 120, 20, 10, '#eb5a28', 'fill');

    context.setFontSize(12);
    context.setFillStyle('#ffffff');
    context.fillText("长按识别二维码", 36, 622);

    context.save()
    context.beginPath()
    context.arc(55, 370, 30, 0, 2 * Math.PI) //画出圆
    context.clip(); //裁剪上面的圆形
    context.drawImage(that.data.imgurl, 25, 340, 60, 60); // 在刚刚裁剪的园上画图
    context.restore()

    context.save()
    context.beginPath()
    context.arc(300, 590, 40, 0, 2 * Math.PI); //画出圆
    context.clip(); //裁剪上面的圆形
    context.drawImage(qrCode, 260, 550, 80, 80); // 在刚刚裁剪的园上画图
    context.restore()
    context.draw()

    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function() {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          that.setData({
            imagePath: tempFilePath,
          });
          wx.hideLoading();
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }, 200);
  },


  baocun: function () {
    that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              /* 该隐藏的隐藏 */
              that.setData({
                maskHidden: false
              })
            }
          }, fail: function (res) {
            console.log('保存失败')
          }
        })
      }
    })
  },

  hideview(){
    that = this;
    that.setData({
      maskHidden: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    var nickName = wx.getStorageSync('nickName')
    var avatarUrl = wx.getStorageSync('avatarUrl')
    wx.getImageInfo({
      src: avatarUrl,
      success: function (res) {
        that.setData({
          nickName: nickName,
          imgurl: res.path
        })
      }
    })


    that.setData({
      dakariqi: new Date().getFullYear()+'.'+(new Date().getMonth()+1)+'.'+new Date().getDate()
    })

    var jsonData = {
      body: {
        curPage: that.data.pageNum,
        pageSize: that.data.pageSize,
      }
    }
    var openid = wx.getStorageSync('openid')
    wx.request({
      url: Monohttps + '/mono-biz-app/educationMiniProgram/getCardInfoMonth',
      method: 'post',
      data: {
        body: {
          openid: openid
        }
      },
      success: function(res) {
        let dayStyle = [];
        var daysstr = res.data.body.createtime
        var daysarr = daysstr.split(',')
        for (var i = 0; i < daysarr.length; i++) {
          dayStyle.push({
            month: 'current',
            day: Number(daysarr[i]),
            color: 'white',
            background: '#DC5828'
          })
        }
        that.setData({
          dayStyle: dayStyle,
          continueday: res.data.body.continueday
        })
      },
    })
    that.getcurData(jsonData)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    wx.switchTab({
      url: '../mine/mine'
    });
  },

  onReachBottom: function() {
    //上拉分页,将页码加1，然后调用分页函数loadRoom()
    that = this;
    if (that.data.hasMoreData) {
      var pageNum = that.data.pageNum;
      that.setData({
        pageNum: ++pageNum
      });
      var jsonData;
      var fenyedata = wx.getStorageSync('fenyeshijian')
      if (fenyedata != undefined) {
        jsonData = {
          body: {
            creatday: fenyedata,
            curPage: that.data.pageNum,
            pageSize: that.data.pageSize
          }
        }
      } else {
        jsonData = {
          body: {
            curPage: that.data.pageNum,
            pageSize: that.data.pageSize
          }
        }
      }

      setTimeout(function() {
        wx.showLoading({
          title: '加载中...',
        })
        that.getcurData(jsonData);
      }, 1000)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})