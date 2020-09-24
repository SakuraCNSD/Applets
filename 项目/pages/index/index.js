const db = wx.cloud.database();
const app = getApp().globalData;
const {
  messageTip,
  sort,
  serveUpdate
} = require("../../utils/util");
Page({
  data: {
    imgUrls: [],
    listData: [],
    current: "links"
  },
  handleClick(e) {
    const current = e.currentTarget.dataset.current;
    if (current === this.data.current) return;
    this.setData({
      current
    }, () => {
      this.getListData();
    });
  },
  handleLink(e) {
    if (!app.userInfo) {
      messageTip("登录后在点赞", res => {
        wx.switchTab({
          url: "../user/user",
        });
      });
      return;
    }
    const _id = e.currentTarget.dataset.id
    serveUpdate("update", {
      collection: "users",
      doc: _id,
      links: true,
      data: {}
    }).then(res => {
      if (app.userInfo && res.errMsg.indexOf("ok") !== -1) {
        db.collection("users").doc(_id).get().then(res => {
          let result = this.data.listData.map(item => {
            if (item._id === _id) {
              item = {
                ...item,
                links: res.data.links
              }
            }
            return item;
          });
          result = sort(result, "links", "desc");
          this.setData({
            listData: result
          });
        }).catch(err => {
          messageTip();
        });
      }
    }).catch(err => {
      console.log(err);
      messageTip("点赞失败");
    });
  },
  getListData() {
    db.collection("users").field({
      userPhoto: true,
      nickName: true,
      links: true,
      _id: true
    }).orderBy(this.data.current, "desc").get().then(res => {
      this.setData({
        listData: res.data
      });
    }).catch(err => {
      messageTip();
    });
  },
  handleDetail(e) {
    const id = e.currentTarget.dataset.id;
    if (app.userInfo) {
      wx.navigateTo({
        url: "../detail/detail?id=" + id,
      });
    } else {
      messageTip("请登录,点击确定跳转到登录页", res => {
        if (res.confirm) {
          wx.switchTab({
            url: "../user/user",
          });
        }
      });
    }
  },
  getBannerList(){
    db.collection("banner").get().then(res => {
      this.setData({
        imgUrls: res.data
      });
    }).catch(err => messageTip());
  },
  onLoad: function (options) {},
  onReady: function () {
    this.getListData();
  },
  onShow: function () {
    this.getListData();
    this.getBannerList();
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