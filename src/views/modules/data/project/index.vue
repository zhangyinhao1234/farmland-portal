
<template>
    <Container>
      <template #header>
        <el-form ref="refForm" :inline="true" @keyup.enter="reacquireHandle()">
          <el-form-item>
            <el-input v-model="form.name" placeholder="名称" clearable />
          </el-form-item>

          <el-form-item>
            <el-input v-model="form.pcode" placeholder="编码" clearable />
          </el-form-item>

          
  
          <el-form-item>
            <el-button v-repeat @click="reacquireHandle()">搜索</el-button>
            <el-button v-repeat @click="clearJson(form), reacquireHandle()">重置</el-button>
            <el-button v-permission="'data:project:create'" type="primary" @click="addEditHandle()">新增</el-button>
            
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
            label="名称"
            prop="name" />
  
          <el-table-column
            align="center"
            label="编码"
            prop="pcode" />

          <el-table-column
            align="center"
            label="花名"
            prop="nick" />
          
          <el-table-column
            align="center"
            label="项目描述"
            prop="description" />
          
          <el-table-column
            align="center"
            label="TO"
            prop="TO" >
            <template v-slot="{ row }">
              {{ row.toUser? row.toUser.userName:'' }}
            </template>
          </el-table-column>
          

          <el-table-column
            align="center"
            label="QO"
            prop="QO">
            <template v-slot="{ row }">
              {{ row.qoUser? row.qoUser.userName:'' }}
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="PO"
            prop="PO" >
            <template v-slot="{ row }">
              {{ row.poUser? row.poUser.userName:'' }}
            </template>
          </el-table-column>

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
              v-permission="'data:project:update'"
              type="primary"
              link
              @click="addEditHandle(row)">编辑</el-button>
              
              
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
  
  import { queryProjectMainDataApi } from '@/api/pcode'
  
  
  
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
          name: '',
          pcode: '',
        },
        list: [],
        selection: []
      })
  
      const administratorId = computed(() => store.state.administrator.administrator.id)
  
      const getList = () => {
        const params = {
          name: data.form.name,
          pcode: data.form.pcode,
          current: page.current,
          size: page.size
        }
        data.loading = true
        queryProjectMainDataApi(params).then(r => {
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
  
      const deleteHandle = (id) => {
        
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
  