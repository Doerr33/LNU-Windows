// pages/public-gonggao/public-gonggao.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: "1.【公告】官方租房信息由芒果不动产提供,管理人员已和芒果不动产公司达成协议,签约时请先联系小程序管理员",
    animation: null,
    timer: null,
    duration: 0,
    textWidth: 0,
    wrapWidth: 0
  },
  onShow() {
    this.initAnimation(this.data.text)
  },
  onHide() {
    this.destroyTimer()
    this.setData({
      timer: null
    })
  },
  onUnload() {
    this.destroyTimer()
    this.setData({
      timer: null
    })
  },
destroyTimer() {
    if (this.data.timer) {
      clearTimeout(this.data.timer);
    }
  },
  /**
   * 开启公告字幕滚动动画
   * @param  {String} text 公告内容
   * @return {[type]} 
   */
  initAnimation(text) {
    let that = this
    this.data.duration = 15000
    this.data.animation = wx.createAnimation({
      duration: this.data.duration,
      timingFunction: 'linear'   
    })
    let query = wx.createSelectorQuery()
    query.select('.content-box').boundingClientRect()
    query.select('#text').boundingClientRect()
    query.exec((rect) => {
      that.setData({
        wrapWidth: rect[0].width,
        textWidth: rect[1].width
      }, () => {
        this.startAnimation()
      })
    })
  },
  // 定时器动画
  startAnimation() {
    //reset
    // this.data.animation.option.transition.duration = 0
    const resetAnimation = this.data.animation.translateX(this.data.wrapWidth).step({ duration: 0 })
    this.setData({
      animationData: resetAnimation.export()
    })
    // this.data.animation.option.transition.duration = this.data.duration
    const animationData = this.data.animation.translateX(-this.data.textWidth).step({ duration: this.data.duration })
    setTimeout(() => {
      this.setData({
        animationData: animationData.export()
      })
    }, 100)
    const timer = setTimeout(() => {
      this.startAnimation()
    }, this.data.duration)
    this.setData({
      timer
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
})