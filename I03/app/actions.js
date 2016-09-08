export const SET_SORT_CRITERIA = 'SET_SORT_CRITERIA';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const DELETE_MESSAGE = 'DELETE_MESSAGE';
export const SET_LOGIN_STATUS = 'SET_LOGIN_STATUS';
export const TOGGLE_IS_PUBLIC = 'TOGGLE_IS_PUBLIC';
export const TOGGLE_UPVOTE = 'TOGGLE_UPVOTE';
export const SET_IS_VISITING_PROFILE = 'SET_IS_VISITING_PROFILE';
export const SET_VISITING_PROFILE = 'SET_VISITING_PROFILE';
export const RECIEVE_MESSAGES_SUCCESS = 'RECIEVE_MESSAGES_SUCCESS';
export const UPDATE_MESSAGE = 'UPDATE_MESSAGE';

var socket;

export const SortCriteria = {
    UPVOTES: 'upvotes',
    ADDED: 'added',
}

export const LoginStatuses = {
    LOGGED_IN: 'LOGGED_IN',
    NOT_LOGGED_IN: 'NOT_LOGGED_IN'
}

exports.toggleUpvote = (message, user) => {
    return {type: TOGGLE_UPVOTE, message, user};
}

exports.toggleIsPublic = (message) => {
    return {type: TOGGLE_IS_PUBLIC, message};
}

exports.setIsVisitingProfile = (isVisiting) => {
    return {type: SET_IS_VISITING_PROFILE, isVisiting};
}

exports.setVisitingProfile = (user) => {
    return {type: SET_VISITING_PROFILE, user};
}

exports.setSortCriteria = (criteria) => {
    return {type: SET_SORT_CRITERIA, criteria};
}

exports.addMessage = (message) => {
    return {type: ADD_MESSAGE, message};
}

exports.deleteMessage = (message) => {
    return {type: DELETE_MESSAGE, message};
}

exports.setLoginStatus = (status) => {
    return {type: SET_LOGIN_STATUS, status};
}

exports.receiveMessagesSuccess = (messages) => {
    return {type: RECIEVE_MESSAGES_SUCCESS, messages};
}

exports.updateMessage = (message) => {
    return {type: UPDATE_MESSAGE, message};
}

exports.openSocket = () => {
    return (dispatch, getState) => {
        const url = 'wss://localhost:3000';
        socket = new WebSocket(url);
        socket.onopen = () => {
            console.log('WebSocket opened!');
            var username = localStorage.getItem('username');
            if(username) {
                socket.send('{"userLoggedIn": "' + username + '"}');
            }
        }
        socket.onmessage = message => {
            console.log(message);
            const text = JSON.parse(message.data);
            console.log(text);
            if(text.action) {
                var action = text.action;
                console.log('action', action);
                if(action === 'reload') {
                    dispatch(exports.reloadList());
                }
                else if(action === 'update') {
                    console.log('update');
                    var id = text.id;
                    var currentState = getState();
                    console.log('currentState', currentState);
                    var needsReload = false;
                    currentState.messages.forEach(msg => {
                        console.log('id:', id, msg._id);
                        if (msg._id === id) {

                            needsReload = true;
                        }
                    });
                    console.log('needsReload', needsReload);
                    if(needsReload) {
                        var fetchArgs = {
                            method: 'GET',
                            mode: 'cors',
                            headers: {}
                        }
                        var token = localStorage.getItem('id_token');
                        fetchArgs.headers['x-access-token'] = token;
                        var url = 'https://localhost:3000/api/message/' + id;
                        if (self.fetch)
                        return fetch(url, fetchArgs)
                            .then(response => {
                                if (response.status === 200) {
                                    response.json().then(json => {
                                        dispatch(exports.updateMessage(json));
                                    });
                                }
                                else {
                                    response.text().then(text => alert('Oppdatering av melding feilet: ' + text + ' \nVennligst prøv igjen!'));
                                }
                            });
                        else {
                            return $.ajax({
                                type: 'GET',
                                url: url,
                                success: (data) => {
                                    dispatch(exports.updateMessage(data));
                                    return;
                                },
                                error: (xhr, status, error) => {
                                    console.log(error);
                                    return alert("Oppdatering av melding feilet: " + error);
                                }
                            });
                        }
                    }
                }
            }
        };
        dispatch(exports.fetchMessages());
    }
}

exports.reloadList = () => {
    return (dispatch, getState) => {
        var currentState = getState();
        if (currentState.isVisitingProfile) {
            dispatch(exports.fetchMessagesForUser(state.visitingProfile.email));
        }
        else {
            dispatch(exports.fetchMessages());
        }
    }
}

