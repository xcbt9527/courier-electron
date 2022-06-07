<template>
  <el-popover
    :title="config.title || ''"
    :width="config.width || 200"
    placement="top-start"
    trigger="hover"
  >
    <div v-if="!config.content">
      <img
        src="https://static.easyicon.net/preview/118/1180012.gif"
        style="width: 30px;height: 30px"
      />
      <span>仅支持xlsx、xls格式的文件导入</span>
    </div>
    <div v-else v-html="config.content"></div>
    <i class="el-icon-warning-outline" slot="reference"></i>
  </el-popover>
</template>
<script>
export default {
  props: {
    config: {
      type: Object
    }
  }
}
</script>