//Copyright (c) <2018>, <fashion.ai LLC>
//All rights reserved.
//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js')
var config = require('../../config')
const WMCOLOR = 'DimGrey';
const CODECOLOR = 'Aqua';
const PRICECOLOR = 'white';

Page({
  data: {
    codeValue: 'scan',
    oriPrice: '',
    discount: '50',
    tax:   '8',
    currency: '7',
    payValue: '0',
    delivery: '5',
    profit: '30',
    profitRate: "10",
    priceValue: '',
    priceValueRMB: '',
    windowW: 1,
    windowH: 1,
    displayScale: 1,
    lineColors: [{ value: "#fff" }, { value: "#fff" }, { value: "#fff" }, { value: "#fff" }],
    watermark: "土豆妈美国代购",
    comments: "wechat:tudoumameidai",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  scanCode: function () {
    wx.scanCode({
      success: (res) => {
        this.setData({
          codeValue: res.result
        })
      }
    })
  },

  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  oriBindKeyInput: function (e) {
    this.changelinecolor(e);
    this.setData({
      oriPrice: e.detail.value,
    })
    this.setAll()
  },
  discountBindKeyInput: function (e) {
    this.changelinecolor(e);
    this.setData({
      discount: e.detail.value
    })
    this.setAll()
  },

  deliveryBindKeyInput: function (e) {
    this.changelinecolor(e);
    this.setData({
      delivery: e.detail.value
    })
    this.setAll()
  },

  profitBindKeyInput: function (e) {
    this.setData({
      profit: e.detail.value
    })
    this.setAll()
  },

  profitRateBindKeyInput: function (e) {
    this.setData({
      profitRate: e.detail.value
    })
  },

  priceRMBBindKeyInput: function (e)  {
    var fixprice = (parseFloat(e.detail.value)/this.data.currency).toFixed(2);
    var profitNum = fixprice - parseFloat(this.data.delivery) - parseFloat(this.data.payValue);
    if (isNaN(profitNum)) profitNum = 0;
    this.setData({
      priceValueRMB: e.detail.value,
      priceValue: fixprice.toString(),
      profit: profitNum.toFixed(2).toString(),
      profitRate: (profitNum/fixprice*100).toFixed(2).toString(),
    })
  },

  getPrice: function () {
    return this.getPay() + parseFloat(this.data.delivery) 
      + parseFloat(this.data.profit);
  },

  getPay: function () {
    return parseFloat(this.data.oriPrice) * parseFloat(this.data.discount)/100
      * (1 + parseFloat(this.data.tax)/100);
  },

  setAll: function () {
    var pay = this.getPay();
    var val = this.getPrice();
    this.setData({
      payValue: pay.toFixed(2).toString(),
      priceValue: val.toFixed(2).toString(),
      priceValueRMB: (val * this.data.currency).toFixed(0).toString(),
      profitRate: (parseFloat(this.data.profit) / val * 100).toFixed(2).toString(),
    })
  },

  changelinecolor: function(e) {
    let id = e.currentTarget.dataset.id;
    let tmp = this.data.lineColors;
    for (var i = 0, len = tmp.length; i < len; i++) {
      tmp[i] = "#fff";
    }
    tmp[id] = util.HLCOLOR;
    this.setData({
      lineColors: tmp,
    })
  },

  cleanlinecolor: function (e) {
    let id = e.currentTarget.dataset.id;
    let tmp = this.data.lineColors;
    tmp[id] = "#fff";
    this.setData({
      lineColors: tmp,
    })
  },

  opensettings: function() {
    wx.navigateTo({
      url: '../../pages/settings/settings?tax=' + this.data.tax + '&watermark=' + this.data.watermark + '&currency=' + this.data.currency + '&comments=' + this.data.comments,
    })
  },

  onLoad: function () {
    // load perference settings
    try {
      var value = wx.getStorageSync('tax');
      if (value) {
        this.data.tax = value;
      }
      value = wx.getStorageSync('currency');
      if (value) {
        this.data.currency = value;
      }
    } catch (e) {
      // Do something when catch error
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  // 上传图片接口
  doUpload: function () {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)
        that.data.windowW = res.windowWidth;
        that.data.windowH = res.windowHeight;
      }
    })
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        util.showBusy('processing')
        var filePath = res.tempFilePaths[0];
        wx.getImageInfo({
          src: filePath,
          success: function (res) {
            that.setData({
              imgUrl: filePath,
              w: res.width,
              h: res.height,
            })
          }
        })

      },
      fail: function (e) {
        console.error(e)
      }
    })
  },

  saveImage: function () {
    var that = this
    var WIDTH = 640;
    var HEIGHT = 1280;
    var windowW = 0;
    var windowH = 0;
    // save data to clipboard:
    wx.setClipboardData({
      data: this.data.codeValue +
      " " + this.data.priceValue +
      " " + this.data.priceValueRMB +
      " " + this.data.profitRate +
      " " + this.data.oriPrice +
      " " + this.data.discount +
      " " + this.data.delivery +
      " " + this.data.profit +
      " " + this.data.tax +
      " " + this.data.currency ,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }
    })
    //save image
    if(this.data.imgUrl) {
      var scale = 1.0;

      var ctx = wx.createCanvasContext("wmPic");
      scale = Math.max(this.data.h / HEIGHT, this.data.w / WIDTH);
      var actW, actH;
      actW = this.data.w / scale;
      actH = this.data.h / scale;

      this.setData({
        picW: actW,
        picH: actH,
        displayScale: Math.min(windowH * 0.4 / actH, windowW * 0.7 / actW),
      })
      console.log(this.data.w, this.data.h, actW, actH, scale, this.data.displayScale);
      ctx.drawImage(this.data.imgUrl, 0, 0, actW, actH);
      //draw text
      ctx.setFontSize(60/scale);
      ctx.setFillStyle(WMCOLOR);
      ctx.setGlobalAlpha(0.9);
      ctx.fillText(this.data.watermark, actW / 2, actH / 2);
      // special req2: display wechat icon:
      if(this.data.comments.search(/wechat:/i) == 0){
        ctx.drawImage("./wechat.png", actW / 2 - 50, actH / 2);
        ctx.fillText(this.data.comments.substr(7), actW / 2, actH / 2 + 60 / scale);
      }
      ctx.setShadow(2, 2, 5, 'black');
      ctx.setGlobalAlpha(1);
      ctx.setFillStyle(CODECOLOR);
      // special req: don't show scan on pic
      if(this.data.codeValue != "scan"){
        ctx.fillText(this.data.codeValue, 5, 20);
      }
      ctx.setFillStyle(PRICECOLOR);
      ctx.setFontSize(90 / scale);
      if (this.data.priceValueRMB != "") {
        ctx.fillText("￥" + this.data.priceValueRMB, actW / 2 - 60, actH - 20);
      }
      ctx.draw();
    }
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: this.data.picW,
      height: this.data.picH,
      destWidth: this.data.picW,
      destHeight: this.data.picH,
      canvasId: 'wmPic',
      success: function (res) {
        console.log(res.tempFilePath)
        let image = that.data.imgUrl;
        that.setData({
          imgUrl: res.tempFilePath,
        })
        that.data.imgUrl = image;
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            console.log(res);
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (res) {
            console.log(res)
            console.log('fail')
            wx.showToast({
              title: '保存失败',
              icon: 'loading',
              duration: 2000
            })
          }
        })
      }
    })
  },

  // 预览图片
  previewImg: function () {
    wx.previewImage({
      current: this.data.imgUrl,
      urls: [this.data.imgUrl]
    })
  },

  // 切换信道的按钮
  switchChange: function (e) {
    var checked = e.detail.value

    if (checked) {
      this.openTunnel()
    } else {
      this.closeTunnel()
    }
  },
  
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
