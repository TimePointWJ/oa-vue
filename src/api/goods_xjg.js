import request from '@/utils/request'

//查询商品类别
export function goodsTypeList(data) {
  return request({
    url: '/service/goods/goodstypeList',
    method: 'post'
  })
}
// 查询商品状态
export function saleFlgList(data) {
  return request({
    url: '/service/goods/saleFlgList',
    method: 'post',
    data
  })
}
  // 查询商品信息
export function goodsList(data) {
    return request({
      url: '/service/goods/goodsList',
      method: 'post',
      data
    })
}
 // 查询商品信息
 export function pagination(data) {
    return request({
      url: '/service/goods/pagination',
      method: 'post',
      data
    })
}
//删除商品
export function deleteGoods(data){
  return request({
    url:'/service/goods/deleteGoods',
    method: 'post',
    data
  })
}
//添加商品
export function addGoods(data){
  return request({
    url:'/service/goods/addGoods',
    method: 'post',
    data
  })
}
//更新商品
export function updateGoods(data){
  return request({
    url:'/service/goods/updateGoods',
    method: 'post',
    data
  })
}