Component({
  options: {
    styleIsolation: "apply-shared"
  },
  properties: {
    phoneNumber: String,
    icon: String,
    weixin: String
  },
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    handleClick() {
      if (this.data.phoneNumber) {
        wx.makePhoneCall({
          phoneNumber: this.data.phoneNumber,
          fail: err => {
            return;
          }
        });
      }else if(this.data.weixin){
        wx.setClipboardData({
          data: this.data.weixin
        });
      }
    }
  }
});