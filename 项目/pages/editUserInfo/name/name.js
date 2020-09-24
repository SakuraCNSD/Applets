const app = getApp().globalData;
const db = wx.cloud.database();
const { messageTip, navBack } = require("../../../utils/util");
Page({
  data: {
    name: ""
  },
  handleText(e) {
    this.setData({
      name: e.detail.value
    });
  },
  handleClick() {
    this.updateNickName();
  },
  updateNickName() {
    app.userInfo.nickName = this.data.name;
    wx.showLoading({
      title: "更新中...",
    });
    db.collection("users").doc(app.userInfo._id).update({
      data: {
        nickName: this.data.name
      }
    }).then(res => {
      wx.hideLoading();
      wx.showToast({
        title: "更新成功",
      });
      navBack(1500);
    }).catch(err => {
      wx.hideLoading();
      messageTip("更新失败");
    });
  },
  bindUserInfo(e) {
    const result = e.detail.userInfo.nickName
    if (result) {
      this.setData({
        name: e.detail.userInfo.nickName
      });
      this.updateNickName();
    }
  },
  onLoad: function (options) {},
  onReady: function () {
    this.setData({
      name: app.userInfo.nickName
    });
  },

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

  }
})