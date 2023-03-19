
import service from '@/utils/request'
import { download } from '@/utils'


export function allAcodeSimpleInfoApi(params) {
  return service({
    url: '/meta/app/querySimple',
    method: 'post',
    data: params
  })
}


