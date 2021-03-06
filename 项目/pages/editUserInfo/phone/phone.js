const db = wx.cloud.database();
const app = getApp().globalData;
const { messageTip, navBack } = require("../../../utils/util");
Page({
  data: {
    phone: ""
  },
  handleText(e) {
    this.setData({
      phone: e.detail.value
    });
  },
  handleClick() {
    this.updatePhone();
  },
  updatePhone() {
    app.userInfo.phone = this.data.phone;
    wx.showLoading({
      title: "更新中...",
    });
    db.collection("users").doc(app.userInfo._id).update({
      data: {
        phoneNumber: this.data.phone
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
  onLoad: function (options) {},
  onReady: function () {
    this.setData({
      phone: app.userInfo.phoneNumber
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