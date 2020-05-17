import * as mutationTypes from "../../constants/mutationTypes";

const state = {
  showPlayerList: true,
  showRefreshModal: false,
};

const mutations = {
  [mutationTypes.TOGGLE_PLAYER_LIST](state) {
    state.showPlayerList = !state.showPlayerList;
  },
  [mutationTypes.TOGGLE_REFRESH_HAND_CONFIRM](state) {
    state.showRefreshModal = !state.showRefreshModal;
  },
};

const actions = {
  togglePlayerListView({ commit }) {
    commit(mutationTypes.TOGGLE_PLAYER_LIST);
  },
  toggleRefrshHandConfirm({ commit }) {
    commit(mutationTypes.TOGGLE_REFRESH_HAND_CONFIRM);
  },
};
export default { state, mutations, actions };
