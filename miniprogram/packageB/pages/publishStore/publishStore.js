// pages/publishStore/publishStore.js
var that;
const db = wx.cloud.database().collection("miniStore")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time:null,
    APPID:null,
    textareaAValue:'',
    textareaBValue:'',
    userInfo:null,
  },
  js_date_time(unixtime) {
    var date = new Date(unixtime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second; //年月日时分秒
  },
  viewImages(e){
    wx.previewImage({
      urls: ['cloud://lingisme9-8gfov2qdc4af131a.6c69-lingisme9-8gfov2qdc4af131a-1302591379/辽宁大学/publish-total/教程.jpg'],
      current: 'cloud://lingisme9-8gfov2qdc4af131a.6c69-lingisme9-8gfov2qdc4af131a-1302591379/辽宁大学/publish-total/教程.jpg' // 当前显示图片的http链接      
    })
  },
  viewImages2(e){
    wx.previewImage({
      urls: ['cloud://lingisme9-8gfov2qdc4af131a.6c69-lingisme9-8gfov2qdc4af131a-1302591379/辽宁大学/publish-total/教程2.jpg'],
      current: 'cloud://lingisme9-8gfov2qdc4af131a.6c69-lingisme9-8gfov2qdc4af131a-1302591379/辽宁大学/publish-total/教程2.jpg' // 当前显示图片的http链接      
    })
  },
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
    console.log(e.detail.value);
  },
  // 求租内容
  textareaBInput(e) {
    this.setData({
      textareaBValue: e.detail.value
    })
    console.log(e.detail.value);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  CopyWeChatX(e){
    console.log("点击复制微信",e);
    var index = e.currentTarget.dataset.index;
    wx.setClipboardData({
      data:"https://mp.weixin.qq.com/",
      success (res) {
        wx.getClipboardData({
          success (res) {
            console.log(res.data) // data
            wx.showToast({
              title: '复制成功',
            })
          }
        })
      }
    })
  },
  onLoad: function (options) {
    that = this;
    that.setData({
      userInfo: getApp().globalData.userInfo,
    })
  },
  publishNews() {
    var time = this.js_date_time(new Date())
    console.log("当前时间",time);
    // 表单验证也可以这么做
    // 如果文字填写内容为空 并且 没有添加图片 给用户提示
    if(that.data.textareaAValue == ''){
      wx.showToast({
        icon:'none',
        title: '请输入店名',
      })
      // 直接返回,不进行操作
      return ;
    }
    if(that.data.textareaBValue == ''){
      wx.showToast({
        icon:'none',
        title: '请输入APPID',
      })
      // 直接返回,不进行操作
      return ;
    }
    wx.showLoading({
      title: '发布中',
    })
    db.add({
      data:{
       userInfo:that.data.userInfo,
       store:that.data.textareaAValue,
       APPID:that.data.textareaBValue,
       time:time,
      },
      success:function(res){
        console.log("news publish success:",res);
        wx.hideLoading()
        wx.showToast({
          title: '发表成功',
        })
        wx.navigateBack({
          delta: 1,
        })
      }
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