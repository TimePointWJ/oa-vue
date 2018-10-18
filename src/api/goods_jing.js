import request from '@/utils/request'

//查询员工信息列表
export function findGoods(data) {
    return request({
      url: '/service/goods_jing/pagination',
      method: 'post',
      data
    })
}

//删除商品信息
export function deleteGoods(data) {
  return request({
    url: '/service/goods_jing/deleteGoods',
    method: 'post',
    data
  })
}

//添加商品
export function addGoods(data) {
  return request({
    url: '/service/goods_jing/addGoods',
    method: 'post',
    data
  })
}

//修改商品
export function updateGoods(data) {
  return request({
    url: '/service/goods_jing/updateGoods',
    method: 'post',
    data
  })
}

export function selectGoodsById(data){
  return request({
    url: '/service/goods_jing/selectGoodsById?id='+data,
    method: 'post',
  })
}
