<template>
  <d2-container>
    <TableHead
      :formConfig="searchConfig"
      @btnAdd="handleAdd"
      @btnExport="ExportUp"
      @btnExportDown="ExportDown"
      @btnRefresh="getList"
      @btnSubmit="searchMethod"
      slot="header"
    ></TableHead>
    <TableMain :config="tableConfig" @Del="btnDel" @Edit="btnEdit" @priceEdit="priceEdit"></TableMain>
    <m-dialog
      :config="config"
      :show.sync="visible"
      @cancel="handleCancel"
      @confirm="handleConfirm"
      ref="dialog"
    ></m-dialog>
    <el-dialog :modal="true" :visible="delVisible" title="删除">
      <div>请确认是否删除当前数据</div>
      <div class="dialog-footer" slot="footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button @click="handleDel" type="primary">确 定</el-button>
      </div>
    </el-dialog>
    <TableFooter :page="tableConfig.page" @change="handlePaginationChange" slot="footer"></TableFooter>
    <export-down :show.sync="exportVisible" @confirm="exportFun" ref="exportdialog" />
  </d2-container>
</template>

<script>
import TableHead from '@/components/global/table/TableHead'
import TableMain from '@/components/global/table/TableMain'
import TableFooter from '@/components/global/table/TableFooter'
import MDialog from '@/components/global/table/dialog'
import { mapActions } from 'vuex'
import utilMinxin from '@/mixin/util'
import { config } from './config'
/**
 * 导入组件
 */
