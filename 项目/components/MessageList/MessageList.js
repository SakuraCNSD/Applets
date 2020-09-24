const db = wx.cloud.database();
const app = getApp().globalData;
const _ = db.command;
const {
  messageTip,
  serveUpdate,
  getServeData
} = require("../../utils/util");
let list, addUserList, friend;
Component({
  options: {
    styleIsolation: "isolated"
  },
  properties: {
    addUserId: Array
  },
  data: {
    startX: 0,
    startY: 0,
    addUser: [],
    isFirst: true
  },
  methods: {
    touchstart(e) {
      this.setData({
        startX: e.changedTouches[0].clientX,
        startY: e.changedTouches[0].clientY
      });
    },
    touchmove(e) {
      let startX = this.data.startX,
        startY = this.data.startY,
        touchMoveX = e.changedTouches[0].clientX,
        touchMoveY = e.changedTouches[0].clientY,
        angle = this.angle({
          x: startX,
          y: startY
        }, {
          x: touchMoveX,
          y: touchMoveY
        }),
        index = e.currentTarget.dataset.index;
      if (Math.abs(angle) > 30) return;
      this.data.addUser.forEach((v, i) => {
        if (index !== i) {
          v.isTouch = false;
        }
      });
      if (touchMoveX > startX) {
        this.data.addUser[index].isTouch = false;
      } else {
        this.data.addUser[index].isTouch = true;
      }
      this.setData({
        addUser: this.data.addUser
      });
    },
    angle(start, end) {
      var _x = end.x - start.x,
        _y = end.y - start.y;
      return 360 * Math.atan(_y / _x) / (2 * Math.PI);
    },
    del(e) {
      const id = e.currentTarget.dataset.id;
      messageTip("删除申请信息", res => {
        if (res.confirm) {
          getServeData({
            collection: "message",
            where: {
              userId: app.userInfo._id
            }
          }).then(res => {
            list = res.data[0].list.filter(v => v !== id);
            addUserList = this.data.addUser.filter(v => v._id !== id);
            serveUpdate("update", {
              collection: "message",
              data: {
                list
              },
              where: {
                userId: app.userInfo._id
              }
            }).then(res => {
              if (res.result.stats.updated > 0) {
                this.setData({
                  addUser: addUserList
                });
                this.triggerEvent("myevent", list);
              }
            }).catch(err => messageTip("删除信息失败"));
          }).catch(err => messageTip());
        }
      }, "", true);
    },
    getUserInfo(userIdList) {
      userIdList.forEach(v => {
        getServeData({
          collection: "users",
          where: {
            _id: v
          }
        }).then(res => {
          this.setData({
            addUser: [...this.data.addUser, {
              ...res.data[0],
              isTouch: false
            }],
            isFirst: false
          });
        }).catch(err => messageTip());
      });
    },
    add(e) {
      const id = e.currentTarget.dataset.id;
      messageTip("添加好友", res => {
        if (res.confirm) {
          list = this.data.addUserId.filter(item => item !== id);
          friend = this.data.addUserId.filter(item => item === id);
          db.collection("users").doc(app.userInfo._id).update({
            data: {
              friendList: _.push(friend)
            }
          }).then(res => {
            if (res.stats.updated > 0) {
              this.triggerEvent("myevent", list);
              serveUpdate("update", {
                collection: "message",
                data: {
                  list
                },
                where: {
                  userId: app.userInfo._id
                }
              }).catch(err => messageTip());
            }
          }).catch(err => messageTip("添加好友失败"));
          serveUpdate("update", {
            collection: "users",
            data: {
              friendList: app.userInfo._id
            },
            where: {
              _id: friend[0]
            }
          }).catch(err => messageTip());
          getServeData({
            collection: "message",
            where: {
              userId: friend[0]
            }
          }).then(res => {
            if(res.data.length > 0 && res.data[0].list.length > 0){
              list = res.data[0].list.filter(item => item !== app.userInfo._id);
              serveUpdate("update", {
                collection: "message",
                data: {
                  list
                },
                where: {
                  userId: friend[0]
                }
              });
            }
          }).catch(err => messageTip());
        }
      }, "", true);
    },
  },
  lifetimes: {
    attached() {
      this.getUserInfo(this.data.addUserId);
    }
  },
  pageLifetimes: {
    hide() {
      this.data.addUser.forEach(v => v.isTouch = false);
      this.setData({
        addUser: this.data.addUser
      });
    }
  },
  observers: {
    addUserId: function (messageId) {
      if (!this.data.isFirst) {
        this.setData({
          addUser: []
        });
        this.getUserInfo(messageId);
      }
    }
  }
});