exports.setIsVisitingProfileAndReload = (isVisiting) => {
    return (dispatch) => {
        dispatch(exports.setIsVisitingProfile(isVisiting));
        if(!isVisiting) {
            dispatch(exports.fetchMessages());
        }
    };
}

exports.visitUser = (username) => {
    var fetchArgs = {
        method: 'GET',
        mode: 'cors',
        headers: {}
    }
    var token = localStorage.getItem('id_token');
    fetchArgs.headers['x-access-token'] = token;
    var url = 'https://localhost:3000/api/users/'+username;
    if(self.fetch)return (dispatch) => {
        return fetch(url, fetchArgs)
            .then(response => {
                if(response.status === 200) {
                    response.json().then(json => {
                        dispatch(exports.setIsVisitingProfile(true));
                        dispatch(exports.setVisitingProfile(json));
                        dispatch(exports.fetchMessagesForUser(json.email));
                        console.log('visitJSON', json.email);
                    });
                }
                else {
                    response.text().then(msg => alert('Fant ikke brukeren: '+msg+' \nVennligst prøv igjen!'));
                }
            });
    };
    else {
        return (dispatch) => {
            return $.ajax({
                type: 'GET',
                url: url,
                success: (data) => {
                    dispatch(exports.setIsVisitingProfile(true));
                    dispatch(exports.setVisitingProfile(data));
                    return;
                },
                error: (xhr, status, error) => {
                    console.log(error);
                    return alert("Fant ikke brukeren: " + error);
                }
            });
        };
    }
}

const getMessagesWithFetch = (dispatch) => {
    var fetchArgs = {
        method: 'GET',
        mode: 'cors',
        headers: {}
    }
    var url = '';
    var user = localStorage.getItem('username');
    var token = localStorage.getItem('id_token');
    if(user == null || token == null) {
        url = 'https://localhost:3000/api/all/messages';
    }
    else {
        dispatch(exports.setLoginStatus(LoginStatuses.LOGGED_IN));
        console.log('fetching for user: ', user, '-------------------');
        url = 'https://localhost:3000/api/all/messages/' + user;
        console.log(url);
        fetchArgs.headers['x-access-token'] = token;
        console.log('headers', fetchArgs.headers)
    }
    return fetch(url, fetchArgs)
        .then(response => {
            console.log(response.status);
            if( response.status == 200 ){
                response.json().then(json => dispatch(exports.receiveMessagesSuccess(json)));
            }
            else {
                response.text().then(msg => alert("Nedlastning av meldinger feilet: " + msg));
            }});
};

const getMessagesWithAjax = (dispatch) => {
    var url = '';
    var user = localStorage.getItem('username');
    var token = localStorage.getItem('id_token');
    console.log(user, token);
    if(user == null || token == null) {
        url = 'https://localhost:3000/api/all/messages';
    }
    else {
        dispatch(exports.setLoginStatus(LoginStatuses.LOGGED_IN));
        console.log('fetching for user: ', user, '-------------------');
        url = 'https://localhost:3000/api/all/messages/' + user;
        console.log(url);
    }
    var req = {
        type: 'GET',
        url: url,
        dataType: 'json',
        headers: {},
        success: (data) => {
            console.log('data', data);
            dispatch(exports.receiveMessagesSuccess(data));
        },
        error: (xhr, status, error) => {
            console.log(error);
            return alert("Nedlastning av meldinger feilet: " + error);
        }
    };
    if(token) {
        req.headers['x-access-token'] = token;
        console.log(req);
    }
    $.ajax(req);
};


exports.fetchMessagesForUser = (username) => {
    if(self.fetch) {
        return (dispatch) => {
            var fetchArgs = {
                method: 'GET',
                mode: 'cors',
                headers: {}
            }
            console.log('user', username);
            var token = localStorage.getItem('id_token');
            dispatch(exports.setLoginStatus(LoginStatuses.LOGGED_IN));
            console.log('fetching for user: ', username, '-------------------');
            var url = 'https://localhost:3000/api/' + username + '/messages';
            console.log(url);
            fetchArgs.headers['x-access-token'] = token;
            console.log('headers', fetchArgs.headers);
            return fetch(url, fetchArgs)
                .then(response => {
                    console.log(response.status);
                    if (response.status == 200) {
                        response.json().then(json => dispatch(exports.receiveMessagesSuccess(json)));
                    }
                    else {
                        response.text().then(msg => alert("Nedlastning av meldinger feilet: " + msg));
                    }
                });
        }
    }
    else {
        return (dispatch) => {
            console.log(username, token);
            dispatch(exports.setLoginStatus(LoginStatuses.LOGGED_IN));
            console.log('fetching for user: ', username, '-------------------');
            console.log(url);
            var req = {
                type: 'GET',
                url: url,
                dataType: 'json',
                headers: {},
                success: (data) => {
                    console.log('data', data);
                    dispatch(exports.receiveMessagesSuccess(data));
                },
                error: (xhr, status, error) => {
                    console.log(error);
                    return alert("Nedlastning av meldinger feilet: " + error);
                }
            };
            if (token) {
                req.headers['x-access-token'] = token;
                console.log(req);
            }
            $.ajax(req);
        }
    }
}

