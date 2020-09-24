// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    if (event.links) {
      event.data.links = _.inc(1);
      return await db.collection(event.collection).doc(event.doc).update({
        data: {
          ...event.data
        }
      });
    } else {
      if(event.data.friendList){
        event.data.friendList =  _.push([event.data.friendList])
      }
      return await db.collection(event.collection).where({
        ...event.where
      }).update({
        data: {
          ...event.data
        }
      });
    }
  } catch (e) {
    console.error(e);
  }
}