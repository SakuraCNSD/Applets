const app = getApp().globalData;
const db = wx.cloud.database();
const {
  messageTip
} = require("../../utils/util");
const _ = db.command;
Page({
  data: {
    longitude: "",
    latitude: "",
    markers: []
  },
  markertap(e){
    wx.navigateTo({
      url: "../detail/detail?id=" + e.markerId,
    });
  },
  getLocation() {
    wx.getLocation({
      type: "gcj02",
      success: res => {
        const latitude = res.latitude
        const longitude = res.longitude
        this.setData({
          longitude,
          latitude
        });
        this.getNearUsers();
      }
    });
  },
  getNearUsers() {
    db.collection("users").where({
      location: _.geoNear({
        geometry: db.Geo.Point(this.data.longitude, this.data.latitude),
        minDistance: 0,
        maxDistance: 5000
      }),
      isLocation: true
    }).field({
      longitude: true,
      latitude: true,
      userPhoto: true
    }).get().then(res => {
      let data = res.data;
      let result = [];
      if (!data.length) return;
      for (let i = 0; i < data.length; i++) {
        if (data[i].userPhoto.includes("cloud://")) {
          wx.cloud.getTempFileURL({
            fileList: [data[i].userPhoto],
            success: res => {
              result.push({
                iconPath: res.fileList[0].tempFileURL,
                id: data[i]._id,
                latitude: data[i].latitude,
                longitude: data[i].longitude,
                width: 30,
                height: 30
              });
              this.setData({
                markers: result
              });
            },
            fail: err => messageTip()
          });
        } else {
          result.push({
            iconPath: data[i].userPhoto,
            id: data[i]._id,
            latitude: data[i].latitude,
            longitude: data[i].longitude,
            width: 30,
            height: 30
          });
        }
      }
      this.setData({
        markers: result
      });
    }).catch(err => {
      console.log(err);
      messageTip()
    });
  },
  onLoad: function (options) {},
  onReady: function () {},
  onShow: function () {
    if (!app.userInfo) {
      messageTip("请先登录", res => {
        wx.switchTab({
          url: "../user/user",
        });
      });
    } else {
      this.getLocation();
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