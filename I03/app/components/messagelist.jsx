import Message from './message.jsx';
import React from 'react';
import SortOptions from './sortoptions.jsx';
import { connect } from 'react-redux';
import {LoginStatuses} from '../actions';

const MessageList = ({visitUser, toggleUpvote, toggleIsPublic, setSortCriteria, messages, deleteMessage, visitingProfile, isVisitingProfile}) => (
    <div className = 'messageList'>
        <h2>{(() => {
            if(isVisitingProfile) {
                var username = visitingProfile.email;
                return username + ' sine meldinger';
            }
            else {
                return 'Meldinger';
            }
        })()}</h2>
        <SortOptions setSortCriteria = {setSortCriteria}/>
        <ul className = 'messageUl'>
            {(() => {
                if(messages) {
                    return messages.map(msg => (
                        <Message key={msg.id}
                                 message = {msg} visitUser = {visitUser} deleteMessage = {deleteMessage} toggleIsPublic = {toggleIsPublic} toggleUpvote = {toggleUpvote}/>
                    ));
                }
            })()}
        </ul>
    </div>
);

export default connect(state => ({visitingProfile: state.visitingProfile, isVisitingProfile: state.isVisitingProfile}))(MessageList);
