import React from 'react';
import { connect } from 'react-redux';
import { LoginStatuses  } from '../actions';

const MessageOptions = ({message, deleteMessage, toggleIsPublic, toggleUpvote, loginStatus}) => (
    <div className = 'messageOptions'>
        {(() => {
            var user = localStorage.getItem('username');
            if(loginStatus === LoginStatuses.LOGGED_IN) {
                var isUpvoted = false;
                message.upvoters.forEach(upvoter => {
                   if(upvoter.name === user) {
                       isUpvoted = true;
                   }
                });
                return (<div className = 'isUpvoted' ><input type='checkbox' name='upvote' value='upvote' checked = {isUpvoted} onClick = {() => {
                                toggleUpvote(message);
                        }}/> Upvote</div>);
            }
        })()}
        {(() => {
            if(loginStatus === LoginStatuses.LOGGED_IN && message.uploader === localStorage.getItem('username')) {
                return(
                    <div>
                        <div className='isPublic'>
                            <input type='checkbox' name='isPublic' value='isPublic' checked = {message.isPublic} onClick = {() => {
                                toggleIsPublic(message);
                            }}/>
                            Offentlig
                        </div>
                        <button className = 'deleteButton' onClick = {() => deleteMessage(message)}>
                            Slett
                        </button>
                    </div>
                );
            }
        })()}
    </div>
);

export default connect(state => ({loginStatus: state.loginStatus}))(MessageOptions);