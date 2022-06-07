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
    <TableMain :config="tableConfig" @Del="btnDel" @Edit="btnEdit"></TableMain>
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
    <!-- <export-down :show.sync="exportVisible" ref="exportdialog" /> -->
  </d2-container>
</template>

<script>
import TableHead from '@/components/global/table/TableHead'
import TableMain from '@/components/global/table/TableMain'
import TableFooter from '@/components/global/table/TableFooter'
import MDialog from '@/components/global/table/dialog'
import { mapActions } from 'vuex'
import { config } from './config'
import utilMinxin from '@/mixin/util'

/**
 * 导入组件
 */
import exportDown from '@/components/exportDown'
export default {
  name: 'settlementerror',
  mounted() {},
  components: {
    TableHead,
    TableFooter,
    TableMain,
    MDialog,
    exportDown
  },
  created() {
    this.getList()
  },
  mixins: [utilMinxin],
  data() {
    return {
      exportVisible: false,
      searchConfig: {
        formItem: [
          {
            prop: 'name',
            type: 'select',
            placeholder: '请输入客户名称',
            noChange: true,
            data: []
          },
          {
            prop: 'orderId',
            type: 'input',
            placeholder: '请输入订单号'
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
            icon: 'refresh',
            event: 'Refresh',
            text: '刷新',
            className: ''
          }
        ],
        formData: {
          name: '',
          orderId: ''
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
            title: '客户名称',
            key: 'userName',
            type: 'text'
          },
          {
            title: '运单号',
            key: 'orderId',
            type: 'text'
          },
          {
            title: '承运公司',
            key: 'companyName',
            type: 'text'
          },
          {
            title: '重量(kg)',
            key: 'kilogram',
            type: 'text'
          },
          {
            title: '错误信息',
            key: 'remark',
            type: 'html'
          },
          {
            title: '收录时间',
            key: 'time',
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
        },
        editTemplate: {
          date: {
            title: '日期',
            value: ''
          },
          name: {
            title: '姓名',
            value: ''
          },
          address: {
            title: '地址',
            value: ''
          },
          forbidEdit: {
            title: '禁用按钮',
            value: false,
            component: {
              show: false
            }
          },
          showEditButton: {
            title: '显示按钮',
            value: true,
            component: {
              show: false
            }
          }
        }
      },
      config: config(),
      visible: false,
      delVisible: false
    }
  },
  methods: {
    getList(data) {
      this.$api('send/errorlist', data).then(res => {
        if (res.code === 1000) {
          this.tableConfig.data = res.data.map(item => {
            item.hideEvent = []
            return item
          })
          this.setUserList(res.data)
          this.tableConfig.page.pageTotal = res.data.length
          this.tableConfig.options.loading = false
          if ((data && data.name) || (data && data.orderId)) {
            return
          }
          this.searchConfig.formItem.forEach(item => {
            if (item.prop === 'name') {
              let hash = {}
              const reduceList = res.data.reduce((itemObject, next) => {
                hash[next.userName]
                  ? ''
                  : (hash[next.userName] = true && itemObject.push(next))
                return itemObject
              }, [])
              item.data = reduceList.map(reduceItem => {
                return {
                  name: reduceItem.userName,
                  value: reduceItem.userName
                }
              })
            }
          })
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
      const view = {
        title: '添加',
        formData: {
          userId: '',
          userName: '',
          orderId: '',
          free: ''
        },
        userList: this.userList,
        companyList: this.companyList
      }
      this.config = config(view)
    },
    handleCancel() {},
    handleConfirm(value) {
      const user = this.getUserName(this.userList, value.userId)
      if (user.name) {
        value.userName = user.name
      }
      const company = this.getUserName(this.companyList, value.companyId)
      if (company.name) {
        value.companyName = company.name
      }
      value.remark = '结算失败件，手动修改'
      this.$api('send/errorEdit', Object.assign({}, value)).then(res => {
        if (res.code === 1000) {
          this.$notify.success({
            title: '成功',
            message: '已为您更新最新状态'
          })
          this.visible = false
          this.getList()
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
      this.userList.forEach(res => {
        if (res.name === row.name) {
          row.name = res._id
        }
      })
      const view = {
        title: '更新',
        formData: row,
        userList: this.userList,
        companyList: this.companyList
      }
      console.log(this.companyList)
      this.config = config(view)
    },
    btnDel(row, idx) {
      this.delVisible = true
      this.row = row
    },
    handleDel() {
      this.$api('send/errorDel', {
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
      this.tableConfig.options.loading = true
      this.getList(this.searchConfig.formData)
    },
    ExportDown() {
      this.exportVisible = true
    },
    ExportUp() {
      const file = []
      this.tableConfig.data.forEach(item => {
        file.push([
          item.userName,
          item.orderId,
          item.companyName,
          item.kilogram,
          item.remark,
          item.time
        ])
      })
      this.$api('utilApi/exportFile', {
        name: '结算失败件',
        list: [
          [
            '客户名称',
            '运单号',
            '承运公司',
            '重量(kg)',
            '错误信息',
            '收录时间'
          ],
          ...file
        ]
      }).then(res => {
        if (res.code === 1000) {
          this.$notify.success({
            title: '成功',
            message: '导出成功'
          })
        }
      })
    },
    ...mapActions(['setUserList'])
  }
}
</script>
