
<template>
    <Container>
      <template #header>
        <el-form ref="refForm" :inline="true" @keyup.enter="reacquireHandle()">
          <el-form-item>
            <el-input v-model="form.k8sCode" placeholder="K8S集群编码" clearable />
          </el-form-item>

          <el-form-item>
            <el-button v-repeat @click="reacquireHandle()">搜索</el-button>
            <el-button v-repeat @click="clearJson(form), reacquireHandle()">重置</el-button>
            <el-button v-permission="'development:jenkins:create'" type="primary" @click="addEditHandle()">新增</el-button>
            
          </el-form-item>
        </el-form>
      </template>
      <template #default>
        <el-table
          ref="refTable"
          v-loading="loading"
          :data="list"
          @selection-change="selectionHandle"
          border>
          
          <el-table-column
            align="center"
            label="ID"
            prop="id"
            width="80" />
          
          <el-table-column
            align="center"
            label="构建方式"
            prop="buildType" />
  
          <el-table-column
            align="center"
            label="开发语言"
            prop="devLanguage" />

          <el-table-column
            align="center"
            label="部署方式"
            prop="deployType" />
            
          <el-table-column
            align="center"
            label="模板编码"
            prop="templateCode" />


          <el-table-column
            align="center"
            label="K8S集群编码"
            prop="k8sCode" />

          <el-table-column
            align="center"
            label="创建时间"
            prop="createTime"
            width="160" />
          
          <el-table-column
            align="center"
            label="操作"
            width="110"
            fixed="right">
            <template v-slot="{ row }">
              
              <el-button
                v-permission="'development:jenkins:delete'"
                type="danger"
                link
                @click="deleteHandle(row.id,row.confId)">删除</el-button>
          
            </template>
          </el-table-column>
        </el-table>
        <AddEdit ref="refAddEdit" v-if="visible" @refresh="getList" />
      </template>
      <template #footer>
        <Page :page="page" @change="pageChangeHandle" />
      </template>
    </Container>
  </template>
  
  <script>
  import { computed, defineComponent, nextTick, onBeforeMount, reactive, ref, toRefs } from 'vue'
  import { useStore } from 'vuex'
  
  import { ElMessage, ElMessageBox } from 'element-plus'
  import AddEdit from './components/add-edit.vue'
  
  import usePage from '@/mixins/page'
  import useDictionary from '@/mixins/dictionary'
  import { clearJson, parseDate2Str } from '@/utils'
  
  import { queryBuildTemplateConfigApi,delBuildTemplateConfigApi } from '@/api/jenkins'
  
  
  
  export default defineComponent({
    components: { AddEdit },
    setup() {
      const store = useStore()
  
      const refForm = ref()
      const refTable = ref()
      const refAddEdit = ref()
  
      const { page } = usePage()
      const { getDictionary } = useDictionary()
      const data = reactive({
        loading: false,
        visible: false,
        form: {
          k8sName: ''
        },
        list: [],
        selection: []
      })
  
      const administratorId = computed(() => store.state.administrator.administrator.id)
  
      const getList = () => {
        const params = {
          k8sName: data.form.k8sName,
          current: page.current,
          size: page.size
        }
        data.loading = true
        queryBuildTemplateConfigApi(params).then(r => {
          if (r) {
            data.list = r.data.list
            page.total = r.data.total
          }
          nextTick(() => { data.loading = false })
        })
      }
  
      const reacquireHandle = () => {
        page.current = 1
        getList()
      }
  
      const addEditHandle = (row) => {
        data.visible = true
        nextTick(() => {
          refAddEdit.value.init(row)
        })
      }
  
      const deleteHandle = (id,confId) => {
        const ids = id ? [id] : data.selection.map(item => item.id)
        ElMessageBox.confirm(`确定对[id=${ ids.join(',') }]进行[${ id ? '删除' : '批量删除' }]操作?`, '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delBuildTemplateConfigApi({ confId: confId }).then(r => {
            if (r) {
              ElMessage({
                message: '操作成功!',
                type: 'success'
              })
              getList()
            }
          })
        }).catch(() => {
          // to do something on canceled
        })
      }
  
      const statusHandle = (row) => {
        
      }
  
      const exportHandle = () => {
       
      }
  
      const selectionHandle = (val) => {
        data.selection = val
      }
  
      const pageChangeHandle = (argPage) => {
        page.current = argPage.current
        page.size = argPage.size
        getList()
      }
  
      onBeforeMount(() => {
        
        getList()
      })
  
      return {
        refForm,
        refTable,
        refAddEdit,
        page,
        ...toRefs(data),
        administratorId,
        getList,
        pageChangeHandle,
        reacquireHandle,
        addEditHandle,
        deleteHandle,
        statusHandle,
        exportHandle,
        selectionHandle,
        clearJson
      }
    }
  })
  </script>
  
  <style lang="scss" scoped>
  .el-tag + .el-tag {
    margin-left: 5px;
  }
  </style>
  