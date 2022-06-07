<template>
  <div class="index">
    <div class="btn-arr">
      <div class="btn">
        <span @click="backup">备份</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  components: {},
  mounted() {
    this.mockData()
  },
  methods: {
    backup() {
      this.$api('sys/backup')
        .then(res => {
          console.log(res)
        })
        .catch(e => {
          console.log(e)
        })
    },
    // 初始化
    init() {
      /**
       * 列表查询
       */
      // this.$api('price/list').then(res => {
      //   console.log('价格列表', res)
      // })
      /**
       * 杂费
       */
      this.$api('othercharge/list').then(res => {
        console.log('杂费列表', res)
      })
    },
    // mock数据
    mockData() {
      /**
       * 新增更新
       */
      /**
       * 价格更新
       */
      // this.$api('price/edit', {
      //   _id: '1hAuoZ4Zd8inI0Bl',
      //   name: `模版名称${Math.floor(Math.random() * (100 - 1) + 1)}`,
      //   companyId: '4ocma66a7S44hiWu',
      //   list: [
      //     {
      //       address: '广东',
      //       kilogram: 1,
      //       price: 5
      //     },
      //     {
      //       address: '广东',
      //       kilogram: 2,
      //       price: 6
      //     },
      //     {
      //       address: '广东',
      //       kilogram: 3,
      //       price: 7
      //     },
      //     {
      //       address: '广东',
      //       kilogram: 4,
      //       price: 8
      //     }
      //   ]
      // }).then(res => {
      //   console.log('价格更新', res)
      // })
      /**
       * 杂费保存
       */
      this.$api('othercharge/edit', {
        userId: '5zrXt5zPvHrKlSxU',
        userName: '客户名称50',
        amount: 100,
        info: '运费',
        remark: '备注运费'
      }).then(res => {
        console.log('杂费保存', res)
      })
      /**
       * 删除
       */
      // this.$api('carrier/del', { _id: 'xr6bI2T4LQn1daD4' }).then(res => {
      //   console.log('删除成功', res)
      // })
      this.init()
    },
    /**
     * 随机生成
     */
    getMoblieNum() {
      var num = '131' //取出随机的手机号前三位并赋值给num，手机号前三位是字符串类型的
      for (var j = 0; j < 8; j++) {
        num = num + Math.floor(Math.random() * 10) //num是字符串，后面的数字被当做字符串。所以变成两个字符串拼接了
      }
      return num
    }
  }
}
</script>

<style lang="scss">
.btn-arr {
  display: flex;
  .btn {
    width: 120px;
    background: blue;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
  }
}
</style>
