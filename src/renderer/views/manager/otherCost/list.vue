<template>
  <d2-container>
    <TableHead
      :formConfig="searchConfig"
      @btnAdd="handleAdd"
      @btnExportDown="ExportDown"
      @btnRefresh="getList"
      @btnSubmit="searchMethod"
      slot="header"
    ></TableHead>
    <TableMain :config="tableConfig" @Del="btnDel" @Edit="btnEdit"></TableMain>
    <m-dialog :config="config" :show.sync="visible" @confirm="handleConfirm" ref="dialog">
      <span style="color:red">* 正数金额代表向客户收取，负数金额代表支付给客户</span>
    </m-dialog>
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
import utilMinxin from '@/mixin/util'
import { config } from './config'
/**
 * 导入组件
 */
import exportDown from '@/components/exportDown'
export default {
  name: 'otherCostList',
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
            prop: 'userName',
            type: 'select',
            placeholder: '请输入客户名称',
            data: []
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
            icon: 'arrow-circle-down',
            event: 'ExportDown',
            text: '导入',
            className: '',
            content: '仅支持杂费模版的xlsx、xls格式的文档导入'
          },
          {
            icon: 'plus',
            event: 'Add',
            text: '添加',
            className: ''
          },
          {
            icon: 'refresh',
            event: 'Refresh',
            text: '刷新',
            className: ''
          }
        ],
        formData: {
          userName: ''
        },
        rules: {
          search: [
            { required: true, message: '请输入搜索的名称', trigger: 'blur' }
          ]
        }
      },
      tableConfig: {
        columns: [
          {
            title: '客户',
            key: 'userName',
            type: 'text'
          },
          {
            title: '金额',
            key: 'amount',
            type: 'text'
          },
          {
            title: '项目信息',
            key: 'info',
            type: 'text'
          },
          {
            title: '备注',
            key: 'remark',
            type: 'text'
          }
        ],
        options: {
          align: 'center',
          border: true,
          loading: false,
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
    getList(data) {
      this.$api('othercharge/list', data).then(res => {
        if (res.code === 1000) {
          this.tableConfig.data = res.data.map(item => {
            item.hideEvent = []
            return item
          })
          this.tableConfig.page.pageTotal = res.data.length
        }
      })
    },
    handlePaginationChange(currentPage) {
      const key = currentPage.current ? 'current' : 'size'
      this.tableConfig.page[key === 'size' ? 'pageSize' : 'currentPage'] =
        currentPage[key]
    },
    handleAdd(e) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.dialog.$refs.form.clearValidate()
      })
      const view = {
        title: '添加',
        formData: {
          userId: '',
          userName: '',
          amount: '',
          info: '',
          remark: ''
        },
        userList: this.userList
      }
      this.config = config(view)
    },
    handleConfirm(value) {
      /**
       * 获取用户的参数
       */
      const user = this.getUserName(this.userList, value.userId)
      if (user.name) {
        value.userName = user.name
      }
      this.$api('othercharge/edit', value).then(res => {
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
    btnEdit(row, idx) {
      this.visible = true
      const view = {
        title: '更新',
        formData: row,
        userList: this.userList
      }
      this.config = config(view)
    },
    btnDel(row, idx) {
      this.delVisible = true
      this.row = row
    },
    handleDel() {
      this.$api('othercharge/del', {
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
        }
      })
    },
    searchMethod(e) {
      this.tableConfig.page.currentPage = 1
      this.getList(this.searchConfig.formData)
    },
    ExportDown() {
      this.exportVisible = true
    },
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
        if (key.indexOf('客户名') !== -1) {
          ++checked
        }
        if (key.indexOf('金额') !== -1) {
          ++checked
        }
      })
      if (checked !== 2) {
        this.$notify.error({
          title: '提醒',
          message: '非本项目导入表格类型,请重新导入'
        })
        return
      }
      const list = item.list.map(res => {
        const objItem = {}
        Object.keys(res).forEach(key => {
          if (key.indexOf('客户名') !== -1) {
            objItem.userName = res[key]
            const user = this.getUserId(this.userList, res[key])
            if (user.name) {
              objItem.userId = user._id
            }
          }
          if (key.indexOf('金额') !== -1) {
            objItem.amount = res[key]
          }
          if (key.indexOf('项目信息') !== -1) {
            objItem.info = res[key]
          }
          if (key.indexOf('备注') !== -1) {
            objItem.remark = res[key]
          }
        })
        return objItem.userName && objItem.amount ? objItem : {}
      })
      this.$api('othercharge/lead', list).then(res => {
        const id = res.data._id
        this.$router.push({ path: `/otherCostDetails/${id}` })
      })
    }
  }
}
</script>
