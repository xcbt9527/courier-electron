<template>
  <el-dialog :before-close="handleClose" :title="title" :visible.sync="value" fullscreen>
    <el-tabs v-model="activeName">
      <el-tab-pane name="first">
        <span slot="label">
          <el-tag type="success">正常共{{successData.data.length}}条数据</el-tag>
        </span>
        <el-button
          :loading="successLoading"
          @click="importStart(1)"
          style="margin-bottom:10px;text-align:right;"
          type="primary"
          v-if="successData.data.length>0"
        >开始导入正常数据</el-button>
        <el-progress
          :color="progressColor"
          :percentage="successPercentage"
          :stroke-width="20"
          :text-inside="true"
          class="progress-loading"
          v-show="successLoading"
        ></el-progress>
        <TableMain :config="successData" @Del="btnDelSuccess"></TableMain>
        <el-pagination
          :current-page.sync="successData.page.currentPage"
          :total="successData.data.length"
          background
          layout="prev, pager, next"
          style="margin-top:10px;text-align:right;"
          v-if="!successLoading"
        ></el-pagination>
      </el-tab-pane>
      <el-tab-pane name="second">
        <span slot="label">
          <el-tag type="danger">异常共{{errorData.data.length}}条数据</el-tag>
        </span>
        <el-button
          :loading="errorLoading"
          @click="errorDataFun"
          style="margin-bottom:10px;text-align:right;"
          type="warning"
          v-if="errorData.data.length>0"
        >导出异常数据</el-button>
        <el-progress
          :color="progressColor"
          :percentage="errorPercentage"
          :stroke-width="20"
          :text-inside="true"
          class="progress-loading"
          v-show="errorLoading"
        ></el-progress>
        <TableMain :config="errorData" @Del="btnDelError"></TableMain>
        <el-pagination
          :current-page.sync="errorData.page.currentPage"
          :total="errorData.data.length"
          background
          layout="prev, pager, next"
          style="margin-top:10px;text-align:right;"
          v-if="!errorLoading"
        ></el-pagination>
      </el-tab-pane>
    </el-tabs>
    <span class="dialog-footer" slot="footer">
      <el-button @click="handleClose" type="primary">关 闭</el-button>
    </span>
  </el-dialog>
