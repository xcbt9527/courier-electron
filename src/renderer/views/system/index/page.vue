<template>
  <d2-container>
    <TableHead
      :formConfig="searchConfig"
      @btnAdd="handleAdd"
      @btnExport="handleExport"
      @btnExportChecked="btnExportChecked"
      @btnRefresh="getList"
      @btnSubmit="searchMethod"
      slot="header"
    ></TableHead>
    <TableMain
      :config="tableConfig"
      @detail="btnDetail"
      @Edit="btnEdit"
      @Export="UserExport"
      @selection="handleSelectionChange"
    ></TableMain>
    <m-dialog
      :config="config"
      :show.sync="visible"
      @confirm="handleConfirm"
      ref="dialog"
    >
      <span style="color:red"
        >* 正数金额代表向客户收取，负数金额代表支付给客户</span
      >
    </m-dialog>
    <el-dialog :modal="true" :visible="delVisible" title="详情" width="80%">
      <el-form :inline="true" :model="row" class="demo-form-inline">
        <el-form-item class="form-warp">
          <span slot="label">客户名称:</span>
          <span>{{ row.userName }}</span>
        </el-form-item>
        <el-form-item class="form-warp">
          <span slot="label">总收入:</span>
          <span>{{ row.free }}(元)</span>
        </el-form-item>
        <el-form-item class="form-warp">
          <span slot="label">寄件收入:</span>
          <span>{{ row.sendFree }}(元)</span>
        </el-form-item>
        <el-form-item class="form-warp">
          <span slot="label">杂费收入:</span>
          <span>{{ row.otherchargeFree }}(元)</span>
        </el-form-item>
      </el-form>
      <el-table :data="showRowList">
        <el-table-column label="来源">
          <template slot-scope="scope">
            <span>{{ scope.row.dbname === "send" ? "运费结算" : "杂费" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收入(元)">
          <template slot-scope="scope">
            <span>{{
              scope.row.dbname === "send" ? scope.row.free : scope.row.amount
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单号">
          <template slot-scope="scope">
            <span>{{ scope.row.orderId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="目的地">
          <template slot-scope="scope">
            <span>{{ scope.row.address }}</span>
          </template>
        </el-table-column>
        <el-table-column label="目的地">
          <template slot-scope="scope">
            <span>{{ scope.row.companyName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="重量(KG)">
          <template slot-scope="scope">
            <span>{{ scope.row.kilogram }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目信息">
          <template slot-scope="scope">
            <span>{{ scope.row.info }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <span>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="日期">
          <template slot-scope="scope">
            <span>{{ scope.row.time }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :page-size="5"
        :total="row.data.length"
        @current-change="handleCurrentChange"
        background
        layout="total, prev, pager, next"
        style="margin-top:10px;"
      ></el-pagination>
      <div class="dialog-footer" slot="footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button @click="handleDetail" type="primary">确 定</el-button>
      </div>
    </el-dialog>
    <TableFooter
      :page="tableConfig.page"
      @change="handlePaginationChange"
      slot="footer"
    ></TableFooter>
  </d2-container>
</template>

<script>
import TableHead from "@/components/global/table/TableHead";
import TableMain from "@/components/global/table/TableMain";
import TableFooter from "@/components/global/table/TableFooter";
import MDialog from "@/components/global/table/dialog";
import utilMinxin from "@/mixin/util";
import moment from "moment";
export default {
  components: {
    TableHead,
    TableFooter,
    TableMain,
    MDialog
  },
  created() {
    this.getList();
  },
  mixins: [utilMinxin],
  computed: {
    showRowList() {
      return this.row.data.slice((this.row.page - 1) * 5, this.row.page * 5);
    }
  },
  data() {
    return {
      selectionChange: [],
      row: {
        data: [],
        page: 1
      },
      searchConfig: {
        formItem: [
          {
            prop: "userName",
            type: "select",
            placeholder: "请输入客户名称",
            data: []
          }
        ],
        action: [
          {
            icon: "search",
            event: "Submit",
            text: "查询",
            className: ""
          },
          {
            icon: "arrow-circle-up",
            event: "Export",
            text: "合并导出",
            className: ""
          },
          {
            icon: "arrow-circle-up",
            event: "ExportChecked",
            text: "选择部分客户导出",
            className: ""
          },
          {
            icon: "refresh",
            event: "Refresh",
            text: "刷新",
            className: ""
          }
        ],
        formData: {
          userName: ""
        },
        rules: {
          search: [
            { required: true, message: "请输入搜索的名称", trigger: "blur" }
          ]
        }
      },
      tableConfig: {
        // 客户，总收入，寄件收入，杂费收入
        columns: [
          {
            title: "客户名称",
            key: "userName",
            type: "text"
          },
          {
            title: "总收入",
            key: "free",
            type: "text"
          },
          {
            title: "寄件收入",
            key: "sendFree",
            type: "text"
          },
          {
            title: "杂费收入",
            key: "otherchargeFree",
            type: "text"
          }
        ],
        options: {
          align: "center",
          border: true,
          loading: false,
          hasSelection: true,
          loadingOptions: {
            text: "拼命加载中",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.8)"
          }
        },
        data: [],
        action: [
          {
            event: "detail",
            type: "text",
            title: "详情"
          },
          {
            event: "Export",
            type: "text",
            title: "下载账单"
          }
        ],
        page: {
          currentPage: 1,
          pageSize: 10,
          pageSizes: [10, 20, 30, 40, 50, 100],
          pageTotal: 1
        },
        formOptions: {
          labelWidth: "80px",
          labelPosition: "left",
          saveLoading: false
        }
      },
      config: {
        title: "",
        labelWidth: "100px",
        formList: [
          {
            label: "客户名称",
            prop: "userName",
            type: "input"
          },
          {
            label: "金额",
            prop: "amount",
            type: "input"
          },
          {
            label: "项目信息",
            prop: "info",
            type: "input"
          },
          {
            label: "备注",
            prop: "remark",
            type: "input"
          }
        ],
        formData: {
          _id: "",
          userId: "",
          userName: "",
          amount: "",
          info: "",
          remark: ""
        },
        rules: {
          userName: [
            { required: true, message: "请填写客户名称", trigger: "blur" }
          ],
          amount: [
            {
              required: true,
              message: "正数金额代表向客户收取，负数金额代表支付给客户",
              trigger: "blur"
            }
            //{ required: true, message: '请填写金额', trigger: 'change' }
          ],
          info: [{ required: true, message: "请填写项目信息", trigger: "blur" }]
        }
      },
      visible: false,
      delVisible: false
    };
  },
  methods: {
    /**
     * 选中部分数据
     */
    handleSelectionChange(val) {
      this.selectionChange = val;
    },
    handleExport(val) {
      const file = [];
      this.tableConfig.data.forEach(item => {
        item.data.forEach(res => {
          let itemList = {
            userName: res.userName,
            dbname: res.dbname === "send" ? "寄件运费" : "杂费",
            free: res.dbname === "send" ? res.free : res.amount,
            info: res.info,
            remark: res.remark,
            time: res.dbname === "send" ? res.time : "",
            orderId: res.orderId ? String(res.orderId) : "",
            address: res.address,
            companyName: res.companyName,
            kilogram: res.kilogram
          };
          file.push([
            itemList.userName,
            itemList.dbname,
            itemList.free,
            itemList.info,
            itemList.remark,
            itemList.time,
            itemList.orderId,
            itemList.address,
            itemList.companyName,
            itemList.kilogram
          ]);
        });
      });
      this.$api("utilApi/exportFile", {
        name: "所有账单",
        list: [
          [
            "名称",
            "来源",
            "收入(元)",
            "收入说明",
            "备注",
            "日期",
            "单号",
            "目的地",
            "承运公司",
            "重量(KG)"
          ],
          ...file
        ]
      }).then(res => {
        if (res.code === 1000) {
          this.$notify.success({
            title: "成功",
            message: "导出成功"
          });
        }
      });
    },
    /**
     * 导出选中部分
     */
    btnExportChecked() {
      if (this.selectionChange.length === 0) {
        this.$notify.warning({
          title: "导出警告",
          message: "请选择需要导出的账单"
        });
        return;
      }
      this.selectionChange.forEach((res, index) => {
        res.chekced = index === this.selectionChange.length - 1;
        this.UserExport(
          res,
          `部分客户账单-${moment(new Date()).format("YYYY-MM-DD")}`
        );
      });
    },
    getList(data) {
      this.$api("total/list", data).then(res => {
        if (res.code === 1000) {
          this.tableConfig.data = res.data.map(item => {
            item.hideEvent = [];
            return item;
          });
          this.tableConfig.page.pageTotal = res.data.length;
        }
      });
    },
    handlePaginationChange(currentPage) {
      const key = currentPage.current ? "current" : "size";
      this.tableConfig.page[key === "size" ? "pageSize" : "currentPage"] =
        currentPage[key];
    },
    handleAdd(e) {
      this.visible = true;
      this.config.title = "新建";
      this.$nextTick(() => {
        this.config.formData = {
          _id: "",
          userId: "",
          userName: "",
          amount: "",
          info: "",
          remark: ""
        };
      });
    },
    handleConfirm(value) {
      this.$api("othercharge/edit", value).then(res => {
        if (res.code === 1000) {
          this.$notify.success({
            title: "成功",
            message: !value._id ? "添加成功" : "更新成功"
          });
          this.visible = false;
        } else {
          this.$notify.warning({
            title: "警告",
            message: res.msg
          });
        }
        this.getList(this.searchConfig.formData);
      });
    },
    btnEdit(row, idx) {
      this.visible = true;
      this.config.formData = row;
    },
    btnDetail(row, idx) {
      this.delVisible = true;
      this.row = row;
      this.row.page = 1;
    },
    handleDetail() {
      this.delVisible = false;
      this.row = { data: [], page: 1 };
    },
    searchMethod(e) {
      this.tableConfig.page.currentPage = 1;
      this.getList(this.searchConfig.formData);
    },
    handleCurrentChange(item) {
      this.row = Object.assign({}, this.row, {
        page: item
      });
    },
    UserExport(item, name) {
      if (!isNaN(name) && typeof name === "number") {
        name = "";
      }
      const file = [];
      item.data.forEach(res => {
        let itemList = {
          userName: res.userName,
          dbname: res.dbname === "send" ? "寄件运费" : "杂费",
          free: res.dbname === "send" ? res.free : res.amount,
          info: res.info,
          remark: res.remark,
          time: res.dbname === "send" ? res.time : "",
          orderId: res.orderId ? String(res.orderId) : "",
          address: res.address,
          companyName: res.companyName,
          kilogram: res.kilogram
        };
        file.push([
          itemList.userName,
          itemList.dbname,
          itemList.free,
          itemList.info,
          itemList.remark,
          itemList.time,
          itemList.orderId,
          itemList.address,
          itemList.companyName,
          itemList.kilogram
        ]);
      });
      if (!name) {
        item.chekced = true;
      }
      this.$api("utilApi/exportFile", {
        name: `${item.userName}的账单-总金额为${String(item.free)}`,
        downloadName:
          name || `${item.userName}的账单-总金额为${String(item.free)}`,
        chekced: item.chekced === false ? item.chekced : true,
        list: [
          [
            "名称",
            "来源",
            "收入(元)",
            "收入说明",
            "备注",
            "日期",
            "单号",
            "目的地",
            "承运公司",
            "重量(KG)"
          ],
          ...file
        ]
      }).then(res => {
        if (res.code === 1000) {
          this.$notify.success({
            title: "成功",
            message: "导出成功"
          });
        }
      });
    }
  }
};
</script>
<style>
.form-warp span {
  font-size: 1.3em;
}
</style>
