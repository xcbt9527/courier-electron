import Mock from 'mockjs'

Mock.mock('/api/product', {
  'list|8': [{
    'id|+1': 1, // id自增长
    'name': '@ctitle', // 商品名称
    'price|1-100': 100, // 商品价格
    'thumb': "@dataImage('200x200')", // 缩略图
    'num|100-500': 200 // 库存
  }]
})

Mock.mock('/api/user', {
  'list|8': [{
    'id|+1': 1,
    'username': '@cname',
    'date': '@date'
  }]
})
