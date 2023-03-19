<!--
 * @Description:
 * @Author: gumingchen
 * @Email: 1240235512@qq.com
 * @Date: 2022-04-25 16:50:13
 * @LastEditors: gumingchen
 * @LastEditTime: 2023-02-24 08:54:08
-->
<template>
  <Container>
    <template #header>
      <el-form ref="refForm" :inline="true" @keyup.enter="reacquireHandle()">
        <el-form-item>
          <el-input v-model="form.userName" placeholder="用户名/昵称" clearable />
        </el-form-item>

        <el-form-item>
          <el-button v-repeat @click="reacquireHandle()">搜索</el-button>
          <el-button v-repeat @click="clearJson(form), reacquireHandle()">重置</el-button>
          <el-button v-permission="'system:administrator:create'" type="primary" @click="addEditHandle()">新增</el-button>
          <!-- <el-button v-permission="'administrator:export'" type="primary" @click="exportHandle()">导出</el-button> -->
          
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
        <el-table-column align="center" type="selection" width="50" />
        <el-table-column
          align="center"
          label="ID"
          prop="id"
          width="80" />
        
        <el-table-column
          align="center"
          label="工号"
          prop="userId" />

        <el-table-column
          align="center"
          label="用户名"
          prop="userName" />
        
        
        <el-table-column
          align="center"
          label="电子邮箱"
          prop="email" />
        
        
        
        <el-table-column
          align="center"
          label="是否启用"
          prop="status"
          width="100">
          <template v-slot="{ row }">
            <el-switch
              v-permission="'administrator:status'"
              @change="statusHandle(row)"
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              :disabled="row.id === administratorId" />
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
              v-permission="'system:administrator:update'"
              type="primary"
              link
              @click="addEditHandle(row)">编辑</el-button>
            <el-button
              v-permission="'system:administrator:delete'"
              type="danger"
              link
              @click="deleteHandle(row.userId)">删除</el-button>
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

import { pageApi, deleteApi, setStatusApi, exportApi } from '@/api/administrator'

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
        userName: ''
      },
      list: [],
      selection: []
    })

    const administratorId = computed(() => store.state.administrator.administrator.id)

    const getList = () => {
      const params = {
        userName: data.form.userName,
        current: page.current,
        size: page.size
      }
      data.loading = true
      pageApi(params).then(r => {
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
      const ids = id ? [id] : data.selection.map(item => item.userId)
      ElMessageBox.confirm(`确定对[id=${ ids.join(',') }]进行[${ id ? '删除' : '批量删除' }]操作?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteApi({ userId: id }).then(r => {
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
      // const params = {
      //   key: row.id,
      //   value: row.status
      // }
      // setStatusApi(params).then(r => {
      //   if (r) {
      //     ElMessage({
      //       message: '操作成功!',
      //       type: 'success'
      //     })
      //   } else {
      //     row.status = row.status === 1 ? 0 : 1
      //   }
      // })
    }

    const exportHandle = () => {
      const params = {
        name: data.form.userName
      }
      exportApi(params)
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
