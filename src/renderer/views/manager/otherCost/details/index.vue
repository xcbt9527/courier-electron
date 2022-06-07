<template>
  <d2-container>
    <TableHead :formConfig="searchConfig" @btnExport="Export" slot="header"></TableHead>
    <TableMain :config="tableConfig" @Del="btnDel"></TableMain>
    <TableFooter :page="tableConfig.page" @change="handlePaginationChange" slot="footer"></TableFooter>
  </d2-container>
</template>

<script>
import TableHead from '@/components/global/table/TableHead'
import TableMain from '@/components/global/table/TableMain'
import TableFooter from '@/components/global/table/TableFooter'
import MDialog from '@/components/global/table/dialog'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'otherCostDetails',
  components: {
    TableHead,
    TableFooter,
    TableMain,
    MDialog
  },
  mounted() {
    this.init()
  },
  computed: {
    ...mapState('d2admin/page', [
      'current' //用户获取当前页面的地址，用于关闭
    ])
  },
  data() {
    return {
      searchConfig: {
        action: [
          {
            icon: 'arrow-circle-down',
            event: 'Export',
            text: '确认导入',
            className: ''
          }
        ],
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
          },
          {
            title: '导入提醒',
            key: 'remind',
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
      }
    }
  },
  methods: {
    init() {
      const id = this.$route.params.id
      this.$api('othercharge/downList', { id }).then(res => {
        if (res.code === 1000) {
          this.tableConfig.data = res.data.map(item => {
            item.hideEvent = []
            return item
          })
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
    btnDel(row, idx) {
      this.$confirm('是否删除此条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableConfig.data.splice(idx, 1)
        this.$notify.success({
            title: '成功',
            message: '删除成功'
        });
      })
    },
    Export() {
      this.$api('othercharge/downOhter', { list: this.tableConfig.data }).then(
        res => {
          if (res.code === 1000) {
            this.$notify.success({
              title: '成功',
              message: '导入成功'
            });
            const tagName = this.current
            this.close({ tagName })
            setTimeout(() => {
              this.$router.push({ path: '/otherCost' })
            }, 10)
          } else {
            this.$notify.warning({
              title: '警告',
              message: res.msg
            });
          }
        }
      )
    },
    ...mapActions('d2admin/page', ['close'])
  }
}
</script>
