import {
    createStore
} from 'vuex'

export default createStore({
    state: {
        websocket: null,
        token: "",
        userId: "",
        chatId: ""
    },
    mutations: {
        setToken(state, token) {
            state.token = token;
        },
        setUserId(state, userId) {
            state.userId = userId;
        },
        setChatId(state, chatId) {
            state.chatId = chatId;
        }
    },
})