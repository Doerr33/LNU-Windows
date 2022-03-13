const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    input:'',
    webview:false,
  },
  sendToYUN(e){
    if(this.data.input == ''){
      wx.showToast({
        title: '链接不能为空',
      })

      return;
    }
    db.collection('music').add({
      data:{
        src:this.data.input
      }
    }).then(res=>{
      console.log("上传成功",res);
    }).catch(err=>{
      console.log(err);
    })
  },  
  bindinput(e){
    console.log(e);
    this.setData({
      input:e.detail.value
    })
  },
  addMusic(e){
    // if(this.data.webview == false){
    //   this.setData({
    //     webview:true
    //   })
    // }else{
    //   this.setData({
    //     webview:false
    //   })
    // }
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        console.log(res.tempFiles[0].path);
        wx.cloud.uploadFile({
          cloudPath: 'MUSIC/' + new Date().getTime() + "_" + Math.floor(Math.random() * 1000) + ".mp3",
          filePath: res.tempFiles[0].path, // 文件路径
          success: res => {
            // get resource ID
            console.log(res.fileID)
          },
          fail: err => {
            // handle error
          }
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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