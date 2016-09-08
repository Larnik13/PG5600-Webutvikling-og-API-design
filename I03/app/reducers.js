import { UPDATE_MESSAGE, TOGGLE_UPVOTE, TOGGLE_IS_PUBLIC, SET_IS_VISITING_PROFILE, SET_VISITING_PROFILE, ADD_MESSAGE, DELETE_MESSAGE, SET_LOGIN_STATUS, SET_SEARCHWORD, SET_SORT_CRITERIA, LoginStatuses, SortCriteria, RECIEVE_MESSAGES_SUCCESS} from './actions';
import { combineReducers } from 'redux';
const { ADDED } = SortCriteria;
const { NOT_LOGGED_IN } = LoginStatuses;

const initialState = {
    sortCriteria: ADDED,
    loginStatus: NOT_LOGGED_IN,
    messages: [],
    isVisitingProfile: false,
    visitingProfile: {}
}

const isVisitingProfile = (state = initialState.isVisitingProfile, action) => {
    switch (action.type) {
        case SET_IS_VISITING_PROFILE:
            return action.isVisiting;
        default :
            return state;
    }
}


const visitingProfile = (state = {}, action) => {
    switch (action.type) {
        case SET_VISITING_PROFILE:
            return action.user;
        default :
            return state;
    }
}

const messages = (state = [], action) => {
    switch(action.type) {
        case ADD_MESSAGE:
            return [
                ...state,
                {
                    text: action.message.text,
                    upvoters: action.message.upvoters,
                    added: action.message.added,
                    uploader: action.message.uploader,
                    isPublic: action.message.isPublic,
                    _id: action.message._id
                }
            ]
        case DELETE_MESSAGE:
        var index = state.indexOf(action.message);
            return [
                ...state.slice(0, index),
                ...state.slice(index + 1)
            ];
        case RECIEVE_MESSAGES_SUCCESS:
            if(action.messages != null){
                return action.messages;
            }
        case TOGGLE_IS_PUBLIC:
            var index = state.indexOf(action.message);
            var msg = state[index];
            msg.isPublic = !msg.isPublic;
            return [
                ...state.slice(0, index),
                {
                    text: msg.text,
                    upvoters: msg.upvoters,
                    added: msg.added,
                    uploader: msg.uploader,
                    isPublic: msg.isPublic,
                    _id: msg._id
                },
                ...state.slice(index + 1)
            ];
        case TOGGLE_UPVOTE:
            var index = state.indexOf(action.message);
            var msg = state[index];
            var user = action.user;
            var userIndex = -1;
            for(var i = 0; i < msg.upvoters.length; i++) {
                if(msg.upvoters[i].name === user) {
                    userIndex = i;
                }
            }
            if(userIndex === -1){
                msg.upvoters.push({name: user});
            }
            else {
                var userIndex = msg.upvoters.indexOf(user);
                msg.upvoters = msg.upvoters.splice(userIndex, userIndex + 1);
            }
            return [
                ...state.slice(0, index),
                {
                    text: msg.text,
                    upvoters: msg.upvoters,
                    added: msg.added,
                    uploader: msg.uploader,
                    isPublic: msg.isPublic,
                    _id: msg._id
                },
                ...state.slice(index + 1)
            ];
        case UPDATE_MESSAGE:
            var message = action.message;
            var index = -1;
            for(var i = 0; i < state.length; i++) {
                if(state[i]._id === message._id) {
                    index = i;
                }
                if(index === -1) {
                    return state;
                }
                return [
                    ...state.slice(0, index),
                    message,
                    ...state.slice(index + 1)
                ];
            }
        default:
            return state;
    }
}

const sortCriteria = (state = ADDED, action) => {
    switch(action.type) {
        case SET_SORT_CRITERIA:
            return action.criteria;
        default:
            return state;
    }
}

const loginStatus = (state = NOT_LOGGED_IN, action) => {
    switch(action.type) {
        case SET_LOGIN_STATUS:
            return  action.status;
        default:
            return state;
    }
}

const messageApp = combineReducers({
    loginStatus,
    sortCriteria,
    messages,
    isVisitingProfile,
    visitingProfile
});

export default messageApp;