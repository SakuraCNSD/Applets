const db = wx.cloud.database();
const app = getApp().globalData;
const {
  messageTip,
  getServeData
} = require("../../utils/util");
Page({
  data: {
    userPhoto: "../../images/user/user-unlogin.png",
    nickName: "请登录",
    logined: false,
    disabled: true,
    id: "",
    longitude: "",
    latitude: ""
  },
  bindGetUserInfo(e) {
    const userInfo = e.detail.userInfo;
    if (!this.data.logined && userInfo) {
      db.collection("users").add({
        data: {
          userPhoto: userInfo.avatarUrl,
          nickName: userInfo.nickName,
          signature: "",
          phoneNumber: "",
          weixinNumber: "",
          links: 0,
          time: Date.now(),
          isLocation: true,
          friendList: [],
          longitude: this.data.longitude,
          latitude: this.data.latitude,
          location: db.Geo.Point(this.data.longitude, this.data.latitude)
        }
      }).then(res => {
        getServeData({
          collection: "users",
          where: {
            _id: res._id
          }
        }).then(res => {
          app.userInfo = {
            ...res.data[0]
          };
          this.setData({
            logined: true,
            nickName: app.userInfo.nickName,
            userPhoto: app.userInfo.userPhoto,
            id: app.userInfo._id
          });
        });
      }).catch(err => messageTip("添加用户失败"));
    }
  },
  getLocation() {
    wx.getLocation({
      type: "gcj02",
      success: res => {
        const latitude = res.latitude;
        const longitude = res.longitude;
        this.setData({
          latitude,
          longitude
        });
      }
    });
  },
  getMessage() {
    db.collection("message").where({
      userId: app.userInfo._id
    }).watch({
      onChange: function (snapshot) {
        if (snapshot.docChanges.length) {
          let list = snapshot.docChanges[0].doc.list;
          if (list.length) {
            wx.showTabBarRedDot({
              index: 2
            });
            app.userMessage = list;
          } else {
            wx.hideTabBarRedDot({
              index: 2
            });
            app.userMessage = [];
          }
        }
      },
      onError: function (err) {
        messageTip();
      }
    });
  },
  onLoad: function (options) {},
  onReady: function () {
    this.getLocation();
    wx.cloud.callFunction({
      name: "login",
      success: res => {
        getServeData({
          collection: "users",
          where: {
            _openid: res.result.OPENID
          }
        }).then(res => {
          if (!res.data.length) {
            this.setData({
              disabled: false
            });
            messageTip("未登录用户，通过授权按钮登录");
          } else {
            app.userInfo = {
              ...res.data[0]
            }
            this.setData({
              userPhoto: app.userInfo.userPhoto,
              nickName: app.userInfo.nickName,
              logined: true,
              id: app.userInfo._id
            });
            this.getMessage();
          }
        }).catch(err => messageTip("登录失败"));
      }
    });
  },
  onShow: function () {
    if (app.userInfo) {
      this.setData({
        userPhoto: app.userInfo.userPhoto,
        nickName: app.userInfo.nickName,
        id: app.userInfo._id
      });
    }
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