// pages/mine/mine.js
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    starCount: 0,
    forksCount: 0,
    visitTotal: 0,
  },
  attached() {
    console.log("success")
    let that = this;
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    })
    let i = 0;
    numDH();
    function numDH() {
      if (i < 20) {
        setTimeout(function () {
          that.setData({
            starCount: i,
            forksCount: i,
            visitTotal: i
          })
          i++
          numDH();
        }, 20)
      } else {
        that.setData({
          starCount: that.coutNum(3000),
          forksCount: that.coutNum(484),
          visitTotal: that.coutNum(24000)
        })
      }
    }
    wx.hideLoading()
  },
  coutNum(e) {
    if (e > 1000 && e < 10000) {
      e = (e / 1000).toFixed(1) + 'k'
    }
    if (e > 10000) {
      e = (e / 10000).toFixed(1) + 'W'
    }
    return e
  },
  CopyLink(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.link,
      success: res => {
        wx.showToast({
          title: '已复制',
          duration: 1000,
        })
      }
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  showQrcode0() {
    wx.navigateTo({
      url: '/packageA/pages/mypublish/mypublish',
    })
  },
  showQrcode() {
    wx.navigateTo({
      url: '/packageA/pages/mine-camera/mine-camera',
    })
  },
  showQrcode1() {
    wx.navigateTo({
      url: '/packageA/pages/mine-tree/mine-tree',
    })
  },
  showQrcode2() {
    wx.navigateTo({
      url: '/packageA/pages/mine-store/mine-store',
    })
  },
  showQrcode5() {
    wx.navigateTo({
      url: '/packageB/pages/Findex-list/Findex-list',
    })
  },
  showQrcode3() {
    wx.previewImage({
      urls: ['https://s3.ax1x.com/2021/03/03/6EUoz6.jpg'],
      current: 'https://s3.ax1x.com/2021/03/03/6EUoz6.jpg' // 当前显示图片的http链接      
    })
  },
  showQrcodeBB() {
    wx.navigateTo({
      url: '/pages/hawthorn/hawthorn',
    })
  },
  showQrcode4() {
    wx.previewImage({
      urls: ['https://s3.ax1x.com/2021/03/03/6Ea3TJ.jpg'],
      current: 'https://s3.ax1x.com/2021/03/03/6Ea3TJ.jpg' // 当前显示图片的http链接      
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      userInfo: getApp().globalData.userInfo,
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