import { login, logout, getInfo } from '@/api/user'

const getDefaultState = () => {
  return {
    user: {},
    token: '',
    messageCount: 0
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_USER: (state, user) => {
    state.user = user || {}
  },
  SET_TOKEN: (state, token) => {
    state.token = token || ''
  },
  SET_MESSAGE_COUNT: (state, count) => {
    state.messageCount = count || 0
  }
}

const actions = {
  // user login
  login({ commit, dispatch }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        const { data } = response
        commit('SET_USER', data)
        commit('SET_TOKEN', data.token)
        localStorage.setItem('token', data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, dispatch }) {
    const token = localStorage.getItem('token')
    commit('SET_TOKEN', token)
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { status, data } = response
        if (status !== 200) {
          return reject('用户未认证，请登录！')
        }
        commit('SET_USER', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  setInfo({ commit }, userInfo) {
    commit('SET_USER', userInfo)
  },

  setMessageCount({ commit }, count) {
    commit('SET_MESSAGE_COUNT', count)
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        // removeToken() // must remove  token  first
        localStorage.removeItem('token')
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

