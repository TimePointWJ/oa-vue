import store from '@/store'

export function hasPermission(role) {
  if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
    store.dispatch('GetUserInfo').then(res => { // 拉取user_info
      return permission(role,res.data.responseData.role)
    })
  }else{
    return permission(role,store.getters.roles)
  }
}

function permission(role,backRoles){
  if(!backRoles) return true
  return backRoles.indexOf(role) >= 0
}
