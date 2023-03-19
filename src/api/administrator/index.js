/*
 * @Description: 管理员
 * @Author: gumingchen
 * @Email: 1240235512@qq.com
 * @Date: 2020-12-28 16:25:18
 * @LastEditors: gumingchen
 * @LastEditTime: 2021-05-20 15:47:56
 */
import service from '@/utils/request'
import { download } from '@/utils'

/**
 * @description: 获取当前管理员
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function selfInfoApi() {
  return service({
    url: '/user/selfInfo',
    method: 'post'
  })
}



/**
 * @description: 编辑密码
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function editPasswordApi(params) {
  return service({
    url: `/meta/user/pwd`,
    method: 'post',
    data: params
  })
}

/**
 * @description: 超级管理员获取当前企业下的所有管理员 否则 获取当前管理员创建的管理员
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function pageApi(params) {
  return service({
    url: '/meta/user/page',
    method: 'post',
    data: params
  })
}

/**
 * @description: 信息
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function infoApi(params) {
  
}

/**
 * @description: 新增
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function addApi(params) {
  return service({
    url: `/meta/user/save`,
    method: 'post',
    data: params
  })
}

/**
 * @description: 编辑
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function editApi(params) {
  return service({
    url: `/meta/user/update`,
    method: 'post',
    data: params
  })
}
/**
 * @description: 编辑基础信息
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function editBasicApi(params) {
  return service({
    url: `/admin/administrator/update/basic`,
    method: 'post',
    data: params
  })
}


/**
 * @description: 删除
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function deleteApi(params) {
  return service({
    url: `/meta/user/del`,
    method: 'post',
    data: params
  })
}

/**
 * @description: 设置是否启用
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function setStatusApi(params) {
  return service({
    url: `/admin/administrator/status`,
    method: 'post',
    data: params
  })
}

/**
 * @description: 导出
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export async function exportApi(params) {
  const r = await service({
    url: '/admin/administrator/export',
    method: 'get',
    responseType: 'blob',
    data: params
  })
  if (r) {
    const { blob, name } = r
    download(blob, name)
  }
}


/**
 * @description: 用户服务角色绑定信息查询
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function userRolePageApi(params) {
  return service({
    url: `/meta/user/app/role/page`,
    method: 'post',
    data: params
  })
}

/**
 * @description: 用户服务角色绑定信息保存
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function userRoleSaveApi(params) {
  return service({
    url: `/meta/user/app/role/save`,
    method: 'post',
    data: params
  })
}

/**
 * @description: 用户服务角色绑定信息删除
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function userRoleDelApi(params) {
  return service({
    url: `/meta/user/app/role/del`,
    method: 'post',
    data: params
  })
}





// todo:------------------------------------------------------------------------------------

/**
 * @description: 获取企业下所有的管理员
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function globalPageApi(params) {
  return service({
    url: '/admin/administrator/global/page',
    method: 'get',
    params: params
  })
}

/**
 * @description: 信息
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function globalInfoApi(params) {
  return service({
    url: `/admin/administrator/global/info/${ params }`,
    method: 'get'
  })
}

/**
 * @description: 新增
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function globalAddApi(params) {
  return service({
    url: `/admin/administrator/global/create`,
    method: 'post',
    data: params
  })
}

/**
 * @description: 编辑
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function globalEditApi(params) {
  return service({
    url: `/admin/administrator/global/update`,
    method: 'post',
    data: params
  })
}

/**
 * @description: 删除
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function globalDeleteApi(params) {
  return service({
    url: `/admin/administrator/global/delete`,
    method: 'post',
    data: params
  })
}

/**
 * @description: 设置是否启用
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function globalSetStatusApi(params) {
  return service({
    url: `/admin/administrator/global/status`,
    method: 'post',
    data: params
  })
}
