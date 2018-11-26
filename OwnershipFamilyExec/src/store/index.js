import Vue from 'vue'
import Vuex from 'vuex'
// import mutations from './mutations'
// import actions from './action'
// import getters from './getters'

Vue.use(Vuex)

const state = {
    pageNumber: "1", //当前第一页
    pageSize: "10", // 每页 10条数据
    count: 10
}

const getters = {
    count: function(state) {
        return state.count += 100;
    }
}

const mutations = {
    add(state) {
        state.count += 1;
    },
    reduce(state) {
        state.count -= 1;
    }
}

const actions = {
    addAction(context) {
        context.commit('add', 10)
    },
    reduceAction({commit}) {
        commit('reduce')
    }
}

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
})