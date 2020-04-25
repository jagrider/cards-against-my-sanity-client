import Vue from "vue";
import Vuex from "vuex";
import API from '../api';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    me: {},
    expansionPacks: [],
    isGameOver: false,
    sendingRequest: false,
    gameWinner: {},
    playerId: '',
    isVIP: false,
    round: {},
    hasStarted: false,
    players: [],
    gameId: null,
    submittedCard: null,
    haveCardSubmissions: false,
    hand: [],
    blackCard: {
      id: null,
      text: "Waiting on other players. . .",
    },
  },
  mutations: {
    setGameInfo(state, { gameId, hand, isVIP }) {
      state.gameId = gameId;
      state.hand = hand;
      state.isVIP = isVIP;
    },
    setSubmittedCard(state, submittedCard) {
      state.submittedCard = submittedCard;
    },

    setPlayerInfo(state, playerId) {
      state.playerId = playerId;
    },
    setExpansionPacks(state, packs) {
      state.expansionPacks = packs;
    },

    updateGame(state, { game }) {

      const { blackCard, round, hasStarted, playerId } = game;
      const players = game.players || {};
      const mappedPlayers = Object.keys(players).map((key) => players[key]);
      if(playerId) {
        state.playerId = playerId;
      }
      const me = players[state.playerId];

      state.players = mappedPlayers;
      state.me = me || {};
      state.hasStarted = hasStarted;
      state.round = round || {};
      state.blackCard = blackCard;
      state.isGameOver = game.gameOver || false;
      state.gameWinner = game.winner.winner || {};
      state.haveCardSubmissions = Object.keys(players).some(key => players[key].submittedCard);

    },
  },
  actions: {
    async createGame({state}, options) {
      const { gameId }  = await API.games.create(state, options);
      return gameId;
    },
    async getPlayerInfo({ commit, state }, { gameId }) {
      const { hand, submittedCard, isVIP, playerId } = await API.players.getInfo(state, gameId);
      commit("setPlayerInfo", playerId)
      commit("setGameInfo", { gameId, hand, isVIP, playerId });
      commit("setSubmittedCard", submittedCard);
    },
    async beginGame({ state }, gameId) {
      await API.games.start(state, gameId);
    },
    async submitCard({ commit, state }, { gameId, cardId }) {
      const { hand, submittedCard } = await API.games.submitCard(state, gameId, cardId);

      commit("setGameInfo", { gameId, hand });
      commit("setSubmittedCard", submittedCard);
    },
    async addPlayer({ commit, state }, { gameId, name }) {
      const { jwtToken, hand, isVIP, playerId } = await API.players.add(state, gameId, name);
      localStorage.setItem(`p-${gameId}`, jwtToken);
      commit("setGameInfo", { gameId, hand, isVIP });
      commit("setPlayerInfo", playerId);
    },
    async selectRoundWinner({ state }, { gameId, cardId }) {
      await API.games.chooseWinner(state, gameId, cardId);
    },
    async nextRound(app, gameId) {
      await API.games.nextRound(gameId);
    },

    async getExpansionPacks({ commit }){
      const packs = await API.games.getExpansionPacks();
      commit('setExpansionPacks', packs)
    },
    async resetGame(app, gameId) {
      await API.games.resetGame(gameId);
    },
    async skipBlackCard({ state }, gameId) {
      await API.games.skipBlackCard(state, gameId);
    },
    async checkRoundStatus({ state }, gameId) {
      await API.games.checkStatus(state, gameId);
    }


  },
});

export default store;