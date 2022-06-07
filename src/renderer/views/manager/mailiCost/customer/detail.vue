<template>
  <d2-container>
    <div class="t-r">
      <el-tag class="t-l" type="success">用户：{{priceDetail.userName}}</el-tag>
      <el-tag class="t-l">承运公司：{{priceDetail.pricename}}</el-tag>
      <el-tag class="t-l">目的地总数：{{priceDetail.list?priceDetail.list.length:0}}</el-tag>
      <el-button @click="exportUp" type="primary">
        <d2-icon name="arrow-circle-up" />
        <span style="margin-left:5px;">导出价格模版</span>
      </el-button>
      <el-button @click="sure" type="primary">确认修改</el-button>
    </div>
    <el-form :inline="true" :model="priceDetail" class="demo-form-inline" ref="elform">
      <el-tabs v-model="activeName">
        <el-tab-pane
          :key="idx"
          :label="idx+1+'.'+item.address"
          :name="'tab'+idx + 1"
          v-for="(item,idx) in priceDetail.list"
        >
          <template v-if="activeName ==='tab'+idx+1">
            <div :key="idx1" v-for="(price,idx1) in item.list">
              <el-form-item
                :prop="'list.' + idx + '.list.'+idx1 + '.kilogram'"
                :rules="[
                  { required: true, message: '请输入重量', trigger: 'change' },
                  { required: true, message: '请输入重量', trigger: 'blur' }
                ]"
                label="重量(KG)"
                required
              >
                <el-input placeholder="请输入重量" type="number" v-model="price.kilogram"></el-input>
              </el-form-item>
              <el-form-item
                :prop="'list.' + idx + '.list.'+idx1 + '.price'"
                :rules="[
                  { required: true, message: '请输入价格', trigger: 'change' },
                  { required: true, message: '请输入价格', trigger: 'blur' }
                ]"
                label="价格(元)"
                required
              >
                <el-input placeholder="请输入价格" type="number" v-model="price.price"></el-input>
              </el-form-item>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </d2-container>
</template>
<style>
.t-r {
  text-align: right;
}
.t-l {
  float: left;
  margin-right: 10px;
}
</style>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'priceDetail',

  data() {
    return {
      priceDetail: {},
      activeName: 'tab1'
    }
  },
  computed: {
    ...mapState('d2admin/page', [
      'current' //用户获取当前页面的地址，用于关闭
    ])
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.$api('ucuser/findData', { id: this.$route.params.id }).then(res => {
        this.priceDetail = res.data
        setTimeout(() => {
          this.activeName = 'tab01'
        }, 100)
        setTimeout(() => {
          loading.close()
        }, 1000)
      })
    },
    sure() {
      this.$confirm('一旦修改将不可恢复，是否确认修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.elform.validate(valid => {
          if (valid) {
            this.$api('ucuser/edit', Object.assign({}, this.priceDetail)).then(
              res => {
                if (res.code === 1000) {
                  this.$notify.success({
                    title: '成功',
                    message: '价格修改成功'
                  })
                  const tagName = this.current
                  this.close({ tagName })
                } else {
                  this.$notify.warning({
                    title: '警告',
                    message: res.msg
                  })
                }
              }
            )
          } else {
            return false
          }
        })
      })
    },
    exportUp() {
      const file = []
      const headerFile = [this.priceDetail.pricename]
      this.priceDetail.list.forEach((item, index) => {
        const list = []
        list.push(item.address)
        item.list.forEach(res => {
          if (index === 0) {
            headerFile.push(`${res.kilogram}公斤`)
          }
          list.push(res.price)
        })
        file.push(list)
      })
      const name = `${this.priceDetail.userName}-${this.priceDetail.pricename}-价格模版`
      this.$api('utilApi/exportFile', {
        name: name,
        list: [headerFile, ...file]
      }).then(res => {
        if (res.code === 1000) {
          this.$notify.success({
            title: '成功',
            message: '导出成功'
          })
        }
      })
    },
    ...mapActions('d2admin/page', ['close'])
  }
}
</script>