
import service from '@/utils/request'
import { download } from '@/utils'






export function queryBuildTemplateConfigApi(params) {
  return service({
    url: '/build/template/page',
    method: 'post',
    data: params
  })
}

export function saveBuildTemplateConfigApi(params) {
  return service({
    url: '/build/template/save',
    method: 'post',
    data: params
  })
}

export function delBuildTemplateConfigApi(params) {
  return service({
    url: '/build/template/del',
    method: 'post',
    data: params
  })
}