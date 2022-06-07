<template>
  <el-form
    :inline="true"
    :model="form"
    :rules="formConfig.rules"
    ref="form"
    size="mini"
    style="margin-bottom: -18px;"
  >
    <el-form-item
      :key="idx"
      :label="item.label"
      :prop="item.prop"
      class="form-item"
      v-for="(item, idx) in formConfig.formItem"
    >
      <el-select
        :placeholder="item.placeholder"
        clearable
        filterable
        v-if="item.type === 'select'"
        v-model="form[item.prop]"
      >
        <el-option
          :key="optIdx"
          :label="optItem.label"
          :value="optItem.value"
          v-for="(optItem, optIdx) in item.data"
        />
      </el-select>
      <el-input
        :placeholder="item.placeholder"
        :type="item.type"
        clearable
        v-else-if="item.type === 'input'"
        v-model.trim="form[item.prop]"
      ></el-input>
      <template v-else-if="item.type === 'input2'">
        <div class="flex-input">
          <el-input
            :placeholder="item.placeholder"
            class="input-width-min"
            clearable
            type="number"
            v-model.trim="form[item.prop]"
          />
          <span class="weight">~</span>
          <el-input
            :placeholder="item.data.placeholder"
            class="input-width-min"
            clearable
            type="number"
            v-model.trim="form[item.data.prop]"
          />
        </div>
      </template>
    </el-form-item>
    <el-form-item
      :class="acItem.className"
      :key="acItem.text"
      v-for="(acItem) in formConfig.action"
    >
      <el-button @click="handleEvnet($event,acItem.event)" type="primary">
        <d2-icon :name="acItem.icon" />
        {{acItem.text}}
        <notice
          :config="{content: acItem.content||'仅支持xlsx、xls格式的文档导入'}"
          v-if="acItem.isExport || acItem.text === '导入'"
        ></notice>
      </el-button>
    </el-form-item>
  </el-form>
</template>
<style>
.form-item {
  min-width: 150px;
}
.flex-input {
  display: flex;
}
.weight {
  display: inline-block;
  min-width: 50px;
  text-align: center;
}
</style>
<script>
import Notice from '@/components/global/common/notice'
export default {
  components: { Notice },
  props: {
    formConfig: {
      type: Object
    }
  },
  methods: {
    handleFormSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('submit', this.form)
        } else {
          this.$notify.error({
            title: '错误',
            message: this.formConfig.message
              ? this.formConfig.message
              : '搜索错误'
          })
          return false
        }
      })
    },
    handleEvnet(e, eventName) {
      this.$emit(`btn${eventName}`, e)
    }
  },
  computed: {
    form: {
      set(val) {
        console.log(val)
      },
      get() {
        return this.formConfig.formData
      }
    }
  }
}
</script>
