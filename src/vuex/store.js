/**
 * Created by Jerry on 2017/4/25.
 */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        foodList: [],
        oldGood: {},
        seller: {},
        desk: 0
    },
    mutations: {
        _update(state, payload) {
            state.foodList = payload;
        },
        _add(state, payload) {
            state.oldGood = payload;
        },
        _push(state, payload) {
            state.seller = payload;
        },
        _desk(state, payload) {
            state.desk = payload;
        }
    }
});