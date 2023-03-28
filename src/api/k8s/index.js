
import service from '@/utils/request'
import { download } from '@/utils'






export function queryK8SConfigApi(params) {
  return service({
    url: '/k8s/conf/page',
    method: 'post',
    data: params
  })
}

export function saveK8SConfigApi(params) {
  return service({
    url: '/k8s/conf/save',
    method: 'post',
    data: params
  })
}

export function delK8SConfigApi(params) {
  return service({
    url: '/k8s/conf/del',
    method: 'post',
    data: params
  })
}