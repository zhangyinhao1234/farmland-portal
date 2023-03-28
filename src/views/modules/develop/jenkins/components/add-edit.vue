<template>
  <el-dialog
    width="400px"
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



      

        <el-col :span="40">
          <el-form-item label="构建方式" prop="buildType">
            <el-select v-model="form.buildType" class="m-2" placeholder="请选择构建方式" >
              <el-option
                v-for="item in buildTypeList.list"
                :key="item.value"
                :label="item.label +'(' + item.value +')'"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>


        <el-col :span="40">
          <el-form-item label="开发语言" prop="devLanguage">
            <el-select v-model="form.devLanguage" class="m-2" placeholder="请选择开发语言" >
              <el-option
                v-for="item in devLanguageList.list"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="40">
          <el-form-item label="部署方式" prop="deployType">
            <el-select v-model="form.deployType" class="m-2" placeholder="请选择部署方式" >
              <el-option
                v-for="item in deployTypeList.list"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="40">
          <el-form-item label="K8S集群编码" prop="k8sCode">
            <el-select v-model="form.k8sCode" class="m-2" placeholder="请选择K8S集群编码" >
              <el-option
                v-for="item in k8sCodeList"
                :key="item.k8sCode"
                :label="item.k8sCode + '(' + item.k8sName + ')' "
                :value="item.k8sCode"
              />
            </el-select>
          </el-form-item>
        </el-col>




        
        <el-col :span="40">
          <el-form-item label="模板编码" prop="templateCode">
            <el-input
              :disabled="form.id ? true : false"
              v-model="form.templateCode"
              placeholder="模板编码"
              maxlength="120"
              show-word-limit />
          </el-form-item>
        </el-col>

     
      
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

import { queryK8SConfigApi } from '@/api/k8s'
import { saveBuildTemplateConfigApi } from '@/api/jenkins'

export default defineComponent({
  emits: ['refresh'],
  setup(_props, { emit }) {
    const { getDictionary } = useDictionary()
    const refForm = ref()
    const refCascader = ref()
    const data = reactive({
      loading: false,
      visible: false,
      form: {
        id: null,
        confId: null,
        buildType: '',
        devLanguage: '',
        deployType: '',
        templateCode: '',
        k8sCode: ''
      },
      buildTypeList:{ map: {}, list: [] },
      devLanguageList:{ map: {}, list: [] },
      deployTypeList:{ map: {}, list: [] },
      k8sCodeList:[]

    })

    const rules = computed(() => {
      return {
        buildType: [
          { required: true, message: '请选择构建方式', trigger: 'blur' }
        ],
        devLanguage: [
          { required: true, message: '请选择开发语言', trigger: 'blur' }
        ],
        deployType: [
          { required: true, message: '请选择部署方式', trigger: 'blur' }
        ],
        k8sCode: [
          { required: true, message: '请选择K8S集群编码', trigger: 'blur' }
        ],
        templateCode: [
          { required: true, message: '请填写模板编码', trigger: 'blur' }
        ]
      }
    })

    

    const loadRole = async () => {
      
    }

    const loadApp = async () => {
      
    }

    const loadUser = async () => {
      
    }

    const loadK8SCode = async () => {
      const params = {
        current: 1,
        size: 9999
      }
      queryK8SConfigApi(params).then(r => {
        if (r) {
          data.k8sCodeList = r.data.list
        }
        
      })
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
          const r = await saveBuildTemplateConfigApi(params)
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

    onBeforeMount(async () => {
      loadApp()
      loadUser()
      loadK8SCode()
      data.buildTypeList = await getDictionary('BuildTypeEnums')
      data.devLanguageList = await getDictionary('DevLanguageEnums')
      data.deployTypeList = await getDictionary('DeployTypeEnums')

      
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
      ...toRefs(data),
      rules,
      init,
      submit,
      dialogClosedHandle,
      loadApp,
      loadUser,
      loadRole,
      loadK8SCode
    }
  }
})
</script>
