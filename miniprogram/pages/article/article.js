// pages/article/article.js
var app = getApp();
var that;
var db = wx.cloud.database();
var _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 回复
    reply: '',
    userInfo:null,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    newsList:[],
    showComment:true,
    commentContent:'',
    commnetLength:0,
    textArea:null,
    articleid:null,
    like:null,
    view:0,
  },
  delcomment(e){
    var index = e.currentTarget.dataset.index;
    console.log("长按删除",e);
    for(var i = 0; i < that.data.newsList[0].comment.length; i++ ){
      if(that.data.userInfo.openid == that.data.newsList[0].comment[i].userInfo.openid){
        console.log(that.data.userInfo.openid);
        console.log(that.data.newsList[0].comment[i].openid);
        wx.showModal({
          title: '提示',
          content: '确定要删除此评论吗？',
          success: function (res) {
            if (res.confirm) {
              console.log('点击确定了');
              that.data.newsList[0].comment.splice(index, 1);
              that.setData({
                newsList:that.data.newsList
              })
              db.collection('news').doc(that.data.newsList[0]._id).update({
                data:{
                  comment:that.data.newsList[0].comment
                }
              })
              wx.showToast({
                title: '删除评论成功',
              })
            } else if (res.cancel) {
               console.log('点击取消了');
              //  return false;       
              }
            that.setData({
              // images
            });
          }
        })
      }
    }
    
  },
  textareaAInput(e){
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
          that.setData({
            commnetLength:0
          })
          return
        }
        else{
          that.setData({
            commnetLength:e.detail.value.length,
            commentContent:e.detail.value
          })
        }
      }
    })
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
  clickSend(e) {
    var newListArticle = that.data.newsList[0];
    console.log("数据",newListArticle);
    var commentList = that.data.newsList[0].comment;
    console.log("评论",commentList);
    var commentData = {};
    commentData.userInfo = that.data.userInfo;
    commentData.content = that.data.commentContent;
    commentData.time = that.js_date_time(new Date());

    //回复
    commentData.reply = that.data.reply;
    if(that.data.reply.length>0){
      commentData.nickName = that.data.userInfo.nickName;
    }

    commentList.unshift(commentData);

    that.setData({
      newsList: that.data.newsList,
      showComment: false,
      commentContent: '',
      commnetLength:0,
      // 发布成功重置被评论人
      reply:''
    })

    db.collection('news').doc(newListArticle._id).update({
        data: {
          comment: _.push(commentData)
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
    console.log("点击评论",e);
    // 点击评论列表条目
    // 2.获取评论在评论列表中的索引
    var commentIndex = e.currentTarget.dataset.commentindex;
    console.log("获取评论在评论列表中的索引",commentIndex);
    // 当前朋友圈信息
    var newsReplay = that.data.newsList[0];
    console.log("当前朋友圈信息",newsReplay);
    // 当前评论列表
    var commentList =newsReplay.comment;
    console.log("当前评论列表",commentList);
    // 当前评论信息
    var commentData = commentList[commentIndex];
    console.log("评论哪一条",commentData);
    // 当前被评论的昵称
    var nickName = commentData.userInfo.nickName;
    console.log("评论谁",nickName);
    that.setData({
      showComment:true,
      reply: nickName
    })
    var commentChild = {}
    commentChild.userInfo = that.data.userInfo;
    commentChild.reply = that.data.reply;
    commentChild.content = that.data.commentContent;
    commentChild.time = that.js_date_time(new Date());
    commentData.commentChild.push(commentChild);

    console.log("回复",commentChild);
  },
  isCard(e) {
    this.setData({
      isCard: e.detail.value
    })
  },
  isLike(e){
    if(!getApp().globalData.userInfo){
      wx.navigateTo({
        url: '../login/login',
      })
    }
    else{
      console.log("点赞",e);
      var newListArticle = that.data.newsList;
      var like = newListArticle[0].like;
      console.log("like",like);
      var isLove = false;
      for (var i = 0; i < like.length; i++) {
        if (that.data.userInfo.openid == like[i]._openid) {
          isLove = true;
          like.splice(i, 1);
          // 如果已经点过赞，取消点赞
          wx.cloud.callFunction({
            name: 'clickLike',
            data: {
              type: 0,
              circleId: newListArticle[0]._id
            }
          }).then(res => {
            console.log("取消赞成功", res);
            wx.showToast({
              title: '取消赞成功',
            })
          }).catch(err => {
            console.error("取消赞失败", err);
          })
          // 取消赞
          like.isLove = false;
          break;
        }
      }
  
      if (!isLove) {
        // 本地点赞
        like.push({
          //nickName: that.data.userInfo.nickName,
          _openid: that.data.userInfo.openid
        });
        wx.cloud.callFunction({
          name: 'clickLike',
          data: {
            type: 1,
            circleId: newListArticle[0]._id,
            //nickName: that.data.userInfo.nickName
          }
        }).then(res => {
          console.log("点赞成功", res);
          wx.showToast({
            title: '点赞成功',
          })
        }).catch(err => {
          console.error("点赞失败", err);
        })
        // 点赞
        newListArticle.isLove = true;
      }
  
      that.setData({
        newsList: that.data.newsList,
      })
  
    }

  },
  viewImage(e){
    console.log("预览图片",e);
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src]
    })
  },
  isComment(e){
    console.log("评论",e);
    if(that.data.showComment == false){
      that.setData({
        showComment:true,
      })
    }
    else{
      that.setData({
        showComment:false
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户信息，登录界面存储到本地
    that = this;
    that.setData({
      userInfo: getApp().globalData.userInfo,
    })
    console.log(options);
    wx.cloud.database().collection('news')
    .where({
      _id:options.id
    })
    .get({
      complete: res=>{
        console.log(res);
        this.setData({
          newsList:res.data,
          articleid:res.data[0]._id
        })
        that.data.view = res.data[0].browse;
        console.log(res.data[0].browse);
        that.data.view ++ ;
        console.log(that.data.view);
      }
    })
    setTimeout(res=>{
      db.collection('news').doc(that.data.articleid).update({
        data:{
          browse:that.data.view,
        }
      })
    },500)
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
    wx.cloud.database().collection('news')
    .where({
      _id:that.data.articleid
    })
    .get({
      complete: res=>{
        console.log(res);
        this.setData({
          newsList:res.data,
        })
      }
    })
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