// packageB/pages/qunLiao/qiaoLiao.js
var that;
var db = wx.cloud.database()
var _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {

    windowHeight: 612,
    current: 'A',
    intoView: '',
    touching: false,
    alphabet: [],
    _tops: [],
    _anchorItemH: 0,
    _anchorItemW: 0,
    _anchorTop: 0,
    _listUpperBound: 0,
    list: [],
    checkedCount: 0,

    title: '发起群聊',
    groupId: '',
    type: 0, // 0.默认值 发起群聊 1.添加群成员 2.删除群成员
    memberIds: [], // 添加群成员时，从群聊页面传递过来的群聊成员id数组
    memberList: [], // 删除群成员时，从群信息页面传递过来的群组成员列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    console.log("QINLIAO,option.type:", options.type);
    if (options.type) {
      that.setData({
        type: options.type,
        groupId: options.groupId
      })
    }
    if (that.data.type == 0) {
      that.getAddressBook();
    }
    if (that.data.type == 1) {
      // 添加成员
      that.setData({
        title: "添加群成员",
        // 解码接收
        memberIds: JSON.parse(decodeURIComponent(options.memberIds))
      })
      that.getAddressBook();
    }
    if (that.data.type == 2) {
      that.setData({
        title: "删除群成员",
        // 传递过来的memberList
        memberList: JSON.parse(decodeURIComponent(options.memberList))
      })
      console.log("memberList", that.data.memberList);
      that.initList(that.data.memberList);
    }

  },
  back() {
    wx.navigateBack({
      delta: 1
    })
  },

  updateGroupMembers(groupType, ids, title) {
    var doc = {};
    // 如果是删除群成员
    if (groupType == 'group_delete') {
      doc = {
        chat_members: _.pullAll(ids)
      }
    }
    // 添加群成员
    if (groupType == 'group_add') {
      doc = {
        chat_members: _.push(ids)
      }
    }
    // 修改群成员
    db.collection('chat_group')
      .where({
        _id: that.data.groupId
      })
      .update({
        data: doc
      })
      .then(res => {
        if (res.stats.updated == 1) {
          that.sendChatMsg(groupType, ids, title);
        }
      })
  },

  sendChatMsg(groupType, ids, title) {
    // 发送系统聊天消息
    // 为了统一删除和添加群成员，删除群成员的聊天消息，也合并成一条
    var time = new Date();
    var timeTS = Date.now();
    const doc = {
      _id: `${Math.random()}_${timeTS}`,
      groupId: that.data.groupId,
      msgType: 'sys',
      textContent: title,
      sendTime: time,
      sendTimeTS: timeTS, // fallback
      creatorName: getApp().globalData.userInfo.nickName,
      groupType: groupType,
      userIds: ids
    }
    db.collection('chat_msg').add({
        data: doc,
      })
      .then(res => {
        that.updateSysMsg(groupType, ids, title, time, timeTS);
      })
  },
  updateSysMsg(groupType, ids, text, time, timeTS) {
    var doc = {};
    if (groupType == 'group_add') {
      doc = {
        content: text,
        time: time,
        sendTimeTS: timeTS,
        childType: 'chat_sys',
        groupType: groupType,
        opIds: ids,
        userIds: _.push(ids)
      }
    }
    if (groupType == 'group_delete') {
      doc = {
        content: text,
        time: time,
        sendTimeTS: timeTS,
        childType: 'chat_sys',
        groupType: groupType,
        opIds: ids,
        userIds: _.pullAll(ids)
      }
    }
    // 修改消息列表中消息
    db.collection('sys_msg')
      .where({
        type: 2,
        groupId: that.data.groupId,
      })
      .update({
        data: doc
      })
      .then(res => {
        wx.hideLoading()
        if (groupType == 'group_delete') {
          for (var i = 0; i < ids.length; i++) {
            // 可能删除多个
            that.sendPushMsg(groupType, time, timeTS, ids[i]);
          }
        }
        // 2.删除/添加群组成员时，除了群主，给群组其他成员发送未读数
        for (var id of ids) {
          if (id != getApp().globalData.userInfo._openid) {
            // that.updateUnreadCount(groupId, id, timeTS);
          }
        }
        var pages = getCurrentPages();
        // 获取上个页面
        var prePage = pages[pages.length - 2];
        prePage.getMemberList();
        wx.navigateBack({
          delta: 1,
        })
      })
  },
  sendPushMsg(groupType, time, timeTS, id) {
    console.log('sendPushMsg delete');
    db.collection('push_msg')
      .add({
        data: {
          type: 2,
          groupId: that.data.groupId,
          time: time,
          sendTimeTS: timeTS,
          groupType: groupType,
          userId: id
        }
      })
      .then(res => {
        console.log('sendPushMsg delete success', res);
      })
  },

  // 发起群聊，确认按钮的点击事件
  confirm() {
    var ids = [];
    var title = '';

    if (that.data.type == 0) {
      ids.push(getApp().globalData.userInfo._openid);
      title = getApp().globalData.userInfo.nickName + "、";
    }

    for (var i = 0; i < that.data.list.length; i++) {
      var itemF = that.data.list[i];
      for (var j = 0; j < itemF.subItems.length; j++) {
        if (itemF.subItems[j].checked) {
          ids.push(itemF.subItems[j].openid);
          title = title + itemF.subItems[j].name + "、";
        }
      }
    }

    title = title.substring(0, title.length - 1);

    if (that.data.type == 1 || that.data.type == 2) {
      var groupType = 'group_delete';
      // 添加或删除群成员
      if (that.data.type == 2) {
        // 删除群成员
      }
      if (that.data.type == 1) {
        // 添加群成员
        groupType = 'group_add';
      }
      that.updateGroupMembers(groupType, ids, title)
      return;
    }
    // 1.创建群聊
    db.collection('chat_group')
      .add({
        data: {
          type: 2,
          chat_members: ids
        }
      })
      .then(res => {
        var groupId = res._id;
        // 2.创建群聊成功后，会向聊天中发送一个系统聊天消息(谁 发起群聊)
        var time = new Date();
        var timeTS = Date.now();
        const doc = {
          _id: `${Math.random()}_${timeTS}`,
          groupId: groupId,
          msgType: 'sys',
          textContent: '发起群聊',
          sendTime: time,
          sendTimeTS: timeTS, // fallback
          creatorName: getApp().globalData.userInfo.nickName
        }
        db.collection('chat_msg').add({
          data: doc,
        }).then(res => {
          // 3.消息列表中添加群聊消息
          that.addSysMsg('发起群聊', time, timeTS, groupId, ids, title);
        })
      })

  },

  addSysMsg(text, time, timeTS, groupId, ids, title) {
    db.collection('sys_msg')
      .add({
        data: {
          type: 2,
          groupId: groupId,
          userIds: ids,
          icon:"/images/qunliao-blue.png",
          title: title,
          content: text,
          time: time,
          sendTimeTS: timeTS,
          unreadCount: 0,
          creator: getApp().globalData.userInfo,
          // 只有在创建群聊时才有
          childType: 'chat_sys'
        }
      })
      .then(res => {
        console.log('add msg success', res)
        // 1.创建群组时，除了群主，给群组其他成员发送未读数
        for (var id of ids) {
          if (id != getApp().globalData.userInfo._openid) {
            that.sendUnreadCount(groupId, id, timeTS);
          }
        }
        wx.navigateTo({
          url: '/pages/im/room/room?title=' + title +
            "&groupId=" + groupId + "&chatType=2",
        })
      })

  },
  initList(list) {
    console.log("初始化通讯录列表", list);
    if (list.length > 0) {
      var friendList = list;
      // var fakeFriend = {
      //   nickName: '假好友',
      //   pinyin: ['jia', 'hao', 'you']
      // };
      // friendList.push(fakeFriend);
      friendList.sort((c1, c2) => {
        let pinyin1 = c1.pinyin.join('')
        let pinyin2 = c2.pinyin.join('')
        return pinyin1.localeCompare(pinyin2)
      })
      // 添加首字母
      const map = new Map()
      for (const friend of friendList) {
        const alpha = friend.pinyin[0].charAt(0).toUpperCase()
        if (!map.has(alpha)) map.set(alpha, [])
        map.get(alpha).push({
          name: friend.nickName,
          avatarUrl: friend.avatarUrl,
          // 这里初始化问题,这里要不是添加群聊出问题，要不就是删除出问题
          openid: friend.friend_id,
          checked: false
        })
      }

      const keys = []
      for (const key of map.keys()) {
        keys.push(key)
      }
      keys.sort()

      const listFriend = []
      for (const key of keys) {
        listFriend.push({
          alpha: key,
          subItems: map.get(key)
        })
      }

      that.setData({
        current: keys[0],
        alphabet: keys,
        list: listFriend
      })
      that.computedSize();
    }
  },
  // 获取通讯录
  getAddressBook(e) {
    db.collection('address_book')
      .where({
        _openid: getApp().globalData.userInfo._openid
      })
      .get()
      .then(res => {
        console.log("获取通讯录成功", res);
        var list = [];
        for (var i = 0; i < res.data.length; i++) {
          // console.log(res.data[i].friend_id);
          list.push(res.data[i])
        }
        console.log("移除之前", list);
        if (that.data.type == 1) {
          // 将群成员的好友在通讯录列表中移除
          for (var i = 0; i < list.length; i++) {
            if (that.data.memberIds.indexOf(list[i].friend_id) >= 0) {
              list.splice(i--, 1)
            }
          }
        }
        console.log("移除之后", list);
        that.initList(list)
      })
      .catch(err => {

      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _wx$getSystemInfoSync = wx.getSystemInfoSync(),
      windowHeight = _wx$getSystemInfoSync.windowHeight;

    this.setData({
      windowHeight: windowHeight
    });
  },
  updateUnreadCount(groupId, userId, timeTS) {
    db.collection('unread_count')
        .where({
            groupId: groupId,
            userId: userId
        })
        .update({
            data: {
                count: _.inc(1),
                sendTimeTS: timeTS
            }
        })
        .then(res => {
            if (res.stats.updated > 0) {
                // 如果更新成功，已经存在所属用户所属群组的未读数
            } else {
                // 如果更新失败，不存在所属用户所属群组的未读数，去创建
                that.sendUnreadCount(groupId, userId, timeTS)
            }
        })
},
sendUnreadCount(groupId, userId, timeTS) {
    db.collection('unread_count')
        .add({
            data: {
                type: 2,
                groupId: groupId,
                userId: userId,
                count: 1,
                sendTimeTS: timeTS
            }
        })
},


/**
 * 创建群聊业务分析
 * 1.创建群聊，区分单聊还是群聊
 *  chat_group
 *    type:1 单聊 2.群聊
 *    chat_members: [选中的好友openid数组]
 * 2.创建群聊成功后，会向聊天中发送一个系统聊天消息(谁 发起群聊)
 *  chat_msg
 *    msgType:'sys' 系统聊天消息
 *    creatorName: 当前发起群聊用户的昵称
 * 3.消息列表中添加群聊消息
 *   sys_msg
 *    type:2 群聊消息
 *    content:'发起群聊'
 *    creator:当前发起群聊的用户
 *    childType:'chat_sys' 判断系统聊天消息(暂时只有创建群聊时才有)
 * 
 * 4.跳转聊天页面时传递参数 chatType 1.单聊 2.群聊
 *    userInfo.js  chatType=1
 *    home.js
 *      点击消息列表中消息条目
 *        根据msg.type 获取聊天消息类型
 *        chatType=msg.type
 *      title 群聊(群聊成员的数量)
 *    create.js
 *      chatType=2
 * 5.接收参数chatType
 *  room.js
 *  chatroom.js
 * 
 * 
 * 
 */
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

  },
  // 多选框选择
  choose: function choose(e) {
    console.log('choose', e);
    // 外层索引
    var index = e.currentTarget.dataset.index;
    // 内层索引
    var subIndex = e.currentTarget.dataset.subindex;
    // 具体item
    var item = that.data.list[index].subItems[subIndex];
    if (item.checked) {
      item.checked = false;
    } else {
      item.checked = true;
    }
    that.setData({
      list: that.data.list
    })
    var count = 0;
    for (var i = 0; i < that.data.list.length; i++) {
      var itemF = that.data.list[i];
      for (var j = 0; j < itemF.subItems.length; j++) {
        if (itemF.subItems[j].checked) {
          count++;
        }
      }
    }
    that.setData({
      checkedCount: count
    })

    console.log('choose', that.data.list)
    // var item = e.target.dataset.item;
    // this.triggerEvent('choose', {
    //   item: item
    // });
  },
  scrollTo: function scrollTo(e) {
    this._scrollTo(e);
  },
  _scrollTo: function _scrollTo(e) {
    var data = this.data;
    var clientY = e.changedTouches[0].clientY;
    var index = Math.floor((clientY - data._anchorTop) / data._anchorItemH);
    var current = data.alphabet[index];
    this.setData({
      current: current,
      intoView: current,
      touching: true
    });
  },
  computedSize: function computedSize() {
    var data = this.data;
    var query = this.createSelectorQuery();
    query.selectAll('.index_list_item').boundingClientRect(function (rects) {
      var result = rects;
      data._tops = result.map(function (item) {
        return item.top;
      });
    }).exec();
    query.select('.anchor-list').boundingClientRect(function (rect) {
      data._anchorItemH = rect.height / data.alphabet.length;
      data._anchorItemW = rect.width;
      data._anchorTop = rect.top;
    }).exec();
    query.select('.page-select-index').boundingClientRect(function (rect) {
      data._listUpperBound = rect.top;
    });
  },
  removeTouching: function removeTouching() {
    var _this2 = this;

    setTimeout(function () {
      _this2.setData({
        touching: false
      });
    }, 150);
  },
  onScroll: function onScroll(e) {
    this._onScroll(e);
  },
  _onScroll: function _onScroll(e) {
    var data = this.data;
    var _tops = data._tops,
      alphabet = data.alphabet;

    var scrollTop = e.detail.scrollTop;
    var current = '';
    if (scrollTop < _tops[0]) {
      current = alphabet[0];
    } else {
      for (var i = 0, len = _tops.length; i < len - 1; i++) {
        if (scrollTop >= _tops[i] && scrollTop < _tops[i + 1]) {
          current = alphabet[i];
        }
      }
    }
    if (!current) current = alphabet[alphabet.length - 1];
    this.setData({
      current: current
    });
  }
})