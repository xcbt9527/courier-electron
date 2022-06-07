<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import util from '@/libs/util'
export default {
  name: 'courier-electron',
  watch: {
    '$i18n.locale': 'i18nHandle'
  },
  created () {
    this.i18nHandle(this.$i18n.locale)
  },
  methods: {
    i18nHandle (val, oldVal) {
      util.cookies.set('lang', val)
      document.querySelector('html').setAttribute('lang', val)
    }
  }
}
</script>
