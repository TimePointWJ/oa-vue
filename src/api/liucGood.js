import request from '@/utils/request'

//查询商品信息列表
export function pagination(data) {
  return request({
    url: '/service/liucGoods/findAllGoods',
    method: 'post',
    data
  })
}

//添加商品
export function addGoods(data) {
  return request({
    url: '/service/liucGoods/addGoods',
    method: 'post',
    data
  })
}
//修改商品信息
export function updateGoods(data) {
  return request({
    url: '/service/liucGoods/updateGoods',
    method: 'post',
    data
  })
}
//删除商品信息
export function deleteGoods(data) {
  return request({
    url: '/service/liucGoods/deleteGoods',
    method: 'post',
    data
  })
}
//根据id查询商品信息
export function selectGoodsById(data) {
  return request({
    url: '/service/liucGoods/selectGoodsById?id='+data,
    method: 'post',
  })
}