</template>
<style>
.warp {
  position: relative;
}
.progress-loading {
  z-index: 99;
}
</style>
<script>
import util from "@/libs/util";
import TableMain from "@/components/global/table/TableMain";
import TableFooter from "@/components/global/table/TableFooter";
import { tableConfig, tableConfigError, action } from "./config";
import moment from "moment";
import {
  EventBus,
  SEND_IMPORT,
  SEND_IMPORT_SUCCESS,
  SEND_IMPORT_ERROR
} from "@/utils/EventBus";
export default {
  name: "settlementDetail",
  data() {
    return {
      activeName: "first",
      statusType: false,
      successLoading: false,
      errorLoading: false,
      successData: tableConfig,
      errorPercentage: 0,
      successPercentage: 0,
      total: 0,
      progressColor: [
        { color: "#f56c6c", percentage: 0 },
        { color: "#e6a23c", percentage: 30 },
        { color: "#5cb87a", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#6f7ad3", percentage: 100 }
      ],
      errorData: tableConfigError
    };
  },
  watch: {},
  computed: {
    title() {
      return `导入数据,共${this.successData.data.length +
        this.errorData.data.length}条数据`;
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  components: {
    TableMain,
    TableFooter
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    errorDataFun() {
      const file = [];
      this.errorData.data.forEach(item => {
        item.remark = item.remark.replace(/<div style="color:#f00;">/g, "");
        item.remark = item.remark.replace(/<\/div>/g, "");
        file.push([
          String(item.orderId),
          item.address,
          item.kilogram,
          item.time,
          item.userName,
          item.companyName,
          item.remark
        ]);
      });
      this.$api("utilApi/exportFile", {
        name: `寄件运费异常数据${moment(new Date()).format(
          "YYYY年MM月DD日 HH时mm分ss秒"
        )}`,
        list: [
          ["单号", "目的地", "重量", "时间", "客户名", "承运公司", "异常情况"],
          ...file
        ]
      }).then(res => {
        if (res.code === 1000) {
          this.$notify.success({
            title: "成功",
            message: "导出成功"
          });
        }
        this.errorData.data = [];
        if (this.successData.data.length === 0) {
          this.$emit("input", false);
          setTimeout(() => {
            this.$notify.success({
              title: "寄件模版",
              message: `已为您导入全部数据共${this.total}条数据`
            });
          }, 1000);
        }
      });
    },
    handleClose(done) {
      this.$confirm("确认关闭？后续的数据将不再导入，是否确认？").then(_ => {
        this.statusType = false;
        this.$emit("input", false);
      });
    },
    /**
     * 开始导入
     */
    importStart(status) {
      this.statusType = true;
      const data = {
        arr: [],
        length: 0
      };
      if (status === 1) {
        this.successLoading = true;
        this.successData.action = [];
        data.arr = this.successData.data.map(item => {
          return item;
        });
        data.dataLength = data.arr.length;
      } else {
        this.errorLoading = true;
        this.errorData.action = [];
        data.arr = this.errorData.data.map(item => {
          return item;
        });
        data.dataLength = data.arr.length;
      }
      this.insertList(data, status);
    },
    btnDelSuccess(row, idx) {
      const rowIndex =
        (this.successData.page.currentPage - 1) *
          this.successData.page.pageSize +
        idx;
      this.successData.data.splice(rowIndex, 1);
    },
    btnDelError(row, idx) {
      const rowIndex =
        (this.errorData.page.currentPage - 1) * this.errorData.page.pageSize +
        idx;
      this.errorData.data.splice(rowIndex, 1);
    },
    /**
     * 批量导入
     */
    insertList(data, type, num = 100) {
      let insertData = [];
      /**
       * 获取数组
       */
      if (type === 1) {
        insertData = this.successData.data.filter((item, index) => {
          return index < num;
        });
      } else {
        insertData = this.errorData.data.filter((item, index) => {
          return index < num;
        });
      }
      if (!this.value) {
        return;
      }
      this.$api("utilApi/insertList", insertData).then(res => {
        if (type === 1) {
          this.successData.data.splice(0, num);
          const dataLength = this.successData.data.length;
          if (dataLength > 0) {
            const parameter = data.dataLength - dataLength;
            this.successPercentage = Math.round(
              (parameter / data.dataLength) * 100
            );
            let number = num;
            if (dataLength < num) {
              number = dataLength;
            }
            this.insertList(data, type, number);
          } else {
            this.successPercentage = 100;
            this.errorLoading = false;
            this.$notify.success({
              title: "成功",
              message: `已成功为您导入共计正常数据${data.dataLength}条数据`
            });
            setTimeout(() => {
              this.$notify.success({
                title: "寄件模版",
                message: `已为您导入全部数据共${this.total}条数据`
              });
            }, 1000);
            if (this.errorData.data.length === 0) {
              this.$emit("input", false);
              setTimeout(() => {
                this.$notify.success({
                  title: "寄件模版",
                  message: `已为您导入全部数据共${this.total}条数据`
                });
              }, 1000);
            }
          }
        } else {
          this.errorData.data.splice(0, num);
          const dataLength = this.errorData.data.length;
          if (dataLength > 0) {
            const parameter = data.dataLength - dataLength;
            this.errorPercentage = Math.round(
              (parameter / data.dataLength) * 100
            );
            let number = num;
            if (dataLength < num) {
              number = dataLength;
            }
            this.insertList(data, type, number);
          } else {
            this.errorPercentage = 100;
            this.errorLoading = false;
            this.$notify.success({
              title: "成功",
              message: `已成功为您导入共计异常数据${data.dataLength}条数据`
            });
            if (this.successData.data.length === 0) {
              this.$emit("input", false);
              setTimeout(() => {
                this.$notify.success({
                  title: "寄件模版",
                  message: `已为您导入全部数据共${this.total}条数据`
                });
              }, 1000);
            }
          }
        }
      });
    },
    init() {
      /**
       * 第一次监听
       */
      EventBus.$on(SEND_IMPORT, arr => {
        this.successLoading = false;
        this.errorLoading = false;
        this.total = arr.successData.length + arr.errorData.length;
        /**
         * 成功
         */
        this.successData.data = arr.successData.map(item => {
          item.hideEvent = [];
          return item;
        });
        this.successData.page.pageTotal = arr.successData.length;
        this.successData.options.loading = false;
        /**
         * 异常数据
         */
        this.errorData.data = arr.errorData.map(item => {
          item.hideEvent = [];
          return item;
        });
        this.errorData.page.pageTotal = arr.errorData.length;
        this.errorData.options.loading = false;
      });
    }
  }
};
</script>
