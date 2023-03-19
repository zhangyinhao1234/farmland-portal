<template>
  <el-dialog
    width="450px"
    :title="form.id ? '编辑' : '新增'"
    v-model="visible"
    :close-on-click-modal="false"
    @closed="dialogClosedHandle"
    append-to-body
    draggable>
    <el-form
      v-loading="loading"
      :model="form"
      :rules="rules"
      ref="refForm"
      @keyup.enter="submit()"
      label-position="top">
      <el-form-item label="角色名称" prop="name">
        <el-input
          v-model="form.name"
          placeholder="角色名称"
          maxlength="20"
          show-word-limit />
      </el-form-item>
      <el-form-item label="角色名称" prop="roleCode">
        <el-input
          v-model="form.roleCode"
          placeholder="角色编码"
          maxlength="20"
          show-word-limit />
      </el-form-item>
      <el-form-item label="权限" prop="menuIds">
        <el-cascader
          class="width-full"
          ref="refCascader"
          v-model="form.menuIds"
          :options="menus"
          :props="cascaderProps"
          :show-all-levels="false"
          collapse-tags
          collapse-tags-tooltip
          clearable />
      </el-form-item>
      
    
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

import { metaResTreeApi } from '@/api/enterprise-menu'
import { infoApi, addApi, editApi } from '@/api/role'

export default defineComponent({
  emits: ['refresh'],
  setup(_props, { emit }) {
    const refForm = ref()
    const refCascader = ref()
    const refPermissionCascader = ref()

    const { dictionaryList, getDictionary } = useDictionary()
    const data = reactive({
      loading: false,
      visible: false,
      departments: [],
      form: {
        id: null,
        name: '',
        roleCode:'',
        permission: 0,
        custom: [],
        menuIds: []
      },
      menus: []
    })

    const rules = reactive(function() {
      const checkCustom = (_rule, value, callback) => {
        // if (data.form.permission === 4 && (value.length < 1)) {
        //   callback(new Error('请选择自定义数据权限'))
        // } else {
        //   callback()
        // }
      }
      return {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleCode: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
        custom: [{ validator: checkCustom, trigger: 'change' }],
        enterprise_menu_ids: [{ type: 'array', required: true, message: '请选择权限', trigger: 'blur' }]
      }
    }())

    const cascaderProps = computed(() => {
      const reuslt = {
        multiple: true,
        emitPath: false,
        checkStrictly: false,
        value: 'id',
        label: `name_cn`,
        children: 'children'
      }
      return reuslt
    })
    const permissionCascaderProps = computed(() => {
      const reuslt = {
        multiple: true,
        checkStrictly: true,
        value: 'id',
        label: `name`,
        children: 'children'
      }
      return reuslt
    })

    const getEnterpriseMenu = async () => {
      const r = await metaResTreeApi()
      if (r) {
        const list = [{
          id: 0,
          name_cn: '一级菜单',
          name_en: 'First level menu',
          parent_id: 0,
          children: r.data
        }]
        data.menus = list
      }
    }

    const getDepartment = async () => {
      // const r = await departmentSelectApi({ status: 1 })
      // if (r) {
      //   data.departments = r.data
      // }
    }

    const init = async (id) => {
      data.visible = true
      data.loading = true
      data.form.id = id.id

      await getEnterpriseMenu()
      if (id.id) {
        const r = await infoApi(id)
        if (r) {
          data.form.name = r.data.name
          data.form.roleCode = r.data.roleCode
          data.form.permission = r.data.permission
          // data.form.custom = r.data.custom ? r.data.custom.split(';').map(item => +item) : []
          data.form.menuIds = r.data.resIds
        }
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
          // 处理已选 菜单 权限
          const checkedNodes = refCascader.value.getCheckedNodes(true)
          const enterpriseMenuIds = []
          checkedNodes.forEach(item => {
            enterpriseMenuIds.push.apply(enterpriseMenuIds, item.pathValues)
          })
          params.menuIds = Array.from(new Set(enterpriseMenuIds)).filter(item => item !== 0)
          if (params.permission === 4) {
            // const departmentCheckedNodes = refPermissionCascader.value.getCheckedNodes()
            // params.custom = departmentCheckedNodes.map(item => item.value).join(';')
          } else {
            params.custom = ''
          }
          const r = await addApi(params)
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
      //getDictionary('dataPermission')
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
      refPermissionCascader,
      dictionaryList,
      ...toRefs(data),
      rules,
      cascaderProps,
      permissionCascaderProps,
      init,
      submit,
      dialogClosedHandle
    }
  }
})
</script>
