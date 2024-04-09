import Vuex, { StoreOptions } from "vuex";
import VuexPersistence from "vuex-persist";
import CharactIntro from "./CharactIntro";

interface State {
  CharactIntro: any;
  userInfo: any;
  elementImageUrl: any;
  richTextEditor: any;
  check: {
    form: any;
    categories: any;
  };
}

const storeOptions: StoreOptions<State> = {
  state(): State {
    return {
      CharactIntro,
      userInfo: null,
      elementImageUrl: null,
      richTextEditor: null,
      check: {
        form: {},
        categories: [],
      },
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
    setCheck(state, { form, categories }) {
      state.check.form = form;
      state.check.categories = categories;
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
    setCheck({ commit }, { form, categories }) {
      commit("setCheck", { form, categories });
    },
  },
  getters: {
    getUserInfo: (state) => state.userInfo,
    getElementImageUrl: (state) => state.elementImageUrl,
    getRichTextEditor: (state) => state.richTextEditor,
    getCheck: (state) => state.check,
  },
  plugins: [
    new VuexPersistence({
      reducer: (state) => ({ userInfo: state.userInfo }),
    }).plugin,
  ],
};

export const store = new Vuex.Store(storeOptions);
