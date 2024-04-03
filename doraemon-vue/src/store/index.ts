import Vuex, { StoreOptions } from "vuex";
import CharactIntro from "./CharactIntro";

interface State {
  CharactIntro: any;
}

const storeOptions: StoreOptions<State> = {
  state() {
    return {
      CharactIntro,
    };
  },
  getters: {},
};

export const store = new Vuex.Store(storeOptions);
