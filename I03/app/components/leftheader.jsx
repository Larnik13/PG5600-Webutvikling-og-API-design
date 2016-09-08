import React from 'react';
import LeftHeaderLinks from './leftheaderlinks.jsx';
import {connect} from 'react-redux';
import {LoginStatuses} from '../actions';

const LeftHeader = ({loginStatus, setVisitingProfile, setIsVisitingProfile,  visitUser}) => (
    <div className = "Header">
        <h1>Twitterish</h1>
        {(() => {
            if(loginStatus === LoginStatuses.LOGGED_IN){
                return (<LeftHeaderLinks setVisitingProfile = {setVisitingProfile} setIsVisitingProfile = {setIsVisitingProfile} visitUser = {visitUser}/>);
            }
        })()}
    </div>
);

export default connect(state => ({loginStatus: state.loginStatus}))(LeftHeader);