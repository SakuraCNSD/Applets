const app = getApp().globalData;
const {
  messageTip,
  getServeData
} = require("../../utils/util");
Page({
  data: {
    userMessage: [],
    isHidden: true
  },
  onMyEvent(e) {
    this.setData({
      userMessage: e.detail
    });
  },
  onLoad: function (options) {},
  onReady: function () {
    if (!app.userInfo) {
      messageTip("请先登录", res => {
        wx.switchTab({
          url: "../user/user",
        });
      });
    } else {
      this.setData({
        isHidden: false,
        userMessage: app.userMessage
      });
    }
  },
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {
    getServeData({
      collection: "message",
      where: {
        userId: app.userInfo._id
      }
    }).then(res => {
      wx.stopPullDownRefresh();
      this.setData({
        userMessage: res.data.length > 0 ? res.data[0].list : []
      });
    }).catch(err => messageTip());
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