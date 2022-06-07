<template>
  <el-dialog
    :modal="true"
    :title="config.title"
    :visible.sync="showDialog"
    @before-close="handleCancel"
  >
    <div>
      <el-form
        :label-width="config.labelWidth || '80px'"
        :model="formData"
        :rules="config.rules"
        ref="form"
      >
        <el-form-item
          :key="idx"
          :label="item.label"
          :prop="item.prop"
          v-for="(item, idx) in config.formList"
        >
          <el-input v-if="item.type === 'text'" v-model="formData[item.prop]" :disabled="true"></el-input>
          <el-input v-else-if="item.type === 'input'" v-model="formData[item.prop]" :show-password="item.isPwd"></el-input>
          <el-select
            filterable
            placeholder="请选择"
            style="width:100%;"
            v-else-if="item.type ==='select'"
            v-model="formData[item.prop]"
          >
            <el-option
              :key="list[item.data.id]"
              :label="list[item.data.name]"
              :value="list[item.data.id]"
              v-for="list in item.data.list"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <slot></slot>
    </div>
    <div class="dialog-footer" slot="footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button @click="handleConfirm" type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    config: {
      type: Object,
      default() {
        return {}
      }
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      initFormData: {}
    }
  },
  computed: {
    showDialog: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit('update:show', val);
        this.$emit('cancel');
        this.clearForm();
      }
    },
    formData: {
      get() {
        return this.config.formData;
      },
      set(val) {
        this.config.formData = val;
      }
    }
  },
  methods: {
    handleCancel() {
      this.showDialog = false;
    },
    handleConfirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('confirm', this.formData);
        } else {
          return false;
        }
      })
    },
    clearForm() {
      this.formData = Object.assign({}, this.initFormData);
      this.$refs.form.clearValidate();
    }
  }
}
</script>