exports.fetchMessages = () => {
    if(self.fetch) {
        return getMessagesWithFetch;
    }
    else {
        return getMessagesWithAjax;
    }
}

exports.register = (userForm) => {
    var fetchArgs = {
        method: 'POST',
        mode: 'cors',
        body: new FormData(userForm)
    }
    var url = 'https://localhost:3000/api/register';
    if(self.fetch)return (dispatch) => {
        return fetch(url, fetchArgs)
            .then(response => {
                if(response.status === 201) {
                    document.getElementById('registerForm').reset();
                    return alert('Registreringen var vellykket');
                }
                else if(response.status === 409) {
                    return alert('En bruker med dette brukernavnet finnes allerede!');
                }
                else {
                    response.text().then(msg => alert('Registreringen feilet: '+msg.error+' \nVennligst prøv igjen!'));
                }
            });
    };
    else {
        return (dispatch) => {
            return $.ajax({
                type: 'POST',
                url: url,
                data: $(userForm).serialize(),
                success: (data) => {
                    return alert('Registreringen var vellykket');
                },
                error: (xhr, status, error) => {
                    console.log(error);
                    return alert("Registreringen feilet: " + error);
                }
            });
        };
    }
}

exports.login = (loginForm) => {
    var fetchArgs = {
        method: 'POST',
        mode: 'cors',
        body: new FormData(loginForm)
    }
    console.log('login');
    var username = loginForm.email.value;
    var url = 'https://localhost:3000/api/login';
    if(self.fetch){
        console.log('login');
        return (dispatch) => {
            console.log('login');
            return fetch(url, fetchArgs)
                .then(response => {
                    console.log('res');
                    if (response.status === 200) {
                        localStorage.setItem('username', username);
                        response.text().then(token => {
                            console.log(username);
                            localStorage.setItem('id_token', token);
                            dispatch(exports.setLoginStatus(LoginStatuses.LOGGED_IN));
                            dispatch(exports.fetchMessages());
                            socket.send('{"userLoggedIn": "' + username + '"}');
                        });
                    }
                    else {
                        console.log('login');
                        response.text().then(msg => alert('Innloggingen feilet: ' + msg + ' \nVennligst prøv igjen!'));
                    }
                });
        };
    }
    else {
        console.log('login');
        return (dispatch) => {
            $.ajax({
                type: 'POST',
                url: url,
                data: $(loginForm).serialize(),
                success: (data) => {
                    var token = data;
                    console.log(username);
                    localStorage.setItem('id_token', token);
                    localStorage.setItem('username', username);
                    dispatch(exports.setLoginStatus(LoginStatuses.LOGGED_IN));
                    dispatch(exports.fetchMessages());
                },
                error: (xhr, status, error) => {
                    console.log(error);
                    alert('Innloggingen feilet: '+error+' \nVennligst prøv igjen!');
                    return dispatch(exports.setLoginStatus(LoginStatuses.NOT_LOGGED_IN));
                }
            });
        }
    }
}

exports.deleteMessageOnServer = (message) => {
    console.log('message: ', message);
    var fetchArgs = {
        method: 'DELETE',
        mode: 'cors',
        headers: {},
    }
    var user = localStorage.getItem('username');
    var token = localStorage.getItem('id_token');
    fetchArgs.headers['x-access-token'] = token;
    var url = 'https://localhost:3000/api/' + user + '/messages' + '/' + message._id;
    if(self.fetch)return (dispatch) => {
        return fetch(url, fetchArgs)
            .then(response => {
                if (response.status === 204) {
                    dispatch(exports.deleteMessage(message));
                }
                else {
                    alert('Sletting av melding feilet: '+msg+' \nVennligst prøv igjen!')
                }
            });
    };
    else {
        return (dispatch) => {
            $.ajax({
                type: 'DELETE',
                url: url,
                headers: {
                    'x-access-token': token
                },
                success: (data) => {
                    dispatch(exports.deleteMessage(message));
                },
                error: (xhr, status, error) => {
                    console.log(error);
                    return alert('Sletting av message feilet: '+error+' \nVennligst prøv igjen!');
                }
            });
        }
    }
}

