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
          <el-form-item label="工号" prop="userId">
            <el-input
              v-model="form.userId"
              placeholder="工号"
              maxlength="50"
              show-word-limit />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="用户名" prop="userName">
            <el-input
              v-model="form.userName"
              placeholder="用户名"
              maxlength="20"
              show-word-limit />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="form.email"
              placeholder="邮箱"
              maxlength="50"
              show-word-limit />
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


import { infoApi, addApi,editApi } from '@/api/administrator'

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
        userName: '',
        email: ''
      },
      roles: []
    })

    const rules = computed(() => {
      const checkUsername = (_rule, value, callback) => {
        if (!isUsername(value)) {
          callback(new Error('用户名由4-16位的数字、字母、中横线、下划线组成'))
        } else {
          callback()
        }
      }
      const checkPassword = (_rule, value, callback) => {
        if (data.form.id && !isPassword(value)) {
          callback(new Error('用户名由8-16位的数字、字母、中横线、下划线组成'))
        } else if (!data.form.id && !isPassword(value)) {
          callback(new Error('用户名由8-16位的数字、字母、中横线、下划线组成'))
        } else {
          callback()
        }
      }
      const checkConfirmPassword = (_rule, value, callback) => {
        
          callback()
        
      }
      const checkMobile = (_rule, value, callback) => {
        
          callback()
        
      }
      const checkEmail = (_rule, value, callback) => {
        if (data.form.email !== '' && !isEmail(value)) {
          callback(new Error('请输入正确的邮箱'))
        } else {
          callback()
        }
      }
      return {
        userId: [
          { required: true, message: '请输入工号', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入帐号', trigger: 'blur' }
        ],
        email: [
        { required: true, message: '邮箱不能为空', trigger: 'blur' }
          // { validator: checkEmail, trigger: 'blur' }
        ]
      }
    })

    const cascaderProps = computed(() => {
      const reuslt = {
        checkStrictly: true,
        value: 'id',
        label: `name`,
        children: 'children'
      }
      return reuslt
    })

    const getRole = async () => {
      
    }

    const getDepartment = async () => {
      
    }

    const init = async (row) => {
      data.visible = true
      data.loading = true
      

      if (row) {
        data.form.id = row.id
        data.form.userId = row.userId
        data.form.userName = row.userName
        data.form.email = row.email 
      }else{
        data.form.id = null
        data.form.userId = ''
        data.form.userName = ''
        data.form.email = ''
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
          const params = [{ ...data.form }]
          const r = data.form.id ? await editApi(params) : await addApi(params)
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
      cascaderProps,
      init,
      submit,
      dialogClosedHandle
    }
  }
})
</script>
