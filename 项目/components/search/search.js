const {
  messageTip
} = require("../../utils/util");
const db = wx.cloud.database();
Component({
  options: {
    styleIsolation: "apply-shared"
  },
  properties: {

  },
  data: {
    isFocus: true,
    historyList: [],
    isSearch: false,
    searchList: [],
    val: ""
  },
  methods: {
    handleFocus() {
      wx.getStorage({
        key: "searchHistory",
        success: res => {
          this.setData({
            historyList: res.data
          });
        }
      });
      this.setData({
        isFocus: false,
      });
    },
    handleCancle() {
      this.setData({
        isFocus: true,
        val: ""
      });
    },
    handleConfirm(e) {
      wx.getStorage({
        key: "searchHistory",
        success: res => {
          wx.setStorage({
            key: "searchHistory",
            data: [...new Set([e.detail.value, ...res.data])]
          });
        },
        fail: err => {
          wx.setStorage({
            key: "searchHistory",
            data: [e.detail.value]
          });
        }
      });
      this.changeSearchList(e.detail.value);
    },
    handleDelete() {
      if (this.data.historyList.length <= 0) return;
      messageTip("清空历史记录", res => {
        if (res.confirm) {
          wx.removeStorage({
            key: "searchHistory",
            success: res => {
              this.setData({
                historyList: []
              });
            }
          });
        }
      }, null, true);
    },
    changeSearchList(value){
      db.collection("users").where({
        nickName: db.RegExp({
          regexp: value,
          options: "i"
        })
      }).field({
        userPhoto: true,
        nickName: true
      }).get().then(res => {
        if(res.data.length){
          this.setData({
            searchList: res.data
          });
        }
      }).catch(err => messageTip());
    },
    handleHistoryItem(e){
      const val = e.currentTarget.dataset.item;
      this.setData({
        val
      });
      this.changeSearchList(val);
    },
    handleInput(e){
      if(e.detail.val === ""){
        this.setData({
          searchList: []
        });
      }
    }
  }
});