import React from 'react';
import {connect} from 'react-redux';
import { LoginStatuses  } from '../actions';

const MessageText = ({message, visitUser, loginStatus}) => (
    <div className = 'messageTextContainer'>
        <h4 className = 'messageHeader' onClick = {() => {
            if(loginStatus === LoginStatuses.LOGGED_IN) {
                visitUser(message.uploader);
            }
        }}>{message.uploader}</h4>
        <p>Lastet opp: {new Date(message.added).toDateString()} {(() => {
            var time = new Date(message.added).toLocaleTimeString();
            var array = time.split(':');
            var timeString = array[0] + ':' + array[1] + ' ' + array[2].split(' ')[1];
            return timeString;
        })()}
        </p>
        <p>{message.upvoters.length} upvotes</p>
        <p className = 'messageText'>{message.text}</p>
    </div>
);

export default connect(state => ({loginStatus: state.loginStatus}))(MessageText);