<template>
  <d2-container>
    <TableHead
      :formConfig="searchConfig"
      @btnAdd="handleAdd"
      @btnExport="handleExport"
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
  </d2-container>
</template>

<script>
import TableHead from '@/components/global/table/TableHead'
import TableMain from '@/components/global/table/TableMain'
import TableFooter from '@/components/global/table/TableFooter'
import MDialog from '@/components/global/table/dialog'
import { mapActions } from 'vuex'
export default {
  name: 'member',
  components: {
    TableHead,
    TableFooter,
    TableMain,
    MDialog
  },
  created() {
    this.getList()
  },
  data() {
    return {
      searchConfig: {
        formItem: [
          {
            prop: 'name',
            type: 'input',
            placeholder: '请输入名称'
          },
          {
            prop: 'mobile',
            type: 'input',
            placeholder: '请输入电话'
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
            title: '电话',
            key: 'mobile',
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
      config: {
        title: '',
        formList: [
          {
            label: '名称:',
            prop: 'name',
            type: 'input'
          },
          {
            label: '电话:',
            prop: 'mobile',
            type: 'input'
          },
          {
            label: '备注:',
            prop: 'remark',
            type: 'input'
          }
        ],
        formData: {
          name: '',
          mobile: '',
          remake: ''
        },
        rules: {
          name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
          mobile: [{ required: true, message: '请填写电话', trigger: 'blur' }]
        }
      },
      visible: false,
      delVisible: false
    }
  },
  methods: {
    getList(data) {
      this.$api('user/list', data).then(res => {
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
      this.config.formList.forEach(res => {
        if (res.prop === 'name') {
          res.type = 'input'
        }
      })
      this.visible = true
      this.config.title = '新建'
      this.config.formData = {
        name: '',
        mobile: '',
        remake: ''
      }
    },
    handleCancel() {},
    handleConfirm(value) {
      this.$api('user/edit', Object.assign({}, value)).then(res => {
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
      this.config.formList.forEach(res => {
        if (res.prop === 'name') {
          res.type = 'text'
        }
      })
      this.config.formData = Object.assign({}, row)
    },
    btnDel(row, idx) {
      this.delVisible = true
      this.row = row
    },
    handleDel() {
      this.$api('user/del', {
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
    handleExport() {
      const file = []
      this.tableConfig.data.forEach(item => {
        file.push([item.name, item.mobile, item.remark])
      })
      this.$api('utilApi/exportFile', {
        name: '客户管理',
        list: [['名称', '电话', '备注'], ...file]
      }).then(res => {
        if (res.code === 1000) {
          this.$notify.success({
            title: '成功',
            message: '导出成功'
          })
        }
      })
    },
    searchMethod(e) {
      this.tableConfig.page.currentPage = 1
      this.tableConfig.options.loading = true
      this.getList(this.searchConfig.formData)
    },
    ...mapActions(['setUserList'])
  }
}
</script>
