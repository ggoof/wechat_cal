//Copyright (c) <2018>, <fashion.ai LLC>
//All rights reserved.
// pages/settings.js
var util = require('../../utils/util.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tax: '7.75',
    currency: '',
    watermark: "yourname",
    comments: "",
    codeChecked: 'true',
    watermarkChecked: 'true',
    priceChecked: 'true',
    lineColors: [{ value: "#fff" }, { value: "#fff" }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      tax : options.tax,
      currency: options.currency,
      watermark : options.watermark,
      comments : options.comments,
    })
  },

  taxBindKeyInput: function (e) {
    this.changelinecolor(e);
    this.setData({
      tax: e.detail.value
    })
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      tax: e.detail.value
    })
  },
  currencyBindKeyInput: function (e) {
    this.changelinecolor(e);
    this.setData({
      currency: e.detail.value
    })
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      currency: e.detail.value
    })
  },
  watermarkBindKeyInput: function (e) {
    this.changelinecolor(e);
    this.setData({
      watermark: e.detail.value
    })
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      watermark: e.detail.value
    })
  },
  commentsBindKeyInput: function (e) {
    this.changelinecolor(e);
    this.setData({
      comments: e.detail.value
    })
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      comments: e.detail.value
    })
  },
  changelinecolor: function (e) {
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    try {
      wx.setStorageSync('tax', this.data.tax );
      wx.setStorageSync('currency', this.data.currency );
      wx.setStorageSync('comments', this.data.comments );
      wx.setStorageSync('codeChecked', this.data.codeChecked );
      wx.setStorageSync('watermarkChecked', this.data.watermarkChecked );
      wx.setStorageSync('priceChecked', this.data.priceChecked );
      wx.setStorageSync('watermark', this.data.watermark );
    } catch (e) {
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})