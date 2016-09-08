import MessageList from './messagelist.jsx';
import React from 'react';
import Header from './rightheader.jsx';
import RightContent from './rightcontent.jsx';

const RightPanel = ({postMessage, register, login, logout}) => (
    <div className = 'rightPanel'>
        <Header login = {login} logout = {logout}/>
        <RightContent register = {register} postMessage = {postMessage}/>
    </div>
);

export default RightPanel;