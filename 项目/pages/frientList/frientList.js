const app = getApp().globalData;
const {
  getServeData,
  messageTip
} = require("../../utils/util");
Page({
  data: {
    friendList: [],
    isShow: false
  },
  onLoad: function (options) {},
  onReady: function () {},
  onShow: function () {
    getServeData({
      collection: "users",
      where: {
        friendList: app.userInfo._id
      }
    }).then(res => {
      if(res.data.length > 0){
        this.setData({
          friendList: res.data,
        });
      }
      this.setData({
        isShow: true
      });
    }).catch(err => messageTip());
  },
  onHide: function () {},

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