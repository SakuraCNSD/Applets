//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error("请使用2.3.3或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        traceUser: true,
        env: "yunkaifa-i639t"
      });
    }
  },
  globalData: {
    userInfo: null,
    userMessage: null
  }
});