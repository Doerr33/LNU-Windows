// pages/mine-tree/mine-tree.js
var that;
var db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TreeList:[],
  },
  addLocation(e){
    wx.navigateTo({
      url: '/packageB/pages/publish-tree/publish-tree',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    // 随机提取1条数据
    db.collection('mineTree').aggregate().sample({size: 1})
    .end()
    .then(res => { 
      console.log(res);
      that.setData({
        TreeList:res.list
      })
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

  onShareAppMessage: function () {
    return {
      path: 'packageA/pages/mine-tree/mine-tree',//用户点开后的默认页面，我默认为首页
      imageUrl:"/images/Tree.jpg",//自定义图片的地址
      title:'每日树洞'
    }
  },
  onShareTimeline:function(res){
    return{
      path: 'packageA/pages/mine-tree/mine-tree',//用户点开后的默认页面，我默认为首页
      imageUrl:"/images/Tree.jpg",//自定义图片的地址
      title: '每日树洞',
      query: '每日树洞'
    }
  },
})