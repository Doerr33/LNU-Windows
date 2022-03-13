const app = getApp();
var that;
var db = wx.cloud.database()
var _ = db.command
let totalNews = -1;
let totalLove = -1
let totalStore = -1
let totalTeacher = -1
let totalTeacherX = -1
let totalHouseX = -1
let totalHouse = -1
let totalCar = -1
let totalTiaoZao = -1
Page({
  data: {
    openid: null,
    // -------------公告---------------------
    text: "1.【公告】官方租房信息由芒果不动产提供,管理人员已和入驻机构达成协议,优惠辽大学生,签约时请先联系小程序管理员核查后再签约",
    animation: null,
    timer: null,
    duration: 0,
    textWidth: 0,
    wrapWidth: 0,
    // -------------当家教--------------------
    YuWen: [],
    Math: [],
    English: [],
    WuLI: [],
    HuaXue: [],
    ShengWu: [],
    ZhengZhi: [],
    DiLi: [],
    LiShi: [],
    PeiDu: [],
    AoShu: [],
    ZhuanShengBen: [],
    BianCheng: [],
    // ------------------------------
    pYuWen: [],
    pMath: [],
    pEnglish: [],
    pWuLI: [],
    pHuaXue: [],
    pShengWu: [],
    pZhengZhi: [],
    pDiLi: [],
    pLiShi: [],
    pPeiDu: [],
    pAoShu: [],
    pZhuanShengBen: [],
    pBianCheng: [],
    // ------------外卖通讯录切换--------------
    SanShiTang: [],
    SiShiTang: [],
    T1: [],
    T2: [],
    T3: [],
    CongShanQingZhen: [],
    YouYuan: [],
    PT1: [],
    PT2: [],
    PT3: [],
    PuHeQingZhen: [],
    // 外卖切换校区
    changeSchool: false,
    // 当家教切换校区
    changeSchoolT: false,
    userInfo: null,
    // ------------------回到顶部--------------------



    // --------------------Tab----------------------
    // tab索引
    TabCur: '0',
    // 食堂崇山tabcur
    TabCurShangtang: '0',
    // 蒲河食堂cur
    TabCurPuHeShangtang: '0',
    // 教师Tab
    TabTeacher: '0',
    //导航栏位置， 向左滚动的距离，自动适应
    scrollLeft: 0,
    //导航栏内容数组
    tabContent: ["校园新闻", "表白墙", "校内外卖", "周边", "出租", "考研", "求助", "驾校", "跳蚤市场"],
    // 外卖通讯录崇山
    tabChongshan: ["三食堂", "四食堂", "桃李一楼", "桃李二楼", "桃李三楼", "清真", "友园"],
    // 外卖通讯录蒲河
    tabPuHe: ["一楼", "二楼", "三楼", "清真"],
    // 家教tab内容
    tabTeacher: ["炸鸡汉堡", "饮品甜点", "零食超市", "粉面水饺", "香锅麻辣", "大型聚餐", "生鲜果蔬", "校内跑腿", "水果捞", "今日特价", "校园美妆", "校园摄影", "其他"],
    // 接收新闻页数据
    newsList: [],
    // 接收表白页数据
    loveList: [],
    // 接收外卖页数据
    storeList: [],
    // 接收老师数据
    teacherList: [],
    // 接收家教需求
    teacherXList: [],
    // 接收租房请求
    houseX: [],
    // 接收房源数据
    house: [],
    // 驾校数据
    carList: [],
    // 跳蚤市场
    TiaoZaoList: [],

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
  navToMiNi(e){
    console.log(e);
    var index = e.currentTarget.dataset.index;
    var APPID = that.data.storeList[index].APPID;
    wx.navigateToMiniProgram({
      appId: APPID,
    })
  },
  navToMiNi2(e){
    console.log(e);
    var index = e.currentTarget.dataset.index;
    var APPID = that.data.teacherList[index].APPID;
    wx.navigateToMiniProgram({
      appId: APPID,
    })
  },

  navToMiNi3(e){
    console.log(e);
    var index = e.currentTarget.dataset.index;
    var APPID = that.data.teacherList[index].APPID;
    wx.navigateToMiniProgram({
      appId: "wxa7935e9a68ccd557",
    })
  },



  // ----------------聊天--------------------------
  toSiLiao(e){
    console.log("私聊",e);
    var index = e.currentTarget.dataset.index;
    console.log(index);
    console.log(that.data.loveList[index].userInfo);
    wx.navigateTo({
      url: '../user/userInfo?id=' + index + '&avatarUrl=' + that.data.loveList[index].userInfo.avatarUrl + '&nickName=' + that.data.loveList[index].userInfo.nickName + '&openid=' + that.data.loveList[index].userInfo._openid
      //携带参数跳转
    })
  },
  toSiLiao1(e){
    console.log("私聊",e);
    var index = e.currentTarget.dataset.index;
    console.log(index);
    console.log(that.data.teacherList[index].userInfo);
    wx.navigateTo({
      url: '../user/userInfo?id=' + index + '&avatarUrl=' + that.data.teacherList[index].userInfo.avatarUrl + '&nickName=' + that.data.teacherList[index].userInfo.nickName + '&openid=' + that.data.teacherList[index].userInfo.openid
      //携带参数跳转
    })
  },
  toSiLiao2(e){
    console.log("私聊",e);
    var index = e.currentTarget.dataset.index;
    console.log(index);
    console.log(that.data.teacherXList[index].userInfo);
    wx.navigateTo({
      url: '../user/userInfo?id=' + index + '&avatarUrl=' + that.data.teacherXList[index].userInfo.avatarUrl + '&nickName=' + that.data.teacherXList[index].userInfo.nickName + '&openid=' + that.data.teacherXList[index].userInfo.openid
      //携带参数跳转
    })
  },
  toSiLiao3(e){
    console.log("私聊",e);
    var index = e.currentTarget.dataset.index;
    console.log(index);
    console.log(that.data.house[index].userInfo);
    wx.navigateTo({
      url: '../user/userInfo?id=' + index + '&avatarUrl=' + that.data.house[index].userInfo.avatarUrl + '&nickName=' + that.data.house[index].userInfo.nickName + '&openid=' + that.data.house[index].userInfo.openid
      //携带参数跳转
    })
  },
  toSiLiao4(e){
    console.log("私聊",e);
    var index = e.currentTarget.dataset.index;
    console.log(index);
    console.log(that.data.houseX[index].userInfo);
    wx.navigateTo({
      url: '../user/userInfo?id=' + index + '&avatarUrl=' + that.data.houseX[index].userInfo.avatarUrl + '&nickName=' + that.data.houseX[index].userInfo.nickName + '&openid=' + that.data.houseX[index].userInfo.openid
      //携带参数跳转
    })
  },
  toSiLiao5(e){
    console.log("私聊",e);
    var index = e.currentTarget.dataset.index;
    console.log(index);
    console.log(that.data.carList[index].userInfo);
    wx.navigateTo({
      url: '../user/userInfo?id=' + index + '&avatarUrl=' + that.data.carList[index].userInfo.avatarUrl + '&nickName=' + that.data.carList[index].userInfo.nickName + '&openid=' + that.data.carList[index].userInfo.openid
      //携带参数跳转
    })
  },
  toSiLiao6(e){
    console.log("私聊",e);
    var index = e.currentTarget.dataset.index;
    console.log(index);
    console.log(that.data.TiaoZaoList[index].userInfo);
    wx.navigateTo({
      url: '../user/userInfo?id=' + index + '&avatarUrl=' + that.data.TiaoZaoList[index].userInfo.avatarUrl + '&nickName=' + that.data.TiaoZaoList[index].userInfo.nickName + '&openid=' + that.data.TiaoZaoList[index].userInfo.openid
      //携带参数跳转
    })
  },
  
  siChatRoom(e) {
    that = this;
    that.setData({
      userInfo: getApp().globalData.userInfo,
    })
    if(!that.data.userInfo){
      wx.navigateTo({
        url: '../login/login',
      })
    }
    else{
      console.log(e);
    var index = e.currentTarget.dataset.index;
    var currentId = getApp().globalData.userInfo._openid;
    var friendId = that.data.loveList[index]._openid;
    if (that.data.loveList[index].userInfo.openid == that.data.userInfo.openid) {
      return;
    }
    // 查询聊天群组是否存在，如果存在直接进去
    db.collection('chat_group')
      .where({
        type: 1,
        chat_members: _.all([currentId, friendId])
      })
      .get()
      .then(res => {
        console.log('query success', res)
        // 不存在
        if (res.data.length == 0) {
          // 去创建聊天群组
          db.collection('chat_group')
            .add({
              data: {
                type: 1,
                chat_members: [currentId, friendId],
                time: new Date()
              }
            })
            .then(res => {
              console.log('add success', res)
              // wx.navigateTo({
              //   url: '../im/room/room?nickName=' + that.data.loveList.userInfo.nickName + "&groupId=" + res._id ,
              // })
              wx.navigateTo({
                url: '../im/room/room?nickName=' + that.data.loveList[index].userInfo.nickName +
                  "&groupId=" + res._id + "&userId" + friendId,
              })
            })
            .catch(err => {

            })
        } else {
          // 存在
          // wx.navigateTo({
          //   url: '../im/room/room?nickName=' + that.data.loveList.userInfo.nickName + "&groupId" + res.data[0]._id,
          // })
          wx.navigateTo({
            url: '../im/room/room?nickName=' + that.data.loveList[index].userInfo.nickName +
              "&groupId=" + res.data[0]._id + "&userId" + friendId,
          })
        }
      })
      .catch(err => {

      })
    }
  },
  // ------------------公告方法-----------------------
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
    query.select('.content-box1').boundingClientRect()
    query.select('#text1').boundingClientRect()
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
    const resetAnimation = this.data.animation.translateX(this.data.wrapWidth).step({
      duration: 0
    })
    this.setData({
      animationData: resetAnimation.export()
    })
    // this.data.animation.option.transition.duration = this.data.duration
    const animationData = this.data.animation.translateX(-this.data.textWidth).step({
      duration: this.data.duration
    })
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





  // -----------------回到顶部------------------------
  // --------------------点击复制----------------------
  CopyWeChat(e) {
    console.log("点击复制微信", e);
    var index = e.currentTarget.dataset.index;
    wx.setClipboardData({
      data: that.data.storeList[index].wxChat,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
            wx.showToast({
              title: '复制成功',
            })
          }
        })
      }
    })
  },
  CopyPhone(e) {

    console.log("点击复制电话", e);
    var index = e.currentTarget.dataset.index;
    wx.makePhoneCall({
      phoneNumber: that.data.storeList[index].phone,

    })
    // wx.setClipboardData({
    //   data: that.data.storeList[index].phone,
    //   success (res) {
    //     wx.getClipboardData({
    //       success (res) {
    //         console.log(res.data) // data
    //         wx.showToast({
    //           title: '复制成功',
    //         })
    //       }
    //     })
    //   }
    // })
  },
  // -------------家教点击复制------------------------
  CopyWeChatT(e) {
    console.log("点击复制微信", e);
    var index = e.currentTarget.dataset.index;
    wx.setClipboardData({
      data: that.data.teacherList[index].weChat,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
            wx.showToast({
              title: '复制成功',
            })
          }
        })
      }
    })
  },
  CopyPhoneT(e) {
    console.log("点击复制电话", e);
    var index = e.currentTarget.dataset.index;
    wx.makePhoneCall({
      phoneNumber: that.data.teacherList[index].phone,
    })
  },
  // -------------找家教复制--------------------------
  CopyWeChatX(e) {
    console.log("点击复制微信", e);
    var index = e.currentTarget.dataset.index;
    wx.setClipboardData({
      data: that.data.teacherXList[index].WeChat,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
            wx.showToast({
              title: '复制成功',
            })
          }
        })
      }
    })
  },
  CopyPhoneX(e) {
    console.log("点击复制电话", e);
    var index = e.currentTarget.dataset.index;
    wx.makePhoneCall({
      phoneNumber: that.data.teacherXList[index].phone,
    })
  },
  CopyPhoneH(e) {
    console.log("点击复制电话", e);
    var index = e.currentTarget.dataset.index;
    wx.makePhoneCall({
      phoneNumber: that.data.house[index].phone,
    })
  },
  // ----------------求租复制------------
  CopyWeChatHX(e) {
    console.log("点击复制微信", e);
    var index = e.currentTarget.dataset.index;
    wx.setClipboardData({
      data: that.data.houseX[index].weChat,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
            wx.showToast({
              title: '复制成功',
            })
          }
        })
      }
    })
  },
  CopyPhoneHX(e) {
    console.log("点击复制电话", e);
    var index = e.currentTarget.dataset.index;
    wx.makePhoneCall({
      phoneNumber: that.data.houseX[index].phone,
    })
  },
  CopyPhoneCar(e) {
    console.log("点击复制电话", e);
    var index = e.currentTarget.dataset.index;
    wx.makePhoneCall({
      phoneNumber: that.data.carList[index].phone,
    })
  },
  // ---------------------表白墙-----------------------
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
    if (!getApp().globalData.userInfo) {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      console.log("点赞函数", e);
      var index = e.currentTarget.dataset.index;
      var circleData = that.data.loveList[index];
      console.log("朋友圈数据",circleData);
      var loveList = circleData.loveList;

      var isHaveLove = false;
      for (var i = 0; i < loveList.length; i++) {
        if (that.data.userInfo.openid == loveList[i]._openid) {
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
          _openid: that.data.userInfo.openid
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

    }

  },

  clickComment(e) {
    if (!getApp().globalData.userInfo) {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      console.log(e);
      that.setData({
        currentCircleIndex: e.currentTarget.dataset.index,
        showCommentAdd: true,
        showOperationPannelIndex: -1,
      })
    }

  },

  bindInput(e) {
    wx.cloud.callFunction({
      name: 'checkImg',
      data: {
        msg: e.detail.value,
      },
      success(res) {
        console.log(res.result)
        if (res.result.errCode == 87014) {

          wx.showToast({
            icon: 'none',
            title: e.detail.value + "违规",
          })
          that.setData({
            commentContent:''
          })
          return
        } else {
          that.setData({
            commentContent: e.detail.value
          })
        }
      }
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
      heightBottom: 0
    })

    if (that.data.touchStartOperation || that.data.touchStartOperationPannel) {

    } else {
      that.setData({
        showOperationPannelIndex: -1,
        heightBottom: 0,
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
    console.log("预览图片", e);
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
  viewImagesTiaoZao(e) {
    // console.log("朋友圈条目",index);
    var current = e.target.dataset.src;
    console.log("当前src", current);
    var index = e.target.dataset.index
    console.log(e);
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.TiaoZaoList[index].images // 需要预览的图片http链接列表  
    })
  },
  viewImagesQH(e) {
    console.log("预览图片", e);
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src]
    })
  },
  // 获取新闻数据
  getDataNews() {
    // 计算新闻长度len==totalNews时到底了
    let len = this.data.newsList.length
    if (totalNews == len) {
      wx.showToast({
        title: '到底啦~',
      })
      // 直接退出不再执行下面代码
      return
    }
    // console.log("新闻list长度", len);

    // 按时间降序获取数据库数据
    wx.cloud.database().collection("news").orderBy('time', 'desc')
      // 每次20条，0，20，40，60
      .skip(len)
      .get()
      .then(res => {
        console.log("获取成功", res);
        // 拼接新闻，0+20，20+20，40+20
        this.setData({
          newsList: this.data.newsList.concat(res.data)
        })
      })
      .catch(res => {
        console.log("获取失败", res);
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

  // 获取外卖数据
  getDataStore() {
    // 计算新闻长度len==totalNews时到底了
    let len = this.data.storeList.length
    if (totalStore == len) {
      wx.showToast({
        title: '到底啦~',
      })
      // 直接退出不再执行下面代码
      return
    }
    // console.log("新闻list长度", len);
    wx.cloud.callFunction({
        name: 'getEat'
      })
      .then(res => {
        console.log("获取通讯录成功", res);
        that.setData({
          storeList: res.result.data
        })
        for (var i = 0; i < that.data.storeList.length; i++) {
          var ShiTang = that.data.storeList[i].ShiTang
          var XiaoQu = that.data.storeList[i].XiaoQu;
          console.log("shiitang", ShiTang);
          console.log("xiaoQu", XiaoQu);
          if ((ShiTang == 0 || ShiTang == null) && (XiaoQu == 0 || XiaoQu == null)) {
            that.data.SanShiTang.push(that.data.storeList[i])
          } else if (ShiTang == 1 && (XiaoQu == 0 || XiaoQu == null)) {
            that.data.SiShiTang.push(that.data.storeList[i])
          } else if (ShiTang == 2 && (XiaoQu == 0 || XiaoQu == null)) {
            that.data.T1.push(that.data.storeList[i])
          } else if (ShiTang == 3 && (XiaoQu == 0 || XiaoQu == null)) {
            that.data.T2.push(that.data.storeList[i])
          } else if (ShiTang == 4 && (XiaoQu == 0 || XiaoQu == null)) {
            that.data.T3.push(that.data.storeList[i])
          } else if (ShiTang == 5 && (XiaoQu == 0 || XiaoQu == null)) {
            that.data.CongShanQingZhen.push(that.data.storeList[i])
          } else if (ShiTang == 6 && (XiaoQu == 0 || XiaoQu == null)) {
            that.data.YouYuan.push(that.data.storeList[i])
          } else if ((ShiTang == 7 || ShiTang == null) && XiaoQu == 1) {
            that.data.PT1.push(that.data.storeList[i])
          } else if (ShiTang == 8 && XiaoQu == 1) {
            that.data.PT2.push(that.data.storeList[i])
          } else if (ShiTang == 9 && XiaoQu == 1) {
            that.data.PT3.push(that.data.storeList[i])
          } else if (ShiTang == 10 && XiaoQu == 1) {
            that.data.PuHeQingZhen.push(that.data.storeList[i])
          } else {
            continue;
          }
        }

        that.setData({
          storeList: that.data.SanShiTang
        })
      })
      .catch(err => {
        console.error("获取通讯录失败", err);
      })
    // // 按时间降序获取数据库数据
    // wx.cloud.database().collection("phone").orderBy('time', 'desc')
    //   // 每次20条，0，20，40，60
    //   .skip(len)
    //   .get()
    //   .then(res => {
    //     console.log("获取成功", res);
    //     // 拼接新闻，0+20，20+20，40+20
    //     this.setData({
    //       storeList: this.data.storeList.concat(res.data)
    //     })
    //   })
    //   .catch(res => {
    //     console.log("获取失败", res);
    //   })
  },
  // 获取家教数据
  getDataTeacher() {
    // 计算新闻长度len==totalNews时到底了
    let len = this.data.teacherList.length
    if (totalTeacher == len) {
      wx.showToast({
        title: '到底啦~',
      })
      // 直接退出不再执行下面代码
      return
    }
    // console.log("新闻list长度", len);
    wx.cloud.callFunction({
        name: 'getTeacher'
      })
      .then(res => {
        console.log("获取家教信息成功", res);
        that.setData({
          teacherList: res.result.data
        })
        for (var i = 0; i < that.data.teacherList.length; i++) {
          var subject = that.data.teacherList[i].subject;
          var school = that.data.teacherList[i].XiaoQu;
          if (subject == "炸鸡汉堡" && school == "崇山校区") {
            that.data.YuWen.push(that.data.teacherList[i])
          } else if (subject == "炸鸡汉堡" && school == "蒲河校区") {
            that.data.pYuWen.push(that.data.teacherList[i])
          } else if (subject == "饮品甜点" && school == "崇山校区") {
            that.data.Math.push(that.data.teacherList[i])
          } else if (subject == "饮品甜点" && school == "蒲河校区") {
            that.data.pMath.push(that.data.teacherList[i])
          } else if (subject == "零食超市" && school == "崇山校区") {
            that.data.English.push(that.data.teacherList[i])
          } else if (subject == "零食超市" && school == "蒲河校区") {
            that.data.pEnglish.push(that.data.teacherList[i])
          } else if (subject == "粉面水饺" && school == "崇山校区") {
            that.data.WuLI.push(that.data.teacherList[i])
          } else if (subject == "粉面水饺" && school == "蒲河校区") {
            that.data.pWuLI.push(that.data.teacherList[i])
          } else if (subject == "香锅麻辣" && school == "崇山校区") {
            that.data.HuaXue.push(that.data.teacherList[i])
          } else if (subject == "香锅麻辣" && school == "蒲河校区") {
            that.data.pHuaXue.push(that.data.teacherList[i])
          } else if (subject == "大型聚餐" && school == "崇山校区") {
            that.data.ShengWu.push(that.data.teacherList[i])
          } else if (subject == "大型聚餐" && school == "蒲河校区") {
            that.data.pShengWu.push(that.data.teacherList[i])
          } else if (subject == "生鲜果蔬" && school == "崇山校区") {
            that.data.ZhengZhi.push(that.data.teacherList[i])
          } else if (subject == "生鲜果蔬" && school == "蒲河校区") {
            that.data.pZhengZhi.push(that.data.teacherList[i])
          } else if (subject == "校内跑腿" && school == "崇山校区") {
            that.data.DiLi.push(that.data.teacherList[i])
          } else if (subject == "校内跑腿" && school == "蒲河校区") {
            that.data.pDiLi.push(that.data.teacherList[i])
          } else if (subject == "水果捞" && school == "崇山校区") {
            that.data.LiShi.push(that.data.teacherList[i])
          } else if (subject == "水果捞" && school == "蒲河校区") {
            that.data.pLiShi.push(that.data.teacherList[i])
          } else if (subject == "今日特价" && school == "崇山校区") {
            that.data.PeiDu.push(that.data.teacherList[i])
          } else if (subject == "今日特价" && school == "蒲河校区") {
            that.data.pPeiDu.push(that.data.teacherList[i])
          } else if (subject == "校园美妆" && school == "崇山校区") {
            that.data.ZhuanShengBen.push(that.data.teacherList[i])
          } else if (subject == "校园美妆" && school == "蒲河校区") {
            that.data.pZhuanShengBen.push(that.data.teacherList[i])
          } else if (subject == "校园摄影" && school == "崇山校区") {
            that.data.BianCheng.push(that.data.teacherList[i])
          } else if (subject == "校园摄影" && school == "蒲河校区") {
            that.data.pBianCheng.push(that.data.teacherList[i])
          } else {
            continue;
          }
        }
        that.setData({
          teacherList: that.data.YuWen
        })
      })
      .catch(err => {
        console.error("获取家教信息失败", err);
      })
    // console.log("新闻list长度", len);

    // 按时间降序获取数据库数据
    // wx.cloud.database().collection("teacher").orderBy('time', 'desc')
    //   // 每次20条，0，20，40，60
    //   .skip(len)
    //   .get()
    //   .then(res => {
    //     console.log("获取成功", res);
    //     // 拼接新闻，0+20，20+20，40+20
    //     this.setData({
    //       teacherList: this.data.teacherList.concat(res.data)
    //     })
    //   })
    //   .catch(res => {
    //     console.log("获取失败", res);
    //   })
  },
  // 获取家教需求数据
  getDataTeacherX() {
    // 计算新闻长度len==totalNews时到底了
    let len = this.data.teacherXList.length
    if (totalTeacherX == len) {
      wx.showToast({
        title: '到底啦~',
      })
      // 直接退出不再执行下面代码
      return
    }
    // console.log("新闻list长度", len);

    // 按时间降序获取数据库数据
    wx.cloud.database().collection("teacherX").orderBy('time', 'desc')
      // 每次20条，0，20，40，60
      .skip(len)
      .get()
      .then(res => {
        console.log("获取成功", res);
        // 拼接新闻，0+20，20+20，40+20
        this.setData({
          teacherXList: this.data.teacherXList.concat(res.data)
        })
      })
      .catch(res => {
        console.log("获取失败", res);
      })
  },
  // 获取租房数据
  getDataHouseX() {
    // 计算新闻长度len==totalNews时到底了
    let len = this.data.houseX.length
    if (totalTeacherX == len) {
      wx.showToast({
        title: '到底啦~',
      })
      // 直接退出不再执行下面代码
      return
    }
    // console.log("新闻list长度", len);

    // 按时间降序获取数据库数据
    wx.cloud.database().collection("houseX").orderBy('time', 'desc')
      // 每次20条，0，20，40，60
      .skip(len)
      .get()
      .then(res => {
        console.log("获取成功", res);
        // 拼接新闻，0+20，20+20，40+20
        this.setData({
          houseX: this.data.houseX.concat(res.data)
        })
      })
      .catch(res => {
        console.log("获取失败", res);
      })
  },
  // 获取房源数据
  getDataHouse() {
    // 计算新闻长度len==totalNews时到底了
    let len = this.data.house.length
    if (totalHouse == len) {
      wx.showToast({
        title: '到底啦~',
      })
      // 直接退出不再执行下面代码
      return
    }
    // console.log("新闻list长度", len);

    // 按时间降序获取数据库数据
    wx.cloud.database().collection("house").orderBy('time', 'desc')
      // 每次20条，0，20，40，60
      .skip(len)
      .get()
      .then(res => {
        console.log("获取成功", res);
        // 拼接新闻，0+20，20+20，40+20
        this.setData({
          house: this.data.house.concat(res.data)
        })
      })
      .catch(res => {
        console.log("获取失败", res);
      })
  },
  // 获取驾校数据
  getDataCar() {
    // 计算新闻长度len==totalNews时到底了
    let len = this.data.house.length
    if (totalCar == len) {
      wx.showToast({
        title: '到底啦~',
      })
      // 直接退出不再执行下面代码
      return
    }
    // console.log("新闻list长度", len);

    // 按时间降序获取数据库数据
    wx.cloud.database().collection("car").orderBy('time', 'desc')
      // 每次20条，0，20，40，60
      .skip(len)
      .get()
      .then(res => {
        console.log("获取成功", res);
        // 拼接新闻，0+20，20+20，40+20
        this.setData({
          carList: this.data.carList.concat(res.data)
        })
      })
      .catch(res => {
        console.log("获取失败", res);
      })
  },
  // 计算外卖总条数
  getTotalStore() {
    // 计算新闻总条数，加载页面时
    wx.cloud.database().collection('phone').count()
      .then(res => {
        // console.log("数据总条数", res)
        totalStore = res.total
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
  // 计算新闻总条数
  getTotalNews() {
    // 计算新闻总条数，加载页面时
    wx.cloud.database().collection('news').count()
      .then(res => {
        // console.log("数据总条数", res)
        totalNews = res.total
      })
  },
  // 计算家教总条数
  getTotalTeacher() {
    // 计算新闻总条数，加载页面时
    wx.cloud.database().collection('teacher').count()
      .then(res => {
        // console.log("数据总条数", res)
        totalTeacher = res.total
      })
  },
  // 计算家教需求总条数
  getTotalTeacherX() {
    // 计算新闻总条数，加载页面时
    wx.cloud.database().collection('teacherX').count()
      .then(res => {
        // console.log("数据总条数", res)
        totalTeacherX = res.total
      })
  },
  // 计算租房需求总条数
  getTotalHouseX() {
    // 计算新闻总条数，加载页面时
    wx.cloud.database().collection('houseX').count()
      .then(res => {
        // console.log("数据总条数", res)
        totalHouseX = res.total
      })
  },
  // 计算租房需求总条数
  getTotalHouse() {
    // 计算新闻总条数，加载页面时
    wx.cloud.database().collection('house').count()
      .then(res => {
        // console.log("数据总条数", res)
        totalHouse = res.total
      })
  },
  // 计算驾校总条数
  getTotalCar() {
    // 计算新闻总条数，加载页面时
    wx.cloud.database().collection('car').count()
      .then(res => {
        // console.log("数据总条数", res)
        totalCar = res.total
      })
  },
  // 计算表白总条数
  getTotalTiaoZao() {
    // 计算新闻总条数，加载页面时
    wx.cloud.database().collection('TiaoZaoList').count()
      .then(res => {
        // console.log("数据总条数", res)
        totalTiaoZao = res.total
      })
  },
  // 获取跳蚤市场
  // 获取表白数据
  getDataTiaoZao() {
    // 计算新闻长度len==totalNews时到底了
    let len = this.data.TiaoZaoList.length
    if (totalTiaoZao == len) {
      wx.showToast({
        title: '到底啦~',
      })
      // 直接退出不再执行下面代码
      return
    }
    // console.log("新闻list长度", len);

    // 按时间降序获取数据库数据
    wx.cloud.database().collection("TiaoZaoList").orderBy('time', 'desc')
      // 每次20条，0，20，40，60
      .skip(len)
      .get()
      .then(res => {
        console.log("获取跳蚤成功", res);
        // 拼接新闻，0+20，20+20，40+20
        this.setData({
          TiaoZaoList: this.data.TiaoZaoList.concat(res.data)
        })
      })
      .catch(res => {
        console.log("获取失败", res);
      })
  },
  onLoad: function (options) {
    that = this;
    that.setData({
      userInfo: getApp().globalData.userInfo,
    })
    // 调用计算新闻总条数
    this.getTotalNews()

    // 调用获取新闻函数
    this.getDataNews()

    // 获取表白总条数
    this.getTotalLove()

    // 获取表白数据
    this.getDataLove()

    // 获取外卖总条数
    this.getTotalStore()

    // 获取外卖数据
    this.getDataStore()

    // 获取家教总条数
    this.getTotalTeacher()

    // 获取家教数据
    this.getDataTeacher()

    // 获取家教总条数
    this.getTotalTeacherX()

    // 获取家教数据
    this.getDataTeacherX()

    // 获取租房总条数
    this.getTotalHouseX()

    // 获取租房数据
    this.getDataHouseX()

    // 获取房源总条数
    this.getTotalHouse()

    // 获取房源数据
    this.getDataHouse()

    // 获取房源总条数
    this.getTotalCar()

    // 获取房源数据
    this.getDataCar()

    // 获取跳蚤数据
    this.getTotalTiaoZao()

    this.getDataTiaoZao()
    let list = [];
    for (let i = 0; i < 26; i++) {
      list[i] = String.fromCharCode(65 + i)
    }
    this.setData({
      list: list,
      listCur: list[0]
    })


  },


  // *******************************导航栏选择获取id和导航栏的位置**************************************
  tabSelect(e) {
    console.log(e);
    this.setData({
      // 每一个tab的id
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id) * 60,
    })
  },
  switchTab(e) {
    console.log(e);
    var cur = e.detail.current;
    this.setData({
      TabCur: cur,
      scrollLeft: cur * 60,
    });
  },
  tabSelectShangtang(e) {
    console.log("结果：", e);
    that.setData({
      TabCurShangtang: e.currentTarget.dataset.id,
    })
    switch (e.currentTarget.dataset.id) {
      case 0:
        that.setData({
          storeList: that.data.SanShiTang,
        })
        break;
      case 1:
        that.setData({
          storeList: that.data.SiShiTang,
        })
        break;
      case 2:
        that.setData({
          storeList: that.data.T1,
        })
        break;
      case 3:
        that.setData({
          storeList: that.data.T2,
        })
        break;
      case 4:
        that.setData({
          storeList: that.data.T3,
        })
        break;
      case 5:
        that.setData({
          storeList: that.data.CongShanQingZhen,
        })
        break;
      case 6:
        that.setData({
          storeList: that.data.YouYuan,
        })
        break;
    }
  },
  tabSelectPuHeShangtang(e) {
    console.log("结果：", e);
    that.setData({
      TabCurPuHeShangtang: e.currentTarget.dataset.id,
    })
    switch (e.currentTarget.dataset.id) {
      case 0:
        that.setData({
          storeList: that.data.PT1,
        })
        break;
      case 1:
        that.setData({
          storeList: that.data.PT2,
        })
        break;
      case 2:
        that.setData({
          storeList: that.data.PT3,
        })
        break;
      case 3:
        that.setData({
          storeList: that.data.PuHeQingZhen,
        })
        break;
    }
  },
  tabSelectTeacher(e) {
    console.log("结果：", e);
    that.setData({
      TabTeacher: e.currentTarget.dataset.id,
    })
    switch (e.currentTarget.dataset.id) {
      case 0:
        if (that.data.changeSchoolT == false) {
          that.setData({
            teacherList: that.data.YuWen,
          })
        } else {
          that.setData({
            teacherList: that.data.pYuWen,
          })
        }
        break;
      case 1:
        if (that.data.changeSchoolT == false) {
          that.setData({
            teacherList: that.data.Math,
          })
        } else {
          that.setData({
            teacherList: that.data.pMath,
          })
        }
        break;
      case 2:
        if (that.data.changeSchoolT == false) {
          that.setData({
            teacherList: that.data.English,
          })
        } else {
          that.setData({
            teacherList: that.data.pEnglish,
          })
        }
        break;
      case 3:
        if (that.data.changeSchoolT == false) {
          that.setData({
            teacherList: that.data.WuLI,
          })
        } else {
          that.setData({
            teacherList: that.data.pWuLI,
          })
        }
        break;
      case 4:
        if (that.data.changeSchoolT == false) {
          that.setData({
            teacherList: that.data.HuaXue,
          })
        } else {
          that.setData({
            teacherList: that.data.pHuaXue,
          })
        }
        break;
      case 5:
        if (that.data.changeSchoolT == false) {
          that.setData({
            teacherList: that.data.ShengWu,
          })
        } else {
          that.setData({
            teacherList: that.data.pShengWu,
          })
        }
        break;
      case 6:
        if (that.data.changeSchoolT == false) {
          that.setData({
            teacherList: that.data.ZhengZhi,
          })
        } else {
          that.setData({
            teacherList: that.data.pZhengZhi,
          })
        }
        break;
      case 7:
        if (that.data.changeSchoolT == false) {
          that.setData({
            teacherList: that.data.DiLi,
          })
        } else {
          that.setData({
            teacherList: that.data.pDiLi,
          })
        }
        break;
      case 8:
        if (that.data.changeSchoolT == false) {
          that.setData({
            teacherList: that.data.LiShi,
          })
        } else {
          that.setData({
            teacherList: that.data.pLiShi,
          })
        }
        break;
      case 9:
        if (that.data.changeSchoolT == false) {
          that.setData({
            teacherList: that.data.PeiDu,
          })
        } else {
          that.setData({
            teacherList: that.data.pPeiDu,
          })
        }
        break;
      case 10:
        if (that.data.changeSchoolT == false) {
          that.setData({
            teacherList: that.data.AoShu,
          })
        } else {
          that.setData({
            teacherList: that.data.pAoShu,
          })
        }
        break;
      case 11:
        if (that.data.changeSchoolT == false) {
          that.setData({
            teacherList: that.data.ZhuanShengBen,
          })
        } else {
          that.setData({
            teacherList: that.data.pZhuanShengBen,
          })
        }
        break;
      case 12:
        if (that.data.changeSchoolT == false) {
          that.setData({
            teacherList: that.data.BianCheng,
          })
        } else {
          that.setData({
            teacherList: that.data.pBianCheng,
          })
        }
        break;
    }
  },
  changeSchool(e) {
    console.log("切换校区", e);
    that.setData({
      changeSchool: true,
      storeList: that.data.PT1
    })
  },
  changeSchool1(e) {
    console.log("切换校区", e);
    that.setData({
      changeSchool: false,
      storeList: that.data.SanShiTang,
    })
  },
  changeSchoolT(e) {
    console.log("切换校区", e);
    that.setData({
      changeSchoolT: true,
      teacherList: that.data.pYuWen
    })
  },
  changeSchool1T(e) {
    console.log("切换校区", e);
    that.setData({
      changeSchoolT: false,
      teacherList: that.data.YuWen
    })
  },



  //*******************************是否为卡片********************************* */
  isCard(e) {
    this.setData({
      isCard: e.detail.value
    })
  },


  //**************************外卖通讯录方法************************ */
  onReady() {

  },
  //滑动选择Item
  tMove(e) {
    let y = e.touches[0].clientY,
      offsettop = this.data.boxTop,
      that = this;
    //判断选择区域,只有在选择区才会生效
    if (y > offsettop) {
      let num = parseInt((y - offsettop) / 20);
      this.setData({
        listCur: that.data.list[num]
      })
    };
  },

  //触发全部开始选择
  tStart() {
    this.setData({
      hidden: false
    })
  },

  //触发结束选择
  tEnd() {
    this.setData({
      hidden: true,
      listCurID: this.data.listCur
    })
  },

  indexSelect(e) {
    let that = this;
    let barHeight = this.data.barHeight;
    let list = this.data.list;
    let scrollY = Math.ceil(list.length * e.detail.y / barHeight);
    for (let i = 0; i < list.length; i++) {
      if (scrollY < i + 1) {
        that.setData({
          listCur: list[i],
          movableY: i * 20
        })
        return false
      }
    }
  },
  // 上拉触底
  onReachBottom: function () {
    // 触底刷新事件
    this.getDataNews()
    this.getDataLove()
    this.getDataStore()
    this.getDataTeacher()
    this.getDataTeacherX()
    this.getDataHouseX()
    this.getDataHouse()
    this.getDataCar()
    this.getDataTiaoZao();
  },
  // 新闻下拉刷新
  getPullNews() {
    // 下拉刷新
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.cloud.database().collection("news").orderBy('time', 'desc')
      .get()
      .then(res => {
        console.log("获取成功", res);
        this.setData({
          newsList: res.data
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
  // 表白下拉刷新
  getPullLove() {
    // 下拉刷新
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.cloud.database().collection("loveList").orderBy('time', 'desc')
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
  // 外卖下拉刷新
  getPullStore() {
    // 下拉刷新
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.cloud.database().collection("phone").orderBy('time', 'desc')
      .get()
      .then(res => {
        console.log("获取成功", res);
        this.setData({
          storeList: res.data
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
  // 家教下拉刷新
  getPullTeacher() {
    // 下拉刷新
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.cloud.database().collection("teacher").orderBy('time', 'desc')
      .get()
      .then(res => {
        console.log("获取成功", res);
        this.setData({
          teacherList: res.data
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
  // 家教需求刷新
  getPullTeacherX() {
    // 下拉刷新
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.cloud.database().collection("teacherX").orderBy('time', 'desc')
      .get()
      .then(res => {
        console.log("获取成功", res);
        this.setData({
          teacherXList: res.data
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
  // 租房需求刷新
  getPullHouseX() {
    // 下拉刷新
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.cloud.database().collection("houseX").orderBy('time', 'desc')
      .get()
      .then(res => {
        console.log("获取成功", res);
        this.setData({
          houseX: res.data
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
  // 房源需求刷新
  getPullHouse() {
    // 下拉刷新
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.cloud.database().collection("house").orderBy('time', 'desc')
      .get()
      .then(res => {
        console.log("获取成功", res);
        this.setData({
          house: res.data
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
  // 房源需求刷新
  getPullCar() {
    // 下拉刷新
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.cloud.database().collection("car").orderBy('time', 'desc')
      .get()
      .then(res => {
        console.log("获取成功", res);
        this.setData({
          carList: res.data
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
  // 跳蚤下拉刷新
  getPullTiaoZao() {
    // 下拉刷新
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.cloud.database().collection("TiaoZaoList").orderBy('time', 'desc')
      .get()
      .then(res => {
        console.log("获取成功", res);
        this.setData({
          TiaoZaoList: res.data
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 调用下拉刷新
    this.getPullNews()
    this.getPullLove()
    this.getPullStore()
    this.getPullTeacher()
    this.getPullTeacherX()
    this.getPullHouseX()
    this.getPullHouse()
    this.getPullCar()
    this.getPullTiaoZao()
  },
  // 回到顶部
  // 获取滚动条当前位置
  // onPageScroll: function (e) {
  //   console.log("onPageScroll", e)
  //   that.setData({
  //     // 滑动面板消失
  //     showOperationPannelIndex: -1,
  //     // 输入框消失
  //     showCommentAdd:false
  //   })
  // },
  onPageScroll(e) {
    console.log(e);
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
    that.setData({
      userInfo: getApp().globalData.userInfo,
    })
    this.initAnimation(this.data.text)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.destroyTimer()
    this.setData({
      timer: null
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.destroyTimer()
    this.setData({
      timer: null
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title:'辽大外卖'
    }
  },
  onShareTimeline:function(res){
    return{
      title: '辽大外卖',
      query: '辽大外卖'
    }
  }

})