exports.addMessageOnServer = (messageForm, text) => {
    var fetchArgs = {
        method: 'POST',
        mode: 'cors',
        headers: {},
        body: new FormData(messageForm)
    }
    var user = localStorage.getItem('username');
    var token = localStorage.getItem('id_token');
    fetchArgs.headers['x-access-token'] = token;
    var url = 'https://localhost:3000/api/' + user + '/messages';
    if(self.fetch)return (dispatch) => {
        return fetch(url, fetchArgs)
            .then(response => {
                if(response.status === 200) {
                    return response.text().then(id => {
                        id = id.replace('"', '');
                        id = id.replace('\'', '');
                        console.log('msg to add', messageForm);
                        dispatch(exports.addMessage({
                            text: text,
                            isPublic: messageForm.isPublic.value,
                            uploader: user,
                            upvoters: [],
                            _id: id,
                            added: Date.now()
                        }));
                    });
                }
                else {
                    response.text().then(msg => alert('Oprettelse av message feilet: '+msg+' \nVennligst prøv igjen!'));
                }
            });
    };
    else {
        return (dispatch) => {
            $.ajax({
                type: 'POST',
                url: url,
                headers: {
                    'x-access-token': token
                },
                data: $(messageForm).serialize(),
                success: (data) => {
                    dispatch(exports.addMessage({
                        title: messageForm.title.value,
                        artist: messageForm.artist.value,
                        releaseYear: messageForm.releaseYear.value,
                        uploader: user
                    }));
                },
                error: (xhr, status, error) => {
                    console.log(error);
                    return alert('Oprettelse av message feilet: '+error+' \nVennligst prøv igjen!');
                }
            });
        }
    }
}

exports.toggleIsPublicOnServer = (message) => {
    var fetchArgs = {
        method: 'PUT',
        mode: 'cors',
        headers: {},
    }
    var user = localStorage.getItem('username');
    var token = localStorage.getItem('id_token');
    fetchArgs.headers['x-access-token'] = token;
    var isPublicString = !message.isPublic ? 'ispublic': 'isprivate';
    var url = 'https://localhost:3000/api/' + user + '/messages/' + message._id + '/' + isPublicString;
    if(self.fetch)return (dispatch) => {
        return fetch(url, fetchArgs)
            .then(response => {
                if(response.status === 200) {
                    dispatch(exports.toggleIsPublic(message));
                }
                else {
                    response.text().then(msg => alert('Endring av status feilet: '+msg+' \nVennligst prøv igjen!'));
                }
            });
    };
    else {
        return (dispatch) => {
            $.ajax({
                type: 'PUT',
                url: url,
                headers: {
                    'x-access-token': token
                },
                data: {
                    isPublic: !message.isPublic
                },
                success: (data) => {
                    dispatch(exports.toggleIsPublic(message));
                },
                error: (xhr, status, error) => {
                    console.log(error);
                    return alert('Opdatering av status feilet: '+error+' \nVennligst prøv igjen!');
                }
            });
        }
    }
}

exports.toggleUpvoteOnServer = (message) => {
    var user = localStorage.getItem('username');
    var shouldAdd = message.upvoters.indexOf(user) === -1;
    var fetchArgs = {
        method: 'PUT',
        mode: 'cors',
        headers: {}
    };
    console.log('fetchargs', fetchArgs.body);
    var token = localStorage.getItem('id_token');
    fetchArgs.headers['x-access-token'] = token;
    var url = 'https://localhost:3000/api/all/messages/' + message._id + '/upvoter';
    if(self.fetch)return (dispatch) => {
        return fetch(url, fetchArgs)
            .then(response => {
                if(response.status === 200) {
                    dispatch(exports.toggleUpvote(message, user));
                }
                else {
                    response.text().then(msg => alert('Endring av upvote feilet: '+msg+' \nVennligst prøv igjen!'));
                }
            });
    };
    else {
        return (dispatch) => {
            $.ajax({
                type: 'PUT',
                url: url,
                headers: {
                    'x-access-token': token
                },
                data: {
                    shouldAdd: shouldAdd,
                    upvoter: user
                },
                success: (data) => {
                    dispatch(exports.toggleUpvote(message));
                },
                error: (xhr, status, error) => {
                    console.log(error);
                    return alert('Opdatering av upvote feilet: '+error+' \nVennligst prøv igjen!');
                }
            });
        }
    }
}

exports.logout = () => {
    return (dispatch) => {
        localStorage.removeItem('id_token');
        localStorage.removeItem('username');
        dispatch(exports.setIsVisitingProfile(false));
        dispatch(exports.setVisitingProfile({}));
        dispatch(exports.setLoginStatus(LoginStatuses.NOT_LOGGED_IN));
        dispatch(exports.fetchMessages());
    };
}