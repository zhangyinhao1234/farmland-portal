
import service from '@/utils/request'
import { download } from '@/utils'


export function allAcodeSimpleInfoApi(params) {
  return service({
    url: '/meta/app/querySimple',
    method: 'post',
    data: params
  })
}



export function queryAppMainDataApi(params) {
  return service({
    url: '/meta/app/page',
    method: 'post',
    data: params
  })
}

export function saveAppMainDataApi(params) {
  return service({
    url: '/meta/app/save',
    method: 'post',
    data: params
  })
}