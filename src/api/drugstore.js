import request from '@/utils/request'

//查询商品信息列表
export function pagination(data) {
  return request({
    url: '/service/lin_goods/pagination',
    method: 'post',
    data
  })
}
//添加商品(员工自己注册)
export function insertStaff(data) {
  return request({
    url: '/service/lin_goods/insertStaff',
    method: 'post',
    data
  })
}
//添加员工(管理员直接添加)
export function addGoods(data) {
  return request({
    url: '/service/lin_goods/addGoods',
    method: 'post',
    data
  })
}
//修改商品信息
export function updateGoods(data) {
  return request({
    url: '/service/lin_goods/updateGoods',
    method: 'post',
    data
  })
}
//删除商品信息
export function deleteGoods(data) {
  return request({
    url: '/service/lin_goods/deleteGoods',
    method: 'post',
    data
  })
}
//根据id查询商品信息
export function selectGoodsById(data) {
  return request({
    url: '/service/lin_goods/selectGoodsById?id='+data,
    method: 'post',
  })
}
//修改员工密码
// export function updateUserPwd(data) {
//   return request({
//     url: '/service/lin_goods/updateUserPwd',
//     method: 'post',
//     data
//   })
// }
//查询商品类型
export function getStaffByPositionId(data) {
  return request({
    url: '/service/lin_goods/getStaffByPositionId?positionId='+data,
    method: 'post',
  })
}
//查询商品
export function selectStaffByQuery(data) {
  return request({
    url: '/service/lin_goods/selectStaffByQuery',
    method: 'post',
    data
  })
}
