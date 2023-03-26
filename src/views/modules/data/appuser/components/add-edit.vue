<template>
  <el-dialog
    width="600px"
    :title="form.id ? '编辑' : '新增'"
    v-model="visible"
    :close-on-click-modal="false"
    @closed="dialogClosedHandle"
    append-to-body
    draggable
    destroy-on-close>
    <el-form
      v-loading="loading"
      :model="form"
      :rules="rules"
      ref="refForm"
      @keyup.enter="submit()"
      label-position="top">



      <el-row :gutter="20">
        
        <el-col :span="12">
          <el-form-item label="用户" prop="userId">
            <el-select v-model="form.userId" class="m-2" placeholder="请选择用户" >
              <el-option
                v-for="item in allUser"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
              />
            </el-select>
          </el-form-item>
        </el-col>

      

        <el-col :span="12">
          <el-form-item label="服务" prop="acode">
            <el-select v-model="form.acode" class="m-2" placeholder="请选择服务" >
              <el-option
                v-for="item in allApp"
                :key="item.acode"
                :label="item.acode"
                :value="item.acode"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="角色" prop="roleCode">
            <el-select v-model="form.roleCode" class="m-2" placeholder="请选择角色" >
              <el-option
                v-for="item in allRole"
                :key="item.roleCode"
                :label="item.roleName"
                :value="item.roleCode"
              />
            </el-select>
          </el-form-item>
        </el-col>

      </el-row>
      
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button
          v-repeat
          type="primary"
          @click="submit()">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { computed, defineComponent, nextTick, onBeforeMount, reactive, ref, toRefs } from 'vue'

import { ElMessage } from 'element-plus'

import useDictionary from '@/mixins/dictionary'
import { isUsername, isPassword, isEmail } from '@/utils/regular'
import { pageApi,  userRoleSaveApi } from '@/api/administrator'
import { rolePageApi } from '@/api/role'
import { allAcodeSimpleInfoApi } from '@/api/acode'

export default defineComponent({
  emits: ['refresh'],
  setup(_props, { emit }) {
    const { dictionaryList, getDictionary } = useDictionary()
    const refForm = ref()
    const refCascader = ref()
    const data = reactive({
      loading: false,
      visible: false,
      departments: [],
      form: {
        id: null,
        userId: '',
        acode: '',
        roleCode: ''
      },
      roles: [],
      allUser:[],
      allApp:[],
      allRole:[]
    })

    const rules = computed(() => {
      return {
        userId: [
          { required: true, message: '请选择人员', trigger: 'blur' }
        ],
        acode: [
          { required: true, message: '请选择服务', trigger: 'blur' }
        ],
        roleCode: [
          { required: true, message: '请选择角色', trigger: 'blur' }
        ]
      }
    })

    

    const loadRole = async () => {
      const params = {
        current: 1,
        size: 9999
      }
      rolePageApi(params).then(r => {
        if (r) {
          data.allRole = r.data.list
        }
        
      })
    }

    const loadApp = async () => {
      const params = {
        current: 1,
        size: 9999
      }
      allAcodeSimpleInfoApi(params).then(r => {
        if (r) {
          data.allApp = r.data
        }
        
      })
    }

    const loadUser = async () => {
      const params = {
        current: 1,
        size: 9999
      }
      pageApi(params).then(r => {
        if (r) {
          data.allUser = r.data.list
        }
        
      })
    }

    const init = async (app) => {
      data.visible = true
      data.loading = true
      if(app){
        data.form.acode = app.acode
      }else{
        data.form = {}
      }
      nextTick(() => { data.loading = false })
    }

    /**
     * @description: 表单验证提交
     * @param {*}
     * @return {*}
     * @author: gumingchen
     */
    const submit = () => {
      refForm.value.validate(async valid => {
        if (valid) {
          const params = { ...data.form }
          const r = await userRoleSaveApi(params)
          if (r) {
            data.visible = false
            ElMessage({
              message: '操作成功!',
              type: 'success'
            })
            emit('refresh')
          }
        }
      })
    }

    onBeforeMount(() => {
      loadApp()
      loadUser()
      loadRole()
      
    })

    /**
     * @description: 弹窗关闭动画结束时的回调
     * @param {*}
     * @return {*}
     * @author: gumingchen
     */
    const dialogClosedHandle = () => {
      refForm.value.resetFields()
    }

    return {
      refForm,
      refCascader,
      dictionaryList,
      ...toRefs(data),
      rules,
      init,
      submit,
      dialogClosedHandle,
      loadApp,
      loadUser,
      loadRole
    }
  }
})
</script>
