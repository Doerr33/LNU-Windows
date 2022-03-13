// pages/hawthorn/hawthorn.js
var that;
const app = getApp();
const db = wx.cloud.database().collection("hawthorn")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:null,
    changeK:true,
    changeW:true,
    searchName:'',
    name:'',
    content:'',
    time:'',
    // 设置是否显示按钮
    changeButton:false,
    // 切换文字
    changeButtonText:true,
  },
  // 方法
  changeViewK(e){
    that.setData({
      changeW:true,
      changeK:false,
      changeButton:true,
    })
    console.log(e);
  },
  // 方法
  changeViewW(e){
    that.setData({
      changeK:true,
      changeW:false,
      changeButton:true,
    })
    console.log(e);
  },
  changeButtonLY(e){
    // 查看留言
    if(that.data.changeButtonText == false){
      that.setData({
        // 创建留言false时显示
        changeW:true,
        changeK:false,
        // 清空列表
        list:null,
        // 切换字样，默认是false，显示创建留言
        changeButtonText:true
      })
    }
    // 创建留言
    else{
      that.setData({
        changeK:true,
        changeW:false,
        // 清空列表
        list:null,
        changeButtonText:false
      })
    }
  },
  // 获取列表
  getList(e){
    if(that.data.searchName == ''){
      wx.showToast({
        icon:'none',
        title: '请输入名字或者暗号',
      })
      return ;
    }
    wx.showLoading({
      title: '获取中',
    })
    console.log(e.detail.value);
    wx.cloud.callFunction({
      name:"getOpenid",
      data:{
        name:that.data.searchName
      },
      success:res=>{
        that.setData({
          list:res.result.data
        })
        wx.hideLoading()
        wx.showToast({
          title: '获取成功',
        })
        console.log("云函数返回列表",res);
      }
    })
  },
  getSearchName(e){
    console.log(e);
    that.setData({
      searchName:e.detail.value
    })
  },
  // 获取输入内容
  getName(e){
    console.log(e.detail.value);
    that.setData({
      name:e.detail.value
    })
  },

  getContent(e){
    console.log(e.detail.value);
    that.setData({
      content:e.detail.value
    })
  },

  publish(e){
    if(that.data.name == ''){
      wx.showToast({
        icon:'none',
        title: '请填写名字或者暗号',
      })
      return;
    }
    if(that.data.content == ''){
      wx.showToast({
        icon:'none',
        title: '请输入留言',
      })
      return ;
    }
    wx.showLoading({
      title: '发表中',
    })
    var time = that.js_date_time(new Date());
    db.add({
      data: {
        name:that.data.name,
        content:that.data.content,
        time:time
      },
      success(res) {
        
        console.log("添加成功", res);
        wx.hideLoading()
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面 
        })
        wx.showToast({
          title: '发表成功',
        })
      },
      fail(res) {
        console.log("添加失败", res);
      }
    })
  },
  // 时间处理函数
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
  onShareAppMessage: function () {
    return {
      path: 'pages/hawthorn/hawthorn',//用户点开后的默认页面，我默认为首页
      imageUrl:"/images/logo-shanzhadao-v01.jpg",//自定义图片的地址
      title:'辽大版山楂岛'
    }
  },
  onShareTimeline:function(res){
    return{
      path: 'pages/hawthorn/hawthorn',//用户点开后的默认页面，我默认为首页
      imageUrl:"/images/logo-shanzhadao-v01.jpg",//自定义图片的地址
      title: '辽大版山楂岛',
      query: '辽大版山楂岛'
    }
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