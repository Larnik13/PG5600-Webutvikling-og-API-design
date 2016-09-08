import React from 'react';
import RegisterForm from './registerform.jsx';
import PostMessageForm from './postmessageform.jsx';
import UserProfile from './userprofile.jsx';
import {connect} from 'react-redux';
import { LoginStatuses  } from '../actions';

const RightContent = ({postMessage, register, loginStatus, isVisitingProfile, visitingProfile}) => (
    <div className = 'rightContent'>
        {(() => {
            if(loginStatus === LoginStatuses.NOT_LOGGED_IN)
            {
                return (<RegisterForm register = {register}/>);
            }
            else if(isVisitingProfile && loginStatus === LoginStatuses.LOGGED_IN){
                return (<UserProfile user = {visitingProfile}/>);
            }
            else if(loginStatus === LoginStatuses.LOGGED_IN) {
                return (<PostMessageForm postMessage = {postMessage}/>);
            }
        })()}
    </div>
);

export default connect(state => ({loginStatus: state.loginStatus, isVisitingProfile: state.isVisitingProfile, visitingProfile: state.visitingProfile}))(RightContent);