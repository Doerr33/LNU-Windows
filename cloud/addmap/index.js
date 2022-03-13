// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database().collection("Location")
// 云函数入口函数

exports.main = async (event, context) => {
  const{
    id,
    Location,
    classify,
    school,
    latitude,
    longitude,
    address,
    callout,
  } = event;
  const wxContext = cloud.getWXContext();
  return db.add({
    data: {
      // id最后设置成数组形式
      id:id,
      // 气泡名
      Location:Location,
      // 分类
      classify: classify,
      // 校区
      school:school,
      // 经纬度
      latitude:latitude,
      longitude:longitude,
      // 地址备用
      address:address,
      iconPath:"../../images/mini-location.png",
      height:30,
      width:30,
      callout:callout
    },
    success(res) {
      return{
        code:200,
        errMsg:"添加成功"
      }
    },
    fail(res) {
      return{
        code:300,
        errMsg:"添加失败"
      }
    }
  })
}