const app = getApp().globalData;
const db = wx.cloud.database();
const { messageTip, navBack } = require("../../../utils/util");
Page({
  data: {
    userPhoto: ""
  },
  handleUploadImg() {
    wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      success: res => {
        const result = res.tempFilePaths[0];
        this.setData({
          userPhoto: result
        });
      }
    });
  },
  handleClick() {
    this.upLoadImg();
  },
  upLoadImg() {
    wx.showLoading({
      title: "上传中...",
    });
    wx.getImageInfo({
      src: this.data.userPhoto,
      success: res => {
        const cloudPath = app.userInfo._openid + Date.now() + "." + res.type;
        wx.cloud.uploadFile({
          cloudPath,
          filePath: res.path,
          success: res => {
            let fileID = res.fileID;
            if (fileID) {
              db.collection("users").doc(app.userInfo._id).update({
                data: {
                  userPhoto: fileID
                }
              }).then(res => {
                wx.hideLoading();
                wx.showToast({
                  title: "头像上传成功"
                });
                app.userInfo.userPhoto = fileID;
                navBack(1500);
              }).catch(err => {
                wx.hideLoading();
                messageTip("头像上传失败");
              });
            }
          },
          fail: err => {
            wx.hideLoading();
            messageTip("头像上传失败");
          }
        });
      }
    });
  },
  bindgetUserInfo(e){
    const result = e.detail.userInfo;
    if(result)
    this.setData({
      userPhoto: result.avatarUrl
    });
    this.upLoadImg();
  },
  onLoad: function (options) {},
  onReady: function () {
    this.setData({
      userPhoto: app.userInfo.userPhoto
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