// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // 接收参数
  const {
    key
  } = event;
  return db.collection('user').where({
    nickName: db.RegExp({
      regexp: key,
      options: 'i',
    })
  }).get()
  .then(res=>{
    console.log("搜索返回",res);
    return{
      code:200,
      data:res.data
    }
  })
  .catch(err=>{
    console.error("搜索失败",err);
    return{
      code:201,
      errMsg:err.errMsg
    }
  })
}