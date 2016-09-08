import MessageList from './messagelist.jsx';
import React from 'react';
import Header from './leftheader.jsx';

const LeftPanel = ({toggleUpvote, toggleIsPublic, setSortCriteria, messages, deleteMessage, setVisitingProfile, setIsVisitingProfile, visitUser}) => (
    <div className = 'leftPanel'>
        <Header setVisitingProfile = {setVisitingProfile} setIsVisitingProfile = {setIsVisitingProfile} visitUser = {visitUser}/>
        <MessageList visitUser = {visitUser} messages = {messages} toggleUpvote = {toggleUpvote} toggleIsPublic = {toggleIsPublic} setSortCriteria = {setSortCriteria} deleteMessage = {deleteMessage} setVisitingProfile = {setVisitingProfile} setIsVisitingProfile = {setIsVisitingProfile} visitUser = {visitUser}/>
    </div>
);

export default LeftPanel;