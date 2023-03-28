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
          <el-form-item label="集群名称" prop="k8sName">
            <el-input
              :disabled="form.id ? true : false"
              v-model="form.k8sName"
              placeholder="集群名称"
              maxlength="120"
              show-word-limit />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="集群编码" prop="k8sCode">
            <el-input
              :disabled="form.id ? true : false"
              v-model="form.k8sCode"
              placeholder="集群编码"
              maxlength="120"
              show-word-limit />
          </el-form-item>
        </el-col>

        


        <el-col :span="12">
          <el-form-item label="envCode" prop="envCode">
            <el-select v-model="form.envCode" class="m-2" placeholder="请选择环境" >
              <el-option
                v-for="item in dictionaryList"
                :key="item.value"
                :label="item.label +'(' + item.value +')'"
                :value="item.value"
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

import { saveK8SConfigApi } from '@/api/k8s'

export default defineComponent({
  emits: ['refresh'],
  setup(_props, { emit }) {
    const { dictionaryList, getDictionary } = useDictionary()
    const refForm = ref()
    const refCascader = ref()
    const data = reactive({
      loading: false,
      visible: false,
      form: {
        id: null,
        confId: null,
        envCode: '',
        k8sName: '',
        k8sCode: ''
      }
    })

    const rules = computed(() => {
      return {
        envCode: [
          { required: true, message: '请选择环境编码', trigger: 'blur' }
        ],
        k8sName: [
          { required: true, message: '请填写集群名称', trigger: 'blur' }
        ],
        k8sCode: [
          { required: true, message: '请填写集群编码', trigger: 'blur' }
        ]
      }
    })

    

    const loadRole = async () => {
      
    }

    const loadApp = async () => {
      
    }

    const loadUser = async () => {
      
    }

    const init = async (row) => {
      data.visible = true
      data.loading = true
      if(row){
        data.form = row
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
          const r = await saveK8SConfigApi(params)
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
      getDictionary('EnvEnums')
      
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
