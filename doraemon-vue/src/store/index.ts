import Vuex, { StoreOptions } from "vuex";
import VuexPersistence from "vuex-persist";
import CharactIntro from "./CharactIntro";

interface State {
  CharactIntro: any;
  userInfo: any;
  elementImageUrl: any;
  richTextEditor: any;
  form: any;
  scroll: number;
}

const storeOptions: StoreOptions<State> = {
  state(): State {
    return {
      CharactIntro,
      userInfo: null,
      elementImageUrl: null,
      richTextEditor: null,
      form: null,
      scroll: 0,
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
    setCheck(state, form) {
      state.form = form;
    },
    setScroll(state, data) {
      state.scroll = data;
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
    setCheck({ commit }, form) {
      commit("setCheck", form);
    },
    setScroll({ commit }, data) {
      commit("setScroll", data);
    },
  },
  getters: {
    getUserInfo: (state) => state.userInfo,
    getElementImageUrl: (state) => state.elementImageUrl,
    getRichTextEditor: (state) => state.richTextEditor,
    getCheck: (state) => state.form,
    getScroll: (state) => state.scroll,
  },
  plugins: [
    new VuexPersistence({
      reducer: (state) => ({ userInfo: state.userInfo }),
    }).plugin,
  ],
};

export const store = new Vuex.Store(storeOptions);
