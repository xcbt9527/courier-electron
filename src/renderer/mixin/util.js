export default {
  mounted() {
    this.init();
  },
  data() {
    return {
      userList: [],
      companyList: [],
      priceList: []
    };
  },
  computed: {},
  methods: {
    init() {
      this.$api("user/list").then(res => {
        if (res.code === 1000) {
          this.userList = res.data;
          this.searchConfig.formItem.forEach(configItem => {
            configItem.noChange = configItem.noChange || false;
            if (
              (configItem.prop === "userName" && !configItem.noChange) ||
              (configItem.prop === "name" && !configItem.noChange)
            ) {
              configItem.data = [];
              configItem.data = res.data.map(item => {
                return {
                  label: item.name,
                  value: item.name
                };
              });
            }
          });
        }
      });
      this.$api("carrier/list").then(res => {
        if (res.code === 1000) {
          this.companyList = res.data;
          this.searchConfig.formItem.forEach(configItem => {
            configItem.noChange = configItem.noChange || false;
            if (configItem.prop === "pricename" && !configItem.noChange) {
              configItem.data = [];
              configItem.data = this.companyList.map(item => {
                return {
                  label: item.name,
                  value: item.name
                };
              });
            }
          });
        }
      });
      this.$api("price/list").then(res => {
        if (res.code === 1000) {
          this.priceList = res.data;
        }
      });
    },
    /**
     * 找到选中的参数
     * @param {*} arr
     * @param {*} id
     */
    getUserName(arr, id) {
      const data = arr.filter(item => item._id === id);
      if (data.length === 1) {
        return data[0];
      } else {
        return {};
      }
    },
    getCompanyName(arr, id) {
      const data = arr.filter(item => item._id === id);
      if (data.length === 1) {
        return data[0];
      } else {
        return {};
      }
    },
    /**
     * 找到选中的参数
     * @param {*} arr
     * @param {*} name
     */
    getUserId(arr, name) {
      const data = arr.filter(item => item.name === name);
      if (data.length > 0) {
        return data[0];
      } else {
        return {};
      }
    },
    distinct(a) {}
  }
};
