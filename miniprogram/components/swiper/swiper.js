// components/swiper/swiper.js
var that = this;
Component({
  // 全局样式引入
  options: {
    addGlobalClass: true
  },

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'cloud://cloud1-7gdhiyd69c198606.636c-cloud1-7gdhiyd69c198606-1305299693/LNU/swiper/0.jpg'
    }, {
      id: 1,
      type: 'image',
      url: 'cloud://cloud1-7gdhiyd69c198606.636c-cloud1-7gdhiyd69c198606-1305299693/LNU/swiper/1.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'cloud://cloud1-7gdhiyd69c198606.636c-cloud1-7gdhiyd69c198606-1305299693/LNU/swiper/2.jpg'
    }, {
      id: 3,
      type: 'image',
      url: 'cloud://cloud1-7gdhiyd69c198606.636c-cloud1-7gdhiyd69c198606-1305299693/LNU/swiper/3.jpg'
    }, {
      id: 4,
      type: 'image',
      url: 'cloud://cloud1-7gdhiyd69c198606.636c-cloud1-7gdhiyd69c198606-1305299693/LNU/swiper/4.jpg'
    }, {
      id: 5,
      type: 'image',
      url: 'cloud://cloud1-7gdhiyd69c198606.636c-cloud1-7gdhiyd69c198606-1305299693/LNU/swiper/5.jpg'
    }, {
      id: 6,
      type: 'image',
      url: 'cloud://cloud1-7gdhiyd69c198606.636c-cloud1-7gdhiyd69c198606-1305299693/LNU/swiper/6.jpg'
    }],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLoad() {
      this.towerSwiper('swiperList');
      // 初始化towerSwiper 传已有的数组名即可
    },
    viewImages(e) {
      // console.log("朋友圈条目",index);
      var index = e.currentTarget.dataset.index
      var src = this.data.swiperList[index].url;

      console.log(e);
      wx.previewImage({
        current: src, // 当前显示图片的http链接  
        urls: [src] // 需要预览的图片http链接列表  
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
      this.setData({
        towerStart: e.touches[0].pageX
      })
    },
    // towerSwiper计算方向
    towerMove(e) {
      this.setData({
        direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
      })
    },
    // towerSwiper计算滚动
    towerEnd(e) {
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
    }
  }
})