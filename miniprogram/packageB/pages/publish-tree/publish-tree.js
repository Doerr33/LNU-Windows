// pages/publish-tree/publish-tree.js
var that;
const db = wx.cloud.database().collection("mineTree")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    time:null,
    context:null,
  },

  textareaAInput(e){
    setTimeout(() => {
      wx.cloud.callFunction({
        name: 'checkImg',
        data: {
          msg: e.detail.value,
        },
        success(res) {
          console.log(res.result)
          if (res.result.errCode == 87014) {
            wx.showToast({
              icon:'none',
              title: e.detail.value + "违规",
            })
            return
          }
          else{
            that.setData({
              context:e.detail.value
            })
          }
        }
      })
    }, 50)
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    // 获取用户信息，登录界面存储到本地
    that.setData({
      userInfo: getApp().globalData.userInfo,
    })
  },
  publishNews() {
    var time = this.js_date_time(new Date())
    console.log("当前时间",time);
    // 表单验证也可以这么做
    // 如果文字填写内容为空 并且 没有添加图片 给用户提示
    if(that.data.context == null){
      wx.showToast({
        icon:'none',
        title: '内容不能为空',
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
       content:that.data.context,
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