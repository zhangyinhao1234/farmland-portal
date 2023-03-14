<template>
  <div class="login-container flex-box flex_a_i-center flex_j_c-center">
    <el-card class="width-500">
      <el-form
        ref="refForm"
        :model="form"
        :rules="rules"
        @keyup.enter="submit()">
        <el-tabs v-model="form.type" @tab-change="tabChangeHandle">
          <el-tab-pane
            v-for="item in dictionaryList"
            :key="item.value"
            :label="item.label"
            :name="item.value" />
        </el-tabs>
        <el-form-item prop="username">
          <el-input v-model="form.userId" :placeholder="type" clearable>
            <template #prefix>
              <Iconfont name="user" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.pwd"
            placeholder="密码"
            show-password
            clearable>
            <template #prefix>
              <Iconfont name="lock" />
            </template>
          </el-input>
        </el-form-item>
        <el-button
          v-repeat
          :loading="loading"
          class="margin_t-20 width-full"
          type="primary"
          @click="submit()">登录</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { computed, defineComponent, nextTick, onBeforeMount, reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { ElNotification } from 'element-plus'

import useDictionary from '@/mixins/dictionary'


export default defineComponent({
  setup() {
    const router = useRouter()
    const store = useStore()

    const { dictionaryList, getDictionary } = useDictionary()

    const refForm = ref()
    const refHappYear = ref()
    const data = reactive({
      loading: false,
      form: {
        userId: '',
        pwd: '',
        type: 1 // 登录方式：1-账号 2-手机号 3-邮箱
      }
    })

    const type = computed({
      get: () => {
        const types = ['', '账号', '手机号', '邮箱']
        return types[data.form.type]
      }
    })

    const rules = computed(function() {
      return {
        userId: [{ required: true, message: `${ type.value }不能为空`, trigger: 'blur' }],
        pwd: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    })



    /**
     * @description: 标签页变化事件
     * @param {*}
     * @return {*}
     * @author: gumingchen
     */
    const tabChangeHandle = () => {
      setTimeout(() => {
        refForm.value.clearValidate() // resetField
      }, 0)
    }

    /**
     * @description: 登录表单提交
     * @param {*}
     * @return {*}
     * @author: gumingchen
     */
    const submit = () => {
      refForm.value.validate(valid => {
        if (valid) {
          data.loading = true
          store.dispatch('administrator/login', data.form).then(r => {
            if (r) {
              router.push({ name: 'redirect', replace: true })
            } else {
              nextTick(() => {
                data.loading = false
              })
            }
          })
        }
      })
    }

   
    onBeforeMount(() => {
      getDictionary('LogInTypeEnums')
    })

    return {
      refForm,
      refHappYear,
      dictionaryList,
      ...toRefs(data),
      type,
      rules,
      tabChangeHandle,
      submit
    }
  }
})
</script>

<style lang="scss">
.login-container {
  input:focus + .el-input__prefix {
    color: var(--el-color-primary);
  }
}
</style>

<style lang="scss">
.login-notify {
  width: 400px;
  .login-notify-content {
    position: relative;
    .tip {
      position: absolute;
      top: -30px;
      left: 40px;
      color: var(--el-color-warning);
    }
    & > div {
      p {
        // font-weight: 700;
        color: var(--el-color-primary);
      }
      b {
        text-indent: 2em;
      }
    }
    p > b {
      color: var(--el-color-danger);
    }
  }
}
</style>
