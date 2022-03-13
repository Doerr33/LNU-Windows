var that;
const db = wx.cloud.database();
Page({
  data: {
    musicId:0,
    // 音乐列表
    // 1.控制图片显示
    playMusic: 0,
    Zmusic:'',
    music:[],

    cardCur: 0,
    swiperList1: [{
      id: 0,
      type: 'image',
      url: 'https://z3.ax1x.com/2021/05/27/2iMbdg.jpg',
    }, {
      id: 1,
      type: 'image',
      url: 'https://z3.ax1x.com/2021/05/27/2iMHeS.jpg'
    }, {
      id: 2,
      type: 'image',
      url: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2624111148,3022511105&fm=26&gp=0.jpg'
    },
    
  ],
    swiperList2: [{
      id: 0,
      type: 'image',
      url: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3478618148,619575660&fm=26&gp=0.jpg'
    }, {
      id: 1,
      type: 'image',
      url: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=591239061,28140699&fm=26&gp=0.jpg'
    }, ],
    swiperList: [{
        id: 0,
        type: 'image',
        url: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3696917474,839042634&fm=26&gp=0.jpg'
      }, {
        id: 1,
        type: 'image',
        url: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3841325839,4118295644&fm=26&gp=0.jpg'
      },
      {
        id: 2,
        type: 'image',
        url: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=310924491,1573284912&fm=26&gp=0.jpg'
      },
      {
        id: 3,
        type: 'image',
        url: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1488795872,3349704878&fm=26&gp=0.jpg'
      },
      {
        id: 4,
        type: 'image',
        url: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2312914408,1463005880&fm=26&gp=0.jpg'
      }
    ],
  },
  // 播放和暂停
  audioPlay: function () {
    that.setData({
      playMusic: 1,
    })
    this.audioCtx.play()
  },
  audioPlay1: function () {
    that.setData({
      playMusic: 0
    })
    this.audioCtx.pause()
  },
  toDetailTuijian(e) {
    console.log(e);
    switch (e.currentTarget.dataset.index) {
      case 0:
        wx.navigateTo({
          url: '/packageA/pages/map/map',
        })
        break;
      case 1:
        wx.navigateToMiniProgram({
          appId: 'wx36f814324c2067b8',
        })
        break;
      case 2:
        wx.navigateTo({
          url: '/packageB/pages/Findex-list/Findex-list',
        })
    }
  },
  toDetailTuijian1(e) {
    console.log(e);
    switch (e.currentTarget.dataset.index) {
      case 0:
        wx.navigateTo({
          url: '/packageA/pages/mine-tree/mine-tree',
        })
        break;
      case 1:
        wx.navigateTo({
          url: '/packageA/pages/mine-camera/mine-camera',
        })
        break;
    }
  },
  clickTJMusic(e) {
    wx.navigateTo({
      url: '/packageB/pages/addMusic/addMusic',
    })
    
  },
  onReady: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
  },
  onLoad() {
    that = this;
    this.audioCtx = wx.createAudioContext('myAudio')
    this.towerSwiper('swiperList');
    db.collection('music').aggregate().sample({size: 5})
    .end()
    .then(res => { 
      console.log(res);
      that.setData({
        music:res.list,
        Zmusic:res.list[0].src
      })
    })
  },
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    console.log("towerStart", e);
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    console.log("towerMove", e);
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    console.log("towerEnd", e);
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  },


  // audiopassed: function () {
  //   var time = this.data.time
  //   this.audioCtx.seek(time.passed)
  // },
  audioNext(e) {
    console.log("下一曲");
    that.data.musicId = that.data.musicId + 1;
    if(that.data.musicId > 4){
      that.setData({
        musicId: 0,
        Zmusic:that.data.music[that.data.musicId].src,
      })
      this.audioCtx.play()
    }
    else{
      that.setData({
        Zmusic:that.data.music[that.data.musicId].src
      })
      this.audioCtx.play()
    }
  },

  audioPre(e) {
    console.log("上一曲");
    that.data.musicId = that.data.musicId - 1;
    if(that.data.musicId < 0){
      that.setData({
        musicId : 4,
        Zmusic:that.data.music[that.data.musicId].src
      })
      this.audioCtx.play()
    }
    else{
      that.setData({
        Zmusic:that.data.music[that.data.musicId].src
      })
      this.audioCtx.play()
    }
  },

})