const db = wx.cloud.database();
const app = getApp().globalData;
const {
  checkObj,
  messageTip,
  serveUpdate,
  getServeData
} = require("../../utils/util");
Page({
  data: {
    detail: {},
    // 0发送添加好友申请,-1可以添加好友,1已是好友
    isFriend: -1,
    _id: "",
    isFirst: true
  },
  handleClick(e) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({
      urls: [url]
    });
  },
  handleAddFriend() {
    db.collection("message").where({
      userId: this.data.detail._id
    }).get().then(res => {
      if (res.data.length) {
        //获取到申请的好友列表，但是没有目标值，需要添加
        if (!res.data[0].list.includes(app.userInfo._id)) {
          serveUpdate("update", {
            collection: "message",
            data: {
              list: [...res.data[0].list, app.userInfo._id]
            },
            where: {
              userId: this.data.detail._id
            }
          }).then(res => {
            wx.showToast({
              title: "申请成功"
            });
            this.setData({
              isFriend: 0
            });
          }).catch(err => messageTip("添加好友申请失败"));
        }
      } else {
        db.collection("message").add({
          data: {
            userId: this.data.detail._id,
            list: [app.userInfo._id]
          }
        }).then(res => {
          wx.showToast({
            title: "申请成功"
          });
          this.setData({
            isFriend: 0
          });
        }).catch(err => messageTip("添加好友失败"));
      }
    }).catch(err => messageTip());
  },
  getUserList() {
    if (this.data.detail._id === app.userInfo._id) return;
    getServeData({
      collection: "message",
      where: {
        userId: this.data.detail._id
      }
    }).then(res => {
      if (res.data.length > 0 && res.data[0].list.includes(app.userInfo._id)) {
        this.setData({
          isFriend: 0
        });
      }
    }).catch(err => messageTip());
    getServeData({
      collection: "users",
      where: {
        _id: this.data.detail._id
      }
    }).then(res => {
      if(res.data.length > 0 && res.data[0].friendList.includes(app.userInfo._id)){
        this.setData({
          isFriend: 1
        });
      }
    }).catch(err => messageTip(err));
  },
  onLoad: function (options) {
    const id = options.id;
    this.setData({
      _id: app.userInfo._id
    });
    db.collection("users").doc(id).get().then(res => {
      this.setData({
        detail: checkObj(res.data),
        isFirst: false
      });
      this.getUserList();
    }).catch(err => messageTip());
  },
  onReady: function () {},
  onShow: function () {
    if (!this.data.isFirst) {
      this.getUserList();
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