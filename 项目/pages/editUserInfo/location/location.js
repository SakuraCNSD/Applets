const app = getApp().globalData;
const db = wx.cloud.database();
const { messageTip, navBack } = require("../../../utils/util");
Page({
  data: {
    isLocation: true
  },
  switchChange(e) {
    const result = e.detail.value;
    this.setData({
      isLocation: result
    });
    app.userInfo.isLocation = result;
    db.collection("users").doc(app.userInfo._id).update({
      data: {
        isLocation: this.data.isLocation
      }
    }).then(res => {
      navBack(300);
    }).catch(() => {
      messageTip("关闭定位失败");
    });
  },
  onLoad: function (options) {},
  onReady: function () {
    this.setData({
      isLocation: app.userInfo.isLocation
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