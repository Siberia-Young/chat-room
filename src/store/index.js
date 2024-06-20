import {
    createStore
} from 'vuex'

export default createStore({
    state: {
        websocket: null,
        token: "",
        userId: "",
        chatId: "",
        user: null,
        chatList: [],
        friendList: [],
        friendRequestList: []
    },
    mutations: {
        setWebsocket(state, websocket) {
            state.websocket = websocket;
        },
        setToken(state, token) {
            state.token = token;
        },
        setUserId(state, userId) {
            state.userId = userId;
        },
        setChatId(state, chatId) {
            state.chatId = chatId;
        },
        setUser(state, user) {
            state.user = user;
        },
        setChatList(state, chatList) {
            state.chatList = chatList;
        },
        setFriendList(state, friendList) {
            state.friendList = friendList;
        },
        setFriendRequestList(state, friendRequestList) {
            state.friendRequestList = friendRequestList;
        }
    },
})