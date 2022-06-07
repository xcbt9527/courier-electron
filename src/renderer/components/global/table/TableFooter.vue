<template>
  <el-pagination
    :current-page="page.currentPage"
    :page-size="page.pageNo"
    :page-sizes="[10, 30, 100, 200,500,1000]"
    :total="page.pageTotal"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
    layout="total, sizes, prev, pager, next, jumper"
    style="margin: -10px;"
  ></el-pagination>
</template>

<script>
export default {
  props: {
    page: {
      type: Object
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('change', {
        current: this.current,
        size: val,
        total: this.total
      })
    },
    handleCurrentChange(val) {
      this.$emit('change', {
        current: val,
        size: this.size,
        total: this.total
      })
    }
  }
}
</script>
