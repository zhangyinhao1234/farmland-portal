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
          <el-form-item label="名称" prop="name">
            <el-input
              :disabled="form.id ? true : false"
              v-model="form.name"
              placeholder="名称"
              maxlength="120"
              show-word-limit />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="编码" prop="pcode">
            <el-input
              :disabled="form.id ? true : false"
              v-model="form.pcode"
              placeholder="编码"
              maxlength="120"
              show-word-limit />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="花名" prop="nick">
            <el-input
              :disabled="form.id ? true : false"
              v-model="form.nick"
              placeholder="花名"
              maxlength="120"
              show-word-limit />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="项目描述" prop="description">
            <el-input
              v-model="form.description"
              placeholder="项目描述"
              maxlength="200"
              show-word-limit />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="PO" prop="poUserId">
            <el-select v-model="form.poUserId" class="m-2" placeholder="请选择用户" >
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
          <el-form-item label="TO" prop="toUserId">
            <el-select v-model="form.toUserId" class="m-2" placeholder="请选择用户" >
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
          <el-form-item label="QO" prop="qoUserId">
            <el-select v-model="form.qoUserId" class="m-2" placeholder="请选择用户" >
              <el-option
                v-for="item in allUser"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
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
import { pageApi } from '@/api/administrator'
import { saveProjectMainDataApi } from '@/api/pcode'

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
        name: '',
        pcode: '',
        nick: '',
        description:'',
        toUserId:'',
        qoUserId:'',
        poUserId:''
      },
      allUser:[]
    })

    const rules = computed(() => {
      return {
        name: [
          { required: true, message: '请填写名称', trigger: 'blur' }
        ],
        pcode: [
          { required: true, message: '请填写编码', trigger: 'blur' }
        ],
        nick: [
          { required: true, message: '请填写昵称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请填写描述', trigger: 'blur' }
        ],
        toUserId: [
          { required: true, message: '请选择TO', trigger: 'blur' }
        ],
        qoUserId: [
          { required: true, message: '请选择QO', trigger: 'blur' }
        ],
        poUserId: [
          { required: true, message: '请选择PO', trigger: 'blur' }
        ]
      }
    })

    

    const loadRole = async () => {
      
    }

    const loadApp = async () => {
      
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

    const init = async (row) => {
      data.visible = true
      data.loading = true
      if(row){
        data.form = row
        data.form.toUserId = row.toUser?row.toUser.userId:''
        data.form.poUserId = row.poUser?row.poUser.userId:''
        data.form.qoUserId = row.qoUser?row.qoUser.userId:''
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
          const r = await saveProjectMainDataApi(params)
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
