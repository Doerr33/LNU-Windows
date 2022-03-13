// pages/mypublishLove/mypublishLove.js
const app = getApp();
var that;
var db = wx.cloud.database()
var _ = db.command
let totalLove = -1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    loveList:[],
    hidden: true,
    showOperationPannelIndex: -1,
    currentCircleIndex: -1,
    showCommentAdd: false,
    commentContent: '',
    heightBottom: '',
    // 回复谁
    reply: '',
    touchStartOperation: false,
    touchStartOperationPannel: false,
    moveHeight: '500',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      userInfo: getApp().globalData.userInfo,
    })
    // 获取表白总条数
    this.getTotalLove()

    // 获取表白数据
    this.getDataLove()
  },
  delLove(e){
    console.log("删除表白",e);
    var index = e.currentTarget.dataset.index;
    var id = that.data.loveList[index]._id;
    console.log("删除新闻",e);
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (res) {
       if (res.confirm) {
        console.log('点击确定了');
        db.collection('loveList').doc(id).remove({
          success(res) {
            console.log("删除成功", res);
          },
          fail(res) {
            console.log("删除失败", res);
          }
         })
       } else if (res.cancel) {
         console.log('点击取消了');
         return false;    
        }
       that.setData({
          loveList:that.data.loveList
       });
      }
     })
  },  
  showOperationPannel(e) {
    console.log("showOperationPannel", e)
    var index = e.currentTarget.dataset.index;
    if (that.data.showOperationPannelIndex == index) {
      that.setData({
        showOperationPannelIndex: -1
      })
    } else {
      that.setData({
        showOperationPannelIndex: index
      })
    }

  },

  clickLove(e) {
    console.log("点赞函数", e);
    var index = e.currentTarget.dataset.index;
    var circleData = that.data.loveList[index];
    var loveList = circleData.loveList;

    var isHaveLove = false;
    for (var i = 0; i < loveList.length; i++) {
      if (that.data.userInfo._openid == loveList[i]._openid) {
        isHaveLove = true;
        loveList.splice(i, 1);
        // 如果已经点过赞，取消点赞
        wx.cloud.callFunction({
          name: 'clickLoveLNU',
          data: {
            type: 0,
            circleId: circleData._id
          }
        }).then(res => {
          console.log("取消赞成功", res);
        }).catch(err => {
          console.error("取消赞失败", err);
        })
        // 取消赞
        circleData.isLove = false;
        break;
      }
    }

    if (!isHaveLove) {
      // 本地点赞
      loveList.push({
        nickName: that.data.userInfo.nickName,
        _openid: that.data.userInfo._openid
      });
      wx.cloud.callFunction({
        name: 'clickLoveLNU',
        data: {
          type: 1,
          circleId: circleData._id,
          nickName: that.data.userInfo.nickName
        }
      }).then(res => {
        console.log("点赞成功", res);
      }).catch(err => {
        console.error("点赞失败", err);
      })
      // 点赞
      circleData.isLove = true;
    }

    that.setData({
      loveList: that.data.loveList,
      showOperationPannelIndex: -1
    })


  },

  clickComment(e) {
    console.log(e);
    that.setData({
      currentCircleIndex: e.currentTarget.dataset.index,
      showCommentAdd: true,
      showOperationPannelIndex: -1,
    })
  },

  bindInput(e) {
    that.setData({
      commentContent: e.detail.value
    })
  },
  bindFocus(e) {
    console.log("获取焦点", e);
    that.setData({
      heightBottom: e.detail.height
    })
  },
  clickSend(e) {
    var circleData = that.data.loveList[that.data.currentCircleIndex];
    var commentList = circleData.commentList;

    var commentData = {};
    commentData.nickName = that.data.userInfo.nickName;
    commentData.content = that.data.commentContent;
    commentData._openid = that.data.userInfo._openid;

    //回复
    commentData.reply = that.data.reply;
    if (that.data.reply.length > 0) {
      commentData.nickName = that.data.userInfo.nickName;
    }

    commentList.push(commentData);

    that.setData({
      loveList: that.data.loveList,
      showCommentAdd: false,
      commentContent: '',
      // 发布成功重置被评论人
      reply: ''
    })

    db.collection('loveList').doc(circleData._id).update({
        data: {
          commentList: _.push(commentData)
        }
      })
      .then(res => {
        console.log('comment add success:', res)
      })
      .catch(err => {
        console.log('comment add fail:', err)
      })

  },
  // 回复评论业务
  clickCommentItem(e) {
    // 点击评论列表条目

    // 1.获取评论所属的朋友圈信息index
    var circleIndex = e.currentTarget.dataset.index;
    // 2.获取评论在评论列表中的索引
    var commentIndex = e.currentTarget.dataset.commentindex;
    // 当前朋友圈信息
    var circleData = that.data.loveList[circleIndex];
    // 当前评论列表
    var commentList = circleData.commentList;
    // 当前评论信息
    var commentData = commentList[commentIndex];
    // 当前被评论的昵称
    var nickName = commentData.nickName;

    that.setData({
      currentCircleIndex: e.currentTarget.dataset.index,
      showCommentAdd: true,
      showOperationPannelIndex: -1,
      reply: nickName
    })
  },
  bindTouchStart(e) {
    // 当触摸朋友圈列表视图时，隐藏评论输入框
    that.setData({
      showCommentAdd: false,
      heightBottom:0
    })

    if (that.data.touchStartOperation || that.data.touchStartOperationPannel) {

    } else {
      that.setData({
        showOperationPannelIndex: -1,
        heightBottom:0,
        showCommentAdd: false,
      })
    }
  },
  bindTouchStartOperation(e) {
    // 触摸操作按钮开始
    that.setData({
      touchStartOperation: true
      
    })
  },
  bindTouchStartOperationPannel(e) {
    // 触摸点赞和评论操作面板开始
    that.setData({
      touchStartOperationPannel: true
    })
  },
  bindTouchEndOperation(e) {
    // 触摸操作按钮结束
    that.setData({
      touchStartOperation: false
    })
  },
  // 点击页面关闭面板
  bindTouchEndOperationPannel(e) {
    // 触摸点赞和评论操作面板结束
    that.setData({
      touchStartOperationPannel: false
    })
  },
  viewImagesPhone(e) {
    console.log("预览图片",e);
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src]
    })
  },
  viewImages(e) {
    // console.log("朋友圈条目",index);
    var current = e.target.dataset.src;
    var index = e.target.dataset.index
    console.log(e);
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.loveList[index].images // 需要预览的图片http链接列表  
    })
  },
  viewImagesQH(e){
    console.log("预览图片",e);
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src]
    })
  },
  // 计算表白总条数
  getTotalLove() {
    // 计算新闻总条数，加载页面时
    wx.cloud.database().collection('loveList').count()
      .then(res => {
        // console.log("数据总条数", res)
        totalLove = res.total
      })
  },
  // 获取表白数据
  getDataLove() {
    // 计算新闻长度len==totalNews时到底了
    let len = this.data.loveList.length
    if (totalLove == len) {
      wx.showToast({
        title: '到底啦~',
      })
      // 直接退出不再执行下面代码
      return
    }
    // console.log("新闻list长度", len);

    // 按时间降序获取数据库数据
    wx.cloud.database().collection("loveList").orderBy('time', 'desc')
      .where({
        _openid : that.data.userInfo._openid
      })
      // 每次20条，0，20，40，60
      .skip(len)
      .get()
      .then(res => {
        console.log("获取成功", res);
        // 拼接新闻，0+20，20+20，40+20
        this.setData({
          loveList: this.data.loveList.concat(res.data)
        })
      })
      .catch(res => {
        console.log("获取失败", res);
      })
  },
  // 表白下拉刷新
  getPullLove() {
    // 下拉刷新
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.cloud.database().collection("loveList").orderBy('time', 'desc')
      .where({
        _openid : that.data.userInfo._openid
      })
      .get()
      .then(res => {
        console.log("获取成功", res);
        this.setData({
          loveList: res.data
        })
      })
      .catch(res => {
        console.log("获取失败", res);
      })
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);
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
    this.getPullLove()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getDataLove()

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})