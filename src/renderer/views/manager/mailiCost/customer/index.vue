<template>
  <d2-container>
    <TableHead
      :formConfig="searchConfig"
      @btnAdd="handleAdd"
      @btnExport="exportUp"
      @btnRefresh="getList"
      @btnSubmit="searchMethod"
      slot="header"
    ></TableHead>
    <TableMain :config="tableConfig" @Del="btnDel" @Edit="btnEdit" @View="btnView"></TableMain>
    <m-dialog
      :config="config"
      :show.sync="visible"
      @cancel="handleCancel"
      @confirm="handleConfirm"
      ref="dialog"
    >
      <el-form :model="config" :rules="config.listRules" label-width="100px" ref="form" size="mini">
        <el-form-item label="价格模版" prop="list" required>
          <el-button @click="changeExportVisible" type="primary" v-if="!config.list">
            上传
            <i class="el-icon-upload el-icon--right"></i>
          </el-button>
          <el-button @click="changeExportVisible" icon="el-icon-check" type="success" v-else>已上传</el-button>
        </el-form-item>
      </el-form>
    </m-dialog>
    <el-dialog :modal="true" :visible="delVisible" title="删除">
      <div>请确认是否删除当前数据</div>
      <div class="dialog-footer" slot="footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button @click="handleDel" type="primary">确 定</el-button>
      </div>
    </el-dialog>
    <export-down :show.sync="exportVisible" @confirm="exportFun" ref="exportdialog" />
    <TableFooter :page="tableConfig.page" @change="handlePaginationChange" slot="footer"></TableFooter>
  </d2-container>
</template>

<script>
import TableHead from '@/components/global/table/TableHead'
import TableMain from '@/components/global/table/TableMain'
import TableFooter from '@/components/global/table/TableFooter'
import MDialog from '@/components/global/table/dialog'
import { mapActions } from 'vuex'
import exportDown from '@/components/exportDown'

import { config } from './config'
import utilMinxin from '@/mixin/util'
export default {
  name: 'customer',
  components: {
    TableHead,
    TableFooter,
    TableMain,
    MDialog,
    exportDown
  },
  watch: {},
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
            data: []
          },
          {
            prop: 'pricename',
            type: 'select',
            placeholder: '请输入承运公司',
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
            title: '客户名称',
            key: 'userName',
            type: 'text'
          },
          {
            title: '承运公司',
            key: 'pricename',
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
            event: 'View',
            type: 'text',
            title: '查看与修正价格'
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
      this.$api('ucuser/list', data).then(res => {
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
          userId: '',
          userName: '',
          companyId: '',
          pricename: '',
          list: []
        },
        userList: this.userList,
        companyList: this.companyList
      }
      this.config = config(view)
    },
    handleCancel() {},
    handleConfirm(value) {
      value.list =
        this.config.list && this.config.list.length > 0 ? this.config.list : []
      if (
        !this.config.list ||
        (this.config.list && this.config.list.length < 1)
      ) {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.editFun(value)
          }
        })
        return
      } else {
        this.editFun(value)
      }
    },
    /**
     * 更新导入
     */
    editFun(value) {
      const user = this.getUserName(this.userList, value.userId)
      if (user.name) {
        value.userName = user.name
      }
      const price = this.getUserName(this.companyList, value.companyId)
      if (price.name) {
        value.pricename = price.name
      }
      this.$api('ucuser/edit', Object.assign({}, value)).then(res => {
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
        list: row.list,
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
      this.$api('ucuser/del', {
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
          this.$notify.error({
            title: '失败',
            message: res.msg
          })
        }
      })
    },
    exportUp() {
      const file = []
      this.tableConfig.data.forEach(item => {
        file.push([item.userName, item.pricename])
      })
      this.$api('utilApi/exportFile', {
        name: '客户价格',
        list: [['客户名称', '价格模块'], ...file]
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
    changeExportVisible() {
      if (!this.config.list) {
        this.exportVisible = true
      } else {
        this.$confirm('已存在模版是否需要替换?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.exportVisible = true
        })
      }
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
      console.log(item.list)
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
          if (objkey.kilogram) {
            objItem.list.push(objkey)
          }
        })
        return objItem
      })
      this.config.list = list
      const itemObj = item.list[0]
      this.$notify.success({
        title: '成功',
        message: `本次成功导入${list.length}条数据，共${Object.keys(itemObj)
          .length - 1}列公斤数`
      })
      this.$refs.form.validate(valid => {})
      this.$nextTick(() => {
        this.handleConfirm(this.config.formData)
      })
    },
    btnView(row) {
      this.$router.push({ path: `/customerDetails/${row._id}` })
    },
    ...mapActions(['setUserList'])
  }
}
</script>
