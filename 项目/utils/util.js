const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const messageTip = (content = "获取数据失败", success = function(){}, title, showCancel = false) => {
  wx.showModal({
    title: !title ? "提示": title,
    content,
    showCancel,
    success
  });
}

const navBack = (durationTime) => {
  setTimeout(() => {
    wx.navigateBack({
      delta: 1
    });
  }, durationTime);
}
// order:asc升序,desc降序
const sort = (data = [], field, order) => {
  if (data) {
    if (order === "asc") {
      data.sort((item1, item2) => item1[field] - item2[field]);
    } else {
      data.sort((item1, item2) => item2[field] - item1[field]);
    }
  }
  return data;
}

const checkObj = (Obj) => {
  for (const key in Obj) {
    if(!Obj[key]){
      Obj[key] = "未设置";
    }
  }
  return Obj;
}

const serveUpdate = (method, data) => {
  return wx.cloud.callFunction({
    name: method,
    data: {...data}
  });
}

const db = wx.cloud.database();

const getServeData = ({collection, where}) => {
  return db.collection(collection).where(where).get();
}

module.exports = {
  formatTime: formatTime,
  messageTip,
  navBack,
  sort,
  checkObj,
  serveUpdate,
  getServeData
}