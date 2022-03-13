// pages/map/map.js
var that;
const db = wx.cloud.database('Loaction');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    changeSchool:0,
    TabCur: 0,
    // tab里面的内容
    markerss: [],
    express: [],
    xueyuan: [],
    jiaotong: [],
    jiaoxuelou: [],
    xingzhenglou: [],
    shitang: [],
    xueshengshushe: [],
    tiyuchangsuo: [],
    shenghuofuwu: [],
    express1: [],
    xueyuan1: [],
    jiaotong1: [],
    jiaoxuelou1: [],
    xingzhenglou1: [],
    shitang1: [],
    xueshengshushe1: [],
    tiyuchangsuo1: [],
    shenghuofuwu1: [],
    points: [{
        latitude: 41.8313281021969,
        longitude: 123.41337203979492
      },
      {
        latitude: 41.8369557564654,
        longitude: 123.40152740478516
      }
    ],
    tabContent: ['快递', '学院', '篮球场', '教学楼', '行政楼', '食堂', '学生宿舍', '体育场所', '生活服务'],
    markers: [],
    scrolltop: null,
    latitude: null,
  },
  // *******************************导航栏选择获取id和导航栏的位置**************************************
  tabSelect(e) {
    var points = that.data.points;
    console.log("结果：", e);
    switch (e.currentTarget.dataset.id) {
      case 0:
        if(that.data.changeSchool == 0){
          that.setData({
            latitude: 41.83355044524474,
            longitude: 123.40609788894653
          })
          for(var i = 0; i < that.data.express.length; i++){
            that.data.express[i].id = i;
          }
          that.setData({
            markerss: that.data.express,
          })
        }
        else{
          that.setData({
            latitude: 41.927902,
            longitude: 123.38665
          })
          for(var i = 0; i < that.data.express1.length; i++){
            that.data.express1[i].id = i;
          }
          that.setData({
            markerss: that.data.express1,
          })
        }
        break;
      case 1:
        if(that.data.changeSchool == 0){
          that.setData({
            latitude: 41.832375,
            longitude: 123.406
          })
          for(var i = 0; i < that.data.xueyuan.length; i++){
            that.data.xueyuan[i].id = i;
          }
          that.setData({
            markerss: that.data.xueyuan
          })
        }
        else{
          that.setData({
            latitude: 41.926563,
            longitude: 123.38693
          })
          for(var i = 0; i < that.data.xueyuan1.length; i++){
            that.data.xueyuan1[i].id = i;
          }
          that.setData({
            markerss: that.data.xueyuan1
          })
        }
        break;
      case 2:
        if(that.data.changeSchool == 0){
          that.setData({
            latitude: 41.835503,
            longitude: 123.40311
          })
          for(var i = 0; i < that.data.jiaotong.length; i++){
            that.data.jiaotong[i].id = i;
          }
          that.setData({
            markerss: that.data.jiaotong
          })
        }
        else{
          that.setData({
            latitude: 41.926563,
            longitude: 123.38693
          })
          for(var i = 0; i < that.data.jiaotong1.length; i++){
            that.data.jiaotong1[i].id = i;
          }
          that.setData({
            markerss: that.data.jiaotong1
          })
        }
        break;
      case 3:
        if(that.data.changeSchool == 0){
          that.setData({
            latitude: 41.832844,
            longitude: 123.408005
          })
          for(var i = 0; i < that.data.jiaoxuelou.length; i++){
            that.data.jiaoxuelou[i].id = i;
          }
          that.setData({
            markerss: that.data.jiaoxuelou
          })
        }
        else{
          that.setData({
            latitude: 41.926563,
            longitude: 123.38693
          })
          for(var i = 0; i < that.data.jiaoxuelou1.length; i++){
            that.data.jiaoxuelou1[i].id = i;
          }
          that.setData({
            markerss: that.data.jiaoxuelou1
          })
        }
        
        break;
      case 4:
        if(that.data.changeSchool == 0){
          that.setData({
            latitude: 41.833904,
            longitude: 123.40555
          })
          for(var i = 0; i < that.data.xingzhenglou.length; i++){
            that.data.xingzhenglou[i].id = i;
          }
          that.setData({
            markerss: that.data.xingzhenglou
          })
        }
        else{
          that.setData({
            latitude: 41.926563,
            longitude: 123.38693
          })
          for(var i = 0; i < that.data.xingzhenglou1.length; i++){
            that.data.xingzhenglou1[i].id = i;
          }
          that.setData({
            markerss: that.data.xingzhenglou1
          })
        }
       
        break;
      case 5:
        if(that.data.changeSchool == 0){
          that.setData({
            latitude: 41.83417,
            longitude: 123.40319
          })
          for(var i = 0; i < that.data.shitang.length; i++){
            that.data.shitang[i].id = i;
          }
          that.setData({
            markerss: that.data.shitang
          })
        }
        else{
          that.setData({
            latitude: 41.926563,
            longitude: 123.38693
          })
          for(var i = 0; i < that.data.shitang1.length; i++){
            that.data.shitang1[i].id = i;
          }
          that.setData({
            markerss: that.data.shitang1
          })
        }
        break;
      case 6:
        if(that.data.changeSchool == 0){
          that.setData({
            latitude: 41.83606,
            longitude: 123.40263
          })
          for(var i = 0; i < that.data.xueshengshushe.length; i++){
            that.data.xueshengshushe[i].id = i;
          }
          that.setData({
            markerss: that.data.xueshengshushe
          })
        }
        else{
          that.setData({
            latitude: 41.92856,
            longitude: 123.38356
          })
          for(var i = 0; i < that.data.xueshengshushe1.length; i++){
            that.data.xueshengshushe1[i].id = i;
          }
          that.setData({
            markerss: that.data.xueshengshushe1
          })
        }
        break;
      case 7:
        if(that.data.changeSchool == 0){
          that.setData({
            latitude: 41.833904,
            longitude: 123.40555
          })
          for(var i = 0; i < that.data.tiyuchangsuo.length; i++){
            that.data.tiyuchangsuo[i].id = i;
          }
          that.setData({
            markerss: that.data.tiyuchangsuo
          })
        }
       else{
        that.setData({
          latitude: 41.926563,
          longitude: 123.38693
        })
        
        for(var i = 0; i < that.data.tiyuchangsuo1.length; i++){
          that.data.tiyuchangsuo1[i].id = i;
        }
        that.setData({
          markerss: that.data.tiyuchangsuo1
        })
       }
        break;
      case 8:
        if(that.data.changeSchool == 0){
          that.setData({
            latitude: 41.83606,
            longitude: 123.40263
          })
          for(var i = 0; i < that.data.shenghuofuwu.length; i++){
            that.data.shenghuofuwu[i].id = i;
          }
          that.setData({
            markerss: that.data.shenghuofuwu
          })
        }
        else{
          that.setData({
            latitude: 41.926563,
            longitude: 123.38693
          })
          for(var i = 0; i < that.data.shenghuofuwu1.length; i++){
            that.data.shenghuofuwu1[i].id = i;
          }
          that.setData({
            markerss: that.data.shenghuofuwu1
          })
        }
        break;
    }
    // 操作新闻数据库
    this.setData({
      // 每一个tab的id
      TabCur: e.currentTarget.dataset.id,
    })
  },
  // 添加位置
  addLocation(e) {
    console.log(e);
    wx.navigateTo({
      url: '../addmap/addmap',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getLocation() {
    wx.cloud.callFunction({
        name: 'getmapList'
      })
      .then(res => {
        console.log("获取map成功", res);
        that.setData({
          markers: res.result.data
        })
        for (var i = 0; i < that.data.markers.length; i++) {
          // console.log(that.data.markers[i].classify);
          if ((that.data.markers[i].classify == 0 || that.data.markers[i].classify == null) && ((that.data.markers[i].school == 0 || that.data.markers[i].school == null) || that.data.markers[i].school == null)) {
            that.data.express.push(that.data.markers[i])
            console.log("ceshi",that.data.markers[i]);
          } 
          else if((that.data.markers[i].classify == 0 || that.data.markers[i].classify == null) && (that.data.markers[i].school == 1 || that.data.markers[i].school == null)){
            that.data.express1.push(that.data.markers[i])
            console.log("ceshi",that.data.markers[i]);
          } 
          else if (that.data.markers[i].classify == 1 && (that.data.markers[i].school == 0 || that.data.markers[i].school == null)) {
            that.data.xueyuan.push(that.data.markers[i])
          } 
          else if(that.data.markers[i].classify == 1 && (that.data.markers[i].school == 1 || that.data.markers[i].school == null)) {
            that.data.xueyuan1.push(that.data.markers[i])
          }
          else if (that.data.markers[i].classify == 2 && (that.data.markers[i].school == 0 || that.data.markers[i].school == null)) {
            that.data.jiaotong.push(that.data.markers[i])
          } 
          else if(that.data.markers[i].classify == 2 && (that.data.markers[i].school == 1 || that.data.markers[i].school == null)){
            that.data.jiaotong1.push(that.data.markers[i])
          }
          else if (that.data.markers[i].classify == 3 && (that.data.markers[i].school == 0 || that.data.markers[i].school == null)) {
            that.data.jiaoxuelou.push(that.data.markers[i])
          } 
          else if(that.data.markers[i].classify == 3 && (that.data.markers[i].school == 1 || that.data.markers[i].school == null)){
            that.data.jiaoxuelou1.push(that.data.markers[i])
          } 
          else if (that.data.markers[i].classify == 4 && (that.data.markers[i].school == 0 || that.data.markers[i].school == null)) {
            that.data.xingzhenglou.push(that.data.markers[i])
          } 
          else if(that.data.markers[i].classify == 4 && (that.data.markers[i].school == 1 || that.data.markers[i].school == null)){
            that.data.xingzhenglou1.push(that.data.markers[i])
          } 
          else if (that.data.markers[i].classify == 5 && (that.data.markers[i].school == 0 || that.data.markers[i].school == null)) {
            that.data.shitang.push(that.data.markers[i])
          } 
          else if(that.data.markers[i].classify == 5 && (that.data.markers[i].school == 1 || that.data.markers[i].school == null)){
            that.data.shitang1.push(that.data.markers[i])
          } 
          else if (that.data.markers[i].classify == 6 && (that.data.markers[i].school == 0 || that.data.markers[i].school == null)) {
            that.data.xueshengshushe.push(that.data.markers[i])
          } 
          else if(that.data.markers[i].classify == 6 && (that.data.markers[i].school == 1 || that.data.markers[i].school == null)){
            that.data.xueshengshushe1.push(that.data.markers[i])
          } 
          else if (that.data.markers[i].classify == 7 && (that.data.markers[i].school == 0 || that.data.markers[i].school == null)) {
            that.data.tiyuchangsuo.push(that.data.markers[i])
          } 
          else if(that.data.markers[i].classify == 7 && (that.data.markers[i].school == 1 || that.data.markers[i].school == null)){
            that.data.tiyuchangsuo1.push(that.data.markers[i])
          } 
          else if (that.data.markers[i].classify == 8 && (that.data.markers[i].school == 0 || that.data.markers[i].school == null)) {
            that.data.shenghuofuwu.push(that.data.markers[i])
          }
          else if(that.data.markers[i].classify == 8 && (that.data.markers[i].school == 1 || that.data.markers[i].school == null)){
            that.data.shenghuofuwu1.push(that.data.markers[i])
          }
          else{
            continue;
          }
        }
        for(var i = 0; i < that.data.express.length; i++){
          that.data.express[i].id = i;
        }

        that.setData({
          markerss: that.data.express
        })
      })
      .catch(err => {
        console.error("获取map失败", err);
      })
  },
  changeSchool(e){
    for(var i = 0; i < that.data.express1.length; i++){
      that.data.express1[i].id = i;
    }
    that.setData({
      changeSchool:1,
      latitude:41.926563,
      longitude:123.38693,
      markerss: that.data.express1,
    })
  },
  changeSchool1(e){
    for(var i = 0; i < that.data.express.length; i++){
      that.data.express[i].id = i;
    }
    that.setData({
      changeSchool:0,
      latitude:41.833904,
      longitude:123.40555,
      markerss: that.data.express,
    })
  },
  bindMarkerTap(e) {
    console.log("点击标记点", e);
      let lat = ''; // 获取点击的markers经纬度
      let lon = ''; // 获取点击的markers经纬度
      let name = ''; // 获取点击的markers名称
      let markerId = e.markerId;// 获取点击的markers  id
      let markers = that.data.markerss;// 获取markers列表
   
      for (let item of markers){
        if (item.id === markerId) {
          lat = item.latitude;
          lon = item.longitude;
          name = item.callout.content;
          wx.openLocation({ // 打开微信内置地图，实现导航功能（在内置地图里面打开地图软件）
            latitude: lat,
            longitude: lon,
            name:name,
            success:function(res){
              console.log(res);
            },
            fail:function(res){
              console.log(res);
            }
          })
          break;
        }
      }
  },
  // 点击地图获取位置
  bindTap(e) {
    console.log("点击地图", e);
  },
  bindCalloutTap(e) {
    console.log("点击气泡", e);
    let lat = ''; // 获取点击的markers经纬度
      let lon = ''; // 获取点击的markers经纬度
      let name = ''; // 获取点击的markers名称
      let markerId = e.markerId;// 获取点击的markers  id
      let markers = that.data.markerss;// 获取markers列表
   
      for (let item of markers){
        if (item.id === markerId) {
          lat = item.latitude;
          lon = item.longitude;
          name = item.callout.content;
          wx.openLocation({ // 打开微信内置地图，实现导航功能（在内置地图里面打开地图软件）
            latitude: lat,
            longitude: lon,
            name:name,
            success:function(res){
              console.log(res);
            },
            fail:function(res){
              console.log(res);
            }
          })
          break;
        }
      }
  },
  onLoad: function (options) {
    that = this;
    // 获取map列表
    // that.getLocation();
    that.setData({
      latitude: 41.83355044524474,
      longitude: 123.40609788894653
    })
  },
  onShow() {
    // 显示页面获取map列表
    that.getLocation();
    that.setData({
      latitude: 41.83355044524474,
      longitude: 123.40609788894653
    })
  },
  onReady(){
    
  },
  onShareAppMessage: function () {
    return {
      title:'辽大导览'
    }
  },
  onShareTimeline:function(res){
    return{
      title: '辽大导览',
      query: '辽大导览'
    }
  }
})