import exportDown from '@/components/exportDown'
export default {
  name: 'price',
  components: {
    TableHead,
    TableFooter,
    TableMain,
    MDialog,
    exportDown
  },
  mixins: [utilMinxin],
  created() {
    this.getList()
  },
  data() {
    return {
      exportVisible: false,
      searchConfig: {
        formItem: [
          {
            prop: 'name',
            type: 'input',
            placeholder: '请输入名称'
          },
          {
            prop: 'companyName',
            type: 'input',
            placeholder: '请输入运货公司名称'
          }
        ],
        action: [
          {
            icon: 'search',
            event: 'Submit',
            text: '查询',
            className: ''
          },
          {
            icon: 'arrow-circle-up',
            event: 'Export',
            text: '导出',
            className: ''
          },
          {
            icon: 'arrow-circle-down',
            event: 'ExportDown',
            text: '导入',
            className: '',
            content: '仅支持价格模版的xlsx、xls格式的文档导入'
          },
          {
            icon: 'refresh',
            event: 'Refresh',
            text: '刷新',
            className: ''
          }
        ],
        formData: {
          name: '',
          mobile: ''
        },
        rules: {
          search: [
            { required: true, message: '请输入搜索的关键词', trigger: 'blur' }
          ]
        }
      },
      tableConfig: {
        columns: [
          {
            title: '名称',
            key: 'name',
            type: 'text'
          },
          {
            title: '运货公司',
            key: 'companyName',
            type: 'text'
          }
        ],
        options: {
          align: 'center',
          border: true,
          loading: true,
          loadingOptions: {
            text: '拼命加载中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.8)'
          }
        },
        data: [],
        action: [
          {
            event: 'Edit',
            type: 'text',
            title: '更新'
          },
          {
            event: 'Del',
            type: 'text',
            title: '删除'
          },
          {
            event: 'priceEdit',
            type: 'text',
            title: '价格修改'
          }
        ],
        page: {
          currentPage: 1,
          pageSize: 10,
          pageSizes: [10, 20, 30, 40, 50, 100],
          pageTotal: 1
        },
        formOptions: {
          labelWidth: '80px',
          labelPosition: 'left',
          saveLoading: false
        }
      },
      config: config(),
      visible: false,
      delVisible: false
    }
  },
  methods: {
    /**
     * 导入按钮
     */
    ExportDown() {
      this.exportVisible = true
    },
    ExportUp() {
      const file = []
      this.tableConfig.data.forEach(item => {
        file.push([item.name, item.companyName])
      })
      this.$api('utilApi/exportFile', {
        name: '价格模版',
        list: [['名称', '运货公司'], ...file]
      }).then(res => {
        if (res.code === 1000) {
          this.$notify.success({
            title: '成功',
            message: '导出成功'
          })
        }
      })
    },
    getList(data) {
      this.$api('price/list', data).then(res => {
        if (res.code === 1000) {
          this.tableConfig.data = res.data.map(item => {
            item.hideEvent = []
            return item
          })
          this.setUserList(res.data)
          this.tableConfig.page.pageTotal = res.data.length
        }
        this.tableConfig.options.loading = false
      })
    },
    handlePaginationChange(currentPage) {
      const key = currentPage.current ? 'current' : 'size'
      this.tableConfig.page[key === 'size' ? 'pageSize' : 'currentPage'] =
        currentPage[key]
    },
    handleAdd(e) {
      this.visible = true
      const view = {
        title: '添加',
        formData: {
          name: '',
          companyId: '',
          companyName: ''
        },
        companyList: this.companyList
      }
      this.config = config(view)
    },
    handleCancel() {},
    handleConfirm(value) {
      /**
       * 获取公司名称的参数
       */
      const companyObj = this.getUserName(this.companyList, value.companyId)
      if (companyObj.name) {
        value.companyName = companyObj.name
      }
      this.$api('price/edit', Object.assign({}, value)).then(res => {
        if (res.code === 1000) {
          this.$notify.success({
            title: '成功',
            message: !value._id ? '添加成功' : '更新成功'
          })
          this.visible = false
        } else {
          this.$notify.warning({
            title: '警告',
            message: res.msg
          })
        }
        this.getList(this.searchConfig.formData)
      })
    },
    /**
     * 修改价格
     */
    priceEdit(row, idx) {
      this.$router.push({ path: `/priceDetails/${row._id}` })
    },
    btnEdit(row, idx) {
      this.visible = true
      const view = {
        title: '更新',
        formData: row,
        companyList: this.companyList
      }
      this.config = config(view)
    },
    btnDel(row, idx) {
      this.delVisible = true
      this.row = row
    },
    handleDel() {
      this.$api('price/del', {
        _id: this.row._id
      }).then(res => {
        if (res.code === 1000) {
          this.$notify.success({
            title: '成功',
            message: '删除成功'
          })
          this.getList(this.searchConfig.formData)
          this.delVisible = false
          this.row = ''
        } else {
          this.$notify.warning({
            title: '警告',
            message: res.msg
          })
          this.delVisible = false
          this.row = ''
        }
      })
    },
    searchMethod(e) {
      this.tableConfig.page.currentPage = 1
      this.tableConfig.options.loading = true
      this.getList(this.searchConfig.formData)
    },
    /**
     * 导入回调之后传回来的参数
     */
    exportFun(item) {
      if (item.list.length === 0) {
        this.$notify.error({
          title: '提醒',
          message: '表内暂无数据'
        })
        return
      }
      let checked = 0
      Object.keys(item.list[0]).forEach(key => {
        if (key.indexOf('公斤') !== -1) {
          ++checked
        }
      })
      if (checked <= 2) {
        this.$notify.error({
          title: '提醒',
          message: '非本项目导入表格类型,请重新导入'
        })
        return
      }
      this.visible = true
      const list = item.list.map(res => {
        const objItem = {
          address: '',
          list: []
        }
        Object.keys(res).forEach(key => {
          let objkey = {
            price: '',
            kilogram: ''
          }
          if (key.indexOf('公斤') !== -1) {
            objkey.price = res[key]
            objkey.kilogram = parseInt(key)
          }
          if (key.indexOf('公斤') === -1) {
            objItem.address = res[key]
          }
          if (objkey.price && objkey.kilogram) {
            objItem.list.push(objkey)
          }
        })
        return objItem
      })
      const view = {
        title: '新增',
        formData: {
          name: item.name,
          companyId: '',
          companyName: '',
          list
        },
        companyList: this.companyList
      }
      this.config = config(view)
    },
    ...mapActions(['setUserList'])
  }
}
</script>
