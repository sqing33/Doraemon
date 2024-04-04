import Vuex, { StoreOptions } from "vuex";
import VuexPersistence from "vuex-persist";
import CharactIntro from "./CharactIntro";

interface State {
  CharactIntro: any;
  userInfo: any;
}

const storeOptions: StoreOptions<State> = {
  state(): State {
    return {
      CharactIntro,
      userInfo: null,
    };
  },
  mutations: {
    setUserInfo(state, data) {
      state.userInfo = data;
    },
  },
  actions: {
    setUserInfoFromAxios({ commit }, data) {
      commit("setUserInfo", data);
    },
  },
  getters: {
    getUserInfo: (state) => state.userInfo,
  },
  plugins: [
    new VuexPersistence({
      reducer: (state) => ({ userInfo: state.userInfo }),
    }).plugin,
  ],
};

export const store = new Vuex.Store(storeOptions);
