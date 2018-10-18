import request from '@/utils/request'

export function dictionaryList(data) {
  return request({
    url: '/common/dictionaryList?codeType=' + data,
    method: 'post'
  })
}

// 查询商品所有
export function listGood(data) {
  return request({
    url: '/service/goodsxg/listGoodxg',
    method: 'post',
    data
  })
}

//查询商品条件
export function listGoodContion(data) {
  return request({
    url: '/service/goodsxg/listGoodContionxg',
    method: 'post',
    data
  })
}

//删除商品
 export function deleteGoods(data) {
  return request({
    url: '/service/goodsxg/deleteGoodsxg',
    method: 'post',
    data
  })
}

//根据id查询员工信息
export function selectGoodsById(data) {
  return request({
    url: '/service/goodsxg/selectGoodsByIdxg?id='+data,
    method: 'post',
  })
}

//修改员工信息
export function updateGoods(data) {
  return request({
    url: '/service/goodsxg/updateGoodsxg',
    method: 'post',
    data
  })
}
//增加员工信息
export function addGoods(data) {
  return request({
    url: '/service/goodsxg/addGoodsxg',
    method: 'post',
    data
  })
}