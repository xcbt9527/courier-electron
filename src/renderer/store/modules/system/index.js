const systemStore = {
  state: {
    userList: [],
    companyList: [],
    leadList:[]
  },
  getters: {
    getUserList(state) {
      return state.userList;
    },
    getCompanyList(state) {
      return state.companyList;
    },
    getLeadList(state) {
      return state.leadList;
    }
  },
  mutations: {
    setUserList(state, list) {
      state.userList = list;
    },
    setCompanyList(state, list) {
      state.companyList = list.map(item => {
        return {
          label: item.name,
          value: item.value
        }
      });
    },
    setLeadList(state, list) {
      state.leadList = list;
    },
  },
  actions: {
    setUserList({ commit }, list) {
      commit("setUserList", list);
    },
    setCompanyList({ commit }, list) {
      commit("setCompanyList", list);
    },
    setLeadList({ commit }, list) {
      commit("setLeadList", list);
    },
  }
};

export default systemStore;
