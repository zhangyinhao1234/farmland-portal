
<template>
    <Container>
      <template #header>
        <el-form ref="refForm" :inline="true" @keyup.enter="reacquireHandle()">
          <el-form-item>
            <el-input v-model="form.name" placeholder="名称" clearable />
          </el-form-item>

          <el-form-item>
            <el-input v-model="form.acode" placeholder="编码" clearable />
          </el-form-item>

          
  
          <el-form-item>
            <el-button v-repeat @click="reacquireHandle()">搜索</el-button>
            <el-button v-repeat @click="clearJson(form), reacquireHandle()">重置</el-button>
            <el-button v-permission="'data:app:create'" type="primary" @click="addEditHandle()">新增</el-button>
            
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
            label="项目编码"
            prop="pcode" />

          <el-table-column
            align="center"
            label="服务编码"
            prop="acode" />

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
              v-permission="'data:app:update'"
              type="primary"
              link
              @click="addEditHandle(row)">编辑</el-button>

              <el-button
              v-permission="'data:appuser:create'"
              type="primary"
              link
              @click="addUserHandle(row)">添加成员</el-button>

              <el-button
              v-permission="'data:appuser:page'"
              type="primary"
              link
              @click="showUserHandle(row)">查看成员</el-button>

            </template>
          </el-table-column>
        </el-table>
        <AddEdit ref="refAddEdit" v-if="visible" @refresh="getList" />
        <AddUserEdit ref="refAddUserEdit" v-if="visible" @refresh="getList" />
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
  import AddUserEdit from '../appuser/components/add-edit.vue'
  
  import usePage from '@/mixins/page'
  import useDictionary from '@/mixins/dictionary'
  import { clearJson, parseDate2Str } from '@/utils'
  import router from '@/router'
  import { useRoute, useRouter } from "vue-router"
  import { queryAppMainDataApi } from '@/api/acode'
  
  
  
  export default defineComponent({
    components: { AddEdit,AddUserEdit },
    setup() {
      const store = useStore()
  
      const refForm = ref()
      const refTable = ref()
      const refAddEdit = ref()
      const refAddUserEdit = ref()
  
      const { page } = usePage()
      const { getDictionary } = useDictionary()
      const data = reactive({
        loading: false,
        visible: false,
        form: {
          name: '',
          acode: '',
        },
        list: [],
        selection: []
      })
  
      const administratorId = computed(() => store.state.administrator.administrator.id)
  
      const getList = () => {
        const params = {
          name: data.form.name,
          acode: data.form.acode,
          current: page.current,
          size: page.size
        }
        data.loading = true
        queryAppMainDataApi(params).then(r => {
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

      const addUserHandle = (row) => {
        data.visible = true
        nextTick(() => {
          refAddUserEdit.value.init(row)
        })
      }

      //
      const showUserHandle = (row) => {
        data.visible = true
        nextTick(() => {
          
          //router.push({path:'/data/appuser',query:{data:row}})

          //const router = useRouter()
          router.push({
              path: '/data/appuser',
              query: {
                data: row
              }
          })
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
        refAddUserEdit,
        page,
        ...toRefs(data),
        administratorId,
        getList,
        pageChangeHandle,
        reacquireHandle,
        addEditHandle,
        addUserHandle,
        showUserHandle,
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
  