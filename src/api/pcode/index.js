
import service from '@/utils/request'
import { download } from '@/utils'


export function queryProjectMainDataApi(params) {
  return service({
    url: '/meta/project/page',
    method: 'post',
    data: params
  })
}

export function saveProjectMainDataApi(params) {
  return service({
    url: '/meta/project/save',
    method: 'post',
    data: params
  })
}


export function queryProjectSummaryApi(params) {
  return service({
    url: 'meta/project/summary',
    method: 'post',
    data: params
  })
}