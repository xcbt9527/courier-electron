<template>
  <d2-container>
    <div slot="header">
      <el-button @click="backup" type="primary">备 份</el-button>
      <el-button @click="upload" type="danger">还原数据</el-button>
      <el-button @click="clean" type="warning">清 理</el-button>
      <el-button @click="modify" type="primary">修改密码</el-button>
    </div>
    <input
      @change="importfxx(this)"
      accept=".zip"
      id="upload"
      refs="inputer"
      style="display:none"
      type="file"
    />
    <m-dialog
      :config="config"
      :show.sync="showModify"
      @cancel="handleCancel"
      @confirm="handleConfirm"
      ref="dialog"
    ></m-dialog>
  </d2-container>
</template>

<script>
import { mapState } from 'vuex'
import MDialog from '@/components/global/table/dialog'
export default {
  name: 'sysmanager',
  components: { MDialog },
  data() {
    return {
      delVisible: false,
      showModify: false,
      config: {
        title: '',
        formList: [
          {
            label: '账号:',
            prop: 'username',
            type: 'text'
          },
          {
            label: '旧密码:',
            prop: 'password',
            type: 'input',
            isPwd: true
          },
          {
            label: '新密码:',
            prop: 'newPwd',
            type: 'input',
            isPwd: true
          },
          {
            label: '重输新密码:',
            prop: 'newPwd1',
            type: 'input',
            isPwd: true
          }
        ],
        formData: {
          username: '',
          password: '',
          newPwd: ''
        },
        rules: {
          password: [
            { required: true, message: '请填入旧密码', trigger: 'blur' }
          ],
          newPwd: [{ required: true, message: '请填新密码', trigger: 'blur' }]
        }
      }
    }
  },
  computed: {
    ...mapState('d2admin/user', ['info'])
  },
  methods: {
    backup() {
      this.$confirm('是否备份数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api('sysApi/backup').then(res => {
          this.$notify.success({
            title: '成功',
            message: '已成功备份'
          })
        })
      })
    },
    clean() {
      this.$confirm('建议在备份之后再清理数据,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api('sysApi/clean').then(res => {
          this.$notify.success({
            title: '成功',
            message: '已成功清理'
          })
        })
      })
    },
    upload() {
      this.$confirm(
        '一旦选择将会覆盖本系统的所有数据，不可找回，是否继续还原数据?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        document.getElementById('upload').click()
      })
    },
    importfxx(obj) {
      let _this = this
      let inputDOM = this.$refs.inputer // 通过DOM取文件数据
      this.file = event.currentTarget.files[0]
      this.$api('sysApi/unzip', { url: this.file.path }).then(res => {
        this.$notify.success({
          title: '成功',
          message: '还原成功，准备更新系统···'
        })
        setTimeout(() => {
          window.location.reload(true)
        }, 1500)
      })
    },
    modify() {
      this.showModify = true
      this.config.formData.username = this.info.name
    },
    handleCancel(value) {
      this.showModify = false
    },
    handleConfirm(value) {
      this.$api('sysApi/modifyPwd', value).then(res => {
        if (res.code !== 1000) {
          this.$notify.warning({
            title: '警告',
            message: res.msg
          })
          return
        }
        this.showModify = false
        this.$notify.success({
          title: '成功',
          message: '修改成功'
        })
      })
    }
  }
}
</script>
