<template>
  <div>
    <el-table
      :border="config.options.border"
      :data="tableData"
      @selection-change="handleSelectionChange"
      style="width: 100%;"
      v-loading="config.options.loading ? config.options.loading : false"
    >
      <el-table-column type="selection" v-if="config.options.hasSelection" width="55"></el-table-column>
      <el-table-column
        :align="config.options.align"
        :key="colIdx"
        :label="colItem.title"
        :prop="colItem.key"
        v-for="(colItem, colIdx) in config.columns"
      >
        <template slot-scope="scope">
          <span v-if="colItem.type === 'text'" v-text="scope.row[colItem.key]"></span>
          <div v-html="scope.row[colItem.key]" v-if="colItem.type === 'html'"></div>
          <span v-else-if="colItem.type === 'img'">
            <img :src="scope.row[colItem.key]" style="width: 100%" />
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" v-if="config.action">
        <template slot-scope="scope">
          <el-button
            :key="btnIdx"
            :type="btnItem.type"
            @click="btnEvent(btnItem, scope.row, scope.$index)"
            fixed="right"
            v-for="(btnItem, btnIdx) in config.action"
            v-show="!scope.row.hideEvent.includes(btnItem.event)"
            v-text="btnItem.title"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    config: {
      type: Object
    }
  },
  methods: {
    btnEvent(item, row, idx) {
      this.$emit(`${item.event}`, row, idx)
    },
    /**
     * 选中数据
     */
    handleSelectionChange(val) {
      this.$emit('selection', val)
    }
  },
  computed: {
    tableData() {
      return this.config.data.slice(
        (this.config.page.currentPage - 1) * this.config.page.pageSize,
        this.config.page.currentPage * this.config.page.pageSize
      )
    }
  }
}
</script>
