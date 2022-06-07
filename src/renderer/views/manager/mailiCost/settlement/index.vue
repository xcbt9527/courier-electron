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
      v-if="visible"
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
    <detailComponents v-model="dialogVisible"></detailComponents>
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
import detailComponents from './detail'
/**
 * 导入组件
 */
import exportDown from '@/components/exportDown'
export default {
  name: 'settlement',
  mounted() {},
  components: {
    TableHead,
    TableFooter,
    TableMain,
    MDialog,
    exportDown,
    detailComponents
  },
  created() {
    this.getList()
  },
  mixins: [utilMinxin],
  watch: {
    dialogVisible() {
      this.getList()
    }
  },
  data() {
    return {
      exportVisible: false,
      dialogVisible: false,
      searchConfig: {
        formItem: [
          {
            prop: 'name',
            type: 'select',
            placeholder: '请输入客户名称',
            data: []
          },
          {
            prop: 'pricename',
            type: 'select',
            placeholder: '请选择承运公司',
            data: []
          },
          {
            prop: 'orderId',
            type: 'input',
            placeholder: '请输入订单号'
          },
          {
            prop: 'address',
            type: 'input',
            placeholder: '请输入目的地'
          },
          {
            prop: 'kilogram',
            type: 'input2',
            placeholder: '请输入重量范围',
            data: {
              prop: 'kilogram1',
              type: 'input',
              placeholder: '请输入重量范围'
            }
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
            content: '仅支持寄件运费模版的xlsx、xls格式的文档导入'
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
          name: '',
          pricename: '',
          orderId: '',
          address: ''
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
            title: '目的地',
            key: 'address',
            type: 'text'
          },
          {
            title: '重量(kg)',
            key: 'kilogram',
            type: 'text'
          },
          {
            title: '承运公司',
            key: 'companyName',
            type: 'text'
          },
          {
            title: '本次运费',
            key: 'free',
            type: 'text'
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
        }
      },
      config: config(),
      visible: false,
      delVisible: false
    }
  },
  methods: {
    getList(data) {
      if ((data && data.kilogram) || (data && data.kilogram1)) {
        if (!data.kilogram || !data.kilogram1) {
          this.$notify.warning({
            title: '警告',
            message: '请填写重量范围'
          })

          this.tableConfig.options.loading = false
          return
        }
        if (Number(data.kilogram1) < Number(data.kilogram)) {
          console.log(data)
          this.$notify.warning({
            title: '警告',
            message: '结束重量不能小于开始重量'
          })
          this.tableConfig.options.loading = false
          return
        }
      }
      this.tableConfig.options.loading = true
      this.$api('send/list', data).then(res => {
        if (res.code === 1000) {
          if (data && data.address) {
            res.data = res.data.filter(item => {
              return item.address.indexOf(data.address) !== -1
            })
          }
          if (data && data.kilogram && data.kilogram1) {
            res.data = res.data.filter(item => {
              return (
                Number(item.kilogram) >= Number(data.kilogram) &&
                Number(item.kilogram) <= Number(data.kilogram1)
              )
            })
          }
          this.tableConfig.data = res.data.map(item => {
            item.hideEvent = []
            return item
          })
          this.setUserList(res.data)
          this.tableConfig.page.pageTotal = res.data.length
        }
        setTimeout(() => {
          this.tableConfig.options.loading = false
        }, 1000)
      })
    },
    handlePaginationChange(currentPage) {
      const key = currentPage.current ? 'current' : 'size'
      this.tableConfig.page[key === 'size' ? 'pageSize' : 'currentPage'] =
        currentPage[key]
    },
    handleAdd(e) {
      const view = {
        title: '添加',
        formData: {
          userId: '',
          userName: '',
          companyName: '',
          kilogram: '',
          orderId: '',
          free: ''
        },
        userList: this.userList,
        companyList: this.companyList
      }
      this.config = Object.assign({}, config(view))
      this.visible = true
    },
    handleCancel() {
      this.visible = false
    },
    handleConfirm(value) {
      const user = this.getUserName(this.userList, value.userId)
      value.companyName = this.getCompanyName(
        this.companyList,
        value.companyId
      ).name
      if (user.name) {
        value.userName = user.name
      }
      this.$api('send/edit', Object.assign({}, value)).then(res => {
        if (res.code === 1000) {
          this.$notify.success({
            title: '成功',
            message: !value._id ? '添加成功' : '更新成功'
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
      const view = {
        title: '更新',
        formData: row,
        userList: this.userList,
        companyList: this.companyList
      }
      this.config = config(view)
    },
    btnDel(row, idx) {
      this.delVisible = true
      this.row = row
    },
    handleDel() {
      this.$api('send/del', {
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
          String(item.orderId),
          item.address,
          item.companyName,
          item.kilogram,
          item.free,
          item.time
        ])
      })
      this.$api('utilApi/exportFile', {
        name: '寄件运费',
        list: [
          [
            '客户名称',
            '运单号',
            '目的地',
            '公司',
            '重量(KG)',
            '本次运费',
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
        if (key.indexOf('单号') !== -1) {
          ++checked
        }
        if (key.indexOf('目的地') !== -1) {
          ++checked
        }
        if (key.indexOf('重量') !== -1) {
          ++checked
        }
        if (key.indexOf('客户名') !== -1) {
          ++checked
        }
        if (key.indexOf('公司') !== -1) {
          ++checked
        }
      })
      if (checked !== 5) {
        this.$notify.error({
          title: '提醒',
          message: '非本项目导入表格类型,或是缺乏字段。请重新导入'
        })
        return
      }
      const list = item.list.map(res => {
        const objItem = {}
        Object.keys(res).forEach(key => {
          if (key.indexOf('客户名') !== -1) {
            objItem.userName = String(res[key]).replace(/\s*/g, '')
            const user = this.getUserId(
              this.userList,
              String(res[key]).replace(/\s*/g, '')
            )
            if (user._id) {
              objItem.userId = user._id
            } else {
              objItem.userId = ''
            }
          }
          if (key.indexOf('公司') !== -1) {
            objItem.companyName = String(res[key]).replace(/\s*/g, '')
          }
          if (key.indexOf('单号') !== -1) {
            objItem.orderId = res[key]
          }
          if (key.indexOf('时间') !== -1) {
            objItem.time = res[key]
          }
          if (key.indexOf('目的地') !== -1) {
            objItem.address = res[key]
          }
          if (key.indexOf('重量') !== -1) {
            objItem.kilogram = res[key]
          }
        })
        return objItem
      })
      const loading = this.$loading({
        lock: true,
        text: '数据检查中，请稍等···',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.$api('send/lead', list)
        .then(res => {
          const data = res.data
          loading.close()
          if (res.code === 1000) {
            this.dialogVisible = true
          }
          this.getList()
        })
        .catch(e => {
          loading.close()
        })
    },
    ...mapActions(['setUserList'])
  }
}
</script>
