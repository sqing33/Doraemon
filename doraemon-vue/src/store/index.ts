import Vuex, { StoreOptions } from "vuex";
import VuexPersistence from "vuex-persist";
import CharactIntro from "./CharactIntro";

interface State {
  CharactIntro: any;
  userInfo: any;
  elementImageUrl: any;
  richTextEditor: any;
}

const storeOptions: StoreOptions<State> = {
  state(): State {
    return {
      CharactIntro,
      userInfo: null,
      elementImageUrl: null,
      richTextEditor: null,
    };
  },
  mutations: {
    setUserInfo(state, data) {
      state.userInfo = data;
    },
    setElementImageUrl(state, data) {
      state.elementImageUrl = data;
    },
    setRichTextEditor(state, data) {
      state.richTextEditor = data;
    },
  },
  actions: {
    setUserInfoFromAxios({ commit }, data) {
      commit("setUserInfo", data);
    },
    setElementImageUrl({ commit }, data) {
      commit("setElementImageUrl", data);
    },
    setRichTextEditor({ commit }, data) {
      commit("setRichTextEditor", data);
    },
  },
  getters: {
    getUserInfo: (state) => state.userInfo,
    getElementImageUrl: (state) => state.elementImageUrl,
    getRichTextEditor: (state) => state.richTextEditor,
  },
  plugins: [
    new VuexPersistence({
      reducer: (state) => ({ userInfo: state.userInfo }),
    }).plugin,
  ],
};

export const store = new Vuex.Store(storeOptions);
