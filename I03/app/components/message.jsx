import React from 'react';
import { connect } from 'react-redux';
import { LoginStatuses  } from '../actions';
import MessageText from './messagetext.jsx';
import MessageOptions from './messageoptions.jsx';

const Message = ({visitUser, message, deleteMessage, toggleIsPublic, toggleUpvote}) => (
    <li className = 'Message'>
        <MessageText visitUser = {visitUser} message = {message}/>
        <MessageOptions message = {message} deleteMessage = {deleteMessage} toggleIsPublic = {toggleIsPublic} toggleUpvote = {toggleUpvote}/>
    </li>
);

export default Message;